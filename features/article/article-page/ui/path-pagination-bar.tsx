'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

import { usePathSteps } from '@/features/learning-paths/model/use-path-steps';
import type { RootState } from '@/shared/api/store';
import { ChevronLeftIcon } from '@/shared/icons/chevronLeftIcon';
import { MenuIcon } from '@/shared/icons/menuIcon';
import { Button } from '@/shared/ui/button';

interface PathPaginationBarProps {
  pathId: string;
  articleId: string;
  onOpenCourseMenu: () => void;
  onFinish: () => void;
}

export const PathPaginationBar = ({
  pathId,
  articleId,
  onOpenCourseMenu,
  onFinish,
}: PathPaginationBarProps) => {
  const router = useRouter();
  const { steps } = usePathSteps(pathId);
  const readArticleIds = useSelector((state: RootState) => state.learningPaths.readArticleIds);

  const index = steps.findIndex((step) => step.id === articleId);
  const prevStep = index > 0 ? steps[index - 1] : null;
  const nextStep = index !== -1 && index < steps.length - 1 ? steps[index + 1] : null;
  const isLastStep = index !== -1 && !nextStep;
  const isFinishing = isLastStep && !readArticleIds.includes(articleId);

  if (index === -1) {
    return null;
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-background-primary border-t border-border-tetriary lg:border-t-0 py-3 flex items-center justify-between mt-6">
      <Button
        variant="secondary"
        size="md"
        className="lg:pl-2.5 lg:pr-3 lg:py-2 lg:rounded-md lg:text-xs"
        leftIcon={<ChevronLeftIcon className="w-2 h-3" />}
        disabled={!prevStep}
        onClick={() => prevStep && router.push(`/article/${prevStep.id}?path=${pathId}`)}
      >
        Sebelumnya
      </Button>
      <button
        type="button"
        onClick={onOpenCourseMenu}
        aria-label="Course structure"
        className="lg:hidden flex items-center justify-center size-10 shrink-0 rounded-lg hover:bg-background-secondary transition-colors text-content-primary"
      >
        <MenuIcon />
      </button>
      <Button
        size="md"
        className="lg:pl-3 lg:pr-2.5 lg:py-2 lg:rounded-md lg:text-xs"
        rightIcon={!isFinishing ? <ChevronLeftIcon className="w-2 h-3 rotate-180" /> : undefined}
        disabled={!nextStep && !isFinishing}
        onClick={() => {
          if (nextStep) {
            router.push(`/article/${nextStep.id}?path=${pathId}`);
          } else if (isFinishing) {
            onFinish();
          }
        }}
      >
        {isFinishing ? 'Finish' : 'Next'}
      </Button>
    </div>
  );
};
