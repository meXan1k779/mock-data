import { baseApi } from '@/shared/api/base-api';
import type { RootState } from '@/shared/api/store';

import type {
  CommentDto,
  CommentReportDto,
  CommentVoteStatus,
  GetCommentsParams,
  PostCommentRequest,
  ReportCommentRequest,
  UpdateCommentRequest,
  VoteCommentRequest,
  VoteCommentResponse,
} from './types';

// Useberry usability-test build: writing (post/edit/delete/vote/report) needs
// a real authenticated session, which this build doesn't have (see
// features/auth/models/auth-slice.ts). Reads still hit the real backend —
// existing articles keep their real comments — but writes are layered on top
// locally as an overlay (added/edited/deleted/voted, keyed by comment id) so
// they're visible for the rest of the session instead of silently failing.
// Reads merge the real response with this overlay; if the real read itself
// fails (e.g. a mock video id that doesn't exist on the backend), the base
// list is just empty and the overlay is all there is.
const STORAGE_KEY = 'useberry-comments-overlay';

interface LocalOverlay {
  added: CommentDto[];
  edited: Record<string, string>;
  deleted: string[];
  votes: Record<string, { vote: number; alreadyVote: CommentVoteStatus }>;
}

const emptyOverlay = (): LocalOverlay => ({ added: [], edited: {}, deleted: [], votes: {} });

const readOverlay = (): LocalOverlay => {
  if (typeof window === 'undefined') {
    return emptyOverlay();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...emptyOverlay(), ...JSON.parse(raw) } : emptyOverlay();
  } catch {
    return emptyOverlay();
  }
};

const writeOverlay = (overlay: LocalOverlay) => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
};

const genId = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Merges the overlay on top of a base list (real comments for this scope, or
// an empty array if the real fetch failed) for one contentId/parentId scope.
const mergeOverlay = (base: CommentDto[], belongsToScope: (c: CommentDto) => boolean) => {
  const overlay = readOverlay();
  const deleted = new Set(overlay.deleted);

  const localReplyCount = (parentId: string) =>
    overlay.added.filter((c) => c.parentId === parentId && !deleted.has(c.id)).length;

  return [...base, ...overlay.added.filter(belongsToScope)]
    .filter((c) => !deleted.has(c.id))
    .map((c) => {
      let next = c;
      if (overlay.edited[c.id] !== undefined) {
        next = { ...next, message: overlay.edited[c.id] };
      }
      const voteOverride = overlay.votes[c.id];
      if (voteOverride) {
        next = { ...next, vote: voteOverride.vote, alreadyVote: voteOverride.alreadyVote };
      }
      if (!next.parentId) {
        next = { ...next, replies: next.replies + localReplyCount(next.id) };
      }
      return next;
    });
};

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<CommentDto[], GetCommentsParams>({
      queryFn: async ({ contentId, page = 0, limit = 10 }, _api, _extra, baseQuery) => {
        const result = await baseQuery(`/api/comment/${contentId}?page=${page}&limit=${limit}`);
        const base = Array.isArray(result.data) ? (result.data as CommentDto[]) : [];
        return { data: mergeOverlay(base, (c) => c.contentId === contentId && !c.parentId) };
      },
      providesTags: ['Comments'],
    }),

    getCommentThread: builder.query<CommentDto[], string>({
      queryFn: async (commentId, _api, _extra, baseQuery) => {
        const result = await baseQuery(`/api/comment/${commentId}/thread`);
        const base = Array.isArray(result.data) ? (result.data as CommentDto[]) : [];
        return { data: mergeOverlay(base, (c) => c.parentId === commentId) };
      },
      providesTags: ['Comments'],
    }),

    postComment: builder.mutation<CommentDto, PostCommentRequest>({
      queryFn: ({ contentId, message, parentId }, api) => {
        const user = (api.getState() as RootState).auth.user;
        const newComment: CommentDto = {
          id: genId(),
          userId: user?.id ?? 'local-user',
          contentId,
          parentId: parentId ?? null,
          message,
          createdAt: new Date().toISOString(),
          isDeleted: false,
          user: { nickname: user?.nickname ?? 'Anda', avatarUrl: user?.avatarUrl || null },
          replies: 0,
          alreadyVote: undefined,
          vote: 0,
        };

        const overlay = readOverlay();
        overlay.added.push(newComment);
        writeOverlay(overlay);

        return { data: newComment };
      },
      invalidatesTags: ['Comments'],
    }),

    updateComment: builder.mutation<CommentDto, UpdateCommentRequest>({
      queryFn: ({ commentId, message }) => {
        const overlay = readOverlay();
        overlay.edited[commentId] = message;
        writeOverlay(overlay);

        const addedMatch = overlay.added.find((c) => c.id === commentId);
        return {
          data: addedMatch
            ? { ...addedMatch, message }
            : ({ id: commentId, message } as CommentDto),
        };
      },
      invalidatesTags: ['Comments'],
    }),

    deleteComment: builder.mutation<void, string>({
      queryFn: (commentId) => {
        const overlay = readOverlay();
        overlay.deleted.push(commentId);
        writeOverlay(overlay);
        return { data: undefined };
      },
      invalidatesTags: ['Comments'],
    }),

    voteComment: builder.mutation<VoteCommentResponse, VoteCommentRequest>({
      queryFn: ({ commentId, vote, currentScore }) => {
        const overlay = readOverlay();
        const existing = overlay.votes[commentId];
        const baseline = existing ? existing.vote : (currentScore ?? 0);
        const statusValue = (status: CommentVoteStatus) =>
          status === 'upvote' ? 1 : status === 'downvote' ? -1 : 0;
        const prevStatus = existing?.alreadyVote ?? 'unvote';
        const nextVote = Math.max(0, baseline + statusValue(vote) - statusValue(prevStatus));

        overlay.votes[commentId] = { vote: nextVote, alreadyVote: vote };
        writeOverlay(overlay);

        return { data: { vote: nextVote, alreadyVote: vote } };
      },
    }),

    reportComment: builder.mutation<CommentReportDto, ReportCommentRequest>({
      queryFn: ({ commentId, tag }) => ({
        data: { id: genId(), commentId, tags: [tag], resolve: false },
      }),
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useGetCommentThreadQuery,
  usePostCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useVoteCommentMutation,
  useReportCommentMutation,
} = commentsApi;
