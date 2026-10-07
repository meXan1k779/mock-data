// hooks/useClickOutside.ts
import type { RefObject } from 'react';
import { useEffect } from 'react';

export const useClickOutside = (
  ref: RefObject<HTMLElement | null>, // разрешаем null
  handler: () => void,
  enabled: boolean = true,
) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current && !ref.current.contains(target)) {
        handler();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [ref, handler, enabled]);
};
