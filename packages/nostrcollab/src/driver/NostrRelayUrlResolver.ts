import { IRequest } from "@fluidframework/core-interfaces";
import {
  IFluidResolvedUrl,
  IResolvedUrl,
  IUrlResolver,
} from "@fluidframework/driver-definitions";
import { CollabRelay, CollabHeader, CollabRequest, COLLAB_FILTER } from "../types";
import { mapFluidRequestToNostrCollab } from "./utils";

/** NostrRelayUrlResolver relies on its relay to resolve collab urls */
export class NostrRelayUrlResolver implements IUrlResolver {
  public constructor(
    // The host should provide a pre-connected Nostr collab relay
    private readonly collabRelay: CollabRelay
  ) { }

  public async resolve(request: IRequest): Promise<IResolvedUrl> {
    const noReq = mapFluidRequestToNostrCollab(request);

    let event = await this.collabRelay.get({
      [COLLAB_FILTER]: [JSON.stringify(noReq)],
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
    let request: CollabRequest = {
      header: {
        [CollabHeader.Share]: true,
      },
      resolvedUrl,
      relativeUrl,
    };

    let event = await this.collabRelay.get({
      [COLLAB_FILTER]: [JSON.stringify(request)],
    });

    if (event) {
      event.content;
    }

    return Promise.reject("Failed to source collab experience from relay");
  }
}
