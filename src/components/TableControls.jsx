import React from 'react';
import { useSelector } from 'react-redux';
import { ExportButton, ReloadButton } from 'components';

const TableControls = () => {
	const { activeProject, searchParams } = useSelector(({ projects }) => projects);
	const { tablePaginationConfig } = useSelector(({ table }) => table);

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
