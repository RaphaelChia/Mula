import { SuiClient } from '@mysten/sui/client';

/**
 * Poll data structure returned from reading the object
 */
export interface PollData {
  id: string;
  name: string;
  options: string[];
  votes: bigint[];
  creator: string;
  voters: string[];
  ended: boolean;
}

/**
 * Retrieves a poll object from the Sui blockchain using its Object ID.
 *
 * Note: In Sui, you need the Object ID (not transaction digest) to read objects.
 * The Object ID is a unique identifier for each object on-chain.
 *
 * @param client - The Sui client instance to use for the RPC call
 * @param objectId - The Object ID of the poll to retrieve
 * @returns The deserialized poll data, or null if the object doesn't exist or isn't a Poll
 * @throws Error if the object exists but cannot be deserialized as a Poll
 */
export async function getPollById(
  client: SuiClient,
  objectId: string,
): Promise<PollData | null> {
  try {
    // Fetch the object with content to get the parsed fields
    const objectResponse = await client.getObject({
      id: objectId,
      options: {
        showContent: true,
      },
    });

    // Check if object exists and has content
    if (!objectResponse.data) {
      return null;
    }

    if (objectResponse.data.content?.dataType !== 'moveObject') {
      return null;
    }

    const moveObject = objectResponse.data.content;

    // Verify this is a Poll object by checking the type
    if (!moveObject.type?.includes('Poll::Poll')) {
      return null;
    }

    // Extract fields from the parsed object
    const fields = moveObject.fields as {
      id: { id: string };
      name: string;
      options: string[];
      votes: string[] | bigint[];
      creator: string;
      voters: string[];
      ended: boolean;
    };

    // Convert votes to bigint array (they come as strings from JSON)
    const votes = fields.votes.map((vote) =>
      typeof vote === 'string' ? BigInt(vote) : vote,
    );

    // Extract the poll data
    return {
      id: objectId,
      name: fields.name,
      options: fields.options,
      votes,
      creator: fields.creator,
      voters: fields.voters,
      ended: fields.ended,
    };
  } catch (error) {
    // If object doesn't exist, return null
    if (
      error instanceof Error &&
      (error.message.includes('not found') ||
        error.message.includes('does not exist'))
    ) {
      return null;
    }
    throw error;
  }
}
