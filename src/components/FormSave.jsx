import React from 'react';
import { Form, Button } from 'antd';

const FormSave = ({ loading }) => {
	return (
		<Form.Item
			className={`fixed-resource-submit ${
				localStorage.getItem('siderCollapsed') === 'true' ? 'long' : ''
			}`}>
			<Button type="primary" htmlType="submit" loading={loading}>
				Сохранить
			</Button>
		</Form.Item>
	);
};

export default FormSave;
