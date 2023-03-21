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
import { ColorDescription, MessageAction, MessageData, NostrUser } from "../Nostr";
import { IHighlightCollection, IHighlightCollectionAppModel } from "./types";
import { HighlightContainerRuntimeFactory } from "./container";

export const readLocalStorage = async (key: string): Promise<string | undefined> => {
	const storage = await browser.storage.local.get();
	return storage[key];
};

export const sendMessage = (data: MessageData) => {
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

export const setupColorUsage = (colorOptions: ColorDescription[]) => {
	let selectedColor: string;

	// Load selected color data from local storage
	browser.storage.local.get().then((store) => {
		selectedColor = store.selected_color || colorOptions[0].val;
		const selectedBtn = document.getElementById(`${selectedColor}`) as HTMLInputElement;

		sendMessage({
			action: MessageAction.SET_COLOR,
			data: { color: selectedColor },
		});

		if (selectedBtn != null) selectedBtn.checked = true;
	});

	const colorButtonGroup = document.getElementById("color-row");
	const colorButtons = document.querySelectorAll('input[name="color"]');

	if (colorButtonGroup != null) {
		colorButtonGroup.addEventListener("click", () => {
			for (const colorButton of colorButtons as any) {
				if (colorButton.checked) {
					const colorSelection = colorButton.getAttribute("value");
					browser.storage.local.set({
						selected_color: colorSelection,
					});
					sendMessage({
						action: MessageAction.SET_COLOR,
						data: { color: colorSelection },
					});
				}
			}
		});
	}
};

export const setupHighlighting = () => {
	let highlightStatus = false;
	const toggleHighlightBtn = document.getElementById("toggle-highlight") as HTMLInputElement;

	// Load value from local storage
	browser.storage.local.get().then((store) => {
		highlightStatus = store.highlight_status || false;

		sendMessage({
			action: MessageAction.TOGGLE_HIGHLIGHT,
			data: { highlightStatus: highlightStatus },
		});
		toggleHighlightBtn.checked = highlightStatus;
	});

	// Enable/Disable highlighting on toggle button click
	toggleHighlightBtn.addEventListener("click", () => {
		highlightStatus = !highlightStatus;
		browser.storage.local.set({ highlight_status: highlightStatus });

		sendMessage({
			action: MessageAction.TOGGLE_HIGHLIGHT,
			data: { highlightStatus: highlightStatus },
		});
	});
};

export const loadCollabHighlighter = async (user: NostrUser): Promise<IHighlightCollection> => {
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

	let id: string;
	let highlightsCollection: IHighlightCollectionAppModel;

	if (window.location.hash.length === 0) {
		const createResponse = await loader.createDetached("0.1.0");
		highlightsCollection = createResponse.collab;
		id = await createResponse.attach();
	} else {
		id = window.location.hash.substring(1);
		highlightsCollection = await loader.loadExisting(id);
	}

	// Update the browser url and window title with the container ID
	window.location.hash = id;
	document.title = id;

	return highlightsCollection.highlightCollection;
};
