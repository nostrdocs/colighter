import React, { useState, useEffect } from "react";
import browser from "webextension-polyfill";
import { MessageAction } from "../../types";
import { sendMessage } from "../../utils";

interface Props {
	text: string;
	color: string;
}

export const HighlightedText: React.FC<Props> = ({ text, color }) => {
	const [highlighted] = useState(false);

	useEffect(() => {
		browser.runtime.onMessage.addListener((request) => {
			if (request.action === MessageAction.TOGGLE_HIGHLIGHTS) {
				console.log("toggleHighlight: ", request.data);
			}
		});

		return () => {
			sendMessage({
				action: MessageAction.REMOVE_HIGHLIGHTS,
				data: "",
			});
		};
	}, [text, color, highlighted]);

	return <span className={`highlighted-text ${highlighted ? "highlighted" : ""}`}>{text}</span>;
};
