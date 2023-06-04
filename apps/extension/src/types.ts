export interface ColorDescription {
  name: string;
  val: string;
}

export enum MessageAction {
  TOGGLE_HIGHLIGHTS = 'TOGGLE_HIGHLIGHTS',
  REMOVE_HIGHLIGHTS = 'REMOVE_HIGHLIGHTS',
  RENDER_HIGHLIGHTS = 'RENDER_HIGHLIGHTS',
  SELECT_COLOR = 'SELECT_COLOR',
  LOAD_COLLAB = 'LOAD_COLLAB',
  GET_COLLAB_HIGHLIGHTS = 'GET_COLLAB_HIGHLIGHTS',
  POST_COLLAB_HIGHLIGHTS = 'POST_COLLAB_HIGHLIGHTS',
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
  SHOW_HIGHLIGHTS = 'SHOW_HIGHLIGHTS',
  HIGHLIGHTING_COLOR = 'HIGHLIGHTING_COLOR',
  COLOR_SELECTION = 'COLOR_SELECTION',
  COLLAB_ID = 'COLLAB_ID',
  COLLAB_HIGHLIGHTS = 'COLLAB_HIGHLIGHTS',
}

export interface IUser {
  userName: string;
  imageUrl: string;
}

export const HIGHLIGHT_COLOR_OPTIONS: ColorDescription[] = [
  { name: 'red', val: 'FAA99D' },
  { name: 'yellow', val: 'FDDF7E' },
  { name: 'green', val: 'CCE29C' },
  { name: 'blue', val: '67EBFA' },
  { name: 'purple', val: 'CE97FB' },
];

export const DEFAULT_HIGHLIGHT_COLOR = HIGHLIGHT_COLOR_OPTIONS[0];
