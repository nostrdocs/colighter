import { TableClient } from '@azure/data-tables';

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
      `${table}-bb`
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
