import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAppDispatch } from '@/shared/api/store';
import { ChevronLeftIcon } from '@/shared/icons/chevronLeftIcon';
import { Button } from '@/shared/ui/button';
import { CustomCheckbox } from '@/shared/ui/checkbox';

import { useCreateContentMutation } from '../api/article-api';
import { resetEditorData } from '../models/article-slice';

const GUIDE_STEPS = [
  {
    image: '/guide-illustrations/moderator-review.svg',
    duration: 'HINGGA 48 JAM',
    title: 'Tinjauan Moderator',
    description:
      'Tim kami akan memeriksa artikel Anda dan memberikan komentar apabila diperlukan revisi.',
  },
  {
    image: '/guide-illustrations/bappebti-approval.svg',
    duration: 'HINGGA 2 BULAN',
    title: 'Persetujuan Badan Pengatur',
    description:
      'Badan pengatur wajib menyetujui seluruh konten sebelum dipublikasikan. Proses ini memastikan artikel Anda tepercaya.',
  },
  {
    image: '/guide-illustrations/article-live.svg',
    duration: 'SETELAH DISETUJUI',
    title: 'Artikel Anda dipublikasikan',
    description:
      'Artikel Anda dipublikasikan di Finex Kita, dan voucer senilai Rp1.000.000 akan dikirimkan ke nomor ponsel Anda.',
  },
] as const;

export const PaymentGuide = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [createContent, { isLoading }] = useCreateContentMutation();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleContinue = async () => {
    const articleData = {
      title: '',
      description: '',
      name: '', // ????
      previewUrl: '', // ????
    };
    try {
      const response = await createContent(articleData).unwrap();
      // Новая статья — очищаем черновик предыдущей, иначе редактор подставит старый текст.
      dispatch(resetEditorData());
      router.replace(`/new-article/topics/${response?.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative px-3 pt-10 sm:px-5">
      <Button
        onClick={handleContinue}
        loading={isLoading}
        disabled={!acceptedTerms}
        variant="text"
        rightIcon={<ChevronLeftIcon className="rotate-180" />}
        className="hidden absolute right-3 top-10 lg:inline-flex sm:right-5"
      >
        Lanjutkan
      </Button>

      <div className="m-auto max-w-[700px]">
        <p className="text-[28px] font-manrope font-bold mb-4">Sebelum memulai</p>
        <p className="text-content-primary mb-6">
          {
            'Semua artikel di Finex Kita akan melalui dua tahap peninjauan sebelum dipublikasikan. Berikut adalah prosesnya:'
          }
        </p>

        <div className="flex flex-col gap-5 mb-7 sm:flex-row">
          {GUIDE_STEPS.map((step) => (
            <div
              key={step.title}
              className="flex flex-1 flex-col items-center gap-4 rounded-2xl bg-background-secondary p-6"
            >
              <img src={step.image} alt="" className="h-[92px] w-auto" />
              <div className="flex w-full flex-col gap-2">
                <p className="text-xs text-content-secondary">{step.duration}</p>
                <p className="text-[18px] font-semibold text-content-primary">{step.title}</p>
                <p className="text-sm text-content-primary">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 mb-7">
          <CustomCheckbox
            id="accept-terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 shrink-0"
          />
          <p className="text-content-primary">
            <label htmlFor="accept-terms" className="cursor-pointer">
              {'Saya memahami dan menyetujui '}
            </label>
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-base-link"
            >
              Syarat dan Ketentuan
            </a>
          </p>
        </div>

        <Button
          onClick={handleContinue}
          loading={isLoading}
          disabled={!acceptedTerms}
          size="lg"
          className="w-full lg:hidden"
        >
          Lanjutkan
        </Button>
      </div>
    </div>
  );
};
