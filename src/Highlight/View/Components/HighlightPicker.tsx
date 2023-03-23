import React, { useEffect, useRef, useState } from "react";
import { NostrUser } from "../../../Nostr";
import { ColorDescription, StorageKey } from "../../types";
import {
	useCollabHighlighter,
	useColorSelectedColor,
	useShowHighlights,
	writeLocalStorage,
} from "../../utils";
import { renderHighlightCollection } from "../../view";
import { HighlightedText } from "./Highlight";

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

export function HighlightPicker() {
	const [user] = useState<NostrUser>(mockNostrUser);
	const [showHighlights, toggleShowHighlights] = useShowHighlights();
	const [selectedColor, updateSelectedColor] = useColorSelectedColor(colorOptions);

	const [collab] = useCollabHighlighter(user);
	const collabViewRef = useRef<HTMLDivElement>(null);
	const [rendered, setRendered] = React.useState(false);

	useEffect(() => {
		if (collabViewRef.current && collab && !rendered) {
			renderHighlightCollection(collab, collabViewRef.current, user.pubkey);
			setRendered(true);
		}
	}, [collab, user]);

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
			<HighlightedText text="" color="" />
			<div ref={collabViewRef}></div>
		</div>
	);
}
