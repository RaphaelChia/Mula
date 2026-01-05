import {
  executeSponsoredTx,
  getSponsoredTx,
} from '@/lib/enoki/get-sponsored-tx';
import { createPollTransaction } from '@/lib/poll/poll-transactions';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSignTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
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
      console.log('received params', params);
      const transaction = createPollTransaction(name, options, packageAddress);
      const result = await signAndExecuteTransaction({
        transaction,
      });
      console.log('result', result);
      return result;
    },
  });
};

/**
 * This is used over the function above due to the above always returning the non decoded effects and changes.
 * Using SignAndExecute will use the wallet's execution function which doesnt take into account options.
 * The Sign, then Execute will use the client's execution function which is created by mysten which properly takes into account options.
 * Sample return txn after showChanges:
 * {
    "digest": "Hf9ABZkP7Av1Qp3UZ9JJtDxHD9FU1JMJBnwvWcqhHeGt",
    "effects": {
        "messageVersion": "v1",
        "status": {
            "status": "success"
        },
        "executedEpoch": "957",
        "gasUsed": {
            "computationCost": "1000000",
            "storageCost": "2903200",
            "storageRebate": "978120",
            "nonRefundableStorageFee": "9880"
        },
        "modifiedAtVersions": [
            {
                "objectId": "0x841666d6793f15fba2adbd1df7fff48d479fdd9cfddd7cda3014f8d18ac7df81",
                "sequenceNumber": "696411044"
            }
        ],
        "transactionDigest": "Hf9ABZkP7Av1Qp3UZ9JJtDxHD9FU1JMJBnwvWcqhHeGt",
        "created": [
            {
                "owner": {
                    "Shared": {
                        "initial_shared_version": 696411045
                    }
                },
                "reference": {
                    "objectId": "0x8b9ffaa7be79d945191b5b7cced23cb3adeebede15d51fa4112c5a7ff459e3b1",
                    "version": 696411045,
                    "digest": "J2mwcjNn2rRvE2x1dATpxuh8wfgSJr1oxYtV4GyLNG9C"
                }
            }
        ],
        "mutated": [
            {
                "owner": {
                    "AddressOwner": "0xb6956cd5fa099c203754d196ec4110b66f61219752f4f8bbdf9df8e945f01be8"
                },
                "reference": {
                    "objectId": "0x841666d6793f15fba2adbd1df7fff48d479fdd9cfddd7cda3014f8d18ac7df81",
                    "version": 696411045,
                    "digest": "DRkAXCad4gniQFHQMzMKth4JqtdDE7ThZDKVF5M2wBjA"
                }
            }
        ],
        "gasObject": {
            "owner": {
                "AddressOwner": "0xb6956cd5fa099c203754d196ec4110b66f61219752f4f8bbdf9df8e945f01be8"
            },
            "reference": {
                "objectId": "0x841666d6793f15fba2adbd1df7fff48d479fdd9cfddd7cda3014f8d18ac7df81",
                "version": 696411045,
                "digest": "DRkAXCad4gniQFHQMzMKth4JqtdDE7ThZDKVF5M2wBjA"
            }
        },
        "dependencies": [
            "AYGcsQizd2wqxDiHSwFUEBDauM4FJ8Qo3us5FLykqvcn",
            "GqUwL9eQD2FZNSZQJr9WZzREagWAQgq3itz2U6rwpjah"
        ]
    },
    "objectChanges": [
        {
            "type": "mutated",
            "sender": "0xb6956cd5fa099c203754d196ec4110b66f61219752f4f8bbdf9df8e945f01be8",
            "owner": {
                "AddressOwner": "0xb6956cd5fa099c203754d196ec4110b66f61219752f4f8bbdf9df8e945f01be8"
            },
            "objectType": "0x2::coin::Coin<0x2::sui::SUI>",
            "objectId": "0x841666d6793f15fba2adbd1df7fff48d479fdd9cfddd7cda3014f8d18ac7df81",
            "version": "696411045",
            "previousVersion": "696411044",
            "digest": "DRkAXCad4gniQFHQMzMKth4JqtdDE7ThZDKVF5M2wBjA"
        },
        {
            "type": "created",
            "sender": "0xb6956cd5fa099c203754d196ec4110b66f61219752f4f8bbdf9df8e945f01be8",
            "owner": {
                "Shared": {
                    "initial_shared_version": 696411045
                }
            },
            "objectType": "0xce4af17d760ed3a399152837c4c3fa6467094366f8cf5822fe49a26d8d8f2ac1::Poll::Poll",
            "objectId": "0x8b9ffaa7be79d945191b5b7cced23cb3adeebede15d51fa4112c5a7ff459e3b1",
            "version": "696411045",
            "digest": "J2mwcjNn2rRvE2x1dATpxuh8wfgSJr1oxYtV4GyLNG9C"
        }
    ],
    "confirmedLocalExecution": false
}
 * @returns The object ID of the created poll, with decoded effects and changes.
 */
export const useCreatePollNew = () => {
  const client = useSuiClient();
  const sender = useCurrentAccount();
  const { mutateAsync: signTransaction } = useSignTransaction();
  return useMutation({
    mutationFn: async (params: CreatePollParams) => {
      const { name, options, packageAddress } = params;
      console.log('received params', params);
      if (!sender) {
        throw new Error('Wallet not connected');
      }
      const transaction = createPollTransaction(name, options, packageAddress);
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
      const createdObject = waitedResultWithChanges.objectChanges?.find(
        (change) => change.type === 'created',
      );

      console.log('Created Object ID:', createdObject?.objectId);
      return {
        result: waitedResultWithChanges,
        objectId: createdObject?.objectId,
      };
    },
  });
};
