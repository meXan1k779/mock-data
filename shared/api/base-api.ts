import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { MOCK_ACCESS_TOKEN, updateToken, logout } from '@/features/auth/models/auth-slice';

import type { RootState } from './store';

interface RefreshRequestData {
  accessToken: string;
  refreshToken: string;
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window?.env?.BASE_API_URL || process.env.NEXT_PUBLIC_API_URL || '';
  }
  return process.env.BASE_API_URL || process.env.NEXT_PUBLIC_API_URL || '';
};

const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    // The mock token isn't a real session — sending it as a bearer token makes
    // the real backend reject otherwise-public reads (e.g. the article list)
    // with 401, whereas no header at all is treated as an anonymous visitor.
    if (accessToken && accessToken !== MOCK_ACCESS_TOKEN) {
      headers.set('authorization', `Bearer ${accessToken}`);
    }

    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Singleton-промис активного refresh. Если уже идёт — все ждут его, не шлют новый запрос.
let refreshPromise: Promise<RefreshRequestData | null> | null = null;

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  // if (result.error?.status === 'FETCH_ERROR') { TO DO cert eror only
  //   if (api.signal?.aborted) {
  //     return result;
  //   }
  //   api.dispatch(setNetworkError(true));
  //   return result;
  // }

  if (result.error && (result.error.data as { message: string })?.message === 'jwt expired') {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const res = await baseQuery(
            {
              url: '/api/auth/refresh',
              method: 'POST',
              body: { token: (api.getState() as RootState).auth.refreshToken },
            },
            api,
            extraOptions,
          );
          return (res.data as RefreshRequestData) ?? null;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    const refreshed = await refreshPromise;

    if (refreshed) {
      api.dispatch(
        updateToken({ accessToken: refreshed.accessToken, refreshToken: refreshed.refreshToken }),
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
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
