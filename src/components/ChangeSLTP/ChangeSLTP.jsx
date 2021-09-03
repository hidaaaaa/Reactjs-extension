import { Form, InputNumber } from "antd";
import React, { useState } from "react";

function ChangeSLTP({ stopLose, takeProfit, handleChangeSLTP }) {
	const [isDisableForm, setIsDisableForm] = useState(true);
	const [form] = Form.useForm();

	const handleChangeForm = () => {
		setIsDisableForm(false);
	};

	const onFinish = (values) => {
		console.log(values);
		if (handleChangeSLTP) {
			handleChangeSLTP(values);
		}
		setIsDisableForm(true);
		form.resetFields();
	};

	return (
		<div className="form">
			<div>Cài giá trị stop lose và take profit:</div>
			<Form form={form} className="form__content" onFinish={onFinish}>
				<p className="form__label">$</p>
				<Form.Item
					name="stopLose"
					rules={[{ required: true }]}
					className="form__item"
					initialValue={stopLose}
					label="Stop lose "
				>
					{/* <div className="form__info">Stop lose</div> */}
					<InputNumber
						className="form__input"
						disabled={isDisableForm}
						bordered={false}
						formatter={(value) => {
							if (value > 0) {
								return -value;
							} else {
								return value;
							}
						}}
					/>
				</Form.Item>

				<Form.Item
					name="takeProfit"
					rules={[{ required: true }]}
					className="form__item"
					initialValue={takeProfit}
					label="Take profit "
				>
					{/* <div className="form__info">Take profit</div> */}
					<InputNumber
						className="form__input"
						disabled={isDisableForm}
						bordered={false}
						formatter={(value) => {
							if (value > 0) {
								return value;
							} else {
								return -value;
							}
						}}
					/>
				</Form.Item>

				{isDisableForm ? (
					<button
						type="primary"
						onClick={handleChangeForm}
						className="form__button danger"
					>
						Thay đổi
					</button>
				) : (
					<Form.Item className="form__item">
						<button
							type="primary"
							htmlType="submit"
							className="form__button primary"
						>
							Xác nhận
						</button>
					</Form.Item>
				)}
			</Form>
		</div>
	);
}

export default ChangeSLTP;
