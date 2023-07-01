import { ActionResponse } from '../types';

import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';

const HIGHLIGHT_MARKER: string = 'NPKryv4iXxihMRg2gxRkTfFhwXmNmX9F';

/** Gets the highlighter instance */
export const getHighlighter = () => {
  const styleElement = document.createElement('style');
  // TODO: Use background color based on user settings
  const cssStyles = `.${HIGHLIGHT_MARKER} { background-color: #CE97FB; }`;
  styleElement.textContent = cssStyles;
  document.head.appendChild(styleElement);

  const highlighter = rangy.createHighlighter();
  highlighter.addClassApplier(rangy.createClassApplier(HIGHLIGHT_MARKER));

  return highlighter;
};

/** TODO Make the classApplier dynamic */
export const getOtherUsersHighlighter = () => {
  const styleElement = document.createElement('style');
  // TODO: Use background color based on user settings
  const cssStyles = `.${HIGHLIGHT_MARKER} { background-color: #CE97FB; }`;
  styleElement.textContent = cssStyles;
  document.head.appendChild(styleElement);

  const highlighter = rangy.createHighlighter();
  highlighter.addClassApplier(rangy.createClassApplier(HIGHLIGHT_MARKER));

  return highlighter;
};
export const createSelectionAtRange = (range: RangyRange): RangySelection => {
  const selection = rangy.getSelection();

  if (!selection) {
    throw new Error('Failed to create selection');
  }

  selection.addRange(range);
  return selection;
};

/* Highlight given selection */
export const highlightCurrentSelection = async (
  highlighter: Highlighter
): Promise<{
  selectedText: string;
  serializedRange: string;
}> => {
  highlighter.highlightSelection(HIGHLIGHT_MARKER);
  const selectedText = rangy.getSelection().toString();
  const serializedRange = highlighter.serialize();

  rangy.getSelection().removeAllRanges();

  return Promise.resolve({ selectedText, serializedRange });
};

/* Remove highlight for given selected text */
export const removeCurrentSelectionHighlight = async (
  highlighter: Highlighter
): Promise<ActionResponse> => {
  highlighter.unhighlightSelection();
  return { success: true };
};
