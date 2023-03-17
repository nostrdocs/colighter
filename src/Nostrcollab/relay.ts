import { ScopeType } from "@fluidframework/protocol-definitions";
import { IFluidResolvedUrl } from "@fluidframework/driver-definitions";
import { Event, Filter, Pub, Sub, SubscriptionOptions } from "nostr-tools";
import {
	NostrCollabToken,
	KIND_COLLAB_TOKEN,
	KIND_COLLAB,
	NostrCollabRequest,
	isNostrCreateCollabRequest,
	isNostrLoadCollabRequest,
	isNostrShareCollabRequest,
} from "./driver";

export class MockCollabRelay {
	constructor(
		public readonly url: string,
		public status: number,
		private readonly collabServerEndpoint: string = "http://localhost:7070",
	) {}

	public connect(): Promise<void> {
		return Promise.resolve();
	}

	public close(): void {
		return;
	}

	public sub(_filters: Filter[], _opts?: SubscriptionOptions): Sub {
		return {
			sub: (filters: Filter[], opts: SubscriptionOptions) => this.sub(filters, opts),
			unsub: () => {},
			on: (_type: "event" | "eose", _cb: any) => {},
			off: (_type: "event" | "eose", _cb: any) => {},
		};
	}

	public list(_filters: Filter[], _opts?: SubscriptionOptions | undefined): Promise<Event[]> {
		return Promise.resolve([]);
	}

	public get(filter: Filter, _opts?: SubscriptionOptions | undefined): Promise<Event | null> {
		if (filter.kinds?.includes(KIND_COLLAB_TOKEN)) {
			const tenant = filter["#tenant"]?.[0];
			const document = filter["#document"]?.[0] || "";

			if (!tenant) {
				return Promise.resolve(null);
			}

			const token = generateCollabToken(tenant, document);

			// TODO: Switch to NIP-42 AUTH event kind
			// https://github.com/nostr-protocol/nips/blob/be0a426745252eeb420a38e4896b28059b4f7fa5/42.md
			return Promise.resolve({
				id: "idid",
				pubkey: "pubkey",
				kind: KIND_COLLAB_TOKEN,
				content: JSON.stringify(token),
				created_at: Math.round(new Date().getTime() / 1000),
				tags: [],
				sig: "sig",
			});
		}

		if (filter.kinds?.includes(KIND_COLLAB)) {
			const request = filter["#request"]?.[0];

			if (request) {
				const fluidProtocolEndpoint = this.collabServerEndpoint.replace(
					/(^\w+:|^)\/\//,
					"fluid://",
				);

				try {
					const req: NostrCollabRequest = JSON.parse(request);

					if (isNostrCreateCollabRequest(req)) {
						// Creating and resolving a pointer to a new collab document
						const newDocumentId = req.url ?? "new";

						const resolvedUrl: IFluidResolvedUrl = {
							endpoints: {
								deltaStorageUrl: `${this.collabServerEndpoint}/deltas/tinylicious/${newDocumentId}`,
								ordererUrl: this.collabServerEndpoint,
								storageUrl: `${this.collabServerEndpoint}/repos/tinylicious`,
							},
							id: req.url,
							tokens: {},
							type: "fluid",
							url: `${fluidProtocolEndpoint}/tinylicious/${newDocumentId}`,
						};

						return Promise.resolve({
							id: "idid",
							pubkey: "pubkey",
							kind: KIND_COLLAB,
							content: JSON.stringify(resolvedUrl),
							created_at: Math.round(new Date().getTime() / 1000),
							tags: [],
							sig: "sig",
						});
					}

					if (isNostrLoadCollabRequest(req)) {
						// Resolving a pointer to an existing collab document
						const url = req.url.replace(`${this.collabServerEndpoint}/`, "");
						const documentId = url.split("/")[0];
						const encodedDocId = encodeURIComponent(documentId);
						const documentRelativePath = url.slice(documentId.length);

						const documentUrl = `${fluidProtocolEndpoint}/tinylicious/${encodedDocId}${documentRelativePath}`;
						const deltaStorageUrl = `${this.collabServerEndpoint}/deltas/tinylicious/${encodedDocId}`;
						const storageUrl = `${this.collabServerEndpoint}/repos/tinylicious`;

						const resolvedUrl: IFluidResolvedUrl = {
							endpoints: {
								deltaStorageUrl,
								ordererUrl: this.collabServerEndpoint,
								storageUrl,
							},
							id: documentId,
							tokens: {},
							type: "fluid",
							url: documentUrl,
						};

						return Promise.resolve({
							id: "idid",
							pubkey: "pubkey",
							kind: KIND_COLLAB,
							content: JSON.stringify(resolvedUrl),
							created_at: Math.round(new Date().getTime() / 1000),
							tags: [],
							sig: "sig",
						});
					}

					if (isNostrShareCollabRequest(req)) {
						// Create a shareable path to an existing collab document
						const documentId = decodeURIComponent(
							req.resolvedUrl.url.replace(
								`${fluidProtocolEndpoint}/tinylicious/`,
								"",
							),
						);
						const absoluteUrl = `${documentId}/${req.relativeUrl}`;

						return Promise.resolve({
							id: "idid",
							pubkey: "pubkey",
							kind: KIND_COLLAB,
							content: JSON.stringify(absoluteUrl),
							created_at: Math.round(new Date().getTime() / 1000),
							tags: [],
							sig: "sig",
						});
					}
				} catch (e) {
					return Promise.resolve(null);
				}
			}

			return Promise.resolve(null);
		}

		return Promise.resolve(null);
	}

	public publish(_event: Event): Pub {
		return {
			on: (_type: "ok" | "failed", _cb: any) => {},
			off: (_type: "ok" | "failed", _cb: any) => {},
		};
	}

	public on(_type: "connect" | "disconnect" | "error" | "notice", _cb: any): void {
		return;
	}

	public off(_type: "connect" | "disconnect" | "error" | "notice", _cb: any): void {
		return;
	}
}

const generateCollabToken = (tenantId: string, documentId: string): NostrCollabToken => {
	const now = Math.round(new Date().getTime() / 1000);

	return {
		tenantId,
		documentId,
		scopes: [ScopeType.DocRead, ScopeType.DocWrite, ScopeType.SummaryWrite],
		iat: now,
		exp: now + 60 * 60,
	};
};
