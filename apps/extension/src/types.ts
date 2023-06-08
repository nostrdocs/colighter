export enum MessageAction {
  TOGGLE_HIGHLIGHTS = 'TOGGLE_HIGHLIGHTS',
  REMOVE_HIGHLIGHTS = 'REMOVE_HIGHLIGHTS',
  CREATE_HIGHLIGHT = 'CREATE_HIGHLIGHT',
  LOAD_COLLAB = 'LOAD_COLLAB',
  GET_COLLAB_HIGHLIGHTS = 'GET_COLLAB_HIGHLIGHTS',
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
