import { Form, InputNumber } from "antd";
import React, { useState } from "react";
import "./style/InputNumberFieldForm.css";

function InputNumberFieldForm({
	handleChangeCapitalPerTrade = null,
	capitalPerTrade,
}) {
	const [isDisableForm, setIsDisableForm] = useState(true);
	const [form] = Form.useForm();

	const handleChangeForm = () => {
		setIsDisableForm(false);
	};

	const onFinish = (values) => {
		// console.log(values);
		if (handleChangeCapitalPerTrade) {
			handleChangeCapitalPerTrade(values);
		}
		setIsDisableForm(true);
		form.resetFields();
	};

	return (
		<div className="form">
			<div>Cài giá trị cho mỗi lệnh:</div>
			<Form form={form} className="form__content" onFinish={onFinish}>
				<p className="form__label">$</p>
				<Form.Item
					name="capitalPerTrade"
					rules={[{ required: true }]}
					className="form__item"
					initialValue={capitalPerTrade}
				>
					<InputNumber
						className="form__input"
						disabled={isDisableForm}
						bordered={false}
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

export default InputNumberFieldForm;
