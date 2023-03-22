import React from "react";
import { ColorDescription, StorageKey } from "../../types";
import { useColorSelectedColor, useShowHighlights, writeLocalStorage } from "../../utils";

const colorOptions: ColorDescription[] = [
	{ name: "red", val: "FAA99D" },
	{ name: "yellow", val: "FDDF7E" },
	{ name: "green", val: "CCE29C" },
	{ name: "blue", val: "67EBFA" },
	{ name: "purple", val: "CE97FB" },
];

export function HighlightPicker() {
	const [showHighlights, toggleShowHighlights] = useShowHighlights();
	const [selectedColor, updateSelectedColor] = useColorSelectedColor(colorOptions);

	const handleToggleHighlight = (event: React.ChangeEvent<HTMLInputElement>) => {
		let showHighlights = event.target.checked;
		toggleShowHighlights(showHighlights);

		writeLocalStorage(StorageKey.SHOW_HIGHLIGHTS, showHighlights);
	};

	return (
		<div>
			<div id="color-row">
				{colorOptions.map((color) => (
					<label className="color-label" key={color.name}>
						<input
							type="radio"
							name="color"
							value={color.val}
							checked={selectedColor.val === color.val}
							onChange={() => {
								updateSelectedColor(color);
							}}
						/>
						<div style={{ background: `#${color.val}` }}></div>
					</label>
				))}
			</div>
			<div className="row">
				<p>
					<strong>Toggle Highlight</strong>
				</p>
				<label className="switch">
					<input
						id="toggle-highlight"
						type="checkbox"
						checked={showHighlights}
						onChange={handleToggleHighlight}
					/>
					<span className="slider round"></span>
				</label>
			</div>
		</div>
	);
}
