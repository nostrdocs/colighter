import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { uploadToStorageTables, sendNostrDM } from './utils';

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

    let res = await uploadToStorageTables(WaitlistTableName, npub);
    if (res.status !== 200) {
      const error = res.error || `Error adding ${npub} to waitlist`;
      context.log(error);
      return {
        status: res.status,
        body: error,
      };
    }

    let progress = `Added ${npub} to waitlist`;
    context.log(progress);

    const waitlistMessage = "Highlight: You're on the waitlist! \nWe'll let you know when Colighter extension is available to start using";
    res = await sendNostrDM(waitlistMessage, npub);
    if (res.status !== 200) {
      const error = res.error || `Error sending DM to ${npub}`;
      context.log(error);
      return {
        status: res.status,
        body: error,
      };
    }

    progress = `Sent DM to ${npub}`;
    context.log(progress);

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
