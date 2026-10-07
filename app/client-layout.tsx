'use client';

import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';

import type { RootState } from '@/shared/api/store';
import { NetworkErrorBanner } from '@/shared/ui/network-error-banner';
import { ToastProvider } from '@/shared/ui/toast';
import { Footer } from '@/widgets/footer/ui';

const Header = dynamic(() => import('@/widgets/header/ui/header'), { ssr: false });

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const networkError = useSelector((state: RootState) => state.auth.networkError);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPathArticlePage = pathname.startsWith('/article/') && !!searchParams.get('path');

  return (
    <ToastProvider>
      <NetworkErrorBanner />
      <Header />
      <main className="w-full max-w-[1200px] m-auto mt-15 sm:mt-17">
        {networkError ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
            <p className="text-xl font-manrope font-semibold text-content-primary">
              Server tidak tersedia
            </p>
            <p className="text-content-secondary text-sm max-w-[360px]">
              {
                'Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba muat ulang halaman.'
              }
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-5 py-2 rounded-lg bg-primary-bg text-sm font-medium text-content-primary hover:opacity-80 transition-opacity"
            >
              Muat ulang halaman
            </button>
          </div>
        ) : (
          children
        )}
      </main>
      {!isPathArticlePage && <Footer />}
    </ToastProvider>
  );
}
