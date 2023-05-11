import {
  IContainer,
  IContainerContext,
  IRuntime,
  IRuntimeFactory,
} from "@fluidframework/container-definitions";
import {
  IContainerRuntimeOptions,
  ContainerRuntime,
} from "@fluidframework/container-runtime";
import { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
import { NamedFluidDataStoreRegistryEntries } from "@fluidframework/runtime-definitions";
import { makeNostrCollabRequestHandler } from "./loader";

export { type IContainer, IRuntimeFactory, type IContainerRuntime };
export { requestFluidObject } from "@fluidframework/runtime-utils";

/**
 * NostrContainerRuntimeFactory is an abstract container class for building NostrCollab container experiences.
 */
export abstract class NostrContainerRuntimeFactory<NostrCollab>
  implements IRuntimeFactory {
  public get IRuntimeFactory() {
    return this;
  }

  /**
   * @param registryEntries - The data store registry for containers produced
   * @param runtimeOptions - The runtime options passed to the ContainerRuntime when instantiating it
   */
  constructor(
    private readonly registryEntries: NamedFluidDataStoreRegistryEntries,
    private readonly runtimeOptions?: IContainerRuntimeOptions
  ) { }

  public async instantiateRuntime(
    context: IContainerContext,
    existing: boolean
  ): Promise<IRuntime> {
    const fromExisting = existing ?? context.existing ?? false;
    const runtime = await ContainerRuntime.load(
      context,
      this.registryEntries,
      makeNostrCollabRequestHandler(this.createNostrCollab.bind(this)),
      this.runtimeOptions,
      undefined, // scope
      existing
    );

    if (!fromExisting) {
      await this.containerInitializingFirstTime(runtime);
    }
    await this.containerHasInitialized(runtime);

    return runtime;
  }

  /**
   * Subclasses must implement createNostrCollab, which should build a NostrCollab given the runtime and container.
   * @param runtime - The container runtime for the container being initialized
   * @param container - The container being initialized
   */
  protected abstract createNostrCollab(
    runtime: IContainerRuntime,
    container: IContainer
  ): Promise<NostrCollab>;

  /**
   * Subclasses may override containerInitializingFirstTime to perform any setup steps at the time the container
   * is created. This likely includes creating any initial data stores that are expected to be there at the outset.
   * @param runtime - The container runtime for the container being initialized
   */
  protected async containerInitializingFirstTime(
    runtime: IContainerRuntime
  ): Promise<void> { }

  /**
   * Subclasses may override containerHasInitialized to perform any steps after the container has initialized.
   * This likely includes loading any data stores that are expected to be there at the outset.
   * @param runtime - The container runtime for the container being initialized
   */
  protected async containerHasInitialized(
    runtime: IContainerRuntime
  ): Promise<void> { }
}
