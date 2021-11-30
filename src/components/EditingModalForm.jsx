import React from 'react';
import { Input, Form, Modal, message } from 'antd';

const { TextArea } = Input;

const EditingModalForm = ({ onCreate, onCancel, formRows, editingRow, confirmLoading }) => {
	const [form] = Form.useForm();

	React.useEffect(() => {
		const obj = {};

		for (let prop in editingRow) {
			if (editingRow[prop] === '') {
				obj[prop] = '-';
			} else {
				obj[prop] = editingRow[prop];
			}
		}

		form.setFieldsValue({
			id: '',
			title: '',
			...obj,
		}); // eslint-disable-next-line
	}, []);

	const onOk = () => {
		form.validateFields()
			.then((record) => {
				const recordWithId = {
					id: editingRow.id,
					...record,
				};
				onCreate(recordWithId);
			})
			.catch(() => message.warning('Проверьте правильность заполненных полей'));
	};

	return (
		<Modal
			visible={true}
			width="600px"
			mask={false}
			closable={false}
			title="Редактировать запись"
			okText="Обновить"
			cancelText="Отмена"
			onCancel={onCancel}
			confirmLoading={confirmLoading}
			onOk={onOk}>
			<Form form={form} name="form_in_modal" labelCol={{ span: 6 }}>
				{formRows.map((row) => {
					const inputNode =
						row.dataIndex === 'content' ? (
							<TextArea rows={3} className="form-modal-textarea" />
						) : row.editable === false ? (
							<Input disabled={true} />
						) : (
							<Input />
						);

					if (row.editable === true) {
						return (
							<Form.Item
								key={row.dataIndex}
								name={row.dataIndex}
								label={row.title}
								rules={[
									{
										required: true,
										message: `Введите ${row.title}`,
									},
								]}>
								{inputNode}
							</Form.Item>
						);
					}
					return null;
				})}
			</Form>
		</Modal>
	);
};

export default EditingModalForm;
