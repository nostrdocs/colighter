import React, { useEffect, useRef, useState } from "react";
import { ColorDescription, NostrUser, StorageKey } from "../../Nostr";
import { IHighlightCollection } from "../types";
import {
	loadCollabHighlighter,
	useColorSelectedColor,
	writeLocalStorage,
	useShowHighlights,
} from "../utils";
import { renderHighlightCollection } from "../view";
import { HighlightedText } from "./Components";

const mockNostrUser: NostrUser = {
	pubkey: "0x1234",
	meta: {},
};

const colorOptions: ColorDescription[] = [
	{ name: "red", val: "FAA99D" },
	{ name: "yellow", val: "FDDF7E" },
	{ name: "green", val: "CCE29C" },
	{ name: "blue", val: "67EBFA" },
	{ name: "purple", val: "CE97FB" },
];

function Extension() {
	const [user] = React.useState<NostrUser>(mockNostrUser);
	const [showHighlights, toggleShowHighlights] = useShowHighlights();
	const [selectedColor, updateSelectedColor] = useColorSelectedColor(colorOptions);

	const [collab, setCollab] = useState<IHighlightCollection | undefined>(undefined);
	const collabViewRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		loadCollabHighlighter(user)
			.then((collab) => {
				setCollab(collab);
			})
			.catch((e) => {
				console.log("Failed to load collab", e);
			});
	}, [user]);

	useEffect(() => {
		if (collabViewRef.current && collab) {
			renderHighlightCollection(collab, collabViewRef.current, user.pubkey);
		}
	}, [collabViewRef, collab, user]);

	const handleToggleHighlight = (event: React.ChangeEvent<HTMLInputElement>) => {
		let showHighlights = event.target.checked;
		toggleShowHighlights(showHighlights);

		writeLocalStorage(StorageKey.SHOW_HIGHLIGHTS, showHighlights);
	};

	return (
		<div>
			<h2>Colighter</h2>
			<p>Select Highlighter Color</p>
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
			<HighlightedText text={""} color={""} />
			<div ref={collabViewRef}></div>
		</div>
	);
}

export default Extension;
