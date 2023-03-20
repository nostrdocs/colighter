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
  
  export interface MessageData {
	action: string;
	data: any;
  }