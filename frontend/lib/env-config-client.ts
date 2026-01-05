import { z } from 'zod';

/*
 * The schema for the environment variables
 * These variables should be defined in:
 * * the app/.env.development.local file for the local environment
 * * the Vercel's UI for the deployed environment
 * They must not be tracked by Git
 */

const clientConfigSchema = z.object({
  NEXT_PUBLIC_SUI_NETWORK_NAME: z.enum(['mainnet', 'testnet', 'devnet']),
  NEXT_PUBLIC_POLL_PACKAGE_ADDRESS: z.string(),
});

const clientConfig = clientConfigSchema.safeParse({
  NEXT_PUBLIC_SUI_NETWORK_NAME: process.env.NEXT_PUBLIC_SUI_NETWORK_NAME,
  NEXT_PUBLIC_POLL_PACKAGE_ADDRESS:
    process.env.NEXT_PUBLIC_POLL_PACKAGE_ADDRESS,
});

if (!clientConfig.success) {
  console.error('Invalid environment variables:', clientConfig.error.format());
  throw new Error('Invalid environment variables');
}

export default clientConfig.data;
