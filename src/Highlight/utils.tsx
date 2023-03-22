import browser, { Tabs } from "webextension-polyfill";
import { RouterliciousDocumentServiceFactory } from "@fluidframework/routerlicious-driver";
import {
	StaticCodeLoader,
	NostrCollabLoader,
	createNostrCreateNewRequest,
	NostrRelayUrlResolver,
	NostrRelayTokenProvider,
	MockCollabRelay,
} from "../Nostrcollab";
import { NostrUser } from "../Nostr";
import {
	ColorDescription,
	MessageAction,
	MessageData,
	IHighlightCollection,
	IHighlightCollectionAppModel,
	StorageKey,
} from "./types";
import { HighlightContainerRuntimeFactory } from "./container";
import { useCallback, useEffect, useState } from "react";

export const readLocalStorage = async <T,>(key: StorageKey): Promise<T | undefined> => {
	const storage = await browser.storage.local.get();
	return storage[key];
};

export const writeLocalStorage = async <T,>(key: StorageKey, value: T) => {
	await browser.storage.local.set({ [key]: value });
};

export const sendMessage = <T,>(data: MessageData<T>) => {
	const queryOptions = { active: true, currentWindow: true };

	browser.tabs.query(queryOptions).then((tabs: Tabs.Tab[]) => {
		const currentTabId = tabs[0]?.id;

		if (currentTabId !== undefined) {
			browser.tabs.sendMessage(currentTabId, data).then((response) => {
				if (response?.data == "ERR") {
					alert("COLIGHTER ERROR");
				}
			});
		}
	});
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

	const updateSelectedColor = useCallback((selectedColor: ColorDescription) => {
		// Update state and local storage
		setSelectedColor(selectedColor);
		writeLocalStorage<ColorDescription>(StorageKey.COLOR_SELECTION, selectedColor);

		// Send message for render action by content script
		sendMessage<ColorDescription>({
			action: MessageAction.SELECT_COLOR,
			data: selectedColor,
		});
	}, []);

	useEffect(() => {
		readLocalStorage<ColorDescription>(StorageKey.COLOR_SELECTION)
			.then((storedSelectedColor) => {
				// Update state
				const updatedSelectedColor = storedSelectedColor ?? selectedColor;
				updateSelectedColor(updatedSelectedColor);
			})
			.catch((e) => {
				console.log("Failed to read local storage", e);
			});
	}, []);

	return [selectedColor, updateSelectedColor] as const;
};

export const useCollabHighlighter = (user: NostrUser) => {
	const [highlightCollection, setHighlightCollection] = useState<IHighlightCollection>();

	useEffect(() => {
		const collabRelayUrl = process.env.COLLAB_RELAY_URL ?? "http://localhost:7070";
		const collabRelay = new MockCollabRelay("wss://mockcollabrelay", 1, collabRelayUrl);

		const tokenProvider = new NostrRelayTokenProvider(collabRelay, user);

		// Create a new Fluid loader, load the highlight collection
		const loader = new NostrCollabLoader<IHighlightCollectionAppModel>({
			urlResolver: new NostrRelayUrlResolver(collabRelay),
			documentServiceFactory: new RouterliciousDocumentServiceFactory(tokenProvider),
			codeLoader: new StaticCodeLoader(new HighlightContainerRuntimeFactory()),
			generateCreateNewRequest: createNostrCreateNewRequest,
		});

		const loadCollabHighlighter = async () => {
			let collabId = await readLocalStorage<string>(StorageKey.COLLAB_ID);
			let highlightsCollection: IHighlightCollectionAppModel;

			if (collabId) {
				highlightsCollection = await loader.loadExisting(collabId);
			} else {
				const createResponse = await loader.createDetached("0.1.0");
				highlightsCollection = createResponse.collab;
				collabId = await createResponse.attach();

				// Update storage with known collab id
				writeLocalStorage<string>(StorageKey.COLLAB_ID, collabId);
			}

			setHighlightCollection(highlightsCollection.highlightCollection);
		};

		loadCollabHighlighter().catch((e) => console.error(e));

		return () => {
			// TODO: Cancel promise loading collab
		};
	}, []);

	return [highlightCollection] as const;
};
