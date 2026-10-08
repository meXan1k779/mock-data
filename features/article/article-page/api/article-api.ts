import { mockResponse } from '@/mocks/backend';
import { raiseStage, requestChanges } from '@/mocks/backend/content';
import { baseApi } from '@/shared/api/base-api';

import type { RequestChanges } from './types';

interface UpdateArticleStageRequest {
  approveId?: string;
  articleId: string;
}

// Prototype build: served by the in-browser mock backend (mocks/backend).
export const articleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    pushArtcileStage: builder.mutation<string, UpdateArticleStageRequest>({
      queryFn: ({ articleId, approveId }) =>
        mockResponse(async () => {
          await raiseStage(articleId, approveId);
          return 'ok';
        }),
      invalidatesTags: ['ModeratorCards'],
    }),
    requestChanges: builder.mutation<string, RequestChanges>({
      queryFn: ({ articleId, comment }) =>
        mockResponse(async () => {
          await requestChanges(articleId, comment);
          return 'ok';
        }),
      invalidatesTags: ['ModeratorCards'],
    }),
  }),
});

export const { usePushArtcileStageMutation, useRequestChangesMutation } = articleApi;
