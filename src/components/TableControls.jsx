import React from 'react';
import { useSelector } from 'react-redux';
import ExportButton from './ExportButton';

const TableControls = () => {
	const { activeProject, tablePaginationConfig, searchParams } = useSelector(
		({ projects }) => projects,
	);

	return (
		<div className="project-actions">
			<div>Всего записей: {tablePaginationConfig.total}</div>
			<ExportButton activeProject={activeProject.value} searchParams={searchParams} />
		</div>
	);
};

export default TableControls;
