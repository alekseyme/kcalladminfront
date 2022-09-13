import React from 'react';
import { LogoutOutlined, LoadingOutlined } from '@ant-design/icons';
import { AuthApi } from 'api';
import { useNavigate } from 'react-router-dom';
//Redux
import { useDispatch } from 'react-redux';
import { logOut } from 'store/user/slice';

const LogoutButton = ({ onLogout }) => {
	const dispatch = useDispatch();
	let navigate = useNavigate();

	const [isLoading, setIsLoading] = React.useState(false);

	const handleLogout = async () => {
		setIsLoading(true);
		try {
			await AuthApi.logOut();
			localStorage.clear();
			onLogout();
			dispatch(logOut());
			navigate('/', { replace: true });
		} catch (error) {
			console.log('logout catch error');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<button onClick={handleLogout} className="btn-logout">
			{isLoading ? <LoadingOutlined /> : <LogoutOutlined />}
		</button>
	);
};

export default LogoutButton;
