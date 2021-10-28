import React from 'react';
import { Avatar, Menu, Dropdown } from 'antd';
import { Logout } from '../pages';

const UserBlock = ({ onLogout }) => {
	const menu = (
		<Menu>
			<Menu.Item key="settings">Настройки</Menu.Item>
			<Menu.Divider />
			<Logout onLogout={onLogout} />
		</Menu>
	);

	return (
		<Dropdown overlay={menu} trigger={['click']}>
			<Avatar
				style={{
					color: '#f56a00',
					backgroundColor: '#fde3cf',
				}}>
				{localStorage.getItem('auth_name')[0]}
			</Avatar>
		</Dropdown>
	);
};

export default UserBlock;
