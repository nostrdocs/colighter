import { nip05, nip19, Event } from 'nostr-tools';
import { NostrMetadata, Relay } from './types';

export const fetchNostrUserMetadata = async (
  pubkey: string,
  relays: Relay[],
  current: NostrMetadata
): Promise<NostrMetadata> => {
  let done = 0;

  let metadata = current;

  relays.forEach((relay) => {
    const sub = relay.sub([{ kinds: [0], authors: [pubkey] }]);
    done++;

    sub.on('event', (event: Event) => {
      try {
        if (
          !metadata[pubkey] ||
          metadata[pubkey].created_at < event.created_at
        ) {
          metadata = {
            ...metadata,
            [pubkey]: {
              ...JSON.parse(event.content),
              created_at: event.created_at,
            },
          };
        }
      } catch (err) {
        console.error(err);
      }
    });

    sub.on('eose', () => {
      sub.unsub();
      done--;

      if (done === 0) {
        metadata = fetchNIP05(metadata, pubkey);
      }
    });
  });

  return Promise.resolve(metadata);
};

export const fetchNIP05 = (
  metadata: NostrMetadata,
  pubkey: string
): NostrMetadata => {
  const meta = metadata[pubkey];

  if (meta && meta.nip05) {
    nip05.queryProfile(meta.nip05).then((name) => {
      if (name === meta.nip05) {
        return {
          ...metadata,
          [pubkey]: { ...meta, nip05verified: true },
        };
      }
    });
  }

  return metadata;
};

export const getNostrImage = (metadata: NostrMetadata, pubkey: string) => {
  const picture = metadata[pubkey]['picture'];

  if (picture && picture.length) {
    return picture;
  }
  return null;
};

export const getNostrName = (metadata: NostrMetadata, pubkey: string) => {
  const meta = metadata[pubkey];

  if (meta) {
    if (meta.nip05 && meta.nip05verified) {
      if (meta.nip05.startsWith('_@')) {
        return meta.nip05.slice(2);
      }
      return meta.nip05;
    }

    if (meta.name && meta.name.length) {
      return meta.name;
    }
  } else if (pubkey) {
    const npub = nip19.npubEncode(pubkey);
    return `${npub.slice(0, 6)}…${npub.slice(-3)}`;
  }

  return 'nostrich';
};
