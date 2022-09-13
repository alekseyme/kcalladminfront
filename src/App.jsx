import React from 'react';
import { Login, Home } from 'pages';
//Redux
import { useDispatch } from 'react-redux';
import { setUserInfo } from 'store/user/slice';

import { AuthLoader } from 'components';

import './App.css';
import { AuthApi } from 'api';

const App = () => {
	const dispatch = useDispatch();

	const [isLoggedin, setIsLoggedin] = React.useState(false);
	const [checkAuth, setCheckAuth] = React.useState(false);

	const handleSuccessLogin = () => {
		setIsLoggedin(true);
	};

	const handleSuccessLogout = () => {
		setIsLoggedin(false);
	};

	const getMe = async () => {
		try {
			const data = await AuthApi.getMe();

			dispatch(setUserInfo(data));
			setCheckAuth(true);
			setIsLoggedin(true);
		} catch (error) {
			setCheckAuth(true);
			setIsLoggedin(false);
		}
	};

	React.useEffect(() => {
		getMe(); // eslint-disable-next-line
	}, []);

	if (!isLoggedin) {
		if (checkAuth) {
			return <Login onLogin={handleSuccessLogin} />;
		}
		return <AuthLoader />;
	}

	return <Home onSuccessLogout={handleSuccessLogout} />;
};

export default App;
