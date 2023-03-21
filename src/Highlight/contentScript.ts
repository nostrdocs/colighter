// // import { initialize } from './ContentScripts/index.js';

// // initialize();

// let color = 'FAA99D';
// const HIGHLIGHT_KEY = 'NPKryv4iXxihMRg2gxRkTfFhwXmNmX9F';

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   switch (request.action) {
//     case 'TOGGLE_HIGHLIGHT':
//       if (request.data.highlightStatus) {
//         document.addEventListener('mouseup', highlightText);
//         document.addEventListener('keyup', highlightText);
//       } else {
//         document.removeEventListener('mouseup', highlightText);
//         document.removeEventListener('keyup', highlightText);
//       }
//       break;
//     case 'SET_COLOR':
//       color = request.data.color;
//       break;
//     case 'HIGHLIGHT':
//       highlightText();
//       break;
//     case 'REMOVE_HIGHLIGHT':
//       removeHighlight();
//       break;
//     default:
//       sendResponse({ data: 'ERR' });
//   }
// });

// /* Get selected text */
// function getSelectedText(): string {
//   let text = '';
//   if (typeof window.getSelection !== 'undefined') {
//     text = window.getSelection()?.toString() ?? '';
//   } else if (
//     typeof document.selection !== 'undefined' &&
//     document.selection.type === 'Text'
//   ) {
//     text = document.selection.createRange().text;
//   }
//   return text;
// }

// /* Highlight given selection */
// function highlightText() {
//   let parent = getHighlightedMark();

//   if (parent?.className !== HIGHLIGHT_KEY) {
//     let selectedText = getSelectedText();
//     if (selectedText) {
//       highlight();
//     }
//   }
// }

// /* Insert mark around selected text */
// function highlight() {
//   let mark = document.createElement('mark');
//   mark.setAttribute('style', `background-color: #${color}`);
//   mark.className = HIGHLIGHT_KEY;
//   let sel = window.getSelection();
//   if (sel?.rangeCount) {
//     let range = sel.getRangeAt(0).cloneRange();
//     range.surroundContents(mark);
//     sel.removeAllRanges();
//     sel.addRange(range);
//   }
// }

// /* Remove highlight for given selected text */
// function removeHighlight() {
//   let highlightedSelection = getHighlightedMark();

//   if (highlightedSelection?.className === HIGHLIGHT_KEY) {
//     let parent = highlightedSelection.parentNode;
//     let text = document.createTextNode(highlightedSelection.innerHTML);

//     parent?.insertBefore(text, highlightedSelection);
//     highlightedSelection.remove();
//   }
// }

// /* Get parent element from selected text 
//  * @returns parent element of selected text 
//  */
// function getHighlightedMark(): HTMLElement | null {
//   let parent: HTMLElement | null = null;
//   let sel: Selection | null;
//   if (window.getSelection) {
//     sel = window.getSelection();
//     if (sel?.rangeCount) {
//       parent = sel.getRangeAt(0).commonAncestorContainer as HTMLElement;
//       if (parent.nodeType !== 1) {
//         parent = parent.parentNode as HTMLElement;
//       }
//     }
//   } else if ((sel = document.selection) && sel.type !== 'Control') {
//     parent = sel.createRange().parentElement() as HTMLElement;
//   }
//   return parent;
// }
