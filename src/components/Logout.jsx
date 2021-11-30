import React from 'react';
import { Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
//Redux
import { useDispatch } from 'react-redux';
import { resetStorage } from '../redux/actions/projects';

const Logout = ({ onLogout }) => {
	const dispatch = useDispatch();
	let history = useHistory();

	const [isLoading, setIsLoading] = React.useState(false);

	const handleLogout = () => {
		setIsLoading(true);
		axios
			.post('/logout')
			.then(() => {
				localStorage.clear();
				onLogout();
				dispatch(resetStorage());
				history.push('/');
			})
			.catch(() => console.log('logout catch error'))
			.finally(() => setIsLoading(false));
	};

	return (
		<Button
			type="text"
			onClick={handleLogout}
			className="btn-logout"
			icon={<ExportOutlined />}
			loading={isLoading}>
			Выйти
		</Button>
	);
};

export default Logout;
