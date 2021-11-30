import React from 'react';
import { Table, Typography, message } from 'antd';
import { EditTwoTone } from '@ant-design/icons';
import axios from 'axios';

import { fetchActiveProject, setTableLoading, setTableData } from '../redux/actions/projects';
import { useSelector, useDispatch } from 'react-redux';

import EditingModalForm from './EditingModalForm';

const ProjectTable = () => {
	const dispatch = useDispatch();

	const [editingRow, setEditingRow] = React.useState(null);
	const [confirmLoading, setConfirmLoading] = React.useState(false);

	const {
		activeProject,
		tableLoading,
		tableColumns,
		tablePaginationConfig,
		tableData,
		searchParams,
		userInfo,
	} = useSelector(({ projects }) => projects);

	const onCreate = (record) => {
		setConfirmLoading(true);
		const editRow = {
			project: activeProject.value,
			...record,
		};

		axios
			.patch(`/project/editrow/${record.id}`, editRow)
			.then(({ data }) => {
				message.success(data.message);
				const newTableData = tableData.map((item) => {
					if (item.id === record.id) {
						return { ...data.row };
					}
					return item;
				});
				dispatch(setTableData(newTableData));
			})
			.catch(() => {
				message.error('Произошла ошибка');
			})
			.finally(() => {
				setConfirmLoading(false);
				setEditingRow(null);
			});
	};

	const onChangeTablePage = async (page, pageSize) => {
		dispatch(setTableLoading(true));
		if (pageSize > 15) {
			window.scrollTo({
				top: 172,
				behavior: 'smooth',
			});
		}
		const parameters = {
			project: activeProject.value,
			page: page,
			per_page: pageSize,
			from: searchParams ? searchParams.from : null,
			to: searchParams ? searchParams.to : null,
			phone: searchParams ? searchParams.phone : null,
			status: searchParams ? searchParams.status : null,
		};
		dispatch(fetchActiveProject(parameters));
	};

	const columns =
		userInfo.isadmin === 1 || userInfo.username === 'supervisor'
			? [
					...tableColumns,
					{
						title: '#',
						dataIndex: 'actions',
						width: 35, //def 122, mid 35
						render: (_, record) => (
							<Typography.Link onClick={() => setEditingRow(record)}>
								<EditTwoTone style={{ fontSize: 18 }} />
							</Typography.Link>
						),
					},
			  ]
			: tableColumns;

	return (
		<>
			<Table
				size="middle"
				className="project-table"
				rowKey={(record) => record.id}
				columns={columns}
				// scroll={{ x: columns.length > 14 ? 1900 : false }}
				dataSource={tableData}
				loading={tableLoading}
				pagination={{
					position: ['bottomCenter'],
					current: tablePaginationConfig.current_page,
					total: tablePaginationConfig.total,
					pageSize: tablePaginationConfig.per_page,
					onChange: onChangeTablePage,
					hideOnSinglePage: true,
				}}
				bordered
			/>
			{editingRow && (
				<EditingModalForm
					onCreate={onCreate}
					onCancel={() => {
						setEditingRow(null);
					}}
					formRows={tableColumns}
					editingRow={editingRow}
					confirmLoading={confirmLoading}
				/>
			)}
		</>
	);
};

export default ProjectTable;
