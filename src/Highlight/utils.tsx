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
import { useEffect, useState } from "react";

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
		const currentTab = tabs[0];
		if (currentTab.id !== undefined) {
			browser.tabs.sendMessage(currentTab.id, data).then((response) => {
				if (response.data == "ERR") {
					alert("COLIGHTER ERROR");
				}
			});
		}
	});
};

export const useShowHighlights = () => {
	const [showHighlights, setShowHighlights] = useState(false);

	const toggleShowHighlights = (showHighlights: boolean) => {
		// Update state and local storage
		setShowHighlights(showHighlights);
		writeLocalStorage(StorageKey.SHOW_HIGHLIGHTS, showHighlights);

		// Send message for render action by content script
		sendMessage({
			action: MessageAction.TOGGLE_HIGHLIGHTS,
			data: showHighlights,
		});
	};

	readLocalStorage<boolean>(StorageKey.SHOW_HIGHLIGHTS)
		.then((storedShowHighlights) => {
			// Update state
			let updatedShowHighlights = storedShowHighlights ?? showHighlights;
			setShowHighlights(updatedShowHighlights);

			// Send message for render action by content script
			sendMessage<boolean>({
				action: MessageAction.TOGGLE_HIGHLIGHTS,
				data: updatedShowHighlights,
			});
		})
		.catch((e) => {
			console.log("Failed to read local storage", e);
		});

	return [showHighlights, toggleShowHighlights] as const;
};

export const useColorSelectedColor = (colorOptions: ColorDescription[]) => {
	const [selectedColor, setSelectedColor] = useState<ColorDescription>(colorOptions[0]);

	const updateSelectedColor = (selectedColor: ColorDescription) => {
		// Update state and local storage
		setSelectedColor(selectedColor);
		writeLocalStorage<ColorDescription>(StorageKey.COLOR_SELECTION, selectedColor);

		// Send message for render action by content script
		sendMessage<ColorDescription>({
			action: MessageAction.SELECT_COLOR,
			data: selectedColor,
		});
	};

	readLocalStorage<ColorDescription>(StorageKey.COLOR_SELECTION)
		.then((storedSelectedColor) => {
			// Update state
			const updatedSelectedColor = storedSelectedColor ?? selectedColor;
			setSelectedColor(updatedSelectedColor);

			// Send message for render action by content script
			sendMessage({
				action: MessageAction.SELECT_COLOR,
				data: updatedSelectedColor,
			});
		})
		.catch((e) => {
			console.log("Failed to read local storage", e);
		});

	return [selectedColor, updateSelectedColor] as const;
};

export const useCollabHighlighter = (user: NostrUser) => {
	const [highlightCollection, setHighlightCollection] = useState<IHighlightCollection>();

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

	useEffect(() => {
		if (!highlightCollection) {
			readLocalStorage<string>(StorageKey.COLLAB_ID)
				.then(async (collabId) => {
					if (collabId) {
						const highlightsCollection: IHighlightCollectionAppModel =
							await loader.loadExisting(collabId);
						setHighlightCollection(highlightsCollection.highlightCollection);
					} else {
						const createResponse = await loader.createDetached("0.1.0");
						const highlightsCollection: IHighlightCollectionAppModel =
							createResponse.collab;
						collabId = await createResponse.attach();
						setHighlightCollection(highlightsCollection.highlightCollection);

						// Update storage with known collab id
						writeLocalStorage<string>(StorageKey.COLLAB_ID, collabId);
					}
				})
				.catch((e) => {
					console.log("Failed to read local storage", e);
				});
		} else {
			highlightCollection.on("highlightCollectionChanged", () => {
				// TODO: Optimize this to only send the changed highlights
				sendMessage({
					action: MessageAction.RENDER_HIGHLIGHTS,
					data: highlightCollection.getHighlights(),
				});
			});

			// First pass render of highlights
			sendMessage({
				action: MessageAction.RENDER_HIGHLIGHTS,
				data: highlightCollection.getHighlights(),
			});
		}

		return () => {
			if (highlightCollection) {
				highlightCollection.removeAllListeners();
			}
		};
	}, [highlightCollection]);

	readLocalStorage<string>(StorageKey.COLLAB_ID)
		.then(async (collabId) => {
			if (collabId) {
				const highlightsCollection: IHighlightCollectionAppModel =
					await loader.loadExisting(collabId);
				setHighlightCollection(highlightsCollection.highlightCollection);
			} else {
				const createResponse = await loader.createDetached("0.1.0");
				const highlightsCollection: IHighlightCollectionAppModel = createResponse.collab;
				collabId = await createResponse.attach();
				setHighlightCollection(highlightsCollection.highlightCollection);

				// Update storage with known collab id
				writeLocalStorage<string>(StorageKey.COLLAB_ID, collabId);
			}
		})
		.catch((e) => {
			console.log("Failed to read local storage", e);
		});

	return [highlightCollection];
};
