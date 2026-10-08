import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

// Prototype build: there is no backend. Every endpoint is implemented with a
// `queryFn` backed by the in-browser mock backend (mocks/backend), so the app
// never makes a network request — fakeBaseQuery fails loudly if an endpoint
// without a queryFn is ever added.
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery<FetchBaseQueryError>(),
  tagTypes: [
    'Auth',
    'User',
    'Profile',
    'AllMyContent',
    'Content',
    'AllContent',
    'ModeratorCards',
    'Comments',
    'CommentReports',
    'Bookmarks',
  ],
  endpoints: () => ({}),
});
