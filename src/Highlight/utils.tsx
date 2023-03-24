import browser, { Tabs } from "webextension-polyfill";
import {
	ColorDescription,
	MessageAction,
	MessageData,
	StorageKey,
	IHighlight,
	SerializedRange,
	ActionResponse,
	SucccessAcionResponse,
} from "./types";
import { useCallback, useEffect, useState } from "react";
import { DEFAULT_HIGHLIGHT_COLOR } from "./constants";

export const tryReadLocalStorage = async <T,>(key: string): Promise<T | undefined> => {
	const storage = await browser.storage.local.get();
	return storage[key];
};

export const readLocalStorage = async <T,>(key: StorageKey): Promise<T | undefined> => {
	return tryReadLocalStorage<T>(key);
};

export const tryWriteLocalStorage = async <T,>(key: string, value: T) => {
	await browser.storage.local.set({ [key]: value });
};

export const writeLocalStorage = async <T,>(key: StorageKey, value: T) => {
	return tryWriteLocalStorage<T>(key, value);
};

export const sendMessage = async <T,>(data: MessageData<T>): Promise<ActionResponse> => {
	const queryOptions = { active: true, currentWindow: true };
	const tabs: Tabs.Tab[] = await browser.tabs.query(queryOptions);
	const currentTabId = tabs[0]?.id;

	if (currentTabId !== undefined) {
		return browser.tabs.sendMessage(currentTabId, data);
	}

	return { success: false, error: "Failed to send message. Unknown tab id" } as ActionResponse;
};

export const useShowHighlights = () => {
	const [showHighlights, setShowHighlights] = useState(false);

	const toggleShowHighlights = useCallback((showHighlights: boolean) => {
		// Update state and local storage
		setShowHighlights(showHighlights);
		writeLocalStorage(StorageKey.SHOW_HIGHLIGHTS, showHighlights);

		// Send message for render action by content script
		sendMessage({
			action: MessageAction.TOGGLE_HIGHLIGHTS,
			data: showHighlights,
		}).catch((e) => {
			console.log("Failed to send message", e);
		});
	}, []);

	useEffect(() => {
		readLocalStorage<boolean>(StorageKey.SHOW_HIGHLIGHTS)
			.then((storedShowHighlights) => {
				// Update state
				let updatedShowHighlights = storedShowHighlights ?? showHighlights;
				toggleShowHighlights(updatedShowHighlights);
			})
			.catch((e) => {
				console.log("Failed to read local storage", e);
			});
	}, []);

	return [showHighlights, toggleShowHighlights] as const;
};

export const useColorSelectedColor = () => {
	const [selectedColor, setSelectedColor] = useState<ColorDescription>(DEFAULT_HIGHLIGHT_COLOR);

	const updateSelectedColor = useCallback(async (selectedColor: ColorDescription) => {
		// Send message for render action by content script
		await sendMessage<ColorDescription>({
			action: MessageAction.SELECT_COLOR,
			data: selectedColor,
		}).catch((e) => {
			console.log("Failed to set selected color", e);
		});

		// Update state and local storage
		writeLocalStorage<ColorDescription>(StorageKey.COLOR_SELECTION, selectedColor);

		setSelectedColor(selectedColor);
	}, []);

	useEffect(() => {
		readLocalStorage<ColorDescription>(StorageKey.COLOR_SELECTION)
			.then((storedSelectedColor) => {
				// Update state
				const updatedSelectedColor = storedSelectedColor || selectedColor;
				setSelectedColor(updatedSelectedColor);
			})
			.catch((e) => {
				console.log("Failed to read local storage", e);
			});
	}, []);

	return [selectedColor, updateSelectedColor] as const;
};

export const useCollabHighlights = () => {
	const [highlights, setHighlights] = useState<IHighlight[]>([]);

	useEffect(() => {
		// Request for collab highlights
		sendMessage<null>({ action: MessageAction.GET_COLLAB_HIGHLIGHTS, data: null })
			.then((outcome: ActionResponse) => {
				if (outcome.success) {
					const data = (outcome as SucccessAcionResponse).data;
					setHighlights(data as IHighlight[]);
				}
			})
			.catch((e) => {
				console.error("Failed to get highlights", e);
			});

		const highlightListener = (message, _sender, _sendResponse) => {
			if (message.action !== MessageAction.POST_COLLAB_HIGHLIGHTS || !message.data) {
				return;
			}

			setHighlights(message.data as IHighlight[]);
		};

		chrome.runtime.onMessage.addListener(highlightListener);

		return () => {
			chrome.runtime.onMessage.removeListener(highlightListener);
		};
	}, []);

	return [highlights, setHighlights] as const;
};

export const sha256Hash = async (message: string): Promise<string> => {
	const encoder = new TextEncoder();
	const hashArray = Array.from(
		new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(message))),
	);
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const serializeRange = (range: Range): SerializedRange => {
	const startContainer = range.startContainer;
	const endContainer = range.endContainer;

	const startOffset = range.startOffset;
	const endOffset = range.endOffset;

	const startPath = getNodePath(startContainer);
	const endPath = getNodePath(endContainer);

	return {
		startPath,
		endPath,
		startOffset,
		endOffset,
	};
};

const getNodePath = (node: Node): number[] => {
	const path: number[] = [];
	while (node !== document.body) {
		const parent = node.parentNode;
		if (!parent) {
			throw new Error("Node not found in document body");
		}
		const index = Array.prototype.indexOf.call(parent.childNodes, node);
		path.push(index);
		node = parent;
	}
	return path.reverse();
};
