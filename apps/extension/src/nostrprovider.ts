import { nip04, getSignature } from 'nostr-tools';
import { Settings } from './utils/Storage';

class NostrProvider {
  constructor(private readonly settings = new Settings()) {}

  // nip07.getPublicKey
  public async getPublicKey() {
    const { pubkey } = await this.settings.getNostrIdentity();
    return pubkey;
  }

  // nip07.signEvent
  public async signEvent(event) {
    const { privkey } = await this.settings.getNostrIdentity();
    event.sig = getSignature(event, privkey);
    return event;
  }

  // nip07.getRelays
  public async getRelays() {
    return this.settings.getRelays();
  }

  // nip04.encrypt
  async encrypt(peer, plaintext) {
    const { privkey } = await this.settings.getNostrIdentity();
    return nip04.encrypt(privkey, peer, plaintext);
  }

  // nip04.decrypt
  async decrypt(peer, ciphertext) {
    const { privkey } = await this.settings.getNostrIdentity();
    return nip04.decrypt(privkey, peer, ciphertext);
  }

  public nip04 = {
    encrypt: this.encrypt,
    decrypt: this.decrypt,
  };
}

window.nostr = new NostrProvider() as any;
