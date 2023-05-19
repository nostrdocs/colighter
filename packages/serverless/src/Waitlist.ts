import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { uploadToStorageTables } from './utils';

const WaitlistTableName = 'waitlist';
interface WaitlistHandlerRequest {
  npub: string;
}

const WaitlistHandler = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  context.log('WaitlistHandler called');

  try {
    const { npub } = (await request.json()) as WaitlistHandlerRequest;

    const res = await uploadToStorageTables(WaitlistTableName, npub);
    if (res.status !== 200) {
      const error = res.error || `Error adding ${npub} to waitlist`;
      context.log(error);
      return {
        status: res.status,
        body: error,
      };
    }

    context.log(`Added ${npub} to waitlist`);

    // TODO: Send Nostr DM to notify them they're on the waitlist

    return {
      status: 200,
      body: 'OK',
    };
  } catch (e: unknown) {
    context.error(e);
    return {
      status: 400,
      body: e as string,
    };
  }
};

app.http('Waitlist', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: WaitlistHandler,
});
