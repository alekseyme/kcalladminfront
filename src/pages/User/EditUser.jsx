import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import axios from 'axios';
import Loader from '../../components/Loader';
import ResourceHeader from '../../components/ResourceHeader';

const EditUser = () => {
	const [isLoadingPage, setIsLoadingPage] = React.useState(true);
	const [isLoading, setIsLoading] = React.useState(false);
	const [initValues, setInitValues] = React.useState({});
	let history = useHistory();
	const { id } = useParams();

	React.useEffect(() => {
		axios
			.get(`/users/${id}/edit`)
			.then(({ data }) => {
				setInitValues(data);
			})
			.catch(() => message.error('Ошибка получения пользовательскх данных'))
			.finally(() => {
				setIsLoadingPage(false);
			});
	}, [id]);

	const onFinish = (values) => {
		setIsLoading(true);
		const newUser = { ...values };
		axios
			.put(`/users/${id}`, newUser)
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
			<ResourceHeader title="Редактировать пользователя" path="/users" lintText="Назад" />

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
