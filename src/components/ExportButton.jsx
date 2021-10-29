import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ExportButton = ({ activeProject, searchParams }) => {
	const [isLoading, setIsLoading] = React.useState(false);

	const fileType =
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
	const fileExtension = '.xlsx';

	const exportToExcel = (csvData, fileName) => {
		const ws = XLSX.utils.json_to_sheet(csvData, { skipHeader: 1 });
		const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileName + fileExtension);
	};

	const fetchData = () => {
		setIsLoading(true);
		const params = {
			...searchParams,
			project: activeProject,
		};
		axios
			.post('/project/export', params)
			.then(({ data }) => exportToExcel(data, `export_${Date.now()}`))
			.finally(() => setIsLoading(false));
	};

	return (
		<Button loading={isLoading} onClick={fetchData} icon={<DownloadOutlined />}>
			Экспорт
		</Button>
	);
};

export default ExportButton;
