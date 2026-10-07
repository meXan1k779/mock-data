import clsx from 'clsx';

import { Skeleton } from '../skeleton';

interface CardSkeletonProps {
  className?: string;
}

export const CardSkeleton = ({ className }: CardSkeletonProps) => {
  return (
    <div className={clsx(className, 'bg-background-primary py-6')}>
      <div className="flex items-center mb-3">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="w-21.5 h-3.5 mx-2 rounded" />
        <Skeleton className="w-21.5 h-3.5 rounded" />
      </div>

      <div className="sm:flex mb-4 sm:mb-0">
        <div className="w-full sm:w-[75%]">
          <Skeleton className="w-full h-7 md:h-8 mb-2 rounded" />
          <Skeleton className="w-3/4 h-7 md:h-8 mb-4 rounded" />

          <div className="space-y-2 mb-4 sm:mb-0">
            <Skeleton className="w-full h-3 rounded" />
            <Skeleton className="w-11/12 h-3 rounded" />
            <Skeleton className="w-10/12 h-3 rounded" />
          </div>

          <div className="flex items-center flex-wrap mb-5 sm:mb-6 mt-4 gap-1">
            <Skeleton className="w-21.5 h-6 rounded-sm" />
          </div>
        </div>
        <Skeleton className="w-full sm:w-[168px] sm:h-[126px] lg:w-[177px] lg:h-[133px] sm:ml-3 h-[246px] mt-[13px] rounded" />
      </div>

      <div className="flex justify-between items-center mt-4">
        <Skeleton className="rounded-3xl w-[73px] h-8 " />
      </div>
    </div>
  );
};
