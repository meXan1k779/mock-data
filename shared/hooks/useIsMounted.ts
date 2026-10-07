import { useSyncExternalStore } from 'react';

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export const useIsMounted = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
