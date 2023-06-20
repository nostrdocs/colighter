export enum MessageAction {
  REMOVE_HIGHLIGHTS = 'REMOVE_HIGHLIGHTS',
  CREATE_HIGHLIGHT = 'CREATE_HIGHLIGHT',
  LOAD_HIGHLIGHTS = 'LOAD_HIGHLIGHTS',
  GET_HIGHLIGHTS = 'GET_HIGHLIGHTS',
  OPEN_SIDEBAR = 'OPEN_SIDEBAR',
  CLOSE_SIDEBAR = 'CLOSE_SIDEBAR',
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
  data?: T;
}

export interface IUser {
  userName: string;
  imageUrl: string;
}

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
