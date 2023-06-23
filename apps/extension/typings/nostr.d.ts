declare interface Window {
  nostr: Nostr;
  browser: any;
}

type Nostr = {
  trackEvent(
    signedEvent: import('nostr-tools').EventTemplate & { pubkey: string } & {
      id: string;
      sig: string;
    } & { id: string } & { sig: string }
  ): unknown;
  getPublicKey(): Promise<string>;
  signEvent(event: import('nostr-tools').EventTemplate): Promise<string>;
  getRelays(): Promise<string[]>;
  nip04: {
    encrypt(peer: string, plaintext: string): Promise<string>;
    decrypt(peer: string, ciphertext: string): Promise<string>;
  };
};
