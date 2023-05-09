import { IRequest } from "@fluidframework/core-interfaces";
import {
  IFluidResolvedUrl,
  IResolvedUrl,
  IUrlResolver,
} from "@fluidframework/driver-definitions";
import { Relay } from "nostrfn";
import { NostrCollabHeader, NostrCollabRequest } from "./types";
import { mapFluidRequestToNostrCollab } from "./utils";
import { KIND_COLLAB } from "./constants";

/** NostrRelayUrlResolver relies on its relay to resolve collab urls */
export class NostrRelayUrlResolver implements IUrlResolver {
  public constructor(
    // The host should provide a pre-connected Nostr collab relay
    private readonly collabRelay: Relay
  ) {}

  public async resolve(request: IRequest): Promise<IResolvedUrl> {
    const noReq = mapFluidRequestToNostrCollab(request);

    let event = await this.collabRelay.get({
      kinds: [KIND_COLLAB],
      "#request": [JSON.stringify(noReq)],
    });

    if (event) {
      try {
        const collab: IFluidResolvedUrl = JSON.parse(event.content);
        return Promise.resolve(collab);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject("Failed to source collab experience from relay");
  }

  public async getAbsoluteUrl(
    resolvedUrl: IFluidResolvedUrl,
    relativeUrl: string
  ): Promise<string> {
    let request: NostrCollabRequest = {
      header: {
        [NostrCollabHeader.Share]: true,
      },
      resolvedUrl,
      relativeUrl,
    };

    let event = await this.collabRelay.get({
      kinds: [KIND_COLLAB],
      "#request": [JSON.stringify(request)],
    });

    if (event) {
      event.content;
    }

    return Promise.reject("Failed to source collab experience from relay");
  }
}
