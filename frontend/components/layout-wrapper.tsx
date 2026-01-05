'use client';
import clientConfig from '@/lib/env-config-client';
import { networkConfig } from '@/lib/network-config';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { Theme } from '@radix-ui/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Toaster } from 'sonner';

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });
  return (
    <>
      <Theme appearance="light">
        <Toaster />

        <QueryClientProvider client={queryClient}>
          <SuiClientProvider
            networks={networkConfig}
            defaultNetwork={clientConfig.NEXT_PUBLIC_SUI_NETWORK_NAME}
          >
            <WalletProvider autoConnect>{children}</WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
      </Theme>
    </>
  );
};

export default LayoutWrapper;
