'use client';

import type { ComponentType } from 'react';
import { useSelector } from 'react-redux';

import { type RootState } from '@/shared/api/store';

// Useberry usability-test build: the app is hard-wired to always be
// authenticated (see features/auth/models/auth-slice.ts), so this no longer
// needs to gate on a real backend session, redirect, or show a loading state
// — `isAuthenticated` is always true and the wrapped page just renders.
export const withAuth = <P extends object>(Component: ComponentType<P>) => {
  return function AuthenticatedComponent(props: P) {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
};
