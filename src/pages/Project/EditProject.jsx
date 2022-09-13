import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Transfer, Col, Row, PageHeader, Switch, Space, Card, message } from 'antd';
import api from 'util/api';
import { Box, Loader, FormSave } from 'components';
//Redux
import { setUserList } from 'store/user/slice';
import { setProjectList } from 'store/projects/slice';
import { useSelector, useDispatch } from 'react-redux';

const EditProject = () => {
	//Redux
	const dispatch = useDispatch();
	const { userList } = useSelector(({ user }) => user);
	const { projectList } = useSelector(({ projects }) => projects);
	const [isLoadingPage, setIsLoadingPage] = React.useState(true);
	const [isLoading, setIsLoading] = React.useState(false);
	const [initValues, setInitvalues] = React.useState({});
	const [targetKeys, setTargetKeys] = React.useState([]);
	const [isClientAvailable, setIsClientAvailable] = React.useState(false);
	const [isOperAvailable, setIsOperAvailable] = React.useState(false);
	const { id } = useParams();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (!userList) {
			getUsers();
		} // eslint-disable-next-line
	}, []);

	const getUsers = () => {
		api()
			.get('/users')
			.then(({ data }) => {
				dispatch(setUserList(data));
			})
			.catch(() => message.error('Ошибка загрузки списка пользователей'));
	};

	React.useEffect(() => {
		api()
			.get(`/projects/${id}/edit`)
			.then(({ data }) => {
				setInitvalues(data);
				setIsClientAvailable(data.client_available === 1 ? true : false);
				setIsOperAvailable(data.oper_available === 1 ? true : false);
				if (data.users.length > 0) {
					const availableUsers = data.users.map((user) => user.id);
					setTargetKeys(availableUsers);
				}
			})
			.catch(() => message.error('Ошибка загрузки данных по текущему проекту'))
			.finally(() => {
				setIsLoadingPage(false);
			});
	}, [id]);

	const filterOption = (input, option) =>
		option.name.toLowerCase().indexOf(input.toLowerCase()) > -1;

	const onUsersChange = (nextTargetKeys) => {
		setTargetKeys(nextTargetKeys);
	};

	const handleClientAvailableChange = (checked) => {
		setIsClientAvailable(checked);
	};

	const handleOperAvailableChange = (checked) => {
		setIsOperAvailable(checked);
	};

	const onSuccessProjectEdit = (updatedProject) => {
		const newProjectList = projectList.map((project) => {
			if (project.id === updatedProject.id) {
				return updatedProject;
			}
			return project;
		});
		dispatch(setProjectList(newProjectList));
	};

	const onFinish = (values) => {
		setIsLoading(true);
		const newProject = { ...values, users: targetKeys };
		api()
			.put(`/projects/${id}`, newProject)
			.then(({ data }) => {
				message.success(data.message);
				onSuccessProjectEdit(data.project);
				navigate('/projects', { replace: true });
			})
			.catch(() => message.error('Ошибка редактирования проекта'))
			.finally(() => setIsLoading(false));
	};

	return (
		<>
			<PageHeader
				className="page-header"
				title="Редактирование проекта"
				onBack={() => window.history.back()}
			/>

			{isLoadingPage ? (
				<Loader />
			) : (
				<Form
					name="edit-project"
					onFinish={onFinish}
					layout="vertical"
					initialValues={initValues}
					autoComplete="off">
					<Box compact>
						<Card title="Основная информация" bordered={false}>
							<Row gutter={16} justify="space-between">
								<Col
									sm={{
										span: 24,
									}}
									md={{
										span: 12,
									}}
									lg={{
										span: 6,
									}}>
									<Form.Item
										label="Название проекта"
										name="name"
										rules={[{ required: true, message: 'Введите название!' }]}>
										<Input />
									</Form.Item>
								</Col>
								<Col
									sm={{
										span: 24,
									}}
									md={{
										span: 12,
									}}
									lg={{
										span: 6,
									}}>
									<Form.Item
										label="Таблица"
										tooltip={{
											title: 'Указать имя таблицы из БД',
										}}
										name="tablename"
										rules={[{ required: true, message: 'Укажите таблицу!' }]}>
										<Input />
									</Form.Item>
								</Col>
								<Col
									sm={{
										span: 24,
									}}
									md={{
										span: 24,
									}}
									lg={{
										span: 6,
									}}>
									<Space size="large">
										<Form.Item
											name="oper_available"
											label="ЛК оператора"
											valuePropName="checked">
											<Switch onChange={handleOperAvailableChange} />
										</Form.Item>
										<Form.Item
											name="client_available"
											label="ЛК клиента"
											valuePropName="checked">
											<Switch onChange={handleClientAvailableChange} />
										</Form.Item>
									</Space>
								</Col>
							</Row>
							<Row gutter={16} justify="space-between">
								<Col
									sm={{
										span: 24,
									}}
									md={{
										span: 24,
									}}
									lg={{
										span: 6,
									}}>
									<Form.Item
										label="Заголовок таблицы"
										tooltip={{
											title: 'Через запятую. Пример: ID,Имя,Телефон',
										}}
										name="table_header"
										rules={[
											{
												required: true,
												message: 'Укажите заголовок таблицы!',
											},
										]}>
										<Input />
									</Form.Item>
								</Col>
								<Col
									sm={{
										span: 24,
									}}
									md={{
										span: 24,
									}}
									lg={{
										span: 6,
									}}>
									<Form.Item
										label="Строка таблицы"
										tooltip={{
											title: 'Поля из таблицы в БД через запятую. Пример: id,name,number',
										}}
										name="table_row"
										rules={[
											{ required: true, message: 'Укажите строку таблицы!' },
										]}>
										<Input />
									</Form.Item>
								</Col>
								<Col
									sm={{
										span: 24,
									}}
									md={{
										span: 24,
									}}
									lg={{
										span: 6,
									}}>
									<Form.Item
										name="changes"
										label="Изменения"
										valuePropName="checked">
										<Switch />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={16}>
								{isClientAvailable && (
									<>
										<Col
											sm={{
												span: 24,
											}}
											md={{
												span: 24,
											}}
											lg={{
												span: 6,
											}}>
											<Form.Item
												label="Заголовок таблицы в ЛК"
												tooltip={{
													title: 'Через запятую. Пример: ID,Имя,Телефон',
												}}
												name="table_header_client"
												rules={[
													{
														required: true,
														message: 'Укажите заголовок таблицы!',
													},
												]}>
												<Input />
											</Form.Item>
										</Col>
										<Col
											sm={{
												span: 24,
											}}
											md={{
												span: 24,
											}}
											lg={{
												span: 6,
												offset: 3,
											}}>
											<Form.Item
												label="Строка таблицы в ЛК"
												tooltip={{
													title: 'Поля из таблицы в БД через запятую. Пример: id,name,number',
												}}
												name="table_row_client"
												rules={[
													{
														required: true,
														message: 'Укажите строку таблицы!',
													},
												]}>
												<Input />
											</Form.Item>
										</Col>
									</>
								)}
								{isOperAvailable && (
									<>
										<Col
											sm={{
												span: 24,
											}}
											md={{
												span: 24,
											}}
											lg={{
												span: 6,
												offset: isClientAvailable ? 3 : 0,
											}}>
											<Form.Item label="Ссылка на скрипт" name="scriptlink">
												<Input />
											</Form.Item>
										</Col>
									</>
								)}
							</Row>
						</Card>
					</Box>
					<Box compact>
						<Card title="Привязать пользователей" bordered={false}>
							<Form.Item>
								<Transfer
									className="transfer-list"
									dataSource={userList?.filter((user) => user.role !== 0) || []}
									titles={['Все', 'Доступен для']}
									targetKeys={targetKeys}
									onChange={onUsersChange}
									filterOption={filterOption}
									rowKey={(record) => record.id}
									render={(item) => item.name}
									showSearch
									oneWay
								/>
							</Form.Item>
							<FormSave loading={isLoading} />
						</Card>
					</Box>
				</Form>
			)}
		</>
	);
};

export default EditProject;
