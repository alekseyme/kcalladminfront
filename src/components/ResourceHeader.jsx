import React from 'react';

import { Link } from 'react-router-dom';
import { Button } from 'antd';

const ResourceHeader = ({ title, path, lintText }) => {
	return (
		<div className="controls box" style={{ padding: '18px 24px' }}>
			<b
				style={{
					fontSize: 16,
					fontWeight: 600,
				}}>
				{title}
			</b>
			<Button type="primary" style={{ marginLeft: 'auto' }}>
				<Link to={path}>{lintText}</Link>
			</Button>
		</div>
	);
};

export default ResourceHeader;
