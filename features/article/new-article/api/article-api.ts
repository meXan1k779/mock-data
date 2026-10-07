import { baseApi } from '@/shared/api/base-api';
import type { ArticleStatus } from '@/shared/types/types';

import type { ContentResponse, Attachment, ContentData } from './types';

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createContent: builder.mutation<ContentResponse, ContentData>({
      query: (data) => ({
        url: 'api/content/',
        method: 'POST',
        body: data,
      }),
    }),

    getAllContent: builder.query<ContentResponse[], { page: number; topic: string }>({
      query: ({ page, topic }) => `api/content?page=${page}${topic}`,
      keepUnusedDataFor: 0,
      providesTags: ['AllContent'],
    }),

    updateContent: builder.mutation<ContentResponse, ContentData>({
      query: (data) => ({
        url: `api/content/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    getContentById: builder.query<ContentResponse, string>({
      query: (id) => `api/content/${id}`,
      providesTags: ['Content'],
    }),

    deleteContentById: builder.mutation<ContentResponse, string>({
      query: (id) => ({
        url: `api/content/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AllMyContent'],
    }),

    getMyContentById: builder.query<ContentResponse, string>({
      query: (id) => `api/content/myContent/${id}`,
    }),

    getAllMyContent: builder.query<ContentResponse[], string>({
      query: (status) => `api/content/myContent?${status}`,
      providesTags: ['AllMyContent'],
    }),

    addAttachment: builder.mutation<Attachment, { articleId: string; file: File }>({
      query: ({ articleId, file }) => {
        const formData = new FormData();
        formData.append('attachment', file);

        return {
          url: `api/content/attachment/${articleId}`,
          method: 'POST',
          body: formData,
        };
      },
    }),

    deleteAttachment: builder.mutation<void, string>({
      query: (attachmentId) => ({
        url: `api/content/attachment/${attachmentId}`,
        method: 'DELETE',
      }),
    }),

    getModeratorContent: builder.query<ContentResponse[], ArticleStatus>({
      query: (status) => `api/moderator/content?status=${status}&page=0&limit=30`,
      providesTags: ['ModeratorCards'],
    }),

    getModeratorContentById: builder.query<ContentResponse, string>({
      query: (articleId) => `api/moderator/content/${articleId}`,
    }),

    submitContent: builder.mutation<void, string>({
      query: (articleId) => ({
        url: `api/content/${articleId}/submit`,
        method: 'PATCH',
      }),
    }),
  }),
});

export const {
  useCreateContentMutation,
  useUpdateContentMutation,
  useGetContentByIdQuery,
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
  useSubmitContentMutation,
  useGetAllContentQuery,
  useGetMyContentByIdQuery,
  useGetAllMyContentQuery,
  useDeleteContentByIdMutation,
  useGetModeratorContentQuery,
  useGetModeratorContentByIdQuery,
} = contentApi;
