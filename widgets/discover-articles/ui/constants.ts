export { DISCOVER_VIDEOS, type DiscoverVideoItem } from '@/features/trading-videos/model/constants';

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'popular', label: 'Paling populer' },
  { value: 'commented', label: 'Paling banyak dikomentari' },
] as const;

export type SortBy = (typeof SORT_OPTIONS)[number]['value'];

export const DIFFICULTY_TABS = [
  { label: 'Untuk pemula', complexity: 1 },
  { label: 'Untuk trader tingkat lanjut', complexity: 2 },
  { label: 'Untuk ahli', complexity: 3 },
];

function hashSeed(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash);
}

// There's no list-level popularity/comments-count endpoint yet, so real articles come
// back with near-uniform numbers (votes cluster 6-11, comments are always 0) — sorting
// by them technically works but never visibly reorders anything. This derives a
// deterministic per-article mock baseline (seeded by id) to add on top of the real
// vote/commentCount, so "Most popular"/"Most commented" demonstrably work while a real
// upvote click still visibly increments the count.
export function getMockEngagementBaseline(seed: string): { vote: number; commentCount: number } {
  const hash = hashSeed(seed || 'article');
  return {
    vote: 12 + (hash % 470),
    commentCount: (hash >> 3) % 58,
  };
}
