import React from 'react';
import { Spin } from 'antd';

const Loader = () => {
	return (
		<div style={{ textAlign: 'center', marginTop: '20px' }}>
			<Spin />
		</div>
	);
};

export default Loader;
