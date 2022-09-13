import React from 'react';
import { Form, Input, Transfer, Col, Row, PageHeader, Switch, Card, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ProjectApi, UserApi } from 'api';
//Redux
import { setUserList } from 'store/user/slice';
import { setProjectList } from 'store/projects/slice';
import { useSelector, useDispatch } from 'react-redux';
import { Box, FormSave } from 'components';

const CreateProject = () => {
	//Redux
	const dispatch = useDispatch();
	const { userList } = useSelector(({ user }) => user);
	const { projectList } = useSelector(({ projects }) => projects);
	const [targetKeys, setTargetKeys] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [isClientAvailable, setIsClientAvailable] = React.useState(false);
	const [isOperAvailable, setIsOperAvailable] = React.useState(false);
	const [isBillingAvailable, setIsBillingAvailable] = React.useState(false);
	// const [form] = Form.useForm();
	let navigate = useNavigate();

	const getUsers = async () => {
		try {
			const data = await UserApi.getAll();
			dispatch(setUserList(data));
		} catch (e) {
			message.error('Ошибка при получении пользователей');
		}
	};

	React.useEffect(() => {
		if (!userList) {
			getUsers();
		} // eslint-disable-next-line
	}, []);

	const filterOption = (input, option) =>
		option.name.toLowerCase().indexOf(input.toLowerCase()) > -1;

	const onUsersChange = (nextTargetKeys) => setTargetKeys(nextTargetKeys);
	const handleClientAvailableChange = (checked) => setIsClientAvailable(checked);
	const handleBillingAvailableChange = (checked) => setIsBillingAvailable(checked);

	const handleOperAvailableChange = (checked) => setIsOperAvailable(checked);
	const onSuccessProjectCreate = (project) => {
		const newProjectList = [...projectList, project];
		dispatch(setProjectList(newProjectList));
	};

	const onFinish = async (values) => {
		setIsLoading(true);
		try {
			const newProject = { ...values, users: targetKeys };
			const data = await ProjectApi.create(newProject);
			message.success(data.message);
			onSuccessProjectCreate(data.project);
			navigate('/projects', { replace: true });
		} catch (error) {
			message.error('Произошла ошибка при создании проекта');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<PageHeader
				className="page-header"
				title="Новый проект"
				onBack={() => window.history.back()}
			/>
			<Form
				name="new-project"
				onFinish={onFinish}
				layout="vertical"
				initialValues={{ changes: false, client_available: false, oper_available: false }}
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
										{ required: true, message: 'Укажите заголовок таблицы!' },
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
								<Space size="large">
									<Form.Item
										name="changes"
										label="Изменения"
										valuePropName="checked">
										<Switch />
									</Form.Item>
									<Form.Item
										name="billing_available"
										label="Биллинг"
										valuePropName="checked">
										<Switch onChange={handleBillingAvailableChange} />
									</Form.Item>
								</Space>
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
		</>
	);
};

export default CreateProject;
