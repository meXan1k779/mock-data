import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import type { RootState } from '@/shared/api/store';

import { MockNotFoundError } from './content';
import { simulateLatency, type MockUser } from './db';

export { resetMockBackend } from './db';

type MockResult<T> = { data: T } | { error: FetchBaseQueryError };

// Runs a mock handler as an RTK Query `queryFn`: adds a bit of latency and
// maps thrown errors to the same shape fetchBaseQuery would produce, so
// components' error handling (e.g. notFound() on 404) keeps working.
export const mockResponse = async <T>(handler: () => T | Promise<T>): Promise<MockResult<T>> => {
  await simulateLatency();
  try {
    return { data: await handler() };
  } catch (error) {
    if (error instanceof MockNotFoundError) {
      return { error: { status: 404, data: { message: error.message } } };
    }
    return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
  }
};

export const getCurrentUser = (getState: () => unknown): MockUser => {
  const user = (getState() as RootState).auth.user;
  if (!user) {
    throw new Error('No current user');
  }
  return user;
};
