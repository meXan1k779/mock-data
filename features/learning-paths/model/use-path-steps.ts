import { useMemo } from 'react';

import { useGetAllContentQuery } from '@/features/article/new-article/api/article-api';
import type { ContentResponse } from '@/features/article/new-article/api/types';

import { getLearningPathById, learningPaths } from './constants';

/**
 * Learning paths curate a specific, ordered set of real published articles
 * (see `articleIds` in constants.ts, matched against the Figma course
 * structure). Content not yet published in the backend is simply absent —
 * we never fabricate placeholder entries for it.
 *
 * The backend paginates at a fixed 10 items/page and ignores any limit/size
 * override, so curated IDs from later pages would otherwise never be found —
 * fetch a handful of pages unconditionally and merge them. Cheap enough for
 * this catalog's size, and simpler than a skip-cascade across hook calls.
 */
function usePublishedContent() {
  const queryOptions = { refetchOnMountOrArgChange: false };
  const page0 = useGetAllContentQuery({ page: 0, topic: '' }, queryOptions);
  const page1 = useGetAllContentQuery({ page: 1, topic: '' }, queryOptions);
  const page2 = useGetAllContentQuery({ page: 2, topic: '' }, queryOptions);
  const page3 = useGetAllContentQuery({ page: 3, topic: '' }, queryOptions);
  const page4 = useGetAllContentQuery({ page: 4, topic: '' }, queryOptions);

  const isLoading =
    page0.isLoading || page1.isLoading || page2.isLoading || page3.isLoading || page4.isLoading;

  const data = useMemo(
    () =>
      [page0.data, page1.data, page2.data, page3.data, page4.data].flatMap((page) => page ?? []),
    [page0.data, page1.data, page2.data, page3.data, page4.data],
  );

  return { data, isLoading };
}

function orderByIds(data: ContentResponse[] | undefined, articleIds: string[]): ContentResponse[] {
  if (!data) {
    return [];
  }
  const byId = new Map(data.map((article) => [article.id, article]));
  return articleIds
    .map((id) => byId.get(id))
    .filter((article): article is ContentResponse => !!article);
}

export function usePathSteps(pathId: string): { steps: ContentResponse[]; isLoading: boolean } {
  const path = getLearningPathById(pathId);
  const { data, isLoading } = usePublishedContent();

  const steps = useMemo(() => orderByIds(data, path?.articleIds ?? []), [data, path]);

  return { steps, isLoading };
}

export function useAllPathsSteps(): Record<
  string,
  { steps: ContentResponse[]; isLoading: boolean }
> {
  const { data, isLoading } = usePublishedContent();

  return useMemo(() => {
    const result: Record<string, { steps: ContentResponse[]; isLoading: boolean }> = {};
    learningPaths.forEach((path) => {
      result[path.id] = {
        steps: orderByIds(data, path.articleIds),
        isLoading,
      };
    });
    return result;
  }, [data, isLoading]);
}

/** Finds which path (if any) an article belongs to, and its step position within it. */
export function useArticlePathContext(articleId: string | undefined) {
  const allSteps = useAllPathsSteps();

  return useMemo(() => {
    if (!articleId) {
      return null;
    }
    for (const path of learningPaths) {
      const { steps } = allSteps[path.id];
      const stepIndex = steps.findIndex((step) => step.id === articleId);
      if (stepIndex !== -1) {
        return { pathId: path.id, steps, stepIndex };
      }
    }
    return null;
  }, [articleId, allSteps]);
}
