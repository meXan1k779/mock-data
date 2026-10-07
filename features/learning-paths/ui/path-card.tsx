'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/ui/button';

import type { LearningPathDefinition } from '../model/constants';
import { usePathProgress } from '../model/use-path-progress';
import { usePathSteps } from '../model/use-path-steps';

interface PathCardProps {
  path: LearningPathDefinition;
  className?: string;
}

export const PathCard = ({ path, className }: PathCardProps) => {
  const router = useRouter();
  const progress = usePathProgress(path.id);
  const { steps } = usePathSteps(path.id);

  const handleClick = () => {
    if (progress.status === 'completed' || progress.status === 'in-progress') {
      const target = progress.nextStepId ?? steps[0]?.id;
      if (target) {
        router.push(`/article/${target}?path=${path.id}`);
        return;
      }
    }
    router.push(`/learning-paths/${path.id}`);
  };

  const percent =
    progress.totalCount > 0 ? Math.round((progress.completedCount / progress.totalCount) * 100) : 0;

  const isCompleted = progress.status === 'completed';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className={clsx(
        'group relative overflow-hidden flex flex-col justify-end cursor-pointer',
        'rounded-2xl h-[280px] pt-2 px-2 pb-2 gap-4',
        'sm:rounded-[20px] sm:h-[304px] sm:pt-4 sm:px-4 sm:pb-4',
        isCompleted && 'pb-[64px] sm:pb-[72px]',
        className,
      )}
    >
      <img
        src={path.heroImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.07]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black" />

      {isCompleted && (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-xs font-medium text-white bg-[#0b8b0f] px-2 pt-0.5 pb-1 rounded-xl">
          Selesai
        </div>
      )}

      <div className="relative flex flex-col gap-2">
        <p className="font-semibold text-white text-sm sm:text-lg leading-5 sm:leading-7">
          {path.title}
        </p>
        <div className="flex sm:hidden flex-col gap-0.5 text-secondary-default text-sm leading-5">
          <p>{progress.totalCount} artikel</p>
          <p>{progress.totalMinutes} menit</p>
        </div>
        <p className="hidden sm:block text-white text-sm">
          {progress.totalCount} artikel • {progress.totalMinutes} menit
        </p>
      </div>

      {progress.status === 'in-progress' && (
        <div className="relative flex flex-col gap-2.5 pt-1">
          <div className="h-1.5 w-full bg-white rounded-[3px] overflow-hidden">
            <div
              className="h-full rounded-[3px] bg-base-positive"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-white text-xs sm:text-sm">{progress.remainingMinutes} menit lagi</p>
        </div>
      )}

      {progress.status === 'not-started' && (
        <Button
          size="md"
          variant="secondary"
          className="relative w-full sm:w-auto self-start"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          Jelajahi
        </Button>
      )}
    </div>
  );
};
