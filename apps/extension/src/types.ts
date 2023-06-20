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
