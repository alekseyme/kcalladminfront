import React from 'react';
import { Form, Input, Button, Select, Checkbox, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CreateProject = () => {
	const [userList, setUserList] = React.useState([]);
	const [projectUser, setProjectUser] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(false);

	React.useEffect(() => {
		axios
			.get('/api/users')
			.then(({ data }) => {
				const newData = data.map((user) => {
					return { label: user.name, value: user.id };
				});
				setUserList(newData);
			})
			.finally(() => console.log('users fetched'));
	}, []);

	const onFinish = (values) => {
		console.log(values);
		console.log(projectUser);
		const newProject = { ...values, users: projectUser };
		console.log(newProject);
		setIsLoading(true);
		axios
			.post('/api/projects', newProject)
			.then(({ data }) => {
				console.log(data);
				message.success('Проект успешно добавлен');
			})
			.catch((rsp) => {
				console.log(rsp);
				message.error('Произошла ошибка');
			})
			.finally(() => setIsLoading(false));
	};

	const onChangeUsers = (checkedValues) => {
		setProjectUser(checkedValues);
	};

	return (
		<>
			<div className="controls box" style={{ padding: '14px 25px' }}>
				<b>Новый проект</b>
				<Button type="primary" style={{ marginLeft: 'auto' }}>
					<Link to={'/projects'}>Назад</Link>
				</Button>
			</div>
			<div className="box" style={{ marginTop: 20 }}>
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
