import { MessageAction } from "./types";

let color: string = 'FAA99D';
const HIGHLIGHT_KEY: string = 'NPKryv4iXxihMRg2gxRkTfFhwXmNmX9F';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case MessageAction.TOGGLE_HIGHLIGHTS:
      if (request.data.highlightStatus) {
        document.addEventListener('mouseup', highlightText);
        document.addEventListener('keyup', highlightText);
      } else {
        document.removeEventListener('mouseup', highlightText);
        document.removeEventListener('keyup', highlightText);
      }
      break;
    case MessageAction.SELECT_COLOR:
      color = request.data.color;
      break;
    case MessageAction.RENDER_HIGHLIGHTS:
      highlightText();
      break;
    case MessageAction.REMOVE_HIGHLIGHTS:
      removeHighlight();
      break;
    default:
      sendResponse({ data: 'ERR' });
  }
});

/* Get selected text */
function getSelectedText(): string {
  let text: string = '';
  if (typeof window.getSelection !== 'undefined') {
    text = window.getSelection()?.toString() ?? '';
  } else if (
    typeof (document as any).selection !== 'undefined' &&
    (document as any).selection.type === 'Text'
  ) {
    text = (document as any).selection.createRange().text;
  }
  return text;
}

/* Highlight given selection */
function highlightText(): void {
  let parent = getHighlightedMark();

  if (parent?.className !== HIGHLIGHT_KEY) {
    let selectedText: string = getSelectedText();
    if (selectedText) {
      highlight();
    }
  }
}

/* Insert mark around selected text */
function highlight(): void {
  let mark: HTMLElement = document.createElement('mark');
  mark.setAttribute('style', `background-color: #${color}`);
  mark.className = HIGHLIGHT_KEY;
  let sel: Selection | null = window.getSelection();
  if (sel?.rangeCount) {
    let range: Range = sel.getRangeAt(0).cloneRange();
    range.surroundContents(mark);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/* Remove highlight for given selected text */
function removeHighlight(): void {
  let highlightedSelection = getHighlightedMark();

  if (highlightedSelection?.className === HIGHLIGHT_KEY) {
    let parent: Node | null = highlightedSelection.parentNode;
    let text: Text | null = document.createTextNode(highlightedSelection.innerHTML);

    parent?.insertBefore(text, highlightedSelection);
    highlightedSelection.remove();
  }
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
  } else if ((sel = (document as any).selection) && sel.type !== 'Control') {
    parent = (sel as any).createRange().parentElement() as HTMLElement;
  }
  return parent;
}

