'use client';

import { useEffect } from 'react';

import { Button } from '@/shared/ui/button';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center text-content-primary max-w-md mx-auto">
        <div className="text-[28px] sm:text-[32px] md:text-[40px] font-bold font-manrope mb-3 leading-12">
          Terjadi kesalahan
        </div>
        <div className="mb-10">
          Kami tidak dapat memuat halaman atau menemukan informasi yang Anda cari. Coba muat ulang
          halaman atau kembali lagi nanti.
        </div>
        <Button size="lg" onClick={() => window.location.reload()}>
          Coba lagi
        </Button>
      </div>
    </div>
  );
}
