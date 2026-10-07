import Link from 'next/link';

import { ChevronLeftIcon } from '@/shared/icons/chevronLeftIcon';

import { tradingVideos } from '../model/constants';

import { VideoCard } from './video-card';

export const TradingVideosSection = () => {
  return (
    <div className="mb-8 lg:mb-10 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-noto text-[18px] leading-[24px] font-semibold text-content-primary md:font-manrope md:text-[20px] md:leading-[28px] lg:font-noto lg:text-[24px] lg:leading-[32px]">
          Baru: video trading
        </p>
        <Link
          href="/discover/video"
          className="btn cursor-pointer whitespace-nowrap btn--text btn--sm"
        >
          <span className="btn-content inline-flex items-center gap-2">
            Video lainnya
            <ChevronLeftIcon className="h-3 w-2 rotate-180 sm:hidden" />
          </span>
        </Link>
      </div>

      {/* <768 (mobile): fluid 2x2 grid, all videos, no scroll (per Figma) */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-4 md:hidden">
        {tradingVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* 768-959 (tablet): single fluid row, 4 equal-width cards, no scroll (per Figma) */}
      <div className="hidden md:flex gap-4 2md:hidden">
        {tradingVideos.map((video) => (
          <VideoCard key={video.id} video={video} className="min-w-0 flex-1" />
        ))}
      </div>

      {/* 960-1199: fluid 2x2 grid, all videos, no scroll (per Figma) */}
      <div className="hidden grid-cols-2 gap-4 2md:grid min-[1200px]:hidden">
        {tradingVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* >=1200: fluid 4-column grid, all videos */}
      <div className="hidden grid-cols-4 gap-4 min-[1200px]:grid">
        {tradingVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};
