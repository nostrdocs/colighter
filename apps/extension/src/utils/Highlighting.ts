import { ActionResponse } from '../types';

import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';

/** Gets the highlighter instance */
export const getHighlighter = () => {
  const styleElement = document.createElement('style');
  // TODO: Use background color based on user settings
  const cssStyles = '.highlight { background-color: #CE97FB; }';
  styleElement.textContent = cssStyles;
  document.head.appendChild(styleElement);

  const highlighter = rangy.createHighlighter();
  highlighter.addClassApplier(rangy.createClassApplier('highlight'));

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
  selectedText: RangySelection;
  serializedRange: string;
}> => {
  highlighter.highlightSelection('highlight');
  const selectedText = rangy.getSelection();
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
