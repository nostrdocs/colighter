import { generatePrivateKey, getPublicKey } from "nostr-tools";
import { KeyPair, NostrUser } from "./types";

import "./window_utils";

/**
 * Source Nostr key pair from nip07 nostr extension, or localStorage or generate a new one
 * @returns {Promise<KeyPair | null>}
 */
export const sourceNostrKeyPair = async (): Promise<KeyPair | null> => {
  // check if they have a nip07 nostr extension from the window object
  if (window.nostr) {
    try {
      // and if it has a key stored on it
      const pubkey = await window.nostr.getPublicKey();
      return Promise.resolve({ privkey: null, pubkey });
    } catch (err) {
      return Promise.resolve(null);
    }
  } else {
    // otherwise use a key from localStorage or generate a new one
    let privkey = localStorage.getItem("nostrkey");

    if (!privkey || privkey.match(/^[a-f0-9]{64}$/)) {
      privkey = generatePrivateKey();
      localStorage.setItem("nostrkey", privkey);
    }
    const pubkey = getPublicKey(privkey);

    return Promise.resolve({ privkey, pubkey });
  }
};

export const getNostrUser = async (): Promise<NostrUser> => {
  // TODO: Load nostr identity from extension or other means
  const mockNostrUser: NostrUser = {
    pubkey: "0x1234",
    meta: {},
  };

  return mockNostrUser;
};
