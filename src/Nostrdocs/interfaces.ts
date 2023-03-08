import type { IContainer } from "@fluidframework/container-definitions";
import type { IContainerRuntime } from "@fluidframework/container-runtime-definitions";

/**
 * A NostrCollab experience that is not connected to a live collab relay service.
 * Useful for step-wise load/pre-load before attaching to live collab.
 */
export interface IDetachedNostrCollab<NostrCollab> {
	/**
	 * The newly created, detached nostr collab object.
	 */
	collab: NostrCollab;

	/**
	 * A function that will attach the nostr collab object to a live collab relay service.
	 * This allows us to start off nostr c
	 * @returns a Promise that will resolve after attach completes with the container ID of the newly attached
	 * container.
	 */
	attach: () => Promise<string>;
}

export type NostrCollabMakerCallback<NostrCollab> = (
	runtime: IContainerRuntime,
	container: IContainer,
) => Promise<NostrCollab>;
