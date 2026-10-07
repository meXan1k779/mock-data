import clsx from 'clsx';
import Link from 'next/link';

import { Avatar } from '@/shared/ui/avatar';

import type { TradingVideoDefinition } from '../model/constants';

interface VideoCardProps {
  video: TradingVideoDefinition;
  className?: string;
}

export const VideoCard = ({ video, className }: VideoCardProps) => {
  const { id, title, authorName, authorAvatarUrl, thumbnailUrl, duration, progressPercent } = video;
  const isContinuing = progressPercent !== undefined;

  return (
    <Link href={`/video/${id}`} className={clsx('group relative flex flex-col gap-3', className)}>
      <div className="pointer-events-none absolute -inset-2 rounded-xl border border-border-tetriary opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative aspect-video w-full overflow-hidden rounded">
        <img src={thumbnailUrl} alt="" className="absolute inset-0 size-full object-cover" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex size-[52px] items-center justify-center rounded-full bg-[rgba(17,25,40,0.48)]">
            <img src="/trading-videos/play-fill.svg" alt="" className="size-6" />
          </div>
        </div>

        {isContinuing && (
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[rgba(17,25,40,0.1)]">
            <div className="h-full bg-[#ff9800]" style={{ width: `${progressPercent}%` }} />
          </div>
        )}

        <div className="absolute right-2 bottom-2 rounded bg-[rgba(17,25,40,0.48)] px-[6px] pb-[2px] text-xs leading-4 font-medium text-white">
          {duration}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Avatar size="sm" nickname={authorName} avatarUrl={authorAvatarUrl} />
          <p className="text-sm leading-5 text-content-primary group-hover:text-content-secondary">
            {authorName}
          </p>
        </div>
        <p className="line-clamp-3 text-base leading-6 font-semibold text-content-primary group-hover:text-content-secondary">
          {title}
        </p>
      </div>
    </Link>
  );
};
