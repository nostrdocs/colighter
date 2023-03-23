import browser, { Tabs } from "webextension-polyfill";
import { ColorDescription, MessageAction, MessageData, StorageKey, IHighlight } from "./types";
import { useCallback, useEffect, useState } from "react";

export const readLocalStorage = async <T,>(key: StorageKey): Promise<T | undefined> => {
	const storage = await browser.storage.local.get();
	return storage[key];
};

export const writeLocalStorage = async <T,>(key: StorageKey, value: T) => {
	await browser.storage.local.set({ [key]: value });
};

export const sendMessage = async <T,>(data: MessageData<T>) => {
	const queryOptions = { active: true, currentWindow: true };
	const tabs: Tabs.Tab[] = await browser.tabs.query(queryOptions);
	const currentTabId = tabs[0]?.id;

	if (currentTabId !== undefined) {
		const res = await browser.tabs.sendMessage(currentTabId, data);
		console.log(res);
	}
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

export const useColorSelectedColor = (colorOptions: ColorDescription[]) => {
	const [selectedColor, setSelectedColor] = useState<ColorDescription>(colorOptions[0]);

	const updateSelectedColor = useCallback(async (selectedColor: ColorDescription) => {
		// Send message for render action by content script
		await sendMessage<ColorDescription>({
			action: MessageAction.SELECT_COLOR,
			data: selectedColor,
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
				updateSelectedColor(updatedSelectedColor);
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
		browser.storage.local.onChanged.addListener((changes) => {
			if (changes[StorageKey.COLLAB_HIGHLIGHTS]) {
				const updatedHighlights = changes[StorageKey.COLLAB_HIGHLIGHTS]
					.newValue as IHighlight[];
				setHighlights(updatedHighlights);
			}
		});
	}, []);

	return [highlights, setHighlights] as const;
};
