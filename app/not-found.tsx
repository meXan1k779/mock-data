'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/shared/ui/button';

import tetst from '../shared/img/404.png';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="h-[calc(100vh-70px)] flex items-center justify-center fixed left-0 right-0 bg-background-secondary">
      <img
        src={tetst.src}
        alt="Background"
        className="absolute h-full w-full inset-0 object-cover -z-10"
      />
      <div className="text-center text-content-primary max-w-[710px] mx-auto">
        <div className="text-[28px] sm:text-[32px] md:text-[40px] font-bold font-manrope mb-3 leading-12">
          Halaman tidak ditemukan
        </div>
        <Button className="w-full sm:w-fit" size="lg" onClick={() => router.push('/')}>
          Ke halaman utama
        </Button>
      </div>
    </div>
  );
}
