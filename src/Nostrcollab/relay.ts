import { ScopeType } from "@fluidframework/protocol-definitions";
import { Event, Filter, Pub, Sub, SubscriptionOptions } from "nostr-tools";
import { NostrCollabToken, KIND_COLLAB_TOKEN } from "./driver";

export class MockCollabRelay {
	constructor(public readonly url: string, public status: number) {}

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

	public list(filters: Filter[], _opts?: SubscriptionOptions | undefined): Promise<Event[]> {
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
