'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useRouter, notFound } from 'next/navigation';
import { useSelector } from 'react-redux';

import { setRedirectAfterLogin, toggleLoginModal } from '@/features/auth/models/auth-slice';
import { LoginModal } from '@/features/auth/ui/login-modal';
import type { RootState } from '@/shared/api/store';
import { useAppDispatch } from '@/shared/api/store';
import { ChevronLeftIcon } from '@/shared/icons/chevronLeftIcon';
import { PositiveCheckmarkIcon } from '@/shared/icons/positiveCheckmarkIcon';
import { Button } from '@/shared/ui/button';
import { getReadingTime } from '@/shared/utils/getReadingTime';

import { getLearningPathById } from '../model/constants';
import { usePathProgress } from '../model/use-path-progress';
import { usePathSteps } from '../model/use-path-steps';
import { markPathStarted } from '../models/learning-paths-slice';

interface PathDetailPageProps {
  pathId: string;
}

export function PathDetailPage({ pathId }: PathDetailPageProps) {
  const path = getLearningPathById(pathId);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { steps, isLoading } = usePathSteps(pathId);
  const progress = usePathProgress(pathId);
  const readArticleIds = useSelector((state: RootState) => state.learningPaths.readArticleIds);

  if (!path) {
    notFound();
  }

  const percent =
    progress.totalCount > 0 ? Math.round((progress.completedCount / progress.totalCount) * 100) : 0;

  const ctaLabel =
    progress.status === 'completed'
      ? 'Tinjau ulang'
      : progress.status === 'in-progress'
        ? 'Lanjutkan'
        : 'Mulai sekarang';

  const handleCta = () => {
    const target = progress.nextStepId ?? steps[0]?.id;

    if (!isAuthenticated) {
      if (target) {
        dispatch(setRedirectAfterLogin(`/article/${target}?path=${pathId}`));
      }
      dispatch(toggleLoginModal(true));
      return;
    }
    dispatch(markPathStarted(pathId));
    if (target) {
      router.push(`/article/${target}?path=${pathId}`);
    }
  };

  return (
    <div className="px-4 md:px-8 xl:px-0 pb-16 mt-4 md:mt-6 lg:mt-10">
      <div className="bg-background-secondary rounded-[20px] md:rounded-[32px] lg:rounded-[48px] p-5 md:p-8 lg:p-[72px] flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
        <div className="w-full md:w-[389px] lg:w-[640px] shrink-0">
          <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-4">
            <span className="h-8 flex items-center px-3 rounded-full bg-background-primary text-content-primary text-base">
              {steps.length} artikel
            </span>
            <span className="h-8 flex items-center px-3 rounded-full bg-background-primary text-content-primary text-base">
              Bacaan {progress.totalMinutes} menit
            </span>
          </div>
          <h1 className="font-manrope font-bold text-[28px] leading-9 md:text-[32px] md:leading-[40px] lg:font-noto lg:font-semibold lg:text-[40px] lg:leading-[48px] text-content-primary mb-2 md:mb-4">
            {path.title}
          </h1>
          <p
            className={clsx(
              'text-content-primary text-base leading-6 lg:text-lg lg:leading-7',
              progress.status !== 'not-started' && 'mb-2 md:mb-4',
            )}
          >
            {path.description}
          </p>

          {progress.status !== 'not-started' && (
            <div className="flex flex-col gap-2.5 w-full">
              <div className="h-1.5 w-full bg-background-primary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-base-positive"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-content-primary text-sm">
                {progress.status === 'completed'
                  ? 'Selesai'
                  : `${progress.remainingMinutes} menit tersisa`}
              </p>
            </div>
          )}

          <Button
            size="lg"
            className="mt-8 md:mt-[52px] w-full md:w-auto"
            rightIcon={<ChevronLeftIcon className="w-2 h-3 rotate-180" />}
            onClick={handleCta}
            disabled={isLoading}
          >
            {ctaLabel}
          </Button>
        </div>

        <img
          src={path.heroImage}
          alt=""
          className="order-first md:order-none mx-auto md:mx-0 w-[200px] h-[233px] lg:w-[287px] lg:h-[334px] rounded-[28px] object-cover shrink-0 rotate-[4.85deg] shadow-xl"
        />
      </div>

      <div className="mt-[72px] max-w-[700px] mx-auto">
        <h2 className="font-noto font-semibold text-lg text-content-primary mb-2">
          Hal yang akan Anda pelajari
        </h2>
        <ul className="list-disc pl-[27px] flex flex-col text-content-primary text-lg leading-7">
          {path.whatYouLearn.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-[72px] max-w-[700px] mx-auto">
        <h2 className="font-noto font-semibold text-lg text-content-primary mb-2">
          Cocok untuk Anda jika
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-5">
          {path.whoItsFor.positive.map((item) => (
            <div key={item} className="bg-background-secondary rounded-2xl p-5 flex flex-col gap-3">
              <img src="/learning-paths/check-circle-outline.svg" alt="" className="size-6" />
              <p className="text-content-primary text-base">{item}</p>
            </div>
          ))}
          <div className="bg-background-primary border border-dashed border-[#cfd4dd] rounded-2xl p-5 flex flex-col gap-3">
            <img src="/learning-paths/error-outline.svg" alt="" className="size-6" />
            <p className="text-content-secondary text-base">
              <span className="font-semibold">Kursus ini kurang sesuai jika:</span>{' '}
              {path.whoItsFor.negative}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-[72px] max-w-[700px] mx-auto">
        <h2 className="font-noto font-semibold text-lg text-content-primary mb-2">
          Struktur jalur
        </h2>
        <div className="flex flex-col">
          {steps.map((step) => {
            const isDone = readArticleIds.includes(step.id);
            return (
              <Link
                key={step.id}
                href={`/article/${step.id}?path=${pathId}`}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-background-secondary transition-colors"
              >
                <img
                  src={
                    isDone
                      ? '/learning-paths/file-dock-fill.svg'
                      : '/learning-paths/file-dock-outline.svg'
                  }
                  alt=""
                  className="size-5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-content-primary text-base truncate">{step.title}</p>
                  <p className="text-content-secondary text-sm">
                    Bacaan {getReadingTime(step.description)} menit
                  </p>
                </div>
                {isDone && <PositiveCheckmarkIcon className="size-6 shrink-0" />}
              </Link>
            );
          })}
          {!isLoading && steps.length === 0 && (
            <p className="text-content-secondary">Belum ada artikel untuk jalur ini.</p>
          )}
        </div>
      </div>

      <LoginModal />
    </div>
  );
}
