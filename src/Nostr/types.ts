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
	TOGGLE_HIGHLIGHT = "TOGGLE_HIGHLIGHT",
	REMOVE_HIGHLIGHTS = "REMOVE_HIGHLIGHTS",
	SET_COLOR = "SET_COLOR",
}

export interface MessageData {
	action: MessageAction;
	data: any;
}

export enum StorageKey {
	HIGHLIGHT_STATUS = "HIGHLIGHT_STATUS",
	HIGHLIGHTING_COLOR = "HIGHLIGHTING_COLOR",
}
