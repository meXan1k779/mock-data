import type { ArticleMiniCardProps } from '@/shared/ui/article-mini-card';

// TODO: replace with real recommendations once the API endpoint exists.
export const whatTradersReadNextMock: Omit<ArticleMiniCardProps, 'className'>[] = [
  {
    id: '1',
    title: 'Memahami Level Support dan Resistance dalam Day Trading',
    previewUrl: '/what-traders-read-next/support-resistance-1.png',
    complexity: 1,
    topic: 'Setoran dan penarikan',
  },
  {
    id: '2',
    title: 'Menguasai Support dan Resistance: Konsep Kunci untuk Day Trading yang Sukses',
    previewUrl: '/what-traders-read-next/support-resistance-2.png',
    complexity: 1,
    topic: 'Setoran dan penarikan',
  },
  {
    id: '3',
    title: 'Mengurai Tren Pasar',
    previewUrl: '/what-traders-read-next/market-trends.png',
    complexity: 1,
    topic: 'Dasar-dasar trading',
  },
];
