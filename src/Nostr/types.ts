export interface NostrUser {
	pubkey: string;
	meta: NostrUserMetadata;
}

export interface NostrUserMetadata {
	[pubkey: string]: string;
}

export interface ColorDescription {
	name: string;
	val: string;
}

export enum MessageAction {
	TOGGLE_HIGHLIGHTS = "TOGGLE_HIGHLIGHTS",
	REMOVE_HIGHLIGHTS = "REMOVE_HIGHLIGHTS",
	SELECT_COLOR = "SELECT_COLOR",
}

export interface MessageData<T> {
	action: MessageAction;
	data: T;
}

export enum StorageKey {
	SHOW_HIGHLIGHTS = "SHOW_HIGHLIGHTS",
	HIGHLIGHTING_COLOR = "HIGHLIGHTING_COLOR",
	COLOR_SELECTION = "COLOR_SELECTION",
}
