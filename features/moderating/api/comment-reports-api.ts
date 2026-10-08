import { mockResponse } from '@/mocks/backend';
import { getReportedComments, resolveCommentReports } from '@/mocks/backend/comments';
import { baseApi } from '@/shared/api/base-api';

export interface ModeratedCommentAuthor {
  nickname: string;
  avatarUrl: string | null;
}

export interface ModeratedCommentReport {
  id: string;
  commentId: string;
  tags: string[];
  resolve: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModeratedComment {
  id: string;
  userId: string;
  contentId: string;
  parentId: string | null;
  message: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  user: ModeratedCommentAuthor;
  reports: ModeratedCommentReport[];
  reportCount: number;
}

export type CommentReportStatus = 'pending' | 'resolved';

export interface GetCommentReportsParams {
  page?: number;
  limit?: number;
  status?: CommentReportStatus;
  tag?: string | null;
}

export interface ResolveCommentReportRequest {
  commentId: string;
  resolve: boolean;
}

export interface ResolveCommentReportResponse {
  commentId: string;
  commentDeleted: boolean;
  resolvedReports: number;
}

// Prototype build: reports live in localStorage next to the comments
// (see mocks/backend/comments.ts).
export const commentReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommentReports: builder.query<ModeratedComment[], GetCommentReportsParams | void>({
      queryFn: (params) =>
        mockResponse(() => {
          const page = params?.page ?? 0;
          const limit = params?.limit ?? 100;
          return getReportedComments({ status: params?.status, tag: params?.tag }).slice(
            page * limit,
            (page + 1) * limit,
          );
        }),
      providesTags: ['CommentReports'],
    }),

    // Один запрос на commentId: резолвятся все нерешённые репорты этого
    // комментария, при скрытии удаляется вся ветка ответов.
    resolveCommentReport: builder.mutation<
      ResolveCommentReportResponse,
      ResolveCommentReportRequest
    >({
      queryFn: ({ commentId, resolve }) =>
        mockResponse(() => resolveCommentReports(commentId, resolve)),
      // Инвалидируем, чтобы счётчик в сайдбаре не протух. Список на экране
      // при этом не дёргается — reported-comments-list.tsx рендерит
      // застывший снапшот и игнорирует фоновые рефетчи того же запроса.
      invalidatesTags: ['CommentReports', 'Comments'],
    }),
  }),
});

export const { useGetCommentReportsQuery, useResolveCommentReportMutation } = commentReportsApi;
