import React from 'react';
import { Form, Input, Select, Transfer, PageHeader, Card, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from 'util/api';
import roles from 'util/roles';
//Redux
import { setUserList } from 'store/user/slice';
import { setProjectList } from 'store/projects/slice';
import { useSelector, useDispatch } from 'react-redux';
import { Box, FormSave } from 'components';

const User = () => {
	//Redux
	const dispatch = useDispatch();
	const { userList } = useSelector(({ user }) => user);
	const { projectList } = useSelector(({ projects }) => projects);

	const [isLoading, setIsLoading] = React.useState(false);
	const [targetKeys, setTargetKeys] = React.useState([]);
	const [isRoleAdmin, setIsRoleAdmin] = React.useState(false);

	let navigate = useNavigate();

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

	const onSuccessUserCreate = (user) => {
		const newUserList = [...userList, user];
		dispatch(setUserList(newUserList));
	};

	const onFinish = (values) => {
		setIsLoading(true);
		const newUser = { ...values, projects: isRoleAdmin ? [] : targetKeys };

		api()
			.post('/users', newUser)
			.then(({ data }) => {
				message.success(data.message);
				onSuccessUserCreate(data.user);
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
				title="Новый пользователь"
				onBack={() => window.history.back()}
			/>
			<Form name="new-user" onFinish={onFinish} layout="vertical" autoComplete="off">
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
									span: 5,
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
									span: 5,
									offset: 1,
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
									span: 5,
									offset: 1,
								}}>
								<Form.Item
									label="Пароль"
									name="password"
									rules={[{ required: true, message: 'Введите пароль!' }]}>
									<Input.Password />
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
									span: 5,
									offset: 1,
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
		</>
	);
};

export default User;
