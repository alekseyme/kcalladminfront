import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AuthApi } from 'api';
//Redux
import { useDispatch } from 'react-redux';
import { setUserInfo } from 'store/user/slice';

const Login = ({ onLogin }) => {
	const [isLoading, setIsLoading] = React.useState(false);
	const dispatch = useDispatch();

	let navigate = useNavigate();

	const onFinish = async (values) => {
		setIsLoading(true);
		try {
			await AuthApi.getCsrfCookie();
			const data = await AuthApi.logIn(values);
			localStorage.setItem('auth_name', data.name);
			dispatch(setUserInfo(data));
			onLogin();
			navigate('/', { replace: true });
		} catch (error) {
			message.error(error.response.data.message);
		} finally {
			setIsLoading(false);
		}
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
