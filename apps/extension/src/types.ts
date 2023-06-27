export enum MessageAction {
  REMOVE_HIGHLIGHTS = 'REMOVE_HIGHLIGHTS',
  CREATE_HIGHLIGHT = 'CREATE_HIGHLIGHT',
  LOAD_HIGHLIGHTS = 'LOAD_HIGHLIGHTS',
  GET_HIGHLIGHTS = 'GET_HIGHLIGHTS',
  OPEN_SIDEBAR = 'OPEN_SIDEBAR',
  CLOSE_SIDEBAR = 'CLOSE_SIDEBAR',
  OPEN_OPTIONS_PAGE = 'OPEN_OPTIONS_PAGE',
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
  /** Unique identifier of the highlight */
  id: string;
  /** Text content of the highlight */
  text: string;
  /** Author of the highlight,
   * This could be the pubkey identifier of the author
   */
  author: string;
  /** Range of the highlight
   * This is a JSON serialized representation of the range
   */
  range?: string;
   /** Created time of the highlight
   * This is a unix time of when the highlight was created
   */
  createdAt?: number
}
