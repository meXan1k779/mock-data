import type { Metadata } from 'next';
import { Noto_Sans, Manrope } from 'next/font/google';
import Script from 'next/script';

import { NetworkStatus } from '@/shared/providers/network-status';
import { StoreProvider } from '@/shared/providers/store-provider';

import { ClientLayout } from './client-layout';

import './globals.css';

declare global {
  interface Window {
    env: {
      BASE_API_URL?: string;
      [key: string]: string | undefined;
    };
  }
}

const noto = Noto_Sans({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-noto',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Finex Kita',
  description: 'Finex Kita — platform edukasi',
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${noto.variable} ${manrope.variable}`}>
      <head>
        <Script src="/__env.js" strategy="beforeInteractive"></Script>
      </head>
      <NetworkStatus>
        <body className="min-h-screen flex flex-col">
          <StoreProvider>
            <ClientLayout>{children}</ClientLayout>
          </StoreProvider>
          {/* Dormant until loaded inside a Useberry test session — safe to
              keep in place permanently, doesn't affect real visitors. */}
          <Script
            src="https://api.useberry.com/integrations/liveUrl/scripts/useberryScript.js"
            strategy="afterInteractive"
          />
        </body>
      </NetworkStatus>
    </html>
  );
}
