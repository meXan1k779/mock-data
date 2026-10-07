// hooks/useKeyboardHeight.ts
import { useEffect, useState } from 'react';

export const useKeyboardHeight = (threshold: number = 150) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateHeight = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const viewport = window.visualViewport;
        if (viewport) {
          const windowHeight = window.innerHeight;
          const visualHeight = viewport.height;
          const diff = windowHeight - visualHeight;
          setKeyboardHeight(diff > threshold ? diff : 0);
        } else {
          // Fallback для старых браузеров
          const originalHeight = window.innerHeight;
          const newHeight = document.documentElement.clientHeight;
          const diff = originalHeight - newHeight;
          setKeyboardHeight(diff > threshold ? diff : 0);
        }
      }, 50);
    };

    window.visualViewport?.addEventListener('resize', updateHeight);
    window.addEventListener('resize', updateHeight);

    return () => {
      window.visualViewport?.removeEventListener('resize', updateHeight);
      window.removeEventListener('resize', updateHeight);
      clearTimeout(timeoutId);
    };
  }, [threshold]);

  return keyboardHeight;
};
