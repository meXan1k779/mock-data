import clsx from 'clsx';
import Link from 'next/link';

import { ChevronLeftIcon } from '@/shared/icons/chevronLeftIcon';

export const RegulatorBanner = ({ className }: { className?: string }) => {
  return (
    <div
      className={clsx(
        className,
        'bg-blue rounded-3xl p-4 sm:px-8 sm:py-6 sm:min-w-[326px] sm:mb-0',
      )}
    >
      <p className="font-semibold mb-1 text-lg">
        Finex Kita — platform edukasi dari{' '}
        <Link
          href="http://finex.co.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-base-link "
        >
          Finex
        </Link>
      </p>
      <p className="mb-4">Nomor Persetujuan: KB.00.00/ 401 /BAPPEBTI.4/SD/03/2026/16 Maret 2026</p>
      <div className="flex items-center">
        <Link href="/aboutus" className="text-base-link mr-1">
          Selengkapnya tentang kami
        </Link>
        <ChevronLeftIcon className="w-1.5 h-3.5 shrink-0 rotate-180 text-base-link" />
      </div>
    </div>
  );
};
