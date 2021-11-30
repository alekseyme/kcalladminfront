import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message, Select } from 'antd';
import axios from 'axios';
import Loader from '../../components/Loader';
import ResourceHeader from '../../components/ResourceHeader';

const EditProject = () => {
	const [userList, setUsertList] = React.useState([]);
	const [projectUser, setProjectUser] = React.useState([]);
	const [isLoadingPage, setIsLoadingPage] = React.useState(true);
	const [isLoading, setIsLoading] = React.useState(false);
	const [initValues, setInitvalues] = React.useState({});
	const { id } = useParams();

	React.useEffect(() => {
		axios
			.get('/users')
			.then(({ data }) => {
				const newData = data.map((user) => {
					return { label: user.name, value: user.id };
				});
				setUsertList(newData);
			})
			.catch(() => message.error('Произошла ошибка'));
	}, []);

	let history = useHistory();

	React.useEffect(() => {
		axios
			.get(`/projects/${id}/edit`)
			.then(({ data }) => {
				setInitvalues(data);
				if (data.users.length > 0) {
					const projectUser = data.users.map((user) => user.id);
					setProjectUser(projectUser);
				}
			})
			.catch(() => message.error('Ошибка редактирования проекта'))
			.finally(() => {
				setIsLoadingPage(false);
			});
	}, [id]);

	const onFinish = (values) => {
		setIsLoading(true);
		const newProject = { ...values, users: projectUser };
		axios
			.put(`/projects/${id}`, newProject)
			.then(({ data }) => {
				message.success(data.message);
				history.push('/projects');
			})
			.catch(() => {
				message.error('Произошла ошибка');
			})
			.finally(() => setIsLoading(false));
	};

	const onChangeUsers = (value) => {
		setProjectUser(value);
	};

	return (
		<>
			<ResourceHeader title="Редактировать проект" path="/projects" lintText="Назад" />
			<div className="box">
				{isLoadingPage ? (
					<Loader />
				) : (
					<>
						<Form
							name="basic"
							onFinish={onFinish}
							initialValues={initValues}
							autoComplete="off">
							<Form.Item
								label="Имя"
								name="name"
								rules={[{ required: true, message: 'Введите имя!' }]}>
								<Input />
							</Form.Item>
							<Form.Item
								label="Таблица"
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
									Обновить проект
								</Button>
							</Form.Item>
						</Form>
					</>
				)}
			</div>
		</>
	);
};

export default EditProject;
