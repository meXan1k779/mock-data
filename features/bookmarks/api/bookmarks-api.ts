import type { ContentResponse } from '@/features/article/new-article/api/types';
import { mockResponse } from '@/mocks/backend';
import { listPublished } from '@/mocks/backend/content';
import { getStoredVote } from '@/mocks/backend/votes';
import { baseApi } from '@/shared/api/base-api';

// Prototype build: there is no backend, so bookmarks are kept in
// localStorage — they persist for the rest of the session (and across a
// refresh).
const STORAGE_KEY = 'useberry-bookmarks';

// `null` means "never touched" (fresh tester) vs. `[]` meaning "explicitly
// emptied" (tester removed every bookmark) — only the former gets seeded,
// see getMyBookmarks below.
const readStoredBookmarks = (): ContentResponse[] | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const readBookmarks = (): ContentResponse[] => readStoredBookmarks() ?? [];

const writeBookmarks = (items: ContentResponse[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const bookmarksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyBookmarks: builder.query<ContentResponse[], void>({
      queryFn: () =>
        mockResponse(async () => {
          const stored = readStoredBookmarks();
          if (stored !== null) {
            // Snapshots are taken at bookmark time — show the current local vote.
            return stored.map((item) => {
              const vote = getStoredVote(item.id);
              if (!vote) {
                return item;
              }
              const alreadyVote = vote.status === 'unvote' ? undefined : vote.status;
              return { ...item, vote: String(vote.count), alreadyVote };
            });
          }

          // Fresh tester, nothing bookmarked yet — seed a couple of articles
          // so the bookmarks page isn't empty on first visit.
          const seed = (await listPublished(0, '')).slice(0, 2);
          writeBookmarks(seed);
          return seed;
        }),
      providesTags: ['Bookmarks'],
    }),

    addBookmark: builder.mutation<void, { contentId: string; article: ContentResponse }>({
      queryFn: ({ contentId, article }) => {
        const items = readBookmarks();
        if (!items.some((item) => item.id === contentId)) {
          writeBookmarks([...items, article]);
        }
        return { data: undefined };
      },
      invalidatesTags: ['Bookmarks'],
    }),

    removeBookmark: builder.mutation<void, string>({
      queryFn: (contentId) => {
        writeBookmarks(readBookmarks().filter((item) => item.id !== contentId));
        return { data: undefined };
      },
      invalidatesTags: ['Bookmarks'],
    }),
  }),
});

export const { useGetMyBookmarksQuery, useAddBookmarkMutation, useRemoveBookmarkMutation } =
  bookmarksApi;
