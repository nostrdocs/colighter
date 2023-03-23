import { DEFAULT_HIGHLIGHT_COLOR } from "./constants";
import { ActionResponse, ColorDescription, MessageAction } from "./types";

let color: ColorDescription = DEFAULT_HIGHLIGHT_COLOR;
const HIGHLIGHT_KEY: string = "NPKryv4iXxihMRg2gxRkTfFhwXmNmX9F";

/**
 * Listen for highlight mesages and take actions that render highlights on the page
 */
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
				color = request.data;
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
			mark.setAttribute("style", `background-color: #${color.val}`);
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
