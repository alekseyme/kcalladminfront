import React from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

const Login = ({ onLogin }) => {
	const [isLoading, setIsLoading] = React.useState(false);

	let history = useHistory();

	const onFinish = (values) => {
		setIsLoading(true);
		axios
			.get('/sanctum/csrf-cookie')
			.then(() => {
				axios
					.post('/api/login', values)
					.then(({ data }) => {
						localStorage.setItem('auth_name', data.name);
						localStorage.setItem('auth_username', data.username);
						if (data.isadmin) {
							localStorage.setItem('auth_isadmin', data.isadmin);
						}
						localStorage.setItem('auth_token', data.token);
						onLogin();
						history.push('/');
					})
					.catch((error) => message.error(error.response.data.message));
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<div className="login">
			<Form className="login-form" onFinish={onFinish} autoComplete="off" size="large">
				<Form.Item
					name="username"
					rules={[
						{
							required: true,
							message: 'Введите логин!',
						},
					]}>
					<Input
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder="Логин"
					/>
				</Form.Item>

				<Form.Item
					name="password"
					rules={[
						{
							required: true,
							message: 'Введите пароль!',
						},
					]}>
					<Input.Password
						prefix={<LockOutlined className="site-form-item-icon" />}
						placeholder="Пароль"
					/>
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						className="login-form-button"
						loading={isLoading}>
						Войти
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default Login;