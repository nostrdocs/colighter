import { Event, UnsignedEvent } from 'nostr-tools';

// TODO: properly define known nip07 NostrWindow api
export interface NostrWindow {
  nip04: any;
  getPublicKey: () => Promise<string>;
  signEvent: (event: UnsignedEvent) => Promise<Event>;
}

export interface NostrUser {
  keypair: PartialKeyPair;
  meta: NostrMetadata;
}

export interface NostrMetadata {
  [key: string]: any;
}

export interface KeyPair {
  privkey: string;
  pubkey: string;
}

export interface PartialKeyPair {
  privkey: string | null;
  pubkey: string;
}

// Forwarded types
export { type Relay } from 'nostr-tools';
