import React from 'react';
import axios from 'axios';
import { Table, Space, Button, Tag, message } from 'antd';
import { Link } from 'react-router-dom';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import Loader from '../../components/Loader';
import ResourceHeader from '../../components/ResourceHeader';

const Project = () => {
	const [projectList, setProjectList] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		axios
			.get('/projects')
			.then(({ data }) => {
				setProjectList(data);
			})
			.catch(() => message.error('Ошибка при загрузке списка проектов'))
			.finally(() => setIsLoading(false));
	}, []);

	const onDeleteProject = (e, projectId) => {
		const thisButton = e.currentTarget;
		thisButton.innerText = 'Удаляю';

		axios
			.delete(`/projects/${projectId}`)
			.then(({ data }) => {
				const newProjectList = projectList.filter((project) => project.id !== projectId);
				setProjectList(newProjectList);
				message.success(data.message);
			})
			.catch(() => message.error('Ошибка при удалении проекта'))
			.finally(() => {
				thisButton.innerText = 'Удалить';
			});
	};

	const columns = [
		{
			title: 'Проект',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Таблица',
			dataIndex: 'tablename',
			key: 'tablename',
		},
		{
			title: 'Заголовок таблицы',
			dataIndex: 'base_header',
			width: 700,
			key: 'base_header',
		},
		{
			title: 'Изменения',
			dataIndex: 'changes',
			width: 103,
			key: 'changes',
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
			title: 'Доступен для',
			dataIndex: 'users',
			key: 'users',
			render: (users) => {
				if (users.length) {
					return (
						<>
							{users.map((user) => (
								<Tag color="blue" key={user.id}>
									{user.name}
								</Tag>
							))}
						</>
					);
				}
			},
		},
		{
			title: 'Действия',
			key: 'action',
			render: (_, record) => (
				<Space size="middle">
					<Link to={`/projects/${record.id}/edit`}>Ред</Link>
					<Button
						type="link"
						className="btn-link"
						onClick={(e) => onDeleteProject(e, record.id)}>
						Удалить
					</Button>
				</Space>
			),
		},
	];

	return (
		<>
			<ResourceHeader
				title="Список проектов"
				path="/projects/create"
				lintText="Добавить проект"
			/>
			<div className="box">
				{isLoading ? (
					<Loader />
				) : (
					<Table
						style={{ width: '100%' }}
						rowKey={(record) => record.id}
						columns={columns}
						dataSource={projectList}
						pagination={{ hideOnSinglePage: true }}
					/>
				)}
			</div>
		</>
	);
};

export default Project;
