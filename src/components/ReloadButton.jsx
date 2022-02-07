import React from 'react';
import { Button } from 'antd';

import { fetchActiveProject, setTableLoading } from '../redux/actions/projects';
import { useDispatch } from 'react-redux';

const ReloadButton = ({ activeProject }) => {
	const dispatch = useDispatch();

	const reloadActiveProject = () => {
		dispatch(setTableLoading(true));
		dispatch(fetchActiveProject(null, activeProject.value));
	};

	return (
		<Button style={{ marginRight: 8 }} onClick={reloadActiveProject}>
			Обновить
		</Button>
	);
};

export default ReloadButton;
