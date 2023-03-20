declare interface Window {
	webln: any;
	nostr: Nostr;
}

type Nostr = {
	trackEvent(
		signedEvent: import("nostr-tools").EventTemplate & { pubkey: string } & {
			id: string;
			sig: string;
		} & { id: string } & { sig: string },
	): unknown;
	getPublicKey(): Promise<string>;
	// signEvent(event: NostrToolsEvent): Promise<NostrToolsEventWithId & { sig: string }>;
};
