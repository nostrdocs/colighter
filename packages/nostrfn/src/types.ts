export interface NostrUser {
  pubkey: string;
  meta: NostrUserMetadata;
}

export interface NostrUserMetadata {
  [pubkey: string]: string;
}

export { type Relay } from "nostr-tools";
