import { ITokenClaims } from "@fluidframework/protocol-definitions";
import {
  ITokenProvider,
  ITokenResponse,
} from "@fluidframework/routerlicious-driver";
import { KJUR as jsrsasign } from "jsrsasign";
import { NostrUser } from "nostrfn";
import { CollabRelay, CollabToken } from "../types";

/** Produces authentication tokens for accessing collab docs served by a relay */
export class NostrRelayTokenProvider implements ITokenProvider {
  public constructor(
    // The client should provide a pre-connected Nostr collab relay
    private readonly relay: CollabRelay,
    // The client should provide a user identity
    private readonly nostrUser: NostrUser
  ) { }

  public async fetchOrdererToken(
    tenantId: string,
    documentId?: string
  ): Promise<ITokenResponse> {
    return {
      fromCache: true,
      jwt: await this.getSignedToken(tenantId, documentId),
    };
  }

  public async fetchStorageToken(
    tenantId: string,
    documentId: string
  ): Promise<ITokenResponse> {
    return {
      fromCache: true,
      jwt: await this.getSignedToken(tenantId, documentId),
    };
  }

  // TODO: Move token signing into the collab relay.
  // Clients should simply fetch and use tokens if authorized
  private async getSignedToken(
    tenantId: string,
    documentId: string | undefined,
    ver: string = "1.0"
  ): Promise<string> {
    const collab = await this.fetchCollabToken(tenantId, documentId);
    const user = {
      id: this.nostrUser.pubkey,
      name: this.nostrUser.meta["name"] || "",
    };

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
      utf8Key
    );
  }

  private async fetchCollabToken(
    tenantId: string,
    documentId?: string
  ): Promise<CollabToken> {
    return this.relay.getAuthToken({
      tenantId,
      documentId
    });
  }
}
