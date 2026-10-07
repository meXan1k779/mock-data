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

export const commentReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommentReports: builder.query<ModeratedComment[], GetCommentReportsParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set('page', String(params?.page ?? 0));
        searchParams.set('limit', String(params?.limit ?? 100));
        if (params?.status) {
          searchParams.set('status', params.status);
        }
        if (params?.tag) {
          searchParams.set('tag', params.tag);
        }
        return `/api/moderator/comment/reports?${searchParams.toString()}`;
      },
      providesTags: ['CommentReports'],
    }),

    // Один запрос на commentId: бэк сам резолвит все нерешённые репорты этого
    // комментария и удаляет/восстанавливает всю ветку ответов.
    resolveCommentReport: builder.mutation<
      ResolveCommentReportResponse,
      ResolveCommentReportRequest
    >({
      query: ({ commentId, resolve }) => ({
        url: `/api/moderator/comment/${commentId}`,
        method: 'PATCH',
        body: { resolve },
      }),
      // Инвалидируем, чтобы счётчик в сайдбаре не протух. Список на экране
      // при этом не дёргается — reported-comments-list.tsx рендерит
      // застывший снапшот и игнорирует фоновые рефетчи того же запроса.
      invalidatesTags: ['CommentReports'],
    }),
  }),
});

export const { useGetCommentReportsQuery, useResolveCommentReportMutation } = commentReportsApi;
