import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

const User = () => {
	const [isLoading, setIsLoading] = React.useState(false);

	const onFinish = (values) => {
		setIsLoading(true);
		axios
			.get('/sanctum/csrf-cookie')
			.then(() => {
				console.log('csrf-cookie OK');
				axios
					.post('/api/users', values)
					.then(({ data }) => {
						console.log(data);
						message.success('Пользователь успешно добавлен');
					})
					.catch((rsp) => {
						console.log(rsp);
						message.error('Произошла ошибка');
					});
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<>
			<div className="controls box" style={{ padding: '14px 25px' }}>
				<b>Новый пользователь</b>
				<Button type="primary" style={{ marginLeft: 'auto' }}>
					<Link to={'/users'}>Назад</Link>
				</Button>
			</div>
			<div className="box" style={{ marginTop: 20 }}>
				<Form name="basic" onFinish={onFinish} autoComplete="off">
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
