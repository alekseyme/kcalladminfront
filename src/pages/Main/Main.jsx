import React from 'react';
import { DatePicker, Form, Input, Button, Select, BackTop, message } from 'antd';
import { PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { UserApi } from 'api';
import moment from 'moment';
import 'moment/locale/ru';

//Redux
import {
	setActiveProject,
	setSearchParams,
	fetchActiveProject,
	setProjectLoading,
} from 'store/projects/slice';
import { setTableColumns, resetTableData, setTableLoading } from 'store/table/slice';
import { useSelector, useDispatch } from 'react-redux';

import { Box, Loader, TableControls, ProjectTable, EmptyProject } from 'components';

const Main = () => {
	//Redux
	const dispatch = useDispatch();
	const { activeProject, projectLoading, searchParams, projectStatuses } = useSelector(
		({ projects }) => projects,
	);
	const { tableData } = useSelector(({ table }) => table);
	const [projectList, setProjectList] = React.useState(null);
	const [searchForm] = Form.useForm();

	const getUserProjects = async () => {
		try {
			const data = await UserApi.getUserProjects();
			const projects = data.map((project) => {
				return {
					id: project.id,
					key: project.id,
					value: project.tablename,
					label: project.name,
					table_header: project.table_header,
					table_row: project.table_row,
				};
			});
			setProjectList(projects);
		} catch (error) {
			message.error(error.message);
		}
	};

	//Подгрузка списка проектов, доступных для пользователя, в селект
	React.useEffect(() => {
		getUserProjects();
	}, []);

	//Меняем активный проект, при смене в селекте
	React.useEffect(() => {
		if (activeProject && !tableData) {
			dispatch(fetchActiveProject({ project: activeProject.value }));
		} // eslint-disable-next-line
	}, [activeProject]);

	const fetchSearchData = (fieldsValue) => {
		if (!activeProject) {
			message.warning('Сначала выберите проект', 2);
			return;
		}
		if (
			!fieldsValue.from &&
			!fieldsValue.to &&
			!fieldsValue.phone &&
			!fieldsValue.status &&
			!fieldsValue.operator
		) {
			message.warning('Заполните хотя бы один параметр поиска', 2);
			return;
		}

		const phone =
			fieldsValue.phone?.length > 10 ? fieldsValue.phone.slice(1) : fieldsValue.phone;

		const values = {
			...fieldsValue,
			phone: phone,
			from: fieldsValue['from'] ? fieldsValue['from'].format('YYYY-MM-DD') : null,
			to: fieldsValue['to'] ? fieldsValue['to'].format('YYYY-MM-DD') : null,
		};

		dispatch(setTableLoading(true));
		dispatch(
			setSearchParams({
				...searchParams,
				from: values.from,
				to: values.to,
				phone: values.phone,
				operator: values.operator,
				status: values.status,
			}),
		);
		const parameters = {
			project: activeProject.value,
			from: values.from,
			to: values.to,
			phone: values.phone,
			operator: values.operator,
			status: values.status,
		};
		dispatch(fetchActiveProject(parameters));
	};

	const resetSearch = async () => {
		await dispatch(setSearchParams(null));
		searchForm.resetFields();
	};

	const getTableRowWidth = (row) => {
		switch (row) {
			case 'id':
				return 34; //def 50, mid 34
			case 'time':
				return 151; //def 168, mid 151
			case 'content':
				return 300; //def 300, mid 300

			default:
				return 'auto';
		}
	};

	const onSelectProject = async (_, optionObj) => {
		dispatch(setProjectLoading(true));
		resetSearch();

		const headerArr = optionObj.table_header.split(',');
		const rowArr = optionObj.table_row.split(',');

		const tableCols = await headerArr.map((col, i) => ({
			title: col,
			dataIndex: rowArr[i],
			width: headerArr.length > 7 ? getTableRowWidth(rowArr[i]) : 148,
			// render: rowArr[i] === 'time' ? (time) => moment(time).format('DD.MM.YYYY H:mm') : false,

			editable:
				rowArr[i] === 'id' ||
				rowArr[i] === 'time' ||
				rowArr[i] === 'operator' ||
				rowArr[i] === 'que'
					? false
					: true,
		}));

		dispatch(resetTableData());
		dispatch(setActiveProject(optionObj));
		dispatch(setTableColumns(tableCols));
	};

	return (
		<>
			<Box>
				<div className="controls">
					<Form
						form={searchForm}
						onFinish={fetchSearchData}
						autoComplete="off"
						initialValues={{
							from:
								searchParams && searchParams.from
									? moment(searchParams.from, 'YYYY-MM-DD')
									: null,
							to:
								searchParams && searchParams.to
									? moment(searchParams.to, 'YYYY-MM-DD')
									: null,
							phone: searchParams ? searchParams.phone : null,
							status: searchParams ? searchParams.status : null,
						}}
						layout="inline">
						<Form.Item name="from">
							<DatePicker placeholder="С" />
						</Form.Item>
						<Form.Item name="to">
							<DatePicker placeholder="По" />
						</Form.Item>
						<Form.Item name="phone">
							<Input
								placeholder="Телефон"
								prefix={
									<PhoneOutlined
										style={{ color: 'rgba(0, 0, 0, 0.25)' }}
										rotate={90}
									/>
								}
								allowClear
							/>
						</Form.Item>
						<Form.Item name="operator">
							<Input
								placeholder="Оператор"
								prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
								allowClear
							/>
						</Form.Item>
						<Form.Item name="status">
							<Select
								placeholder="Статус"
								style={{ width: 202 }}
								options={projectStatuses || null}
								allowClear
							/>
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								Поиск
							</Button>
						</Form.Item>
						{searchParams && (
							<Form.Item>
								<Button
									onClick={() => {
										dispatch(setTableLoading(true));
										resetSearch();
										dispatch(
											fetchActiveProject({ project: activeProject.value }),
										);
									}}>
									Сбросить
								</Button>
							</Form.Item>
						)}
					</Form>
					<Select
						value={activeProject ? activeProject.label : null}
						showSearch
						style={{ width: 202, marginLeft: 8 }}
						placeholder="Выбрать проект"
						optionFilterProp="label"
						onChange={onSelectProject}
						options={projectList}
						filterOption={(input, option) =>
							option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
					/>
				</div>
			</Box>
			<Box>
				{projectLoading ? (
					<Loader />
				) : tableData ? (
					<>
						<TableControls />
						<ProjectTable />
					</>
				) : (
					<EmptyProject />
				)}
			</Box>
			<BackTop duration={800} />
		</>
	);
};

export default Main;
