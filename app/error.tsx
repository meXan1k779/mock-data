'use client';

import { useEffect } from 'react';

import { ErrorBlock } from '@/shared/ui/error';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return <ErrorBlock />;
}
