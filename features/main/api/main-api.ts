import type { ContentResponse } from '@/features/article/new-article/api/types';
import { baseApi } from '@/shared/api/base-api';

// Useberry usability-test build: voting needs a real authenticated session,
// which this build doesn't have (see features/auth/models/auth-slice.ts), so
// it's tracked locally instead of hitting the real backend. `currentVote` is
// the count already shown in the UI (real, for existing articles, or the
// mock baseline for videos) — it seeds the local count the first time this
// id is voted on, so the number increments from what the tester already saw
// rather than jumping to some unrelated local-only value.
const STORAGE_KEY = 'useberry-votes';

type VoteStatus = 'upvote' | 'downvote' | 'unvote';

interface VoteRecord {
  count: number;
  status: VoteStatus;
}

const statusValue = (status: VoteStatus) =>
  status === 'upvote' ? 1 : status === 'downvote' ? -1 : 0;

const readVotes = (): Record<string, VoteRecord> => {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
};

const writeVotes = (votes: Record<string, VoteRecord>) => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
};

// Lets a page seed its initial vote display from a previous local vote
// (e.g. mock videos, which have no real backend row to re-fetch on reload —
// see features/trading-videos/video-page/ui/index.tsx).
export const getStoredVote = (id: string): VoteRecord | undefined => readVotes()[id];

export const mainApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    vote: builder.mutation<
      ContentResponse,
      { vote: string; articleId: string; currentVote?: string }
    >({
      queryFn: ({ vote, articleId, currentVote }) => {
        const status = vote as VoteStatus;
        const votes = readVotes();
        const existing = votes[articleId];
        const baseline = existing ? existing.count : Number(currentVote ?? 0) || 0;
        const prevStatus = existing?.status ?? 'unvote';
        const nextCount = Math.max(0, baseline + statusValue(status) - statusValue(prevStatus));

        votes[articleId] = { count: nextCount, status };
        writeVotes(votes);

        return { data: { vote: String(nextCount) } as ContentResponse };
      },
      invalidatesTags: ['Bookmarks', 'AllMyContent'],
    }),

    getApprovalDoc: builder.query<Blob, void>({
      query: () => ({
        url: '/approvalDoc',
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useVoteMutation, useLazyGetApprovalDocQuery } = mainApi;
