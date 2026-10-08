import { getCurrentUser, mockResponse } from '@/mocks/backend';
import * as mockContent from '@/mocks/backend/content';
import { baseApi } from '@/shared/api/base-api';
import type { ArticleStatus } from '@/shared/types/types';

import type { ContentResponse, Attachment, ContentData } from './types';

// Prototype build: served by the in-browser mock backend (mocks/backend).
export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createContent: builder.mutation<ContentResponse, ContentData>({
      queryFn: (data, { getState }) =>
        mockResponse(() => mockContent.createContent(data, getCurrentUser(getState))),
      invalidatesTags: ['AllMyContent'],
    }),

    getAllContent: builder.query<ContentResponse[], { page: number; topic: string }>({
      queryFn: ({ page, topic }) => mockResponse(() => mockContent.listPublished(page, topic)),
      keepUnusedDataFor: 0,
      providesTags: ['AllContent'],
    }),

    updateContent: builder.mutation<ContentResponse, ContentData>({
      queryFn: (data, { getState }) =>
        mockResponse(() => mockContent.updateContent(data, getCurrentUser(getState))),
      invalidatesTags: ['AllMyContent'],
    }),

    getContentById: builder.query<ContentResponse, string>({
      queryFn: (id) => mockResponse(() => mockContent.getPublishedById(id)),
      providesTags: ['Content'],
    }),

    deleteContentById: builder.mutation<ContentResponse, string>({
      queryFn: (id, { getState }) =>
        mockResponse(() => mockContent.deleteContent(id, getCurrentUser(getState))),
      invalidatesTags: ['AllMyContent'],
    }),

    getMyContentById: builder.query<ContentResponse, string>({
      queryFn: (id, { getState }) =>
        mockResponse(() => mockContent.getMyById(id, getCurrentUser(getState))),
    }),

    getAllMyContent: builder.query<ContentResponse[], string>({
      queryFn: (status, { getState }) =>
        mockResponse(() => mockContent.listMine(status, getCurrentUser(getState))),
      providesTags: ['AllMyContent'],
    }),

    addAttachment: builder.mutation<Attachment, { articleId: string; file: File }>({
      queryFn: ({ articleId, file }) =>
        mockResponse(() => mockContent.addAttachment(articleId, file)),
    }),

    deleteAttachment: builder.mutation<void, string>({
      queryFn: (attachmentId) => mockResponse(() => mockContent.deleteAttachment(attachmentId)),
    }),

    getModeratorContent: builder.query<ContentResponse[], ArticleStatus>({
      queryFn: (status) => mockResponse(() => mockContent.listForModeration(status)),
      providesTags: ['ModeratorCards'],
    }),

    getModeratorContentById: builder.query<ContentResponse, string>({
      queryFn: (articleId) => mockResponse(() => mockContent.getForModeration(articleId)),
    }),

    submitContent: builder.mutation<void, string>({
      queryFn: (articleId, { getState }) =>
        mockResponse(() => mockContent.submitContent(articleId, getCurrentUser(getState))),
      invalidatesTags: ['AllMyContent', 'ModeratorCards'],
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
