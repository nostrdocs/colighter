import {
  IContainer,
  IHostLoader,
  ICodeDetailsLoader,
  IFluidCodeDetails,
  IFluidModuleWithDetails,
  IRuntimeFactory,
} from "@fluidframework/container-definitions";
import { ILoaderProps, Loader } from "@fluidframework/container-loader";
import type { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
import type { IRequest, IResponse } from "@fluidframework/core-interfaces";
import { ensureFluidResolvedUrl } from "@fluidframework/driver-utils";
import {
  create404Response,
  requestFluidObject,
} from "@fluidframework/runtime-utils";
import { IDetachedNostrCollab, NostrCollabMakerCallback } from "./interfaces";

const nostrCollabUrl = "nostrcollab";

interface IModelRequest extends IRequest {
  url: typeof nostrCollabUrl;
  headers: {
    containerRef: IContainer;
  };
}

const isNostrCollabRequest = (request: IRequest): request is IModelRequest =>
  request.url === nostrCollabUrl && request.headers?.containerRef !== undefined;

/**
 * A helper function for container authors, which generates the request handler they need to align with the
 * ModelLoader contract.
 * @param NostrCollabMakerCallback - A callback that will produce the model for the container
 * @returns A request handler that can be provided to the container runtime factory
 */
export const makeNostrCollabRequestHandler = <NostrCollab>(
  NostrCollabMakerCallback: NostrCollabMakerCallback<NostrCollab>
) => {
  return async (
    request: IRequest,
    runtime: IContainerRuntime
  ): Promise<IResponse> => {
    // The model request format is for an empty path (i.e. "") and passing a reference to the container in the
    // header as containerRef.
    if (isNostrCollabRequest(request)) {
      const container: IContainer = request.headers.containerRef;
      const model = await NostrCollabMakerCallback(runtime, container);
      return { status: 200, mimeType: "fluid/object", value: model };
    }
    return create404Response(request);
  };
};

export interface INostrCollabLoader<NostrCollab> {
  /**
   * Check if the INostrCollabLoader knows how to instantiate an appropriate model for the provided container code version.
   * It is async to permit dynamic model loading - e.g. referring to a remote service to determine if the requested
   * model is available.
   * @param version - the container code version to check
   */
  supportsVersion(version: string): Promise<boolean>;

  /**
   * Create a detached model using the specified version of container code.
   * Returns an object containing the detached model plus an attach callback.  When invoked, the attach callback
   * returns a promise that will resolve after attach has completed with the id of the container.
   * @param version - the container code version to create a model for
   */
  createDetached(version: string): Promise<IDetachedNostrCollab<NostrCollab>>;

  /**
   * Load a nostr collab object for the container with the given id.
   * @param id - the id of the container to load
   */
  loadExisting(id: string): Promise<NostrCollab>;
}

export class NostrCollabLoader<NostrCollab>
  implements INostrCollabLoader<NostrCollab>
{
  private readonly loader: IHostLoader;
  private readonly generateCreateNewRequest: () => IRequest;

  public constructor(
    props: Pick<
      ILoaderProps,
      "urlResolver" | "documentServiceFactory" | "codeLoader"
    > & {
      generateCreateNewRequest: () => IRequest;
    }
  ) {
    this.loader = new Loader({
      urlResolver: props.urlResolver,
      documentServiceFactory: props.documentServiceFactory,
      codeLoader: props.codeLoader,
    });
    this.generateCreateNewRequest = props.generateCreateNewRequest;
  }

  public async supportsVersion(version: string): Promise<boolean> {
    // TODO: Build a version support check into the loader
    return true;
  }

  private async getCollabFromContainer(container: IContainer) {
    const request: IModelRequest = {
      url: nostrCollabUrl,
      headers: { containerRef: container },
    };
    return requestFluidObject<NostrCollab>(container, request);
  }

  public async createDetached(
    version: string
  ): Promise<IDetachedNostrCollab<NostrCollab>> {
    const container = await this.loader.createDetachedContainer({
      package: version,
    });
    const collab = await this.getCollabFromContainer(container);

    // The attach callback lets us defer the attach so the caller can do whatever initialization pre-attach,
    // without leaking out the loader, service, etc.  We also return the container ID here so we don't have
    // to stamp it on something that would rather not know it (e.g. the model).
    const attach = async () => {
      await container.attach(this.generateCreateNewRequest());
      const resolved = container.resolvedUrl;
      ensureFluidResolvedUrl(resolved);
      return resolved.id;
    };
    return { collab, attach };
  }

  public async loadExisting(id: string): Promise<NostrCollab> {
    const container = await this.loader.resolve({
      url: id,
      headers: {
        loadMode: {
          // Here we use "all" to ensure we are caught up before returning.  This is particularly important
          // for direct-link scenarios, where the user might have a direct link to a data object that was
          // just attached (i.e. the "attach" op and the "set" of the handle into some map is in the
          // trailing ops).  If we don't fully process those ops, the expected object won't be found.
          opsBeforeReturn: "all",
        },
      },
    });
    return this.getCollabFromContainer(container);
  }
}

export class StaticCodeLoader implements ICodeDetailsLoader {
  public constructor(private readonly runtimeFactory: IRuntimeFactory) {}

  public async load(
    details: IFluidCodeDetails
  ): Promise<IFluidModuleWithDetails> {
    return {
      module: { fluidExport: this.runtimeFactory },
      details,
    };
  }
}
