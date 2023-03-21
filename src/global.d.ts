declare interface Window {
	nostr: Nostr;
	browser: any;
}

type Nostr = {
	trackEvent(
		signedEvent: import("nostr-tools").EventTemplate & { pubkey: string } & {
			id: string;
			sig: string;
		} & { id: string } & { sig: string },
	): unknown;
	getPublicKey(): Promise<string>;
};
