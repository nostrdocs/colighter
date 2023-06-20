import { ActionResponse, ISerializedRange } from '../types';

const HIGHLIGHT_KEY: string = 'NPKryv4iXxihMRg2gxRkTfFhwXmNmX9F';

/* Get selection info from window selection object */
export const getSelectionInfo = async (): Promise<{
  selection: Selection;
  range: Range;
  text: string;
}> => {
  const selection = window.getSelection();
  let range: Range | null = null;
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

export const createSelectionAtRange = (range: Range): Selection => {
  const selection = document.getSelection();
  if (!selection) {
    throw new Error('Failed to create selection');
  }

  selection.addRange(range);
  return selection;
};

/* Highlight given selection */
export const highlightText = async (
  selection: Selection,
  range: Range,
  text: string
): Promise<{ text: string; range: Range }> => {
  let parent = getHighlightedMark(range);

  if (parent?.className !== HIGHLIGHT_KEY) {
    let mark: HTMLElement = document.createElement('mark');
    mark.setAttribute('style', `background-color: #CE97FB`);
    mark.className = HIGHLIGHT_KEY;

    range.surroundContents(mark);
  } else {
    console.log('Already highlighted');
  }

  selection.removeRange(range);

  return Promise.resolve({ text, range });
};

/* Get parent element from selected text */
const getHighlightedMark = (range: Range): HTMLElement | null => {
  let parent: HTMLElement | null = null;
  parent = range.commonAncestorContainer as HTMLElement;
  if (parent.nodeType !== 1) {
    parent = parent.parentNode as HTMLElement;
  }
  return parent;
};

/* Remove highlight for given selected text */
export const removeHighlight = async (): Promise<ActionResponse> => {
  // const { selection, range, text } = await getSelectionInfo();

  // if (selection === null || range === null) {
  //   return {
  //     success: false,
  //     error: 'Failed to get selection',
  //   } as ActionResponse;
  // }

  // if (!text) {
  //   return { success: false, error: 'No text selected' } as ActionResponse;
  // }

  // let mark = getHighlightedMark(selection);

  // if (mark && mark?.className === HIGHLIGHT_KEY) {
  //   let parent: Node | null = mark.parentNode;
  //   let text: Text | null = document.createTextNode(mark.innerHTML);

  //   parent?.insertBefore(text, mark);
  //   mark.remove();

  //   return { success: true };
  // }

  return {
    success: false,
    error: 'Failed to remove highlight',
  } as ActionResponse;
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
