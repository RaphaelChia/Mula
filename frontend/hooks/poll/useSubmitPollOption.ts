import {
  executeSponsoredTx,
  getSponsoredTx,
} from '@/lib/enoki/get-sponsored-tx';
import { voteTransaction } from '@/lib/poll/poll-transactions';
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { useMutation } from '@tanstack/react-query';

export interface SubmitPollOptionParams {
  pollId: string;
  option: number;
  packageAddress?: string;
}

/**
 * This is used over the function above due to the above always returning the non decoded effects and changes.
 * Using SignAndExecute will use the wallet's execution function which doesnt take into account options.
 * The Sign, then Execute will use the client's execution function which is created by mysten which properly takes into account options.
 * @returns The transaction result with decoded effects and changes.
 */
export const useSubmitPollOptionNew = () => {
  const client = useSuiClient();
  const sender = useCurrentAccount();
  const { mutateAsync: signTransaction } = useSignTransaction();
  return useMutation({
    mutationFn: async (params: SubmitPollOptionParams) => {
      const { pollId, option, packageAddress } = params;
      console.log('received params', params);
      if (!sender) {
        throw new Error('Wallet not connected');
      }

      // If packageAddress is not provided, fetch the object to extract it from its type
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
      const preparedTxn = voteTransaction(pollId, option, actualPackageAddress);
      const txBytes = await preparedTxn.build({
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

      // const result = await client.executeTransactionBlock({
      //   transactionBlock: bytes,
      //   signature: [signature, sponsoredTxn],
      //   options: {
      //     showEffects: true,
      //     showObjectChanges: true, // This will now definitely work
      //   },
      // });

      console.log('Vote transaction result:', waitedResultWithChanges);
      return { result: waitedResultWithChanges };
    },
  });
};
