import React from 'react';
import { useSelector } from 'react-redux';
import ExportButton from './ExportButton';
import ReloadButton from './ReloadButton';

const TableControls = () => {
	const { activeProject, tablePaginationConfig, searchParams } = useSelector(
		({ projects }) => projects,
	);

	return (
		<div className="project-actions">
			<div>
				<span>Всего записей:</span> {tablePaginationConfig.total}
			</div>
			<div>
				<ReloadButton activeProject={activeProject} />
				<ExportButton activeProject={activeProject} searchParams={searchParams} />
			</div>
		</div>
	);
};

export default TableControls;
