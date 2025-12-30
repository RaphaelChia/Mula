import { endPollTransaction } from '@/lib/poll-transactions';
import { useSignTransaction, useSuiClient } from '@mysten/dapp-kit';
import { useMutation } from '@tanstack/react-query';

export interface EndPollParams {
  pollId: string;
  packageAddress?: string;
}

export const useEndPoll = () => {
  const client = useSuiClient();
  const { mutateAsync: signTransaction } = useSignTransaction();
  return useMutation({
    mutationFn: async (params: EndPollParams) => {
      const { pollId, packageAddress } = params;
      console.log('received params', pollId);

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
      const { bytes, signature } = await signTransaction({
        transaction,
      });

      const result = await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature: signature,
        options: {
          showEffects: true,
          showObjectChanges: true, // This will now definitely work
        },
      });
      console.log('result of ending poll', result);
      // 4. Parse the result
      const createdObject = result.objectChanges?.find(
        (change) => change.type === 'created',
      );

      return { result, objectId: createdObject?.objectId };
    },
  });
};
