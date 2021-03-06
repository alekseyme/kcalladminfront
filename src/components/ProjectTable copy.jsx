import React from 'react';
import { Table, Input, InputNumber, Form, Typography, message } from 'antd';
import axios from 'axios';

import { fetchActiveProject, setTableLoading, setTableData } from '../redux/actions/projects';
import { useSelector, useDispatch } from 'react-redux';

const EditableCell = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	...restProps
}) => {
	const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{
						margin: 0,
					}}
					rules={[
						{
							required: true,
							message: `Введите ${title}!`,
						},
					]}>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};

const ProjectTable = () => {
	const dispatch = useDispatch();
	const {
		activeProject,
		tableLoading,
		tableColumns,
		tablePaginationConfig,
		tableData,
		searchParams,
		userInfo,
	} = useSelector(({ projects }) => projects);

	const [form] = Form.useForm();
	const [editingKey, setEditingKey] = React.useState('');

	const isEditing = (row) => row.id === editingKey;

	const edit = (row) => {
		const obj = {};

		for (let prop in row) {
			if (row[prop] === '') {
				obj[prop] = '-';
			} else {
				obj[prop] = row[prop];
			}
		}

		form.setFieldsValue({
			id: '',
			title: '',
			...obj,
		});
		setEditingKey(row.id);
	};

	const save = async (record) => {
		try {
			const row = await form.validateFields();

			const editRow = {
				project: activeProject.value,
				...row,
			};

			axios
				.put(`/project/editrow/${record.id}`, editRow)
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
					setEditingKey('');
				});
		} catch (errInfo) {
			message.warning('Проверьте правильность заполненных полей');
		}
	};

	const cancel = () => {
		setEditingKey('');
	};

	const onChangeTablePage = async (page, pageSize) => {
		cancel();
		dispatch(setTableLoading(true));
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
						title: 'Действия',
						dataIndex: 'actions',
						width: 102, //def 122, mid 102
						render: (_, record) => {
							const editable = isEditing(record);
							return editable ? (
								<span>
									<Typography.Link
										onClick={() => save(record)}
										style={{
											marginRight: 8,
										}}>
										Сохр
									</Typography.Link>
									<Typography.Link onClick={cancel}>Отмена</Typography.Link>
								</span>
							) : (
								<Typography.Link
									disabled={editingKey !== ''}
									onClick={() => edit(record)}>
									Ред
								</Typography.Link>
							);
						},
					},
			  ]
			: tableColumns;

	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col;
		}

		return {
			...col,
			onCell: (record) => ({
				record,
				inputType: col.dataIndex === 'age' ? 'number' : 'text',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});

	return (
		<Form form={form} component={false}>
			<Table
				components={{
					body: {
						cell: EditableCell,
					},
				}}
				size="middle"
				rowKey={(record) => record.id}
				columns={mergedColumns}
				dataSource={tableData}
				loading={tableLoading}
				pagination={{
					current: tablePaginationConfig.current_page,
					total: tablePaginationConfig.total,
					pageSize: tablePaginationConfig.per_page,
					onChange: onChangeTablePage,
					hideOnSinglePage: true,
				}}
				bordered
			/>
		</Form>
	);
};

export default ProjectTable;
