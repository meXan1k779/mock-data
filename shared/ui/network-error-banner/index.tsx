'use client';

import { useDispatch, useSelector } from 'react-redux';

import { setNetworkError } from '@/features/auth/models/auth-slice';
import type { RootState } from '@/shared/api/store';

export function NetworkErrorBanner() {
  const dispatch = useDispatch();
  const hasError = useSelector((state: RootState) => state.auth.networkError);

  if (!hasError) {
    return null;
  }

  const isDevEnv =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname.includes('stage'));

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between gap-4 bg-red-500 px-4 py-2.5 text-sm text-white">
      <span>
        Could not connect to the server.
        {isDevEnv &&
          ' The SSL certificate may not be trusted by the browser — open the API URL directly and allow access.'}
      </span>
      <button
        onClick={() => dispatch(setNetworkError(false))}
        aria-label="Close"
        className="shrink-0 text-white/80 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}
