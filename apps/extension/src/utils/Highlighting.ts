import { ActionResponse, ISerializedRange } from '../types';

import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';

// const HIGHLIGHT_KEY: string = 'NPKryv4iXxihMRg2gxRkTfFhwXmNmX9F';

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

/* Get selection info from window selection object */
export const getSelectionInfo = async (): Promise<{
  selection: Selection;
  range: RangyRange;
  text: string;
}> => {
  const selection = rangy.getSelection();
  let range: RangyRange | null = null;
  let text = '';

  if (selection) {
    range = selection.getRangeAt(0);
    text = range.toString();
  }

  if (selection === null || range === null) {
    throw new Error('Failed to get selection');
  }

  if (!text) {
    throw new Error('No text selected');
  }

  return Promise.resolve({ selection, range, text });
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
  // highlighter.highlightSelection('highlight');
  const selectedText = rangy.getSelection();
  const serializedRange = highlighter.serialize();

  // highlighter.deserialize(serializedRange);
  rangy.getSelection().removeAllRanges();

  return Promise.resolve({ selectedText, serializedRange });
};

/* Remove highlight for given selected text */
export const removeCurrentSelectionHighlight = async (
  highlighter: Highlighter
): Promise<ActionResponse> => {
  const { selection, range, text } = await getSelectionInfo();

  if (selection === null || range === null) {
    return {
      success: false,
      error: 'Failed to get selection',
    } as ActionResponse;
  }

  if (!text) {
    return { success: false, error: 'No text selected' } as ActionResponse;
  }

  highlighter.unhighlightSelection();
  return { success: true };
};

export const serializeRange = (range: Range): ISerializedRange => {
  const startContainer = range.startContainer;
  const endContainer = range.endContainer;

  const startOffset = range.startOffset;
  const endOffset = range.endOffset;

  const startPath = getNodePath(startContainer);
  const endPath = getNodePath(endContainer);

  return {
    startPath,
    endPath,
    startOffset,
    endOffset,
  };
};

const getNodePath = (node: Node): number[] => {
  const path: number[] = [];

  while (node !== document.body) {
    const parent = node.parentNode;
    if (!parent) {
      throw new Error('Node not found in document body');
    }
    const index = Array.prototype.indexOf.call(parent.childNodes, node);
    path.push(index);
    node = parent;
  }

  return path.reverse();
};

// TODO: Redefine range serialization to work with all cases of highlighting the DOM
export const hackyDeserializeRange = (
  { startPath }: ISerializedRange,
  text: string
): Range => {
  const range = document.createRange();

  const ancestor = getNodeFromPath(startPath);
  const ancestorText = ancestor.textContent || '';
  const startOffset = ancestorText.indexOf(text);

  if (startOffset !== -1 && ancestor.firstChild) {
    const endOffset = startOffset + text.length;
    range.setStart(ancestor.firstChild, startOffset);
    range.setEnd(ancestor.firstChild, endOffset);
  }

  return range;
};

const getNodeFromPath = (path: number[]): Node => {
  let node: Node = document.body;

  for (const index of path) {
    node = node.childNodes[index];
  }

  if (!node) {
    throw new Error('Node not found in document body');
  }

  return node;
};

export const sha256Hash = async (message: string): Promise<string> => {
  const encoder = new TextEncoder();
  const hashArray = Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', encoder.encode(message))
    )
  );
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};
