import {
  nip04,
  getSignature,
  generatePrivateKey,
  getPublicKey,
} from 'nostr-tools';

class NostrProvider {
  private privkey: string;
  private pubkey: string;

  constructor() {
    // TODO: Persist keys safely
    // TODO: Let user configure a key from some UI, like settings page
    this.privkey = generatePrivateKey();
    this.pubkey = getPublicKey(this.privkey);
  }

  // nip07.getPublicKey
  public async getPublicKey() {
    if (this.pubkey) return this.pubkey;

    // TODO: Show some error message to user. Prompt them to configure NipO7 parts of extension
  }

  // nip07.signEvent
  public async signEvent(event) {
    return getSignature(event, this.privkey);
  }

  // nip07.getRelays
  public async getRelays(): Promise<string[]> {
    // TODO: Return user configured relays
    // TODO: Let user configure relays from some UI, like settings page
    return Promise.resolve([
      'wss://relay.nostrdocs.com',
      'wss://relay.f7z.io',
      'wss://nos.lol',
    ]);
  }

  // nip04.encrypt
  async encrypt(peer, plaintext) {
    return nip04.encrypt(this.privkey, peer, plaintext);
  }

  // nip04.decrypt
  async decrypt(peer, ciphertext) {
    return nip04.decrypt(this.privkey, peer, ciphertext);
  }

  public nip04 = {
    encrypt: this.encrypt,
    decrypt: this.decrypt,
  };
}

window.nostr = new NostrProvider() as any;
