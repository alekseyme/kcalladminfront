import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, PageHeader, Card, Row, Col, Transfer, message } from 'antd';
import api from 'util/api';
import roles from 'util/roles';
import { Box, Loader, FormSave } from 'components';
//Redux
import { setUserList } from 'store/user/slice';
import { setProjectList } from 'store/projects/slice';
import { useSelector, useDispatch } from 'react-redux';

const EditUser = () => {
	//Redux
	const dispatch = useDispatch();
	const { userList } = useSelector(({ user }) => user);
	const { projectList } = useSelector(({ projects }) => projects);

	const [isLoadingPage, setIsLoadingPage] = React.useState(true);
	const [isLoading, setIsLoading] = React.useState(false);
	const [initValues, setInitValues] = React.useState({});
	const [targetKeys, setTargetKeys] = React.useState([]);
	const [isRoleAdmin, setIsRoleAdmin] = React.useState(false);
	const { id } = useParams();
	let navigate = useNavigate();

	React.useEffect(() => {
		api()
			.get(`/users/${id}/edit`)
			.then(({ data }) => {
				setInitValues(data);
				if (data.role === 0) {
					setIsRoleAdmin(true);
				}
				const availableProjects = data.projects.map((project) => project.id);
				setTargetKeys(availableProjects);
			})
			.catch(() => message.error('Ошибка получения пользовательскх данных'))
			.finally(() => {
				setIsLoadingPage(false);
			});
	}, [id]);

	React.useEffect(() => {
		if (!projectList) {
			getProjects();
		} // eslint-disable-next-line
	}, []);

	const getProjects = () => {
		api()
			.get('/projects')
			.then(({ data }) => {
				dispatch(setProjectList(data));
			})
			.catch(() => message.error('Ошибка при загрузке списка проектов'));
	};

	const handleRoleChange = (value) => {
		const isAdmin = value === 0;
		isAdmin ? setIsRoleAdmin(true) : setIsRoleAdmin(false);
	};

	const filterOption = (input, option) =>
		option.name.toLowerCase().indexOf(input.toLowerCase()) > -1;

	const onProjectChange = (nextTargetKeys) => {
		setTargetKeys(nextTargetKeys);
	};

	const onSuccessUserEdit = (updatedUser) => {
		const newUserList = userList.map((user) => {
			if (user.id === updatedUser.id) {
				return updatedUser;
			}
			return user;
		});
		dispatch(setUserList(newUserList));
	};

	const onFinish = (values) => {
		setIsLoading(true);
		const newUser = { ...values, projects: isRoleAdmin ? [] : targetKeys };
		api()
			.put(`/users/${id}`, newUser)
			.then(({ data }) => {
				message.success(data.message);
				onSuccessUserEdit(data.user);
				navigate('/users', { replace: true });
			})
			.catch(() => {
				message.error('Произошла ошибка');
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<>
			<PageHeader
				className="page-header"
				title="Редактирование пользователя"
				onBack={() => window.history.back()}
			/>
			{isLoadingPage ? (
				<Loader />
			) : (
				<Form
					name="edit-user"
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
										label="Имя"
										name="name"
										rules={[{ required: true, message: 'Введите имя!' }]}>
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
										offset: 3,
									}}>
									<Form.Item
										label="Логин"
										name="username"
										rules={[{ required: true, message: 'Введите логин!' }]}>
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
										offset: 3,
									}}>
									<Form.Item
										label="Роль"
										name="role"
										rules={[{ required: true, message: 'Укажите роль!' }]}>
										<Select
											placeholder="Роль"
											options={roles}
											onChange={handleRoleChange}
										/>
									</Form.Item>
								</Col>
							</Row>
						</Card>
					</Box>
					{!isRoleAdmin && (
						<Box compact>
							<Card title="Привязать проекты" bordered={false}>
								<Form.Item>
									<Transfer
										className="transfer-list"
										dataSource={projectList || []}
										titles={['Все', 'Доступные']}
										targetKeys={targetKeys}
										onChange={onProjectChange}
										filterOption={filterOption}
										rowKey={(record) => record.id}
										render={(item) => item.name}
										showSearch
										oneWay
									/>
								</Form.Item>
							</Card>
						</Box>
					)}
					<FormSave loading={isLoading} />
				</Form>
			)}
		</>
	);
};

export default EditUser;
