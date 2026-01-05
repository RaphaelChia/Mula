'use server';
import clientConfig from '@/lib/env-config-client';
import serverConfig from '@/lib/env-config-server';
import { getMoveTarget } from '@/lib/helpers-onchain';
import { EnokiClient, EnokiNetwork } from '@mysten/enoki';
import { toBase64 } from '@mysten/sui/utils';

/**
 *
 * @param txBytes - The transaction object built with onlyTransactionKind: true
 * @param sender - The sender address
 * @returns
 */
export const getSponsoredTx = async ({
  txBytes,
  sender,
}: {
  txBytes: Uint8Array<ArrayBuffer>;
  sender: string;
}) => {
  console.log('enoki secret key', serverConfig.ENOKI_PRIVATE_KEY);
  console.log('sui network name', clientConfig.NEXT_PUBLIC_SUI_NETWORK_NAME);
  console.log('sender move target', getMoveTarget('Poll', 'vote'));
  const enokiClient = new EnokiClient({
    apiKey: serverConfig.ENOKI_PRIVATE_KEY,
  });
  const sponsoredTransaction = await enokiClient.createSponsoredTransaction({
    network: process.env.NEXT_PUBLIC_SUI_NETWORK_NAME as EnokiNetwork,
    transactionKindBytes: toBase64(txBytes),
    sender: sender,
    allowedAddresses: [sender],
    allowedMoveCallTargets: [
      // dealer interactions
      getMoveTarget('Poll', 'create_poll'),
      getMoveTarget('Poll', 'vote'),
      getMoveTarget('Poll', 'end_poll'),
    ],
  });
  return sponsoredTransaction;
};

/**
 * Executes a sponsored transaction
 * @param digest - The digest of the sponsored transaction
 * @param signature - The signature of the sponsored transaction, MUST HAVE 2 signatures by this point.
 * @returns The result of the executed sponsored transaction
 */
export const executeSponsoredTx = async ({
  digest,
  signature,
}: {
  digest: string;
  signature: string;
}) => {
  const enokiClient = new EnokiClient({
    apiKey: serverConfig.ENOKI_PRIVATE_KEY,
  });
  const result = await enokiClient.executeSponsoredTransaction({
    digest,
    signature,
  });
  return result;
};
