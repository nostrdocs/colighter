import { RouterliciousDocumentServiceFactory } from "@fluidframework/routerlicious-driver";
import { getNostrUser } from "../Nostr";
import {
	createNostrCreateNewRequest,
	MockCollabRelay,
	NostrCollabLoader,
	NostrRelayTokenProvider,
	NostrRelayUrlResolver,
	StaticCodeLoader,
} from "../Nostrcollab";
import { HighlightContainerRuntimeFactory } from "./container";
import {
	IHighlight,
	IHighlightCollection,
	IHighlightCollectionAppModel,
	MessageAction,
	StorageKey,
} from "./types";
import {
	tryReadLocalStorage,
	sendMessage,
	sha256Hash,
	writeLocalStorage,
	tryWriteLocalStorage,
} from "./utils";

let collab: IHighlightCollection | null = null;

/**
 * Listen for tab updates, and appropriately load the collab model whenever a tab is fully loaded
 */
chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo, tab) => {
	// Load collab whenever on fully loaded tabs, if the tab is active
	if (changeInfo.status === "complete" && tab.active) {
		const collabRelayUrl = process.env.COLLAB_RELAY_URL ?? "http://localhost:7070";
		const collabRelay = new MockCollabRelay("wss://mockcollabrelay", 1, collabRelayUrl);

		const tokenProvider = new NostrRelayTokenProvider(collabRelay, await getNostrUser());

		// Create a new Fluid loader, load the highlight collection
		const loader = new NostrCollabLoader<IHighlightCollectionAppModel>({
			urlResolver: new NostrRelayUrlResolver(collabRelay),
			documentServiceFactory: new RouterliciousDocumentServiceFactory(tokenProvider),
			codeLoader: new StaticCodeLoader(new HighlightContainerRuntimeFactory()),
			generateCreateNewRequest: createNostrCreateNewRequest,
		});

		let storageKey = await sha256Hash(tab.url ?? "");
		let collabId = await tryReadLocalStorage<string>(storageKey);

		if (!collabId) {
			const createResponse = await loader.createDetached("0.1.0");
			collab = createResponse.collab.highlightCollection;
			tryWriteLocalStorage<string>(storageKey, await createResponse.attach());
		} else {
			collab = (await loader.loadExisting(collabId)).highlightCollection;
		}
	}

	if (collab !== null) {
		// Listen for changes to the highlight collection
		const changeListener = async () => {
			const highlights = await collab!.getHighlights();

			// Request render highlights on canvas
			await sendMessage<IHighlight[]>({
				action: MessageAction.RENDER_HIGHLIGHTS,
				data: highlights,
			});

			// Notify render of highlights on popup UI
			writeLocalStorage<IHighlight[]>(StorageKey.COLLAB_HIGHLIGHTS, highlights);
		};

		collab.on("highlightCollectionChanged", changeListener);
	}
});
