export interface TradingVideoDefinition {
  id: string;
  title: string;
  authorName: string;
  authorAvatarUrl?: string;
  thumbnailUrl: string;
  duration: string;
  complexity: number;
  topic: string;
  /**
   * Continue-watching progress, 0-100. When set, the card is in the Figma
   * "New=No" state: the progress bar always shows, and hover dims the text
   * without a play button. When unset, it's "New=Yes": hover reveals a play
   * button and no progress bar is shown.
   */
  progressPercent?: number;
}

// Shown in the home page "New: trading videos" carousel — kept small and
// curated on purpose, separate from the larger catalog below that only
// appears in Discover (see allTradingVideos).
export const tradingVideos: TradingVideoDefinition[] = [
  {
    id: 'macd-divergence',
    title: 'MACD Divergence: Mengenali Potensi Pembalikan Tren',
    authorName: 'Brahmantya Himawan',
    authorAvatarUrl: '/trading-videos/author-avatar.png',
    thumbnailUrl: '/trading-videos/thumbnail-macd.png',
    duration: '4:48',
    complexity: 1,
    topic: 'Analisis Trading',
  },
  {
    id: 'fibonacci-golden-area',
    title: 'Trading dengan Fibonacci: Menemukan Golden Area',
    authorName: 'Brahmantya Himawan',
    authorAvatarUrl: '/trading-videos/author-avatar.png',
    thumbnailUrl: '/trading-videos/thumbnail-fibonacci.png',
    duration: '6:12',
    complexity: 1,
    topic: 'Analisis Trading',
  },
  {
    id: 'candlestick-engulfing',
    title: 'Contoh Trading Menggunakan Pola Candlestick Engulfing',
    authorName: 'Brahmantya Himawan',
    authorAvatarUrl: '/trading-videos/author-avatar.png',
    thumbnailUrl: '/trading-videos/thumbnail-candlestick.png',
    duration: '3:57',
    complexity: 1,
    topic: 'Analisis Trading',
  },
  {
    id: 'support-resistance',
    title: 'Support, Resistance, dan Big Movement',
    authorName: 'Brahmantya Himawan',
    authorAvatarUrl: '/trading-videos/author-avatar.png',
    thumbnailUrl: '/trading-videos/cover-support-resistance.png',
    duration: '7:03',
    complexity: 1,
    topic: 'Analisis Trading',
    progressPercent: 21,
  },
];

// Discover-only catalog — not shown in the home carousel, only used to give
// the Discover "video" tab enough variety (complexity/topic/engagement) to
// make filtering and sorting demonstrably do something. Reuses the existing
// thumbnail assets since there are no dedicated images for these mock videos.
const additionalDiscoverVideos: TradingVideoDefinition[] = [
  {
    id: 'deposit-withdrawal-guide',
    title: 'Cara Mudah Melakukan Deposit dan Penarikan Dana di Finex',
    authorName: 'Siti Rahmawati',
    thumbnailUrl: '/trading-videos/thumbnail-macd.png',
    duration: '4:10',
    complexity: 1,
    topic: 'Deposit dan Penarikan',
  },
  {
    id: 'deposit-withdrawal-fees',
    title: 'Mengenal Biaya dan Waktu Proses Deposit-Penarikan',
    authorName: 'Siti Rahmawati',
    thumbnailUrl: '/trading-videos/thumbnail-fibonacci.png',
    duration: '3:48',
    complexity: 1,
    topic: 'Deposit dan Penarikan',
  },
  {
    id: 'withdrawal-troubleshooting',
    title: 'Mengatasi Kendala saat Penarikan Dana',
    authorName: 'Dimas Prakoso',
    thumbnailUrl: '/trading-videos/thumbnail-candlestick.png',
    duration: '6:02',
    complexity: 2,
    topic: 'Deposit dan Penarikan',
  },
  {
    id: 'risk-management-basics',
    title: 'Manajemen Risiko untuk Trader Pemula: Stop Loss dan Position Sizing',
    authorName: 'Dimas Prakoso',
    thumbnailUrl: '/trading-videos/cover-support-resistance.png',
    duration: '7:15',
    complexity: 2,
    topic: 'Manajemen Risiko',
  },
  {
    id: 'trading-psychology-fomo',
    title: 'Mengatasi FOMO dan Panic Selling saat Trading',
    authorName: 'Nadia Putri',
    thumbnailUrl: '/trading-videos/thumbnail-macd.png',
    duration: '5:33',
    complexity: 2,
    topic: 'Emosi dan Psikologi Trading',
  },
  {
    id: 'finex-platform-tour',
    title: 'Tur Platform Trading Finex: Fitur yang Wajib Anda Tahu',
    authorName: 'Nadia Putri',
    thumbnailUrl: '/trading-videos/thumbnail-fibonacci.png',
    duration: '8:30',
    complexity: 1,
    topic: 'Platform Trading Finex',
  },
  {
    id: 'account-verification-guide',
    title: 'Panduan Lengkap Verifikasi Akun Finex',
    authorName: 'Siti Rahmawati',
    thumbnailUrl: '/trading-videos/thumbnail-candlestick.png',
    duration: '3:20',
    complexity: 1,
    topic: 'Verifikasi Akun',
  },
  {
    id: 'advanced-chart-tools',
    title: 'Alat Analisis Chart Tingkat Lanjut: Bollinger Bands dan RSI',
    authorName: 'Brahmantya Himawan',
    authorAvatarUrl: '/trading-videos/author-avatar.png',
    thumbnailUrl: '/trading-videos/cover-support-resistance.png',
    duration: '9:02',
    complexity: 3,
    topic: 'Alat Trading',
  },
  {
    id: 'expert-portfolio-hedging',
    title: 'Strategi Hedging Portofolio untuk Trader Berpengalaman',
    authorName: 'Dimas Prakoso',
    thumbnailUrl: '/trading-videos/thumbnail-macd.png',
    duration: '10:12',
    complexity: 3,
    topic: 'Analisis Trading',
  },
];

// Full catalog (home-featured + Discover-only) — used wherever a video needs
// to be resolvable by id regardless of where it was discovered (video detail
// page, Discover grid).
export const allTradingVideos: TradingVideoDefinition[] = [
  ...tradingVideos,
  ...additionalDiscoverVideos,
];

export interface DiscoverVideoItem {
  id: string;
  title: string;
  authorName: string;
  authorAvatarUrl: string;
  thumbnailUrl: string;
  duration: string;
  timeAgo: string;
  complexity: number;
  topic: string;
  voteCount: number;
  commentCount: number;
}

// Hand-picked, visibly distinct engagement numbers per mock video — there's only a
// handful of these, so curating them directly reads clearer than hashing an id.
// Deliberately uncorrelated with complexity/topic/order, so switching between
// Newest/Most popular/Most commented visibly reorders the grid instead of
// coincidentally landing back on the same order, and filtering by level/topic
// isn't the same as sorting by engagement.
const VIDEO_ENGAGEMENT: Record<string, { voteCount: number; commentCount: number }> = {
  'macd-divergence': { voteCount: 76, commentCount: 58 },
  'fibonacci-golden-area': { voteCount: 342, commentCount: 3 },
  'candlestick-engulfing': { voteCount: 19, commentCount: 24 },
  'support-resistance': { voteCount: 128, commentCount: 9 },
  'deposit-withdrawal-guide': { voteCount: 265, commentCount: 112 },
  'deposit-withdrawal-fees': { voteCount: 58, commentCount: 19 },
  'withdrawal-troubleshooting': { voteCount: 140, commentCount: 200 },
  'risk-management-basics': { voteCount: 215, commentCount: 41 },
  'trading-psychology-fomo': { voteCount: 12, commentCount: 15 },
  'finex-platform-tour': { voteCount: 301, commentCount: 67 },
  'account-verification-guide': { voteCount: 54, commentCount: 2 },
  'advanced-chart-tools': { voteCount: 180, commentCount: 95 },
  'expert-portfolio-hedging': { voteCount: 8, commentCount: 5 },
};

// Cycled across videos just for variety in the "posted X ago" label — there's no
// real publish timestamp for mock videos.
const TIME_AGO_CYCLE = [
  '2 jam yang lalu',
  '1 hari yang lalu',
  '3 hari yang lalu',
  '1 minggu yang lalu',
  '2 minggu yang lalu',
  '1 bulan yang lalu',
];

const DEFAULT_VIDEO_ENGAGEMENT = { voteCount: 12, commentCount: 1 };

// Shared lookup so any page showing a single video (e.g. the video detail
// page) can display the same vote/comment counts as the Discover cards
// instead of drifting out of sync with them.
export function getVideoEngagement(videoId: string): { voteCount: number; commentCount: number } {
  return VIDEO_ENGAGEMENT[videoId] ?? DEFAULT_VIDEO_ENGAGEMENT;
}

// Mock engagement data layered on top of the catalog above. Complexity/topic
// come straight from the video definition so the level tabs and topic filter
// (in Discover) actually narrow this list down.
export const DISCOVER_VIDEOS: DiscoverVideoItem[] = allTradingVideos.map((video, index) => ({
  id: video.id,
  title: video.title,
  authorName: video.authorName,
  authorAvatarUrl: video.authorAvatarUrl ?? '',
  thumbnailUrl: video.thumbnailUrl,
  duration: video.duration,
  timeAgo: TIME_AGO_CYCLE[index % TIME_AGO_CYCLE.length],
  complexity: video.complexity,
  topic: video.topic,
  ...getVideoEngagement(video.id),
}));
