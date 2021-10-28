import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import axios from 'axios';
import Loader from '../../components/Loader';

const EditUser = () => {
	const [isLoadingPage, setIsLoadingPage] = React.useState(true);
	const [isLoading, setIsLoading] = React.useState(false);
	const [initValues, setInitValues] = React.useState({});
	const { id } = useParams();

	React.useEffect(() => {
		axios
			.get(`/api/users/${id}/edit`)
			.then(({ data }) => {
				setInitValues(data);
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setIsLoadingPage(false);
			});
	}, [id]);

	const onFinish = (values) => {
		setIsLoading(true);
		const newUser = { ...values };
		axios
			.put(`/api/users/${id}`, newUser)
			.then(({ data }) => {
				message.success(data.message);
			})
			.catch(() => {
				message.error('Произошла ошибка');
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<>
			<div className="controls box" style={{ padding: '14px 25px' }}>
				<b>Редактировать пользователя</b>
				<Button type="primary" style={{ marginLeft: 'auto' }}>
					<Link to={'/users'}>Назад</Link>
				</Button>
			</div>
			<div className="box" style={{ marginTop: 20 }}>
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
								label="Логин"
								name="username"
								rules={[{ required: true, message: 'Введите логин!' }]}>
								<Input />
							</Form.Item>
							<Form.Item name="isadmin" valuePropName="checked">
								<Checkbox>Админ</Checkbox>
							</Form.Item>

							<Form.Item>
								<Button type="primary" htmlType="submit" loading={isLoading}>
									Обновить пользователя
								</Button>
							</Form.Item>
						</Form>
					</>
				)}
			</div>
		</>
	);
};

export default EditUser;
