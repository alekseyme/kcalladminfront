import React from 'react';
import { Table, Typography, Divider, Popover, Space, message } from 'antd';
import {
	EditTwoTone,
	DownloadOutlined,
	LoadingOutlined,
	PlayCircleTwoTone,
} from '@ant-design/icons';
import { AudioApi, TableApi } from 'api';
import fileDownload from 'js-file-download';

import { fetchActiveProject } from 'store/projects/slice';
import { setTableLoading, setTableData } from 'store/table/slice';
import { useSelector, useDispatch } from 'react-redux';

import { EditingModalForm, AudioPlayere } from 'components';

const ProjectTable = () => {
	const dispatch = useDispatch();

	const [editingRow, setEditingRow] = React.useState(null);
	const [audioSavingId, setAudioSavingId] = React.useState(null);
	const [confirmLoading, setConfirmLoading] = React.useState(false);
	const [audioSource, setAudioSource] = React.useState(null);
	const [rowAudio, setRowAudio] = React.useState({});

	const { activeProject, searchParams } = useSelector(({ projects }) => projects);
	const { userInfo } = useSelector(({ user }) => user);
	const role = userInfo.role;
	const { tableLoading, tableColumns, tablePaginationConfig, tableData } = useSelector(
		({ table }) => table,
	);

	const handleUpdateRow = async (record) => {
		setConfirmLoading(true);
		try {
			const editRow = {
				project: activeProject.value,
				...record,
			};
			const data = await TableApi.updateRow(editRow);
			message.success(data.message);
			const newTableData = tableData.map((item) => {
				if (item.id === record.id) {
					return { ...data.row };
				}
				return item;
			});
			dispatch(setTableData(newTableData));
		} catch (error) {
			message.error('Произошла ошибка');
		} finally {
			setConfirmLoading(false);
			setEditingRow(null);
		}
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

	const downloadAudio = async (record) => {
		try {
			setAudioSavingId(record.id);
			const correctTime = record.time.replace(/[^\d]/g, '_');
			const data = await AudioApi.getOne(record.request_id);
			fileDownload(data, correctTime + '_' + record.number + '.mp3');
		} catch (error) {
			message.error('Произошла ошибка');
		} finally {
			setAudioSavingId(null);
		}
	};

	const playAudio = async (record) => {
		if (rowAudio[record.id]) {
			if (rowAudio[record.id] === audioSource.url) {
				return;
			}
			setAudioSource({
				id: record.id,
				url: rowAudio[record.id],
			});
			return;
		}

		try {
			setAudioSource(null);
			const data = await AudioApi.getOne(record.request_id);
			const url = URL.createObjectURL(data);
			setAudioSource({
				id: record.id,
				url: url,
			});

			const newArr = {
				...rowAudio,
				[record.id]: url,
			};
			setRowAudio(newArr);
		} catch (error) {
			message.error('Произошла ошибка');
		}
	};

	const columns =
		role === 0 || role === 1 || role === 2
			? [
					...tableColumns,
					{
						title: '#',
						dataIndex: 'actions',
						width: 35, //def 122, mid 35

						render: (_, record) => (
							<Space split={<Divider type="vertical" />} size={1}>
								{role !== 2 && (
									<Typography.Link onClick={() => setEditingRow(record)}>
										<EditTwoTone style={{ fontSize: 18 }} />
									</Typography.Link>
								)}

								{record.request_id ? (
									<>
										<Popover
											content={
												audioSource &&
												audioSource.url === rowAudio[audioSource.id] ? (
													<AudioPlayere src={audioSource} />
												) : (
													'загрузка'
												)
											}
											trigger="click">
											<Typography.Link onClick={() => playAudio(record)}>
												<PlayCircleTwoTone
													style={{ fontSize: 18 }}
													twoToneColor={
														record.id === audioSource?.id
															? '#52c41a'
															: false
													}
												/>
											</Typography.Link>
										</Popover>
										<Typography.Link onClick={() => downloadAudio(record)}>
											{record.id === audioSavingId ? (
												<LoadingOutlined style={{ fontSize: 18 }} />
											) : (
												<DownloadOutlined style={{ fontSize: 18 }} />
											)}
										</Typography.Link>
									</>
								) : null}
							</Space>
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
					onCreate={handleUpdateRow}
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
