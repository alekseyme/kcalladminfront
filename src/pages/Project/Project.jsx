import React from 'react';
import { ProjectApi } from 'api';
import { Table, Space, Button, Popconfirm, Divider, PageHeader, message } from 'antd';
import { Link } from 'react-router-dom';
import {
	CheckCircleTwoTone,
	CloseCircleTwoTone,
	EditTwoTone,
	DeleteTwoTone,
} from '@ant-design/icons';
import { Box, BoxTitle, ResourceLoader } from 'components';
//Redux
import { setProjectList } from 'store/projects/slice';
import { useSelector, useDispatch } from 'react-redux';

const Project = () => {
	//Redux
	const dispatch = useDispatch();
	const { projectList } = useSelector(({ projects }) => projects);
	const [isLoading, setIsLoading] = React.useState(false);
	const [isProjectReload, setIsProjectReload] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState('');

	React.useEffect(() => {
		if (!projectList) {
			setIsLoading(true);
			getProjects();
		} // eslint-disable-next-line
	}, []);

	const getProjects = async () => {
		try {
			const data = await ProjectApi.getAll();
			dispatch(setProjectList(data));
			setIsLoading(false);
			setIsProjectReload(false);
		} catch (error) {
			message.error('Ошибка при загрузке списка проектов');
		}
	};

	const onProjectListReload = () => {
		setIsProjectReload(true);
		getProjects();
	};

	const onDeleteProject = async (_, projectId) => {
		try {
			const data = await ProjectApi.delete(projectId);
			const newProjectList = projectList.filter((project) => project.id !== projectId);
			dispatch(setProjectList(newProjectList));
			message.success(data.message);
		} catch (error) {
			message.error('Ошибка при удалении проекта');
		}
	};

	const columns = [
		{
			title: 'Проект',
			dataIndex: 'name',
			key: 'name',
			ellipsis: true,
		},
		{
			title: 'Таблица',
			dataIndex: 'tablename',
			key: 'tablename',
			ellipsis: true,
		},
		{
			title: 'Заголовок таблицы',
			dataIndex: 'table_header',
			key: 'table_header',
			ellipsis: true,
		},
		{
			title: 'Строка таблицы',
			dataIndex: 'table_row',
			key: 'table_row',
			ellipsis: true,
		},
		{
			title: 'Изменения',
			dataIndex: 'changes',
			width: 120,
			key: 'changes',
			align: 'center',
			render: (changes) => {
				return (
					<>
						{changes ? (
							<CheckCircleTwoTone
								twoToneColor="#52c41a"
								style={{ fontSize: '16px' }}
							/>
						) : (
							<CloseCircleTwoTone
								twoToneColor="#f5222d"
								style={{ fontSize: '16px' }}
							/>
						)}
					</>
				);
			},
		},
		{
			title: 'ЛК клиента',
			dataIndex: 'client_available',
			width: 120,
			key: 'client_available',
			align: 'center',
			render: (client_available) => {
				return (
					<>
						{client_available ? (
							<CheckCircleTwoTone
								twoToneColor="#52c41a"
								style={{ fontSize: '16px' }}
							/>
						) : (
							<CloseCircleTwoTone
								twoToneColor="#f5222d"
								style={{ fontSize: '16px' }}
							/>
						)}
					</>
				);
			},
		},
		{
			title: 'ЛК оператора',
			dataIndex: 'oper_available',
			width: 120,
			key: 'oper_available',
			align: 'center',
			render: (oper_available) => {
				return (
					<>
						{oper_available ? (
							<CheckCircleTwoTone
								twoToneColor="#52c41a"
								style={{ fontSize: '16px' }}
							/>
						) : (
							<CloseCircleTwoTone
								twoToneColor="#f5222d"
								style={{ fontSize: '16px' }}
							/>
						)}
					</>
				);
			},
		},
		{
			title: '#',
			key: 'action',
			width: 103,
			align: 'center',
			render: (_, record) => (
				<Space size="small" split={<Divider type="vertical" />}>
					<Link to={`/projects/${record.id}/edit`}>
						<EditTwoTone style={{ fontSize: '20px' }} />
					</Link>
					<Popconfirm
						title="Вы уверены, что хотите удалить проект?"
						onConfirm={(e) => onDeleteProject(e, record.id)}
						placement="topRight"
						okText="Да"
						cancelText="Отмена">
						<Button type="link" className="btn-link">
							<DeleteTwoTone twoToneColor="#f5222d" style={{ fontSize: '20px' }} />
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<PageHeader className="page-header" title="Управление проектами" />
			<Box>
				{isLoading ? (
					<ResourceLoader />
				) : (
					<>
						<BoxTitle
							text="Проекты"
							linkText="Создать проект"
							path="/projects/create"
							onReload={onProjectListReload}
							spin={isProjectReload}
							resourceCount={projectList?.length}
							onSearch={(value) => setSearchValue(value)}
							reloadable
							searchable
						/>
						<Table
							style={{ width: '100%' }}
							rowKey={(record) => record.id}
							columns={columns}
							loading={isProjectReload}
							dataSource={projectList?.filter((project) =>
								project.name.toLowerCase().includes(searchValue.toLowerCase()),
							)}
							pagination={{
								hideOnSinglePage: true,
							}}
						/>
					</>
				)}
			</Box>
		</>
	);
};

export default Project;
