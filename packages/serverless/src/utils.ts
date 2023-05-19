import { TableClient } from '@azure/data-tables';
import { signDirectMessage, publishEvent, initRelays, connectRelays, createEphemeralNostrId } from 'nostrfn';

interface Response {
  status: number;
  body?: string;
  error?: string;
}

export const uploadToStorageTables = async (
  table: string,
  value: string
): Promise<Response> => {
  // Connect to Azure Storage
  const connectionString = process.env.AzureWebJobsStorage;

  try {
    // Create a new table if it doesn't exist
    const tableClient = TableClient.fromConnectionString(
      connectionString,
      table
    );

    // Create a new entity with the name
    const entity = {
      partitionKey: 'subscribers',
      rowKey: `${Date.now()}`,
      npub: value,
    };

    await tableClient.createEntity(entity);

    return {
      status: 200,
      body: `Value successfully uploaded to ${table} in Azure Storage`,
    };
  } catch (error) {
    return {
      status: 500,
      error: `Error occurred while uploading value to ${table} in Azure Storage`,
    };
  }
};

export const sendNostrDM = async (message: string, npub: string): Promise<Response> => {
  // const colighterPrivkey = process.env.COLIGHTER_PRIVKEY;
  // const colighterPubkey = process.env.COLIGHTER_PUBKEY;

  try {
    // Ideally we shouls source the Colighter key pair from the environment variables
    // But for now we'll just generate a new ephemeral key pair and send the DM from that
    const { privkey: colighterPrivkey, pubkey: colighterPubkey } = await createEphemeralNostrId();

    const event = await signDirectMessage(message, colighterPrivkey, colighterPubkey, npub);

    const publishRelays = initRelays(['wss://nostrdocs.com']);
    if (await connectRelays(publishRelays)) {
      await publishEvent(publishRelays, event);

      return {
        status: 200,
        body: `Successfully sent DM to ${npub}`,
      };
    }

    return {
      status: 500,
      error: `Error occurred while connecting to publish relays`,
    };
  } catch (error) {
    return {
      status: 500,
      error: `Error occurred while sending DM to ${npub}`,
    };
  }
};
