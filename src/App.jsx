import React from 'react';
import { Layout, Menu } from 'antd';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import {
	Main,
	Project,
	EditProject,
	CreateProject,
	EditUser,
	CreateUser,
	User,
	Login,
	Test,
} from './pages';
import UserBlock from './components/UserBlock';

//Redux
import { resetStorage } from './redux/actions/projects';
import { useDispatch } from 'react-redux';

import './App.css';

const { Header, Content } = Layout;

const App = () => {
	const dispatch = useDispatch();

	const [isLoggedin, setIsLoggedin] = React.useState(
		localStorage.getItem('auth_token') &&
			localStorage.getItem('auth_name') &&
			localStorage.getItem('auth_username')
			? true
			: false,
	);

	const onSuccessLogin = () => {
		setIsLoggedin(true);
	};

	const onSuccessLogout = () => {
		dispatch(resetStorage());
		setIsLoggedin(false);
	};

	if (!isLoggedin) {
		return <Login onLogin={onSuccessLogin} />;
	}

	return (
		<Layout>
			<Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
				<Menu mode="horizontal" defaultSelectedKeys={['1']}>
					<Menu.Item key="1">
						<Link to="/">Главная</Link>
					</Menu.Item>
					{
						//Админ
						localStorage.getItem('auth_isadmin') && (
							<>
								<Menu.Item key="projects">
									<Link to="/projects">Проекты</Link>
								</Menu.Item>
								<Menu.Item key="users">
									<Link to="/users">Пользователи</Link>
								</Menu.Item>
								{/* <Menu.Item key="test">
									<Link to="/test">Тест</Link>
								</Menu.Item> */}
							</>
						)
					}
				</Menu>
				<UserBlock onLogout={onSuccessLogout} />
			</Header>
			<Content
				className="site-layout"
				style={{
					padding: '0 50px',
					margin: '52px auto 0 auto',
					maxWidth: 1740,
					width: '100%',
				}}>
				<Switch>
					<Route exact path="/">
						<Main />
					</Route>

					{
						//Админ
						localStorage.getItem('auth_isadmin') && (
							<>
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
								<Route exact path="/test">
									<Test />
								</Route>
							</>
						)
					}

					<Redirect to="/" />
				</Switch>
			</Content>
		</Layout>
	);
};

export default App;
