import { generatePrivateKey, getPublicKey } from 'nostr-tools';
import browser from 'webextension-polyfill';

export const tryReadLocalStorage = async <T>(
  key: string
): Promise<T | undefined> => {
  const storage = await browser.storage.local.get();
  return storage[key];
};

export const tryWriteLocalStorage = async <T>(key: string, value: T) => {
  await browser.storage.local.set({ [key]: value });
};

enum Storagekeys {
  NostrId = 'ColighterNostrId',
  Relays = 'ColighterRelays',
}

export class Settings {
  crateNewNostrIdentity = async () => {
    const privkey = generatePrivateKey();
    const pubkey = getPublicKey(privkey);

    await tryWriteLocalStorage(Storagekeys.NostrId, { privkey, pubkey });
    return { privkey, pubkey };
  };

  getNostrIdentity = async () => {
    const nostrKeys = await tryReadLocalStorage<{
      privkey: string;
      pubkey: string;
    }>(Storagekeys.NostrId);

    if (nostrKeys) {
      return nostrKeys;
    } else {
      return this.crateNewNostrIdentity();
    }
  };

  saveNostrIdentity = async (nostrId: { privkey: string; pubkey: string }) => {
    await tryWriteLocalStorage(Storagekeys.NostrId, nostrId);
  };

  getRelays = async () => {
    const relays = await tryReadLocalStorage<string[]>(Storagekeys.Relays);

    if (relays) {
      return relays;
    } else {
      // Default relays
      return [
        'wss://relay.nostrdocs.com',
        'wss://relay.f7z.io',
        'wss://nos.lol',
        'wss://relay.damus.io',
        'wss://relay.snort.social',
      ];
    }
  };

  saveRelays = async (relays: string[]) => {
    await tryWriteLocalStorage(Storagekeys.Relays, relays);
  };
}
