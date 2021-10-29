import React from 'react';
import { DatePicker, Form, Input, Button, Select, BackTop, message } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

//Redux
import {
	setActiveProject,
	setTableColumns,
	resetTableData,
	setSearchParams,
	fetchActiveProject,
	setProjectLoading,
	setTableLoading,
} from '../redux/actions/projects';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '../components/Loader';
import TableControls from '../components/TableControls';
import ProjectTable from '../components/ProjectTable';

const Main = () => {
	//Redux
	const dispatch = useDispatch();
	const { activeProject, projectLoading, tableData, searchParams, projectStatuses } = useSelector(
		({ projects }) => projects,
	);

	const [projectList, setProjectList] = React.useState(null);
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
			dispatch(fetchActiveProject(null, activeProject.value));
		} // eslint-disable-next-line
	}, [activeProject]);

	const fetchSearchData = (fieldsValue) => {
		console.log(fieldsValue);
		if (!activeProject) {
			message.warning('Сначала выберите проект', 2);
			return;
		}
		if (!fieldsValue.from && !fieldsValue.to && !fieldsValue.phone && !fieldsValue.status) {
			message.warning('Заполните хотя бы один параметр поиска', 2);
			return;
		}

		const values = {
			...fieldsValue,
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
				status: values.status,
			}),
		);
		const parameters = {
			project: activeProject.value,
			from: values.from,
			to: values.to,
			phone: values.phone,
			status: values.status,
		};
		dispatch(fetchActiveProject(parameters));
	};

	const resetSearch = async () => {
		await dispatch(setSearchParams(null));
		searchForm.resetFields();
	};

	const onSelectProject = (_, optionObj) => {
		dispatch(setProjectLoading(true));
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
								type="dashed"
								onClick={() => {
									dispatch(setProjectLoading(true));
									resetSearch();
									dispatch(fetchActiveProject(null, activeProject.value));
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
					}></Select>
			</div>
			<div className="site-layout-background">
				{projectLoading ? (
					<Loader />
				) : tableData ? (
					<>
						<TableControls />
						<ProjectTable />
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
