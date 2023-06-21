const defaultRelays = [
  'wss://relay.nostrdocs.com',
  'wss://relay.f7z.io',
  'wss://nos.lol',
];

let storedRelays = localStorage.getItem('relays');
let relays: string[] = storedRelays ? JSON.parse(storedRelays) : defaultRelays;

export const addRelay = (url: string): void => {
  relays.push(url);
  // TODO: Add relay to a db or something
  localStorage.setItem('relays', JSON.stringify(relays));
};

export const getRelays = (): string[] => {
  // TODO: Fetch relays from a db or something
  let storedRelays = localStorage.getItem('relays');
  relays = storedRelays ? JSON.parse(storedRelays) : defaultRelays;
  return [...relays];
};
