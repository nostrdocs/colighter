import { generatePrivateKey, getPublicKey } from 'nostr-tools';
import { KeyPair, PartialKeyPair } from './types';

const STORAGE_PRIVKEY = 'nostrprivkey';

/**
 * Source Nostr key pair from nip07 nostr extension or localStorage or generate a new one
 * @returns {Promise<PartialKeyPair | null>}
 */
export const browserSourceNostrId =
  async (): Promise<PartialKeyPair | null> => {
    // Adds typing to the window object
    await import('./window_utils');

    // check if they have a nip07 nostr extension from the window object
    if (window?.nostr) {
      try {
        // and if it has a key stored on it
        const pubkey = await window.nostr.getPublicKey();
        return Promise.resolve({ privkey: null, pubkey });
      } catch (err) {
        return Promise.resolve(null);
      }
    } else {
      // otherwise use a key from localStorage or generate a new one
      let privkey = localStorage.getItem(STORAGE_PRIVKEY);

      if (!privkey || privkey.match(/^[a-f0-9]{64}$/)) {
        let { privkey, pubkey } = createEphemeralNostrId();

        localStorage.setItem(STORAGE_PRIVKEY, privkey);
        return Promise.resolve({ privkey, pubkey });
      }

      const pubkey = getPublicKey(privkey);
      return Promise.resolve({ privkey, pubkey });
    }
  };

/**
 * Creates a new ephemeral Nostr key pair
 * Be sure to store the private key somewhere safe in case you want persistent identity
 * @returns {Promise<KeyPair>}
 */
export const createEphemeralNostrId = (): KeyPair => {
  const privkey = generatePrivateKey();
  const pubkey = getPublicKey(privkey);

  return { privkey, pubkey };
};
