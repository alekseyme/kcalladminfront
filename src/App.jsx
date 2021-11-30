import React from 'react';
import { Login, Home } from './pages';
import axios from 'axios';
//Redux
import { useDispatch } from 'react-redux';
import { setUserInfo } from './redux/actions/projects';

import AuthLoader from './components/AuthLoader';

import './App.css';

const App = () => {
	const dispatch = useDispatch();

	const [isLoggedin, setIsLoggedin] = React.useState(false);
	const [checkAuth, setCheckAuth] = React.useState(false);

	const onSuccessLogin = () => {
		setIsLoggedin(true);
	};

	const onSuccessLogout = () => {
		setIsLoggedin(false);
	};

	React.useEffect(() => {
		axios
			.post('me')
			.then(({ data }) => {
				dispatch(setUserInfo(data));
				setCheckAuth(true);
				setIsLoggedin(true);
			})
			.catch(() => {
				setCheckAuth(true);
				setIsLoggedin(false);
			}); // eslint-disable-next-line
	}, []);

	if (!isLoggedin) {
		if (checkAuth) {
			return <Login onLogin={onSuccessLogin} />;
		}
		return <AuthLoader />;
	}

	return <Home onSuccessLogout={onSuccessLogout} />;
};

export default App;
