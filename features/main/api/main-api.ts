import type { ContentResponse } from '@/features/article/new-article/api/types';
import { simulateLatency } from '@/mocks/backend/db';
import { castVote, getStoredVote, type VoteStatus } from '@/mocks/backend/votes';
import { baseApi } from '@/shared/api/base-api';

// Prototype build: no backend — votes live in localStorage (see
// mocks/backend/votes.ts), the approval document is a static file.

// Lets a page seed its initial vote display from a previous local vote
// (e.g. mock videos, which have no real backend row to re-fetch on reload —
// see features/trading-videos/video-page/ui/index.tsx).
export { getStoredVote };

const APPROVAL_DOC_URL = '/mock-assets/approval-doc.pdf';

export const mainApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    vote: builder.mutation<
      ContentResponse,
      { vote: string; articleId: string; currentVote?: string }
    >({
      queryFn: ({ vote, articleId, currentVote }) => {
        const nextCount = castVote(articleId, vote as VoteStatus, currentVote);
        return { data: { vote: String(nextCount) } as ContentResponse };
      },
      invalidatesTags: ['Bookmarks', 'AllMyContent'],
    }),

    getApprovalDoc: builder.query<Blob, void>({
      queryFn: async () => {
        await simulateLatency();
        try {
          const response = await fetch(APPROVAL_DOC_URL);
          return { data: await response.blob() };
        } catch {
          return { error: { status: 'FETCH_ERROR', error: 'Failed to load approval document' } };
        }
      },
    }),
  }),
});

export const { useVoteMutation, useLazyGetApprovalDocQuery } = mainApi;
