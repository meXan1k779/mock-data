import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return <div className={clsx('animate-pulse bg-secondary-default rounded', className)} />;
};
