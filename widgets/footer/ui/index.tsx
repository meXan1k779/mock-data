import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { FinexLogoIcon } from '@/shared/icons/finexLogoIcon';

export const Footer = () => {
  const pathname = usePathname();

  const isProfile = pathname.includes('profile');
  const isArticle = pathname.includes('/article/');
  const isVideo = pathname.includes('/video/');
  const isPolicy = pathname.includes('/privacy-policy');
  const isTermsOfUse = pathname.includes('/terms');
  const isAboutUs = pathname.includes('/aboutus');
  // Home and Path Detail are short, finite-length pages now (no infinite
  // scroll) — the redesigned home in Figma shows the footer at the bottom.
  const isHome = pathname === '/';
  const isLearningPath = pathname.includes('/learning-paths/');

  if (
    !isProfile &&
    !isArticle &&
    !isVideo &&
    !isPolicy &&
    !isTermsOfUse &&
    !isAboutUs &&
    !isHome &&
    !isLearningPath
  ) {
    return null;
  }
  return (
    <footer className="bg-background-secondary border-t border-border-tetriary w-full text-sm text-content-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 pt-12 md:pt-16 lg:pt-20 pb-10 md:pb-12 lg:pb-15 flex flex-col gap-8 md:gap-10 lg:gap-12">
        <div className="flex flex-col items-start gap-6 md:gap-8 lg:flex-row lg:justify-between">
          <FinexLogoIcon className="h-8 w-auto shrink-0 lg:h-11" />
          <div className="flex flex-col gap-5 lg:gap-2 w-full lg:max-w-[813px]">
            <p>
              Platform edukasi dari{' '}
              <Link
                href="http://finex.co.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-link"
              >
                Finex
              </Link>
              . Nomor Persetujuan: KB.00.00/ 401 /BAPPEBTI.4/SD/03/2026/16 Maret 2026
            </p>
            <div className="flex flex-col gap-1">
              <p>PT Finex Bisnis Solusi Futures</p>
              <p>
                SOHO Pancoran, Tower Splendor, Lantai 30, Unit 3005, Jl. Letjen MT Haryono Kav. 2-3,
                Tebet, Jakarta Selatan 12810
              </p>
              <p>+62 21-5010-1569</p>
            </div>
            <div className="flex flex-col gap-2">
              <p>
                Platform ini hanya menyediakan materi edukasi dan tidak menawarkan layanan trading
                atau pialang berjangka. Transaksi derivatif adalah transaksi high-risk, high-return.
              </p>
              <p>
                PT Finex Bisnis Solusi Futures memiliki izin dan diawasi oleh BAPPEBTI, OJK, dan
                Bank Indonesia, serta merupakan anggota Bursa Berjangka Jakarta (JFX) dan Kliring
                Berjangka Indonesia (KBI).
              </p>
            </div>
            <p>
              Untuk pertanyaan lebih lanjut, hubungi kami melalui{' '}
              <Link href="mailto:education@finex.co.id" className="text-base-link">
                education@finex.co.id.
              </Link>
            </p>
          </div>
        </div>
        <div className="h-px w-full bg-border-tetriary" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:gap-6 lg:gap-8">
            <Link href="/aboutus" className="text-base-link">
              Tentang kami
            </Link>
            <Link href="/privacy-policy" className="text-base-link">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="text-base-link">
              Syarat dan Ketentuan
            </Link>
          </div>
          <p className="text-xs text-content-tetriary">
            © 2026 Finex Kita. Hak cipta dilindungi undang-undang.
          </p>
        </div>
      </div>
    </footer>
  );
};
