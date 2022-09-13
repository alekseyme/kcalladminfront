import React from 'react';
import { Button } from 'antd';

import { fetchActiveProject } from 'store/projects/slice';
import { setTableLoading } from 'store/table/slice';
import { useDispatch } from 'react-redux';

const ReloadButton = ({ activeProject }) => {
	const dispatch = useDispatch();

	const reloadActiveProject = () => {
		dispatch(setTableLoading(true));
		dispatch(fetchActiveProject({ project: activeProject.value }));
	};

	return (
		<Button style={{ marginRight: 8 }} onClick={reloadActiveProject}>
			Обновить
		</Button>
	);
};

export default ReloadButton;
