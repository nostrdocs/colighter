import { Relay, relayInit } from 'nostr-tools';

export const initRelays = (urls: string[]): Relay[] => {
  return urls.map((url) => relayInit(url));
};

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
