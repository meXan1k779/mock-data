'use client';

import { Skeleton } from '@/shared/ui/skeleton';

export const ArticlePageSkeleton = () => {
  return (
    <div className="max-w-[700px] mx-4 sm:mx-8 md:m-auto pt-6">
      {/* Title */}
      <Skeleton className="w-full h-9 md:h-11 mb-3 rounded" />
      <Skeleton className="w-3/4 h-9 md:h-11 mb-6 rounded" />

      {/* Badges */}
      <div className="flex items-center flex-wrap gap-1 mb-4">
        <Skeleton className="w-16 h-6 rounded-sm" />
        <Skeleton className="w-20 h-6 rounded-sm" />
        <Skeleton className="w-14 h-6 rounded-sm" />
      </div>

      {/* Author row */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-24 h-4 rounded" />
          <Skeleton className="w-16 h-4 rounded" />
        </div>
      </div>

      {/* Content paragraphs */}
      <div className="space-y-3 mb-6">
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-11/12 h-4 rounded" />
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-10/12 h-4 rounded" />
        <Skeleton className="w-full h-4 rounded" />
      </div>

      <Skeleton className="w-full h-48 rounded mb-6" />

      <div className="space-y-3 mb-6">
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-9/12 h-4 rounded" />
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-11/12 h-4 rounded" />
      </div>

      <Skeleton className="w-full h-36 rounded mb-6" />

      <div className="space-y-3">
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-10/12 h-4 rounded" />
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-8/12 h-4 rounded" />
      </div>
    </div>
  );
};
