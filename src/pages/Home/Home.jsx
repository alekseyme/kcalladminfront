import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined, ProjectOutlined } from '@ant-design/icons';

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { Main, Project, EditProject, CreateProject, EditUser, CreateUser, User } from 'pages';
import { UserBlock, LogoutButton } from 'components';
import Logo from 'assets/brand_logo.svg';
//Redux
import { useSelector } from 'react-redux';

const { Header, Content, Sider } = Layout;

const Home = ({ onSuccessLogout }) => {
	const location = useLocation();
	const navigate = useNavigate();

	const { userInfo } = useSelector((state) => state.user);
	const [collapsed, setCollapsed] = React.useState(false);

	const isAdmin = userInfo?.role === 0;

	const menuItems = [
		{ label: 'Главная', key: '/', icon: <HomeOutlined /> },
		isAdmin
			? {
					label: 'Проекты',
					key: 'projects',
					icon: <ProjectOutlined />,
					children: [
						{ label: 'Список проектов', key: '/projects' },
						{ label: 'Создать проект', key: '/projects/create' },
					],
			  }
			: false,
		isAdmin
			? {
					label: 'Пользователи',
					key: 'users',
					icon: <UserOutlined />,
					children: [
						{ label: 'Список пользователей', key: '/users' },
						{ label: 'Создать пользователя', key: '/users/create' },
					],
			  }
			: false,
	];

	const handleMenuSelect = ({ key }) => {
		navigate(key, { replace: true });
	};

	const handleChangeCollapse = (value) => {
		setCollapsed(value);
		localStorage.setItem('siderCollapsed', value);
	};

	return (
		<Layout>
			<Header>
				<div className="logo">
					<img src={Logo} alt="company-logo" />
					{/* <h1>Админ раздел</h1> */}
				</div>
				<div className="d-flex">
					<UserBlock />
					<LogoutButton onLogout={onSuccessLogout} />
				</div>
			</Header>
			<Layout>
				<Sider
					width={210}
					collapsible
					collapsed={collapsed}
					onCollapse={handleChangeCollapse}>
					<Menu
						selectedKeys={[location.pathname]}
						mode="inline"
						className="menu"
						items={menuItems}
						onSelect={handleMenuSelect}
					/>
				</Sider>
				<Layout>
					<Content>
						<Routes>
							<Route path="/" element={<Main />} />
							{
								//Админ
								isAdmin && (
									<>
										<Route path="/projects" element={<Project />} />
										<Route
											path="/projects/:id/edit"
											element={<EditProject />}
										/>
										<Route
											path="/projects/create"
											element={<CreateProject />}
										/>
										<Route path="/users" element={<User />} />
										<Route path="/users/:id/edit" element={<EditUser />} />
										<Route path="/users/create" element={<CreateUser />} />
										<Route path="*" element={<Main />} />
									</>
								)
							}
						</Routes>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default Home;
