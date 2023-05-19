import { Event, UnsignedEvent } from 'nostr-tools';

// TODO: properly define known nip07 Nostr api
export interface Nostr {
  nip04: any;
  getPublicKey: () => Promise<string>;
  signEvent: (event: UnsignedEvent) => Promise<Event>;
}

export interface NostrUser {
  pubkey: string;
  meta: NostrMetadata;
}

export interface NostrMetadata {
  [key: string]: any;
}

export interface KeyPair {
  privkey: string | null;
  pubkey: string;
}

// Forwarded types
export { type Relay } from 'nostr-tools';
