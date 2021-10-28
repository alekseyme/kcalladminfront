import React from 'react';
import { Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Logout = ({ onLogout }) => {
	let history = useHistory();
	const [isLoading, setIsLoading] = React.useState(false);

	const handleLogout = () => {
		setIsLoading(true);
		axios
			.post('/api/logout')
			.then(() => {
				localStorage.clear();
				onLogout();
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
