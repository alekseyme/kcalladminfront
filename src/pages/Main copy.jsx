import React from 'react';
import { DatePicker, Form, Input, Button, Select, Table, BackTop, message } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

//Redux
import {
	setActiveProject,
	setTableColumns,
	resetTableData,
	setTableData,
	setTablePaginationConfig,
	setSearchParams,
} from '../redux/actions/projects';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '../components/Loader';
import ExportButton from '../components/ExportButton';

const Main = () => {
	//Redux
	const dispatch = useDispatch();
	const { activeProject, tableColumns, tableData, tablePaginationConfig, searchParams } =
		useSelector(({ projects }) => projects);

	const [tableLoading, setTableLoading] = React.useState(false);
	const [projectList, setProjectList] = React.useState(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [searchForm] = Form.useForm();

	//Подгрузка списка проектов, доступных для пользователя, в селект
	React.useEffect(() => {
		axios
			.post('/userprojects', { isadmin: localStorage.getItem('auth_isadmin') === '1' })
			.then(({ data }) => {
				const projects = data.map((project) => {
					return {
						id: project.id,
						value: project.tablename,
						label: project.name,
						base_header: project.base_header,
						base_row: project.base_row,
					};
				});
				setProjectList(projects);
			});
	}, []);

	//Меняем активный проект, при смене в селекте
	React.useEffect(() => {
		if (activeProject && !tableData) {
			fetchActiveProject();
		} // eslint-disable-next-line
	}, [activeProject]);

	const fetchActiveProject = (parameters) => {
		const params = parameters || { project: activeProject.value };

		axios
			.post('/project/search', params)
			.then(({ data }) => {
				const tableConfig = {
					total: data.total,
					current_page: data.current_page,
					per_page: data.per_page,
				};
				dispatch(setTablePaginationConfig(tableConfig));
				dispatch(setTableData(data.data));
			})
			.catch(() => alert('ошибка запроса'))
			.finally(() => {
				setIsLoading(false);
				setTableLoading(false);
			});
	};

	const fetchSearchData = (fieldsValue) => {
		if (!activeProject) {
			message.warning('Сначала выберите проект', 2);
			return;
		}
		if (!fieldsValue.from && !fieldsValue.to && !fieldsValue.phone) {
			message.warning('Заполните хотя бы один параметр поиска', 2);
			return;
		}

		const values = {
			...fieldsValue,
			from: fieldsValue['from'] ? fieldsValue['from'].format('YYYY-MM-DD') : null,
			to: fieldsValue['to'] ? fieldsValue['to'].format('YYYY-MM-DD') : null,
		};

		setTableLoading(true);
		dispatch(
			setSearchParams({
				...searchParams,
				from: values.from,
				to: values.to,
				phone: values.phone,
			}),
		);
		const parameters = {
			project: activeProject.value,
			from: values.from,
			to: values.to,
			phone: values.phone,
		};
		fetchActiveProject(parameters);
	};

	const resetSearch = async () => {
		await dispatch(setSearchParams(null));
		searchForm.resetFields();
	};

	const onSelectProject = (_, optionObj) => {
		setIsLoading(true);
		resetSearch();

		const headerArr = optionObj.base_header.split(',');
		const rowArr = optionObj.base_row.split(',');

		const tableCols = headerArr.map((col, i) => ({
			title: col,
			dataIndex: rowArr[i],
			// key: rowArr[i],
			editable: true,
		}));

		dispatch(resetTableData());
		dispatch(setActiveProject(optionObj));
		dispatch(setTableColumns(tableCols));
	};

	const onChangeTablePage = (page, pageSize) => {
		setTableLoading(true);
		const parameters = {
			project: activeProject.value,
			page: page,
			per_page: pageSize,
			from: searchParams ? searchParams.from : null,
			to: searchParams ? searchParams.to : null,
			phone: searchParams ? searchParams.phone : null,
		};
		fetchActiveProject(parameters);
	};

	return (
		<>
			<div className="controls box">
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
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Поиск
						</Button>
					</Form.Item>
					{searchParams && (
						<Form.Item>
							<Button
								type="dashed"
								onClick={() => {
									setIsLoading(true);
									resetSearch();
									fetchActiveProject();
								}}>
								Сбросить
							</Button>
						</Form.Item>
					)}
				</Form>
				<Select
					value={activeProject ? activeProject.label : null}
					showSearch
					style={{ width: 200, marginLeft: 8 }}
					placeholder="Выбрать проект"
					optionFilterProp="label"
					onChange={onSelectProject}
					options={projectList}
					filterOption={(input, option) =>
						option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
					}></Select>
			</div>
			<div className="site-layout-background">
				{isLoading ? (
					<Loader />
				) : tableData ? (
					<>
						<div className="project-actions">
							<div>Всего записей: {tablePaginationConfig.total}</div>
							{activeProject && (
								<ExportButton
									activeProject={activeProject.value}
									searchParams={searchParams}
								/>
							)}
						</div>
						<Table
							rowKey={(record) => record.id}
							columns={tableColumns}
							dataSource={tableData}
							loading={tableLoading}
							pagination={{
								current: tablePaginationConfig.current_page,
								total: tablePaginationConfig.total,
								pageSize: tablePaginationConfig.per_page,
								onChange: onChangeTablePage,
							}}
						/>
					</>
				) : (
					<h1 style={{ textAlign: 'center', marginBottom: 0 }}>Выберите проект</h1>
				)}
			</div>
			<BackTop />
		</>
	);
};

export default Main;
