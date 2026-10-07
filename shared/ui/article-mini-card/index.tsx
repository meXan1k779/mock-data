import clsx from 'clsx';
import Link from 'next/link';

import { LevelBadge } from '@/shared/ui/level-badge';

export interface ArticleMiniCardProps {
  id: string;
  title: string;
  previewUrl: string;
  complexity: number;
  topic: string;
  className?: string;
}

export const ArticleMiniCard = ({
  id,
  title,
  previewUrl,
  complexity,
  topic,
  className,
}: ArticleMiniCardProps) => {
  return (
    <Link href={`/article/${id}`} className={clsx(className, 'flex flex-1 flex-col gap-2 min-w-0')}>
      <div className="aspect-[212/159] w-full overflow-hidden rounded-lg">
        <img src={previewUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <p className="font-noto font-semibold text-base leading-6 text-content-primary">{title}</p>
      <div className="flex flex-wrap items-center gap-1">
        <LevelBadge level={complexity} />
        <div className="text-xs text-content-primary px-2 py-1 rounded-md bg-background-secondary">
          {topic}
        </div>
      </div>
    </Link>
  );
};
