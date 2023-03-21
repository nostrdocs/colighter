import React, { useState, useEffect } from "react";
import browser from "webextension-polyfill";
import { MessageAction, MessageData } from "../../../Nostr";
import { sendMessage } from "../../utils";

interface Props {
	text: string;
	color: string;
}

export const HighlightedText: React.FC<Props> = ({ text, color }) => {
	const [highlighted, setHighlighted] = useState(false);

	useEffect(() => {
		const message: MessageData = {
			action: MessageAction.TOGGLE_HIGHLIGHT,
			data: {
				text: text,
				color: color,
			},
		};

		const toggleHighlight = () => {
			setHighlighted(!highlighted);
			sendMessage(message);
		};

		browser.runtime.onMessage.addListener((request) => {
			if (request.action === MessageAction.TOGGLE_HIGHLIGHT) {
				toggleHighlight();
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
