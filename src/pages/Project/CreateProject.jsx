import React from 'react';
import { Form, Input, Button, Select, Checkbox, message } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ResourceHeader from '../../components/ResourceHeader';

const CreateProject = () => {
	const [userList, setUserList] = React.useState([]);
	const [projectUser, setProjectUser] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(false);
	let history = useHistory();

	React.useEffect(() => {
		axios
			.get('/users')
			.then(({ data }) => {
				const newData = data.map((user) => {
					return { label: user.name, value: user.id };
				});
				setUserList(newData);
			})
			.catch(() => message.error('Произошла ошибка'));
	}, []);

	const onFinish = (values) => {
		const newProject = { ...values, users: projectUser };
		setIsLoading(true);
		axios
			.post('/projects', newProject)
			.then(({ data }) => {
				message.success(data.message);
				history.push('/projects');
			})
			.catch(() => message.error('Произошла ошибка'))
			.finally(() => setIsLoading(false));
	};

	const onChangeUsers = (checkedValues) => {
		setProjectUser(checkedValues);
	};

	return (
		<>
			<ResourceHeader title="Новый проект" path="/projects" lintText="Назад" />
			<div className="box">
				<Form
					name="basic"
					onFinish={onFinish}
					initialValues={{ changes: false }}
					autoComplete="off">
					<Form.Item
						label="Имя"
						name="name"
						rules={[{ required: true, message: 'Введите имя!' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label="Таблица"
						tooltip={{
							title: 'Указать имя таблицы из БД',
						}}
						name="tablename"
						rules={[{ required: true, message: 'Укажите таблицу!' }]}>
						<Input />
					</Form.Item>

					<Form.Item
						label="Заголовок таблицы"
						tooltip={{
							title: 'Через запятую. Пример: ID,Имя,Телефон',
						}}
						name="base_header"
						rules={[{ required: true, message: 'Укажите заголовок таблицы!' }]}>
						<Input />
					</Form.Item>

					<Form.Item
						label="Строка таблицы"
						tooltip={{
							title: 'Поля из таблицы в БД через запятую. Пример: id,name,number',
						}}
						name="base_row"
						rules={[{ required: true, message: 'Укажите строку таблицы!' }]}>
						<Input />
					</Form.Item>

					<Form.Item name="changes" valuePropName="checked">
						<Checkbox>Изменения</Checkbox>
					</Form.Item>

					<Form.Item>
						<Select
							mode="multiple"
							optionFilterProp="label"
							style={{ width: '100%' }}
							placeholder="Выбрать пользователей"
							defaultValue={projectUser}
							onChange={onChangeUsers}
							options={userList}></Select>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" loading={isLoading}>
							Добавить проект
						</Button>
					</Form.Item>
				</Form>
			</div>
		</>
	);
};

export default CreateProject;
