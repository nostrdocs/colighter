import { requestFluidObject } from "@fluidframework/runtime-utils";
import { IContainer } from "@fluidframework/container-definitions";
import { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
import { NostrContainerRuntimeFactory } from "nostrcollab";
import { IHighlightCollection, IHighlightCollectionAppModel } from "./types";
import { HighlightCollectionInstantiationFactory } from "./model";

const highlightCollectionId = "highlightCollection";

/** HighlightContainerAppModel defines Fluid collab data stores for highlight collections */
export class HighlightContainerAppModel
  implements IHighlightCollectionAppModel
{
  public constructor(
    public readonly highlightCollection: IHighlightCollection
  ) {}
}

export class HighlightContainerRuntimeFactory extends NostrContainerRuntimeFactory<HighlightContainerAppModel> {
  public constructor() {
    super(new Map([HighlightCollectionInstantiationFactory.registryEntry]));
  }

  protected async createNostrCollab(
    runtime: IContainerRuntime,
    _container: IContainer
  ): Promise<IHighlightCollectionAppModel> {
    const highlightCollection = await requestFluidObject<IHighlightCollection>(
      await runtime.getRootDataStore(highlightCollectionId),
      ""
    );

    return new HighlightContainerAppModel(highlightCollection);
  }

  protected async containerInitializingFirstTime(runtime: IContainerRuntime) {
    const dataStore = await runtime.createDataStore(
      HighlightCollectionInstantiationFactory.type
    );

    await dataStore.trySetAlias(highlightCollectionId);
  }
}
