import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ExportButton = ({ activeProject, searchParams }) => {
	const [isLoading, setIsLoading] = React.useState(false);

	const fileExtension = '.xlsx';

	const newExport = (csvData) => {
		const headerArr = activeProject.base_header.split(',');

		const wb = XLSX.utils.book_new();
		const ws = XLSX.utils.json_to_sheet([]);
		XLSX.utils.sheet_add_aoa(ws, [headerArr]);
		XLSX.utils.sheet_add_json(ws, csvData, { origin: 'A2', skipHeader: true });
		XLSX.utils.book_append_sheet(wb, ws, activeProject.label);
		XLSX.writeFile(wb, activeProject.label + `_${Date.now()}` + fileExtension);
	};

	const fetchData = () => {
		setIsLoading(true);
		const params = {
			...searchParams,
			project: activeProject.value,
			fields: activeProject.base_row.split(','),
		};
		axios
			.post('/project/export', params)
			.then(({ data }) => newExport(data))
			.finally(() => setIsLoading(false));
	};

	return (
		<Button loading={isLoading} onClick={fetchData} icon={<DownloadOutlined />}>
			Экспорт
		</Button>
	);
};

export default ExportButton;
