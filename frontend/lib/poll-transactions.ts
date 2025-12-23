import { createPoll, endPoll, vote } from '@/__generated__/mula/Poll';
import { Transaction } from '@mysten/sui/transactions';

/**
 * Creates a transaction for creating a new poll.
 * 
 * @param name - The name/title of the poll
 * @param options - Array of poll option strings
 * @param packageAddress - Optional package address (defaults to '@local-pkg/poll')
 * @returns A Transaction object ready to be signed and executed
 */
export const createPollTransaction = (
  name: string,
  options: string[],
  packageAddress?: string,
): Transaction => {
  const tx = new Transaction();
  const pollBuilder = createPoll({
    package: packageAddress,
    arguments: { name, options },
  });
  pollBuilder(tx);
  return tx;
}

/**
 * Creates a transaction for voting on a poll.
 * 
 * @param pollId - The object ID of the poll to vote on
 * @param option - The index of the option to vote for (0-based)
 * @param packageAddress - Optional package address (defaults to '@local-pkg/poll')
 * @returns A Transaction object ready to be signed and executed
 */
export const voteTransaction = (
    pollId: string,
    option: number | bigint,
    packageAddress?: string,
): Transaction => {
  const tx = new Transaction();
  const voteBuilder = vote({
    package: packageAddress,
    arguments: { poll: pollId, option },
  });
  voteBuilder(tx);
  return tx;
}

/**
 * Creates a transaction for ending a poll.
 * Only the poll creator can end a poll.
 * 
 * @param pollId - The object ID of the poll to end
 * @param packageAddress - Optional package address (defaults to '@local-pkg/poll')
 * @returns A Transaction object ready to be signed and executed
 */
export const endPollTransaction = (
  pollId: string,
  packageAddress?: string,
): Transaction => {
  const tx = new Transaction();
  const endPollBuilder = endPoll({
    package: packageAddress,
    arguments: { poll: pollId },
  });
  endPollBuilder(tx);
  return tx;
}

