import type { ContentResponse } from '@/features/article/new-article/api/types';
import { ArticleStatus } from '@/shared/types/types';

import { allTradingVideos, getVideoEngagement } from '../../model/constants';

export type VideoContent = ContentResponse;

const creator = {
  createdAt: new Date().toISOString(),
  avatarUrl: '/trading-videos/author-avatar.png',
  email: '',
  iconUrl: '',
  id: 'brahmantya-himawan',
  isDeleted: false,
  isVerified: true,
  nickname: 'Brahmantya Himawan',
  role: 'author',
};

// ~2 months ago, computed at import time so "sekitar 2 bulan yang lalu" always reads correctly.
const postedTwoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

// TODO: replace with real video content once the API endpoint exists. The
// player itself is a placeholder for now (per Figma "Video page for test
// prototype") — no real or external video is loaded on this page.
// Only videos actually reviewed by Bappebti get an approval number here —
// complexity/topic/vote/commentCount now live on the video definition itself
// (see features/trading-videos/model/constants.ts) so Discover and this page
// can't drift out of sync the way they used to.
const approveIdByVideoId: Record<string, string> = {
  'fibonacci-golden-area': 'KB.00.00/765/BAPPEBTI.4/SD/06/2026 24 Juni 2026',
  'macd-divergence': 'KB.00.00/612/BAPPEBTI.4/SD/05/2026 18 Mei 2026',
  'candlestick-engulfing': 'KB.00.00/598/BAPPEBTI.4/SD/05/2026 5 Mei 2026',
  'support-resistance': 'KB.00.00/577/BAPPEBTI.4/SD/04/2026 22 April 2026',
};

export const videoContentById: Record<string, VideoContent> = Object.fromEntries(
  allTradingVideos.map((video) => {
    const { voteCount, commentCount } = getVideoEngagement(video.id);

    return [
      video.id,
      {
        id: video.id,
        title: video.title,
        description: '',
        complexity: video.complexity,
        status: ArticleStatus.APPROVED,
        approveId: approveIdByVideoId[video.id],
        createdAt: postedTwoMonthsAgo,
        creatorId: creator.id,
        topics: [video.topic],
        vote: String(voteCount),
        commentCount,
        Creator: creator,
      },
    ];
  }),
);
