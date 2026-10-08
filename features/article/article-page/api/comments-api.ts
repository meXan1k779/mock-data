import { mockResponse } from '@/mocks/backend';
import * as mockComments from '@/mocks/backend/comments';
import { baseApi } from '@/shared/api/base-api';
import type { RootState } from '@/shared/api/store';

import type {
  CommentDto,
  CommentReportDto,
  GetCommentsParams,
  PostCommentRequest,
  ReportCommentRequest,
  UpdateCommentRequest,
  VoteCommentRequest,
  VoteCommentResponse,
} from './types';

// Prototype build: comments live in localStorage (see mocks/backend/comments.ts).
export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<CommentDto[], GetCommentsParams>({
      queryFn: ({ contentId }) => mockResponse(() => mockComments.getComments(contentId)),
      providesTags: ['Comments'],
    }),

    getCommentThread: builder.query<CommentDto[], string>({
      queryFn: (commentId) => mockResponse(() => mockComments.getCommentThread(commentId)),
      providesTags: ['Comments'],
    }),

    postComment: builder.mutation<CommentDto, PostCommentRequest>({
      queryFn: ({ contentId, message, parentId }, api) =>
        mockResponse(() => {
          const user = (api.getState() as RootState).auth.user;
          return mockComments.addComment({
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
          });
        }),
      invalidatesTags: ['Comments'],
    }),

    updateComment: builder.mutation<CommentDto, UpdateCommentRequest>({
      queryFn: ({ commentId, message }) =>
        mockResponse(() => mockComments.editComment(commentId, message)),
      invalidatesTags: ['Comments'],
    }),

    deleteComment: builder.mutation<void, string>({
      queryFn: (commentId) => mockResponse(() => mockComments.deleteComment(commentId)),
      invalidatesTags: ['Comments'],
    }),

    voteComment: builder.mutation<VoteCommentResponse, VoteCommentRequest>({
      // No simulated latency — the vote counter waits for this result.
      queryFn: ({ commentId, vote, currentScore }) => ({
        data: mockComments.voteComment(commentId, vote, currentScore),
      }),
    }),

    reportComment: builder.mutation<CommentReportDto, ReportCommentRequest>({
      queryFn: ({ commentId, tag }) =>
        mockResponse(() => mockComments.reportComment(commentId, tag)),
      invalidatesTags: ['CommentReports'],
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
