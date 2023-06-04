import { EventEmitter } from 'events';

export type ISerializedRange = {
  startPath: number[];
  endPath: number[];
  startOffset: number;
  endOffset: number;
};

export interface IHighlight {
  /** Text content of the highlight */
  text: string;
  /** Author of the highlight,
   * This could be the pubkey identifier of the author
   */
  author: string;
  /** Range of the highlight
   * This is a serialized representation of the range
   */
  range: ISerializedRange;
  /** Unique hash identifier of the highlight
   *  Possibly create this by hashing concat of author + text
   */
  hashId: string;
}

export interface IHighlightCollection extends EventEmitter {
  addHighlight(highlight: IHighlight): Promise<IHighlight>;
  removeHighlight(hashId: string): Promise<boolean>;
  getHighlight(hashId: string): Promise<IHighlight | undefined>;
  getHighlights(): Promise<IHighlight[]>;

  /** `HighlightCollectionUpdate` event will fire whenever the highlight collection changes.
   * Changes originate either locally or remotely
   */
  on(event: typeof HighlightCollectionUpdate, listener: () => void): this;
}

export const HighlightCollectionUpdate = 'HighlightCollectionUpdate';

export interface IHighlightCollectionAppModel {
  readonly highlightCollection: IHighlightCollection;
}
