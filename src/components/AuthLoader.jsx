import React from 'react';
import { Spin } from 'antd';

const AuthLoader = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
			}}>
			<Spin size="large" />
		</div>
	);
};

export default AuthLoader;
