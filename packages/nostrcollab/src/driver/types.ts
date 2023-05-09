import { IFluidResolvedUrl } from "@fluidframework/driver-definitions";

export interface NostrCollabRequest {
	header: NostrCollabRequestHeader;
	[index: string]: any;
}

export type NostrCollabRequestHeader = {
	[index in NostrCollabHeader]?: any;
};

export enum NostrCollabHeader {
	// Creating and resolving a pointer to a new collab document
	Create = "createCollab",
	// Resolving a pointer to an existing collab document
	Load = "loadCollab",
	// Create a shareable path to an existing collab document
	Share = "shareCollab",
}

export interface CreateCollabRequest extends NostrCollabRequest {
	header: {
		[NostrCollabHeader.Create]: true;
	};
	url: string;
}

export interface LoadCollabRequest extends NostrCollabRequest {
	header: {
		[NostrCollabHeader.Load]: true;
	};
	url: string;
}

export interface ShareCollabRequest extends NostrCollabRequest {
	header: {
		[NostrCollabHeader.Share]: true;
	};
	resolvedUrl: IFluidResolvedUrl;
	relativeUrl: string;
}
