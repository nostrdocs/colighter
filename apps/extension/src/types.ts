import { EventEmitter } from "events";

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
  range: SerializedRange;
  /** Unique hash identifier of the highlight
   *  Possibly create this by hashing concat of author + text
   */
  hashId: string;
}

export type SerializedRange = {
  startPath: number[];
  endPath: number[];
  startOffset: number;
  endOffset: number;
};

export interface IHighlightCollection extends EventEmitter {
  addHighlight(highlight: IHighlight): Promise<IHighlight>;
  removeHighlight(hashId: string): Promise<boolean>;
  getHighlight(hashId: string): Promise<IHighlight | undefined>;
  getHighlights(): Promise<IHighlight[]>;

  /** highlightCollectionChanged event will fire whenever the highlight collection changes.
   * Changes originate either locally or remotely
   */
  on(event: "highlightCollectionChanged", listener: () => void): this;
}

export interface IHighlightCollectionAppModel {
  readonly highlightCollection: IHighlightCollection;
}

export interface ColorDescription {
  name: string;
  val: string;
}

export enum MessageAction {
  TOGGLE_HIGHLIGHTS = "TOGGLE_HIGHLIGHTS",
  REMOVE_HIGHLIGHTS = "REMOVE_HIGHLIGHTS",
  RENDER_HIGHLIGHTS = "RENDER_HIGHLIGHTS",
  SELECT_COLOR = "SELECT_COLOR",
  LOAD_COLLAB = "LOAD_COLLAB",
  GET_COLLAB_HIGHLIGHTS = "GET_COLLAB_HIGHLIGHTS",
  POST_COLLAB_HIGHLIGHTS = "POST_COLLAB_HIGHLIGHTS",
}

export interface ActionResponse {
  success: boolean;
}
export interface SucccessAcionResponse extends ActionResponse {
  success: true;
  data?: any;
}

export interface ErrorActionResponse extends ActionResponse {
  success: false;
  error: string;
}

export interface MessageData<T> {
  action: MessageAction;
  data: T;
}

export enum StorageKey {
  SHOW_HIGHLIGHTS = "SHOW_HIGHLIGHTS",
  HIGHLIGHTING_COLOR = "HIGHLIGHTING_COLOR",
  COLOR_SELECTION = "COLOR_SELECTION",
  COLLAB_ID = "COLLAB_ID",
  COLLAB_HIGHLIGHTS = "COLLAB_HIGHLIGHTS",
}

export interface IUser {
  userName: string;
  imageUrl: string;
}
