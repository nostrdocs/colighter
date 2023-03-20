import React, { useEffect, useState } from "react";
import { setupHighlighting } from "../Services/Setup/highlightServiceSetup";
import { setupColorUsage } from "../Services/Setup/colorServiceSetup";
import { ColorDescription } from "../Common/Types";
import HighlightedText from "./Highlight"

function App() {
	const [selectedColor, setSelectedColor] = useState("");
	const colorOptions: ColorDescription[] = [
		{ name: "red", val: "FAA99D" },
		{ name: "yellow", val: "FDDF7E" },
		{ name: "green", val: "CCE29C" },
		{ name: "blue", val: "67EBFA" },
		{ name: "purple", val: "CE97FB" },
	];

	useEffect(() => {
		setupHighlighting();
		setupColorUsage(colorOptions);
	}, []);

	const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedColor(event.target.value);
	};

	const handleToggleHighlight = () => {
		const toggleHighlightBtn = document.getElementById("toggle-highlight") as HTMLInputElement;
		toggleHighlightBtn.checked = !toggleHighlightBtn.checked;
	};

	return (
		<>
			<h2>Colighter</h2>
			<p>Select Highlighter Color</p>
			<div id="color-row">
				{colorOptions.map((color) => (
					<label className="color-label" key={color.val}>
						<input
							type="radio"
							name="color"
							value={color.val}
							checked={selectedColor === color.val}
							onChange={handleColorChange}
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
					<input id="toggle-highlight" type="checkbox" onChange={handleToggleHighlight} />
					<span className="slider round"></span>
				</label>
			</div>
      <HighlightedText text={""} color={""} />
		</>
	);
}

export default App;
