import { ISerializedRange } from './types';

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

export const sha256Hash = async (message: string): Promise<string> => {
  const encoder = new TextEncoder();
  const hashArray = Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', encoder.encode(message))
    )
  );
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};
