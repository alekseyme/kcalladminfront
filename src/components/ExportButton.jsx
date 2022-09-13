import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { TableApi } from 'api';

const ExportButton = ({ activeProject, searchParams }) => {
	const [isLoading, setIsLoading] = React.useState(false);

	const fileExtension = '.xlsx';

	const newExport = (csvData) => {
		const headerArr = activeProject.table_header.split(',');

		const wb = XLSX.utils.book_new();
		const ws = XLSX.utils.json_to_sheet([]);
		XLSX.utils.sheet_add_aoa(ws, [headerArr]);
		XLSX.utils.sheet_add_json(ws, csvData, { origin: 'A2', skipHeader: true });
		XLSX.utils.book_append_sheet(wb, ws, activeProject.label);
		XLSX.writeFile(wb, activeProject.label + `_${Date.now()}` + fileExtension);
	};

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const params = {
				...searchParams,
				project: activeProject.value,
				fields: activeProject.table_row.split(','),
			};

			const data = await TableApi.exportData(params);
			newExport(data);
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button loading={isLoading} onClick={fetchData} icon={<DownloadOutlined />}>
			Экспорт
		</Button>
	);
};

export default ExportButton;
