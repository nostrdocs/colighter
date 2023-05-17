import { ScopeType } from "@fluidframework/protocol-definitions";
import { IFluidResolvedUrl } from "@fluidframework/driver-definitions";
import {
  CountPayload,
  Event,
  Filter,
  Kind,
  Pub,
  Relay,
  Sub,
  SubscriptionOptions,
} from "nostr-tools";
import {
  isNostrCreateCollabRequest,
  isNostrLoadCollabRequest,
  isNostrShareCollabRequest,
} from "./driver";
import {
  CollabToken,
  CollabRequest,
  COLLAB_FILTER,
  CollabTokenKey
} from './types';

// TODO: Use definition from #nostr-tools
type SubEvent = {
  event: (event: Event) => void | Promise<void>;
  count: (payload: CountPayload) => void | Promise<void>;
  eose: () => void | Promise<void>;
};

type RelayEvent = {
  connect: () => void | Promise<void>;
  disconnect: () => void | Promise<void>;
  error: () => void | Promise<void>;
  notice: (msg: string) => void | Promise<void>;
  auth: (challenge: string) => void | Promise<void>;
};

const DEFAULT_PUBLIC_TENANT = "public-tenant";
const DEFAULT_DOCID_WILDCARD = "*";

export class CollabRelayClient implements Relay {
  private authToken?: CollabToken;

  constructor(
    public readonly url: string,
    public status: number,
    private readonly collabServerEndpoint: string = "http://localhost:7070"
  ) { }

  public connect(): Promise<void> {
    // TODO: Establish websocket connection with relay
    return Promise.resolve();
  }

  public close(): void {
    return;
  }

  public getAuthToken(
    tokenKey?: CollabTokenKey
  ): Promise<CollabToken> {
    if (this.authToken) {
      return Promise.resolve(this.authToken);
    }

    const tenantId = tokenKey?.tenantId || DEFAULT_PUBLIC_TENANT;
    const documentId = tokenKey?.documentId || DEFAULT_DOCID_WILDCARD;

    const token = generateCollabToken(tenantId, documentId);

    // TODO: Support caching of multiple tokens.
    // Cache could be a map of tenants and token pairs
    this.authToken = token;

    return Promise.resolve(token);
  }

  public auth(_event: Event): Pub {
    return {
      on: (_type: "ok" | "failed", _cb: any) => { },
      off: (_type: "ok" | "failed", _cb: any) => { },
    };
  }

  public get(
    filter: Filter,
    _opts?: SubscriptionOptions | undefined
  ): Promise<Event | null> {
    const request = filter[COLLAB_FILTER]?.[0];
    if (request) {

      try {
        const req: CollabRequest = JSON.parse(request);

        const fluidProtocolEndpoint = this.collabServerEndpoint.replace(
          /(^\w+:|^)\/\//,
          "fluid://"
        );

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
            kind: Kind.Text,
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
            kind: Kind.Text,
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
              ""
            )
          );
          const absoluteUrl = `${documentId}/${req.relativeUrl}`;

          return Promise.resolve({
            id: "idid",
            pubkey: "pubkey",
            kind: Kind.Text,
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

  public publish(_event: Event): Pub {
    return {
      on: (_type: "ok" | "failed", _cb: any) => { },
      off: (_type: "ok" | "failed", _cb: any) => { },
    };
  }

  public sub(_filters: Filter[], _opts?: SubscriptionOptions): Sub {
    return {
      sub: (filters: Filter[], opts: SubscriptionOptions) =>
        this.sub(filters, opts),
      unsub: () => { },
      on: <T extends keyof SubEvent, U extends SubEvent[T]>(
        _event: T,
        _listener: U
      ) => { },
      off: <T extends keyof SubEvent, U extends SubEvent[T]>(
        _event: T,
        _listener: U
      ) => { },
    };
  }

  public list(
    _filters: Filter[],
    _opts?: SubscriptionOptions | undefined
  ): Promise<Event[]> {
    return Promise.resolve([]);
  }

  public count(
    _filters: Filter[],
    _opts?: SubscriptionOptions | undefined
  ): Promise<CountPayload | null> {
    return Promise.resolve(null);
  }

  public on<T extends keyof RelayEvent, U extends RelayEvent[T]>(
    _type: T,
    _cb: U
  ): void {
    return;
  }

  public off<T extends keyof RelayEvent, U extends RelayEvent[T]>(
    _type: T,
    _cb: U
  ): void {
    return;
  }
}

const generateCollabToken = (
  tenantId: string,
  documentId: string
): CollabToken => {
  const now = Math.round(new Date().getTime() / 1000);

  return {
    tenantId,
    documentId,
    scopes: [ScopeType.DocRead, ScopeType.DocWrite, ScopeType.SummaryWrite],
    iat: now,
    exp: now + 60 * 60,
  };
};
