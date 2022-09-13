import React from 'react';
import { Avatar, Menu, Dropdown } from 'antd';
import { SmileTwoTone } from '@ant-design/icons';

const UserBlock = () => {
	const userName = localStorage.getItem('auth_name');

	const menu = (
		<Menu
			items={[
				{
					label: 'Спасибо за клик',
					key: '1',
					icon: <SmileTwoTone style={{ fontSize: 16 }} />,
				},
			]}
		/>
	);

	return (
		<Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
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
				<Avatar
					size="small"
					style={{
						color: '#f56a00',
						backgroundColor: '#fde3cf',
					}}>
					{userName ? userName[0] : '-'}
				</Avatar>
				{/* <DownOutlined
					style={{
						marginLeft: 6,
						color: 'rgba(255, 255, 255, 0.65)',
					}}
				/> */}
			</div>
		</Dropdown>
	);
};

export default UserBlock;
