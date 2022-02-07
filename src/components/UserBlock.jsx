import React from 'react';
import { Avatar, Menu, Dropdown } from 'antd';
import Logout from './Logout';

const UserBlock = ({ onLogout }) => {
	const userName = localStorage.getItem('auth_name');

	const menu = (
		<Menu>
			<Menu.Item key="profile">Профиль</Menu.Item>
			<Menu.Divider />
			<Logout onLogout={onLogout} />
		</Menu>
	);

	return (
		<div className="user-box">
			{userName ? (
				<span
					style={{
						marginRight: 10,
						fontWeight: 600,
						color: 'rgba(255, 255, 255, 0.65)',
					}}>
					{userName}
				</span>
			) : null}
			<Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
				<Avatar
					style={{
						color: '#f56a00',
						backgroundColor: '#fde3cf',
					}}>
					{userName ? userName[0] : '-'}
				</Avatar>
			</Dropdown>
		</div>
	);
};

export default UserBlock;
