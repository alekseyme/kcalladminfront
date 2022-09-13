import React from 'react';
import { Link } from 'react-router-dom';
import api from 'util/api';
import roles from 'util/roles';
import { Table, Space, Tag, Button, PageHeader, Popconfirm, Tooltip, message } from 'antd';
import { KeyOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { Box, BoxTitle, ResourceLoader } from 'components';
//Redux
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser, fetchUsers, selectUsers } from 'store/users/slice';

const User = () => {
	const dispatch = useDispatch();
	const { items, status } = useSelector(selectUsers);
	const [isUserReload, setIsUserReload] = React.useState(false);

	const isIdle = status === 'idle';

	React.useEffect(() => {
		if (isIdle) {
			getUsers();
		} // eslint-disable-next-line
	}, []);

	const getUsers = async () => {
		await dispatch(fetchUsers()).unwrap();
		setIsUserReload(false);
	};

	const onUserListReload = () => {
		setIsUserReload(true);
		getUsers();
	};

	const onDeleteUser = async (_, userId) => {
		try {
			await dispatch(deleteUser(userId)).unwrap();
		} catch (err) {
			message.error('Ошибка при удалении пользователя');
		}
	};

	const onResetPassword = (userId) => {
		const newPwd = prompt('Введите новый пароль');

		if (newPwd) {
			api()
				.patch(`/user/changepwd`, { userid: userId, password: newPwd })
				.then(({ data }) => {
					message.success(data.message);
				})
				.catch(() => message.error('Ошибка при смене пароля'));
		}
	};

	const columns = [
		{
			title: 'Пользователь',
			dataIndex: 'name',
			key: 'name',
			render: (_, record) => {
				return (
					<>
						{record.role === 0 || record.role === 1 ? (
							<>
								{record.name} <Tag>{roles[record.role].label}</Tag>
							</>
						) : (
							record.name
						)}
					</>
				);
			},
		},
		{
			title: 'Логин',
			dataIndex: 'username',
			key: 'username',
			ellipsis: true,
		},
		{
			title: '#',
			key: 'action',
			width: 130,
			align: 'center',
			render: (_, record) => (
				<Space size="middle">
					<Link to={`/users/${record.id}/edit`}>
						<EditTwoTone style={{ fontSize: '20px' }} />
					</Link>
					<Popconfirm
						title="Вы уверены, что хотите удалить пользователя?"
						onConfirm={(e) => onDeleteUser(e, record.id)}
						placement="topRight"
						okText="Да"
						cancelText="Отмена">
						<Button type="link" className="btn-link">
							<DeleteTwoTone twoToneColor="#f5222d" style={{ fontSize: '20px' }} />
						</Button>
					</Popconfirm>
					<Tooltip title="Смена пароля">
						<Button
							type="link"
							className="btn-link"
							onClick={() => onResetPassword(record.id)}>
							<KeyOutlined style={{ fontSize: '20px' }} />
						</Button>
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<>
			<PageHeader className="page-header" title="Управление пользователями" />
			<Box>
				{isIdle ? (
					<ResourceLoader />
				) : (
					<>
						<BoxTitle
							text="Пользователи"
							linkText="Создать пользователя"
							path="/users/create"
							onReload={onUserListReload}
							resourceCount={items?.length}
							spin={isUserReload}
							reloadable
						/>
						<Table
							style={{ width: '100%' }}
							rowKey={(record) => record.id}
							columns={columns}
							loading={isUserReload}
							dataSource={items}
							pagination={{ hideOnSinglePage: true }}
						/>
					</>
				)}
			</Box>
		</>
	);
};

export default User;
