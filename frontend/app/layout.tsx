import LayoutWrapper from '@/components/layout-wrapper';
import Navbar from '@/components/navbar';
import '@mysten/dapp-kit/dist/index.css';
import '@radix-ui/themes/styles.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Just Vote',
  description: 'Create polls, vote, have fun.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased [--pagepx:24px] [--pagepy:36px]`}
      >
        <LayoutWrapper>
          <Navbar />
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
