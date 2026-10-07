// components/network-status.tsx
'use client';

import { useSyncExternalStore } from 'react';

import { ErrorBlock } from '@/shared/ui/error';

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return !navigator.onLine;
}

function getServerSnapshot() {
  return false;
}

export function NetworkStatus({ children }: { children: React.ReactNode }) {
  const isOffline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (isOffline) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <ErrorBlock />
      </div>
    );
  }

  return <>{children}</>;
}
