import {
  executeSponsoredTx,
  getSponsoredTx,
} from '@/lib/enoki/get-sponsored-tx';
import { endPollTransaction } from '@/lib/poll/poll-transactions';
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { useMutation } from '@tanstack/react-query';

export interface EndPollParams {
  pollId: string;
  packageAddress?: string;
}

export const useEndPoll = () => {
  const client = useSuiClient();
  const sender = useCurrentAccount();
  const { mutateAsync: signTransaction } = useSignTransaction();
  return useMutation({
    mutationFn: async (params: EndPollParams) => {
      const { pollId, packageAddress } = params;
      console.log('received params', pollId);
      if (!sender) {
        throw new Error('Wallet not connected');
      }

      let actualPackageAddress = packageAddress;
      if (!actualPackageAddress) {
        const objectResponse = await client.getObject({
          id: pollId,
          options: {
            showType: true,
          },
        });

        if (objectResponse.data?.type) {
          // Extract package address from type string (format: "0x...::Poll::Poll")
          const typeParts = objectResponse.data.type.split('::');
          actualPackageAddress = typeParts[0] || undefined;
        }
      }

      const transaction = endPollTransaction(pollId, actualPackageAddress);
      const txBytes = await transaction.build({
        client: client,
        onlyTransactionKind: true,
      });
      const sponsoredTxn = await getSponsoredTx({
        sender: sender.address,
        txBytes: txBytes,
      });
      const { signature } = await signTransaction({
        transaction: sponsoredTxn.bytes,
      });

      const result = await executeSponsoredTx({
        digest: sponsoredTxn.digest,
        signature: signature,
      });
      const waitedResultWithChanges = await client.waitForTransaction({
        digest: result.digest,
        options: {
          showObjectChanges: true,
          showEffects: true,
        },
      });
      // 4. Parse the result

      return { result: waitedResultWithChanges };
    },
  });
};
