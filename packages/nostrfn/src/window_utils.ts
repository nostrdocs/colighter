import { NostrWindow } from './types';

// Reflect nostr api on the global window object
declare global {
  interface Window {
    nostr: NostrWindow | undefined;
  }
}
