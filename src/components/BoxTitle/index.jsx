import React from 'react';
import { Space, Button, Input } from 'antd';
import { Link } from 'react-router-dom';
import { SyncOutlined } from '@ant-design/icons';
import styles from './BoxTitle.module.css';

const { Search } = Input;

const BoxTitle = ({
	text,
	linkText,
	reloadable,
	onReload,
	spin,
	path,
	resourceCount,
	searchable,
	onSearch,
}) => {
	return (
		<div className={styles.title}>
			<h3>
				{text} <span>{resourceCount}</span>
			</h3>
			{searchable && (
				<Search
					placeholder="Поиск"
					onSearch={onSearch}
					className={styles.search}
					allowClear
				/>
			)}
			<Space size="middle">
				<Button type="primary">
					<Link to={path}>{linkText}</Link>
				</Button>
				{reloadable && <SyncOutlined spin={spin} onClick={onReload} />}
			</Space>
		</div>
	);
};

export default BoxTitle;
