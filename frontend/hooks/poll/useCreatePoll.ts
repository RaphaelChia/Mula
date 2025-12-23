import { createPollTransaction } from '@/lib/poll-transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useMutation } from '@tanstack/react-query';

export interface CreatePollParams {
  name: string;
  options: string[];
  packageAddress?: string;
}

export const useCreatePoll = () => {
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async (params: CreatePollParams) => {
      const { name, options, packageAddress } = params;
      console.log("received params", params);
      const transaction = createPollTransaction(name, options, packageAddress);
      const result = await signAndExecuteTransaction({
        transaction,
      });
      return result;
    },
  });
};