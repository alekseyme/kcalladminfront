import React from 'react';
import { Skeleton } from 'antd';

const ResourceLoader = () => {
	return (
		<>
			<div
				className="d-flex"
				style={{ justifyContent: 'space-between', marginBottom: '1.5em' }}>
				<Skeleton.Button style={{ width: '150px' }} />
				<Skeleton.Button style={{ width: '200px' }} />
			</div>
			<Skeleton paragraph />
		</>
	);
};

export default ResourceLoader;
