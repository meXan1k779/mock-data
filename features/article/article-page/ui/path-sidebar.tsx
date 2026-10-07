'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import { getLearningPathById } from '@/features/learning-paths/model/constants';
import { usePathSteps } from '@/features/learning-paths/model/use-path-steps';
import type { RootState } from '@/shared/api/store';
import { ChevronLeftIcon } from '@/shared/icons/chevronLeftIcon';
import { Close24Icon } from '@/shared/icons/close24Icon';
import { PositiveCheckmarkIcon } from '@/shared/icons/positiveCheckmarkIcon';
import { getReadingTime } from '@/shared/utils/getReadingTime';

interface PathSidebarProps {
  pathId: string;
  articleId: string;
  className?: string;
  onClose?: () => void;
}

export const PathSidebar = ({ pathId, articleId, className, onClose }: PathSidebarProps) => {
  const path = getLearningPathById(pathId);
  const { steps } = usePathSteps(pathId);
  const readArticleIds = useSelector((state: RootState) => state.learningPaths.readArticleIds);

  if (!path) {
    return null;
  }

  return (
    <aside className={clsx('flex flex-col min-h-0', className)}>
      <div className="flex items-start justify-between gap-2 pl-4 mb-5 shrink-0">
        <div className="flex flex-col gap-2">
          <p className="font-noto font-semibold text-lg leading-7 text-content-primary">
            {path.title}
          </p>
          <Link
            href={`/learning-paths/${pathId}`}
            className="text-base-link text-sm font-medium inline-flex items-center gap-1"
          >
            Ringkasan jalur
            <ChevronLeftIcon className="w-2 h-3 rotate-180" />
          </Link>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center size-10 shrink-0 rounded-lg hover:bg-background-secondary transition-colors"
          >
            <Close24Icon className="text-content-primary" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-[2px] overflow-y-auto min-h-0">
        {steps.map((step) => {
          const isCurrent = step.id === articleId;
          const isDone = readArticleIds.includes(step.id);
          return (
            <Link
              key={step.id}
              href={`/article/${step.id}?path=${pathId}`}
              className={clsx(
                'flex items-center gap-4 px-4 py-3 transition-colors',
                isCurrent
                  ? 'bg-background-secondary rounded-2xl'
                  : 'rounded-xl hover:bg-background-secondary',
              )}
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
                <p className="text-base text-content-primary truncate">{step.title}</p>
                <p className="text-sm text-content-secondary">
                  {getReadingTime(step.description)} min read
                </p>
              </div>
              {isDone && <PositiveCheckmarkIcon className="size-6 shrink-0" />}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
