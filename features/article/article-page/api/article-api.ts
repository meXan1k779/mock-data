import { baseApi } from '@/shared/api/base-api';

import type { RequestChanges } from './types';

interface UpdateArticleStageRequest {
  approveId?: string;
  articleId: string;
}

export const articleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    pushArtcileStage: builder.mutation<string, UpdateArticleStageRequest>({
      query: ({ articleId, approveId }) => ({
        url: `/api/moderator/content/${articleId}/raise`,
        method: 'PATCH',
        body: { approveId },
      }),
      invalidatesTags: ['ModeratorCards'],
    }),
    requestChanges: builder.mutation<string, RequestChanges>({
      query: ({ articleId, comment }) => ({
        url: `/api/moderator/content/${articleId}/reject`,
        method: 'PATCH',
        body: { comment },
      }),
    }),
  }),
});

export const { usePushArtcileStageMutation, useRequestChangesMutation } = articleApi;
