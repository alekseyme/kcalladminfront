import React from 'react';
import { Empty } from 'antd';

const EmptyProject = () => {
	return (
		<Empty
			image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
			imageStyle={{
				height: 60,
			}}
			description={<span>Необходимо выбрать проект</span>}></Empty>
	);
};

export default EmptyProject;
