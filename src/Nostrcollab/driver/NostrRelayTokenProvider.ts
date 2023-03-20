import { ScopeType, ITokenClaims } from "@fluidframework/protocol-definitions";
import { ITokenProvider, ITokenResponse } from "@fluidframework/routerlicious-driver";
import { KJUR as jsrsasign } from "jsrsasign";
import { Relay } from "nostr-tools";
import { NostrUser } from "../../Common/Types";
import { KIND_COLLAB_TOKEN } from "./constants";

/** Produces authentication tokens for accessing collab docs served by a relay */
export class NostrRelayTokenProvider implements ITokenProvider {
	public constructor(
		// The host should provide a pre-connected Nostr collab relay
		private readonly collabRelay: Relay,
		// The host should provide a user identity. Possibbly sourced from other relays?
		private readonly nostrUser: NostrUser,
	) {}

	public async fetchOrdererToken(tenantId: string, documentId?: string): Promise<ITokenResponse> {
		return {
			fromCache: true,
			jwt: await this.getSignedToken(tenantId, documentId),
		};
	}

	public async fetchStorageToken(tenantId: string, documentId: string): Promise<ITokenResponse> {
		return {
			fromCache: true,
			jwt: await this.getSignedToken(tenantId, documentId),
		};
	}

	private async getSignedToken(
		tenantId: string,
		documentId: string | undefined,
		ver: string = "1.0",
	): Promise<string> {
		const collab = await this.fetchNostrCollabToken(tenantId, documentId);
		const user = { id: this.nostrUser.pubkey, name: this.nostrUser.meta["name"] || "" };

		const claims: ITokenClaims = {
			...collab,
			user,
			ver,
		};

		const utf8Key = { utf8: "12345" };
		return jsrsasign.jws.JWS.sign(
			null,
			JSON.stringify({ alg: "HS256", typ: "JWT" }),
			claims,
			utf8Key,
		);
	}

	private async fetchNostrCollabToken(
		tenantId: string,
		documentId?: string,
	): Promise<NostrCollabToken> {
		const tenantFilter = tenantId ? [tenantId] : [];
		const docFilter = documentId ? [documentId] : [];

		let event = await this.collabRelay.get({
			"kinds": [KIND_COLLAB_TOKEN],
			"#tenant": tenantFilter,
			"#document": docFilter,
		});

		if (event) {
			try {
				let collab: NostrCollabToken = {
					...JSON.parse(event.content),
					created_at: event.created_at,
				};
				return collab;
			} catch (err) {
				return Promise.reject(err);
			}
		}

		return Promise.reject("No collab token found");
	}
}

export interface NostrCollabToken {
	tenantId: string;
	documentId: string;
	scopes: ScopeType[];
	iat: number;
	exp: number;
}
