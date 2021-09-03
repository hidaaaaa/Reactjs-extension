import React from "react";
import { Tag } from "antd";
import { useState } from "react";

const { CheckableTag } = Tag;

function ChooseExpect({ listExpect }) {
	const [selectedExpect, setSelectedExpect] = useState(
		JSON.parse(localStorage.getItem("selectedExpect")) || listExpect
	);

	const handleChange = (tag, checked) => {
		const nextSelectedTags = checked
			? [...selectedExpect, tag]
			: selectedExpect.filter((t) => t !== tag);
		setSelectedExpect(nextSelectedTags);
		localStorage.setItem("selectedExpect", JSON.stringify(nextSelectedTags));
	};

	return (
		<>
			<span style={{ marginRight: 8 }}>Danh sách chuyên gia:</span>
			{listExpect.map((tag) => (
				<CheckableTag
					key={tag}
					checked={selectedExpect.indexOf(tag) > -1}
					onChange={(checked) => handleChange(tag, checked)}
				>
					{tag}
				</CheckableTag>
			))}
		</>
	);
}

export default ChooseExpect;
