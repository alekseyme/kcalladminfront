import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined, ProjectOutlined } from '@ant-design/icons';
import { Switch, Route, Link, Redirect, useLocation } from 'react-router-dom';
import { Main, Project, EditProject, CreateProject, EditUser, CreateUser, User } from './index';
import UserBlock from '../components/UserBlock';
//Redux
import { useSelector } from 'react-redux';

const { Header, Content } = Layout;

const Home = ({ onSuccessLogout }) => {
	let location = useLocation();
	const { userInfo } = useSelector(({ projects }) => projects);

	const isAdmin = userInfo.isadmin === 1;

	return (
		<Layout>
			<Header>
				<div className="container header-container">
					<Menu
						theme="dark"
						mode="horizontal"
						defaultSelectedKeys={[location.pathname]}
						style={{ width: 386 }}>
						<Menu.Item key="/">
							<Link to="/">
								<HomeOutlined style={{ marginRight: 6 }} />
								Главная
							</Link>
						</Menu.Item>
						{
							//Админ
							isAdmin && (
								<>
									<Menu.Item key="/projects">
										<Link to="/projects">
											<ProjectOutlined style={{ marginRight: 6 }} />
											Проекты
										</Link>
									</Menu.Item>
									<Menu.Item key="/users">
										<Link to="/users">
											<UserOutlined style={{ marginRight: 6 }} />
											Пользователи
										</Link>
									</Menu.Item>
								</>
							)
						}
					</Menu>
					<UserBlock onLogout={onSuccessLogout} />
				</div>
			</Header>
			<Content className="container site-layout">
				<Switch>
					<Route exact path="/">
						<Main />
					</Route>
					{
						//Админ
						isAdmin && (
							<Switch>
								<Route exact path="/projects">
									<Project />
								</Route>
								<Route exact path="/projects/:id/edit">
									<EditProject />
								</Route>
								<Route exact path="/projects/create">
									<CreateProject />
								</Route>
								<Route exact path="/users">
									<User />
								</Route>
								<Route exact path="/users/:id/edit">
									<EditUser />
								</Route>
								<Route exact path="/users/create">
									<CreateUser />
								</Route>
								<Redirect to="/" />
							</Switch>
						)
					}
					<Redirect to="/" />
				</Switch>
			</Content>
		</Layout>
	);
};

export default Home;
