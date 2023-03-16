import { Event, Filter, Pub, Sub, SubscriptionOptions } from 'nostr-tools';

export class MockCollabRelay {
  constructor(public readonly url: string, public status: number) { }

  public connect(): Promise<void> {
    return Promise.resolve();
  }

  public close(): void {
    return;
  }

  public sub(_filters: Filter[], _opts?: SubscriptionOptions): Sub {
    return {
      sub: (filters: Filter[], opts: SubscriptionOptions) => this.sub(filters, opts),
      unsub: () => { },
      on: (_type: 'event' | 'eose', _cb: any) => { },
      off: (_type: 'event' | 'eose', _cb: any) => { },
    };
  };

  public list(_filters: Filter[], _opts?: SubscriptionOptions | undefined): Promise<Event[]> {
    return Promise.resolve([]);
  };

  public get(_filter: Filter, _opts?: SubscriptionOptions | undefined): Promise<Event | null> {
    return Promise.resolve(null);
  }

  public publish(_event: Event): Pub {
    return {
      on: (_type: 'ok' | 'failed', _cb: any) => { },
      off: (_type: 'ok' | 'failed', _cb: any) => { },
    };
  }

  public on(_type: 'connect' | 'disconnect' | 'error' | 'notice', _cb: any): void {
    return;
  }

  public off(_type: 'connect' | 'disconnect' | 'error' | 'notice', _cb: any): void {
    return;
  }
}
