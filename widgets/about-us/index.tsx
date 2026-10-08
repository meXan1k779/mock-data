'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';

import { useLazyGetApprovalDocQuery } from '@/features/main/api/main-api';

interface DetailRowProps {
  label: string;
  value: ReactNode;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
  <>
    <div className="flex flex-col gap-1 w-full">
      <span className="text-xs text-content-secondary">{label}</span>
      <span className="text-sm text-content-primary">{value}</span>
    </div>
    <div className="h-px w-full bg-border-tetriary" />
  </>
);

const legalEntityDetails: DetailRowProps[] = [
  {
    label: 'Alamat',
    value:
      'SOHO Pancoran, Tower Splendor, Lantai 30, Unit 3005, Jl. Letjen MT Haryono Kav. 2-3, Tebet, Jakarta Selatan 12810',
  },
  {
    label: 'Situs',
    value: (
      <a
        href="https://finex.co.id/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-base-link"
      >
        https://finex.co.id/
      </a>
    ),
  },
  { label: 'Telepon Kantor', value: '+62 21-5010-1569' },
  { label: 'Dukungan WhatsApp', value: '+62 811-8105-688' },
  {
    label: 'Email',
    value: (
      <a href="mailto:customer@finex.co.id" className="text-base-link">
        customer@finex.co.id
      </a>
    ),
  },
];

const approvalDetails: DetailRowProps[] = [
  {
    label: 'Diterbitkan oleh',
    value: 'Badan Pengawas Perdagangan Berjangka Komoditi (BAPPEBTI), Kementerian Perdagangan RI',
  },
  { label: 'Tanggal', value: '16 Maret 2026' },
  { label: 'Perihal', value: 'Persetujuan Program Promosi Platform Edukasi' },
];

export const AboutUsPage = () => {
  const [getApprovalDoc, { isFetching: isApprovalDocLoading }] = useLazyGetApprovalDocQuery();

  const handleViewApprovalDoc = async () => {
    try {
      const blob = await getApprovalDoc().unwrap();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      console.error('Failed to load approval document:', error);
    }
  };

  return (
    <div className="max-w-[700px] mx-4 md:mx-auto pt-10 mb-16 md:mb-20 flex flex-col gap-15">
      <div className="flex flex-col gap-4">
        <h1 className="text-[28px] leading-9 md:text-[32px] md:leading-10 lg:text-[40px] lg:leading-12 font-bold font-manrope text-content-primary">
          Tentang kami
        </h1>
        <p className="text-lg leading-7 text-content-primary">
          Finex Kita adalah platform edukasi trading terbaru dari Finex. Di sini, trader dapat
          belajar dari penulis berpengalaman, materi yang telah disetujui, serta penjelasan pasar
          yang praktis dalam lingkungan yang tenang dan mudah dipahami.
        </p>
        <p className="text-lg leading-7 text-content-primary">
          Finex Kita membantu trader membangun pemahaman sebelum mengambil keputusan, tanpa tekanan,
          tanpa FOMO, dan tanpa materi pembelajaran yang berorientasi pada penjualan.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-content-secondary">BADAN HUKUM</span>
          <span className="text-xl font-bold font-manrope text-content-primary">
            PT Finex Bisnis Solusi Futures
          </span>
        </div>
        <div className="h-px w-full bg-border-tetriary" />
        {legalEntityDetails.map((row) => (
          <DetailRow key={row.label} {...row} />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#117716]">DOKUMEN PERSETUJUAN</span>
          <div className="w-full rounded-lg bg-green border border-[#A0E8A0] overflow-clip flex flex-col items-start gap-4 px-4 py-2.5 md:h-13 md:flex-row md:items-center md:justify-between md:gap-0 md:py-0">
            <span className="text-[15px] font-bold font-manrope text-[#117716]">
              KB.00.00/401/BAPPEBTI.4/SD/03/2026
            </span>
            {/* <button
              type="button"
              onClick={handleViewApprovalDoc}
              disabled={isApprovalDocLoading}
              className={clsx(
                'bg-background-primary rounded-md px-3 py-2 text-xs font-medium text-content-primary w-full md:w-fit',
                'cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed',
              )}
            >
              {isApprovalDocLoading ? 'Memuat...' : 'Lihat'}
            </button> */}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {approvalDetails.map((row) => (
            <DetailRow key={row.label} {...row} />
          ))}
        </div>
      </div>
    </div>
  );
};
