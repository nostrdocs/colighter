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
import { DEFAULT_HIGHLIGHT_COLOR } from "./constants";
import { HighlightContainerRuntimeFactory } from "./container";
import { Highlight } from "./model";
import {
	ActionResponse,
	ColorDescription,
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
	serializeRange,
} from "./utils";

let color: ColorDescription = DEFAULT_HIGHLIGHT_COLOR;
const HIGHLIGHT_KEY: string = "NPKryv4iXxihMRg2gxRkTfFhwXmNmX9F";

/**
 * Listen for highlight mesages and take actions that render highlights on the page
 */
chrome.runtime.onMessage.addListener((request: any, _sender, sendResponse) => {
	(async () => {
		let outcome: ActionResponse;

		switch (request.action) {
			case MessageAction.TOGGLE_HIGHLIGHTS:
				if (request.data) {
					// TODO: render all highlights
				} else {
					// TODO: remove all highlights
				}
				outcome = { success: true };
				break;
			case MessageAction.SELECT_COLOR:
				color = request.data;
				outcome = { success: true };
				break;
			case MessageAction.RENDER_HIGHLIGHTS:
				if (request.data) {
					// We don't know how to render collab highlights yet
					// TODO: Render submitted highlights
					outcome = { success: false, error: "Not implemented" } as ActionResponse;
					break;
				}

				outcome = await highlightText().catch((e) => {
					return (outcome = {
						success: false,
						error: e,
					} as ActionResponse);
				});
				break;
			case MessageAction.REMOVE_HIGHLIGHTS:
				outcome = removeHighlight();
				break;
			default:
				outcome = { success: false, error: "Unknown message action" } as ActionResponse;
				break;
		}

		sendResponse(outcome);
	})();
});

const getSelectionInfo = (): { selection: Selection | null; range: Range | null; text: string } => {
	const selection = window.getSelection();
	let range: Range | null = null;
	let text = "";

	if (selection) {
		range = selection.getRangeAt(0);
		text = range.toString();
	}
	return { selection, range, text };
};

/* Highlight given selection */
const highlightText = async (): Promise<ActionResponse> => {
	const { selection, range, text } = getSelectionInfo();

	if (selection === null || range === null) {
		return { success: false, error: "Failed to get selection" } as ActionResponse;
	}

	if (!text) {
		return { success: false, error: "No text selected" } as ActionResponse;
	}

	let parent = getHighlightedMark(selection);

	if (parent?.className !== HIGHLIGHT_KEY) {
		let mark: HTMLElement = document.createElement("mark");
		mark.setAttribute("style", `background-color: #${color.val}`);
		mark.className = HIGHLIGHT_KEY;
		let sel: Selection | null = window.getSelection();

		if (sel?.rangeCount) {
			let range: Range = sel.getRangeAt(0).cloneRange();
			range.surroundContents(mark);
			sel.removeAllRanges();
			sel.addRange(range);

			return await trySaveHighlight(range, text);
		}
	}

	return { success: false, error: "Already highlighted" } as ActionResponse;
};

/* Remove highlight for given selected text */
const removeHighlight = (): ActionResponse => {
	const { selection, range, text } = getSelectionInfo();

	if (selection === null || range === null) {
		return { success: false, error: "Failed to get selection" } as ActionResponse;
	}

	if (!text) {
		return { success: false, error: "No text selected" } as ActionResponse;
	}

	let mark = getHighlightedMark(selection);

	if (mark?.className === HIGHLIGHT_KEY) {
		let parent: Node | null = mark.parentNode;
		let text: Text | null = document.createTextNode(mark.innerHTML);

		parent?.insertBefore(text, mark);
		mark.remove();

		return { success: true };
	}

	return { success: false, error: "Failed to remove highlight" } as ActionResponse;
};

/* Get parent element from selected text */
const getHighlightedMark = (selection: Selection): HTMLElement | null => {
	let parent: HTMLElement | null = null;
	parent = selection.getRangeAt(0).commonAncestorContainer as HTMLElement;
	if (parent.nodeType !== 1) {
		parent = parent.parentNode as HTMLElement;
	}
	return parent;
};

// ######################## Collab Script ########################

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
		});``

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

const trySaveHighlight = async (range: Range, text: string): Promise<ActionResponse> => {
	if (collab !== null) {
		try {
			const rangeSer = serializeRange(range);
			const highlight = await Highlight.create(text, rangeSer, "0x000000");
			await collab.addHighlight(highlight);
			return { success: true };
		} catch (e) {
			return { success: false, error: e } as ActionResponse;
		}
	}

	return { success: false, error: "Collab model not ready" } as ActionResponse;
};
