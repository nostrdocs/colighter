import './window_utils';

import {
  getEventHash,
  signEvent,
  nip04,
  Event,
  Relay,
  UnsignedEvent,
} from 'nostr-tools';

export const connectRelays = async (relays: Relay[]): Promise<boolean> => {
  const connections = await Promise.all(
    relays.map(async (relay) => {
      try {
        await relay.connect();
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    })
  );

  return connections.some((c) => c);
};

export const publishNostrPrivateMessage = async (
  message: string,
  senderPrivkey: string | null,
  senderPubkey: string,
  receiverPubkey: string,
  relays: Relay[]
): Promise<PublishOutcome> => {
  let ciphertext;

  if (window.nostr) {
    try {
      ciphertext = await window.nostr.nip04.encrypt(receiverPubkey, message);
    } catch (err: any) {
      const message = `Failed to encrypt message to ${receiverPubkey.slice(
        0,
        5
      )}… with Nostr extension. Try a different extension, or try again later.`;
      return Promise.resolve({ type: 'warning', message });
    }
  } else {
    if (!senderPrivkey) {
      // Could not encrypt message because we don't have a private key
      return Promise.resolve({
        type: 'error',
        message:
          'Missing Nostr private key. We cannot encrypt and send this message',
      });
    }

    ciphertext = await nip04.encrypt(senderPrivkey, receiverPubkey, message);
  }

  const unsignedEvent: UnsignedEvent = {
    kind: 4,
    pubkey: senderPubkey,
    created_at: Math.round(Date.now() / 1000),
    tags: [['p', receiverPubkey]],
    content: ciphertext,
  };

  let event: Event;

  // if we have a private key that means it was generated locally and we don't have a nip07 extension
  if (senderPrivkey) {
    event = {
      ...unsignedEvent,
      id: getEventHash(unsignedEvent),
      sig: signEvent(unsignedEvent, senderPrivkey),
    };
  } else {
    if (window.nostr) {
      try {
        event = await window.nostr.signEvent(unsignedEvent);
      } catch (err: any) {
        console.error(err);
        const message = `Failed to sign request message with Nostr extension. Try a different extension, or try again later.`;
        return Promise.resolve({ type: 'error', message });
      }
    }
  }

  return new Promise((resolve, reject) => {
    const publishTimeout = setTimeout(() => {
      return reject('Timed out when attempting to send request');
    }, 8000);

    relays.forEach((relay) => {
      const pub = relay.publish(event);
      pub.on('ok', () => {
        clearTimeout(publishTimeout);
        return resolve({
          type: 'success',
          message: 'Request sent successfully',
        });
      });
    });
  });
};

// Typed outcome of a nostr api operation
export interface PublishOutcome {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
}
