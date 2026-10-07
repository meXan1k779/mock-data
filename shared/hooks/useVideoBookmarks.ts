'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'video-bookmarks';

// Seeded on a fresh tester's first visit so the bookmarks page isn't empty
// (see readStoredIds below) — a bookmarked video the tester never actually
// bookmarked, not an editorial pick, so any 1-2 known-valid ids work.
const DEFAULT_BOOKMARKED_VIDEO_IDS = ['fibonacci-golden-area', 'support-resistance'];

function readStoredIds(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      // Never touched (fresh tester) vs. an explicit `[]` (tester removed
      // every bookmark) — only the former gets seeded.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKMARKED_VIDEO_IDS));
      return DEFAULT_BOOKMARKED_VIDEO_IDS;
    }
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

// Trading videos are mock-only content (see features/trading-videos) with no
// matching row in the real Content table, so they can't go through the
// api/bookmark/:contentId endpoint used for articles. This persists saved
// video ids client-side instead, so the bookmarks page can still show them.
export function useVideoBookmarks() {
  const [bookmarkedVideoIds, setBookmarkedVideoIds] = useState<string[]>([]);

  useEffect(() => {
    // Hydrating from localStorage (unavailable during SSR/first render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBookmarkedVideoIds(readStoredIds());
  }, []);

  const isBookmarked = useCallback(
    (videoId: string) => bookmarkedVideoIds.includes(videoId),
    [bookmarkedVideoIds],
  );

  const toggleBookmark = useCallback((videoId: string) => {
    setBookmarkedVideoIds((prev) => {
      const next = prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { bookmarkedVideoIds, isBookmarked, toggleBookmark };
}
