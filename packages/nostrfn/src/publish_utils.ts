import {
  getEventHash,
  signEvent,
  nip04,
  Event,
  Relay,
  UnsignedEvent,
  Kind,
} from 'nostr-tools';

export const browserSignDirectMessage = async (
  message: string,
  senderPubkey: string,
  receiverPubkey: string
): Promise<Event> => {
  if (!window.nostr) {
    const message = 'Nostr extension not found.';
    return Promise.reject({ type: 'warning', message });
  }

  try {
    const ciphertext = await window.nostr.nip04
      .encrypt(receiverPubkey, message)
      .catch((err: unknown) => {
        console.error(err);
        const message = `Failed to encrypt a message to ${receiverPubkey.slice(
          0,
          5
        )}… with Nostr extension`;
        return Promise.reject({ type: 'warning', message });
      });

    const unsignedEvent: UnsignedEvent = {
      kind: Kind.EncryptedDirectMessage,
      pubkey: senderPubkey,
      created_at: Math.round(Date.now() / 1000),
      tags: [['p', receiverPubkey]],
      content: ciphertext,
    };

    const event: Event = await window.nostr.signEvent(unsignedEvent);

    return Promise.resolve(event);
  } catch (err: any) {
    console.error(err);
    const message = 'Failed to sign message with Nostr extension';
    return Promise.reject({ type: 'error', message });
  }
};

export const signDirectMessage = async (
  message: string,
  senderPrivkey: string,
  senderPubkey: string,
  receiverPubkey: string
): Promise<Event> => {
  try {
    const ciphertext = await nip04
      .encrypt(senderPrivkey, receiverPubkey, message)
      .catch((err: unknown) => {
        console.error(err);
        const message = `Failed to encrypt a message to ${receiverPubkey.slice(
          0,
          5
        )}…`;
        return Promise.reject({ type: 'warning', message });
      });

    const unsignedEvent: UnsignedEvent = {
      kind: Kind.EncryptedDirectMessage,
      pubkey: senderPubkey,
      created_at: Math.round(Date.now() / 1000),
      tags: [['p', receiverPubkey]],
      content: ciphertext,
    };

    const event: Event = {
      ...unsignedEvent,
      id: getEventHash(unsignedEvent),
      sig: signEvent(unsignedEvent, senderPrivkey),
    };

    return Promise.resolve(event);
  } catch (err: any) {
    console.error(err);
    const message = 'Failed to sign direct message';
    return Promise.reject({ type: 'error', message });
  }
};

export const publishEvent = async (
  relays: Relay[],
  event: Event
): Promise<PublishOutcome> => {
  return new Promise((resolve, reject) => {
    const publishTimeout = setTimeout(() => {
      return reject('Timed out when attempting to publish event');
    }, 8000);

    relays.forEach((relay) => {
      const pub = relay.publish(event);
      pub.on('ok', () => {
        clearTimeout(publishTimeout);
        return resolve({
          type: 'success',
          message: 'Event published successfully',
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
