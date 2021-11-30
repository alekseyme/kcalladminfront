import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import ResourceHeader from '../../components/ResourceHeader';

const User = () => {
	const [isLoading, setIsLoading] = React.useState(false);

	let history = useHistory();

	const onFinish = (values) => {
		setIsLoading(true);
		axios
			.post('/users', values)
			.then(({ data }) => {
				message.success(data.message);
				history.push('/users');
			})
			.catch(() => {
				message.error('Произошла ошибка');
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<>
			<ResourceHeader title="Новый пользователь" path="/users" lintText="Назад" />
			<div className="box">
				<Form
					name="basic"
					onFinish={onFinish}
					initialValues={{ isadmin: false }}
					autoComplete="off">
					<Form.Item
						label="Имя"
						name="name"
						rules={[{ required: true, message: 'Введите имя!' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label="Логин"
						name="username"
						rules={[{ required: true, message: 'Введите логин!' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label="Пароль"
						name="password"
						rules={[{ required: true, message: 'Введите пароль!' }]}>
						<Input.Password />
					</Form.Item>
					<Form.Item name="isadmin" valuePropName="checked">
						<Checkbox>Админ</Checkbox>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" loading={isLoading}>
							Добавить пользователя
						</Button>
					</Form.Item>
				</Form>
			</div>
		</>
	);
};

export default User;
