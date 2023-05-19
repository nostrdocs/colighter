import type { IContainer } from '@fluidframework/container-definitions';
import type { IContainerRuntime } from '@fluidframework/container-runtime-definitions';
import { IFluidResolvedUrl } from '@fluidframework/driver-definitions';
import { ScopeType } from '@fluidframework/protocol-definitions';

import { Relay } from 'nostr-tools';

export interface CollabRequest {
  header: CollabRequestHeader;
  [index: string]: any;
}

export type CollabRequestHeader = {
  [index in CollabHeader]?: any;
};

export enum CollabHeader {
  // Creating and resolving a pointer to a new collab document
  Create = 'createCollab',
  // Resolving a pointer to an existing collab document
  Load = 'loadCollab',
  // Create a shareable link to an existing collab document
  Share = 'shareCollab',
}

export interface CreateCollabRequest extends CollabRequest {
  header: {
    [CollabHeader.Create]: true;
  };
  url: string;
}

export interface LoadCollabRequest extends CollabRequest {
  header: {
    [CollabHeader.Load]: true;
  };
  url: string;
}

export interface ShareCollabRequest extends CollabRequest {
  header: {
    [CollabHeader.Share]: true;
  };
  resolvedUrl: IFluidResolvedUrl;
  relativeUrl: string;
}

export interface CollabRelay extends Relay {
  getAuthToken: (tokenKey?: CollabTokenKey) => Promise<CollabToken>;
}

/**
 * Authenticated token for accessing a collab doc
 * hosted on a relay
 */
export interface CollabToken {
  tenantId: string;
  documentId: string;
  scopes: ScopeType[];
  iat: number;
  exp: number;
}

export interface CollabTokenKey {
  tenantId?: string;
  documentId?: string;
}

export const COLLAB_FILTER = '#collab';

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
  container: IContainer
) => Promise<NostrCollab>;
