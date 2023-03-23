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
	ActionResponse,
	IHighlight,
	IHighlightCollection,
	IHighlightCollectionAppModel,
	MessageAction,
	StorageKey,
} from "./types";
import { readLocalStorage, sendMessage, writeLocalStorage } from "./utils";

let color: string = "FAA99D";
const HIGHLIGHT_KEY: string = "NPKryv4iXxihMRg2gxRkTfFhwXmNmX9F";

chrome.runtime.onMessage.addListener(
	(request: { action: MessageAction; data: any }, _sender, sendResponse) => {
		let outcome: ActionResponse;

		switch (request.action) {
			case MessageAction.TOGGLE_HIGHLIGHTS:
				if (request.data) {
					document.addEventListener("mouseup", highlightText);
					document.addEventListener("keyup", highlightText);
				} else {
					document.removeEventListener("mouseup", highlightText);
					document.removeEventListener("keyup", highlightText);
				}
				outcome = { success: true };
			case MessageAction.SELECT_COLOR:
				color = request.data.color;
				outcome = { success: true };
				break;
			case MessageAction.RENDER_HIGHLIGHTS:
				if (request.data) {
					// We don't know how to render collab highlights yet
					// TODO: Render submitted highlights
					outcome = { error: "Not implemented" };
					break;
				}

				outcome = highlightText();
				break;
			case MessageAction.REMOVE_HIGHLIGHTS:
				outcome = removeHighlight();
				break;
			default:
				outcome = { error: "Unknown message action" };
				break;
		}

		sendResponse(outcome);
	},
);

/* Get selected text */
function getSelectedText(): string {
	let text: string = "";
	if (typeof window.getSelection !== "undefined") {
		text = window.getSelection()?.toString() ?? "";
	} else if (
		typeof (document as any).selection !== "undefined" &&
		(document as any).selection.type === "Text"
	) {
		text = (document as any).selection.createRange().text;
	}
	return text;
}

/* Highlight given selection */
function highlightText(): ActionResponse {
	let parent = getHighlightedMark();

	if (parent?.className !== HIGHLIGHT_KEY) {
		let selectedText: string = getSelectedText();

		if (selectedText) {
			let mark: HTMLElement = document.createElement("mark");
			mark.setAttribute("style", `background-color: #${color}`);
			mark.className = HIGHLIGHT_KEY;
			let sel: Selection | null = window.getSelection();

			if (sel?.rangeCount) {
				let range: Range = sel.getRangeAt(0).cloneRange();
				range.surroundContents(mark);
				sel.removeAllRanges();
				sel.addRange(range);

				// TODO: return highlight for persistence in collab
				return { success: true };
			}

			return { error: "Failed to create highlight" };
		}

		return { error: "No text selected" };
	}

	return { error: "Already highlighted" };
}

/* Remove highlight for given selected text */
function removeHighlight(): ActionResponse {
	let highlightedSelection = getHighlightedMark();

	if (highlightedSelection?.className === HIGHLIGHT_KEY) {
		let parent: Node | null = highlightedSelection.parentNode;
		let text: Text | null = document.createTextNode(highlightedSelection.innerHTML);

		parent?.insertBefore(text, highlightedSelection);
		highlightedSelection.remove();

		return { success: true };
	}

	return { error: "Failed to remove highlight" };
}

/* Get parent element from selected text
 * @returns parent element of selected text
 */
function getHighlightedMark(): HTMLElement | null {
	let parent: HTMLElement | null = null;
	let sel: Selection | null;
	if (window.getSelection) {
		sel = window.getSelection();
		if (sel?.rangeCount) {
			parent = sel.getRangeAt(0).commonAncestorContainer as HTMLElement;
			if (parent.nodeType !== 1) {
				parent = parent.parentNode as HTMLElement;
			}
		}
	} else if ((sel = (document as any).selection) && sel.type !== "Control") {
		parent = (sel as any).createRange().parentElement() as HTMLElement;
	}
	return parent;
}

let collab: IHighlightCollection | null = null;

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

		let collabId = await readLocalStorage<string>(StorageKey.COLLAB_ID);

		if (!collabId) {
			const createResponse = await loader.createDetached("0.1.0");
			collab = createResponse.collab.highlightCollection;
			writeLocalStorage<string>(StorageKey.COLLAB_ID, await createResponse.attach());
		} else {
			collabId = window.location.hash.substring(1);
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
