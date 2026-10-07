import type { ContentResponse } from '@/features/article/new-article/api/types';
import { baseApi } from '@/shared/api/base-api';

// Useberry usability-test build: bookmarking needs a real authenticated
// session, which this build doesn't have (see
// features/auth/models/auth-slice.ts), so bookmarks are kept in localStorage
// instead of hitting the real backend — they persist for the rest of the
// session (and across a refresh) instead of silently failing.
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
      queryFn: async (_arg, _api, _extraOptions, baseQuery) => {
        const stored = readStoredBookmarks();
        if (stored !== null) {
          return { data: stored };
        }

        // Fresh Useberry tester, nothing bookmarked yet — seed a couple of
        // real articles so the bookmarks page isn't empty on first visit.
        const result = await baseQuery('api/content?page=0');
        const articles = Array.isArray(result.data) ? (result.data as ContentResponse[]) : [];
        const seed = articles.slice(0, 2);
        writeBookmarks(seed);
        return { data: seed };
      },
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
