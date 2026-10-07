import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/shared/api/store';
import { getReadingTime } from '@/shared/utils/getReadingTime';

import { usePathSteps } from './use-path-steps';

export type PathStatus = 'not-started' | 'in-progress' | 'completed';

export interface PathProgress {
  status: PathStatus;
  completedCount: number;
  totalCount: number;
  totalMinutes: number;
  remainingMinutes: number;
  isLoading: boolean;
  /** id of the first step that hasn't been read yet — where "Continue" should resume */
  nextStepId: string | null;
}

export function usePathProgress(pathId: string): PathProgress {
  const { steps, isLoading } = usePathSteps(pathId);
  const readArticleIds = useSelector((state: RootState) => state.learningPaths.readArticleIds);
  const started = useSelector((state: RootState) => state.learningPaths.startedPaths[pathId]);

  return useMemo(() => {
    const totalMinutes = steps.reduce((sum, step) => sum + getReadingTime(step.description), 0);
    const completedSteps = steps.filter((step) => readArticleIds.includes(step.id));
    const remainingMinutes = steps
      .filter((step) => !readArticleIds.includes(step.id))
      .reduce((sum, step) => sum + getReadingTime(step.description), 0);

    const totalCount = steps.length;
    const completedCount = completedSteps.length;

    let status: PathStatus = 'not-started';
    if (totalCount > 0 && completedCount === totalCount) {
      status = 'completed';
    } else if (completedCount > 0 || started) {
      status = 'in-progress';
    }

    const nextStep = steps.find((step) => !readArticleIds.includes(step.id));

    return {
      status,
      completedCount,
      totalCount,
      totalMinutes,
      remainingMinutes,
      isLoading,
      nextStepId: nextStep?.id ?? null,
    };
  }, [steps, readArticleIds, started, isLoading]);
}
