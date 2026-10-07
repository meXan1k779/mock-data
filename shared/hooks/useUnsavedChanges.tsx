import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useUnsavedChanges = (hasUnsavedChanges: boolean) => {
  // React Compiler must not memoize this hook: it intentionally mutates the
  // router instance (router.push/replace) to intercept navigation, which the
  // compiler's purity assumptions don't allow. There is no public App Router
  // API for blocking navigation, so this is the accepted escape hatch.
  'use no memo';

  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const pendingNavigationRef = useRef<(() => void) | null>(null);
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);

  const originalPushRef = useRef(router.push);
  const originalReplaceRef = useRef(router.replace);

  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  const handleLeave = useCallback(() => {
    setShowModal(false);
    if (pendingNavigationRef.current) {
      pendingNavigationRef.current();
      pendingNavigationRef.current = null;
    }
  }, []);

  const handleStay = useCallback(() => {
    setShowModal(false);
    pendingNavigationRef.current = null;
  }, []);

  useEffect(() => {
    if (!router) {
      return;
    }

    originalPushRef.current = router.push;
    originalReplaceRef.current = router.replace;

    const wrappedPush: typeof router.push = (url, options) => {
      if (hasUnsavedChangesRef.current) {
        pendingNavigationRef.current = () => originalPushRef.current(url, options);
        setShowModal(true);
      } else {
        originalPushRef.current(url, options);
      }
    };

    const wrappedReplace: typeof router.replace = (url, options) => {
      if (hasUnsavedChangesRef.current) {
        pendingNavigationRef.current = () => originalReplaceRef.current(url, options);
        setShowModal(true);
      } else {
        originalReplaceRef.current(url, options);
      }
    };

    // eslint-disable-next-line react-hooks/immutability -- intentional: see 'use no memo' note above
    router.push = wrappedPush;

    router.replace = wrappedReplace;

    return () => {
      router.push = originalPushRef.current;
      router.replace = originalReplaceRef.current;
    };
  }, [router]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChangesRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChangesRef.current) {
        e.preventDefault();
        pendingNavigationRef.current = () => window.history.back();
        setShowModal(true);
        window.history.pushState(null, '');
      }
    };
    window.history.pushState(null, '');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      if (!hasUnsavedChangesRef.current) {
        return;
      }

      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href) {
        return;
      }

      if (anchor.target === '_blank') {
        return;
      }

      if (href.startsWith('#')) {
        return;
      }

      // Пропускаем внешние ссылки (другой домен)
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) {
          return;
        }
        // Если путь такой же, как текущий – не блокируем
        if (url.pathname === window.location.pathname) {
          return;
        }
      } catch {
        return;
      }

      e.preventDefault();
      e.stopImmediatePropagation(); // Останавливаем обработчики Next.js (Link)

      pendingNavigationRef.current = () => {
        window.location.href = href;
      };
      setShowModal(true);
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    return () => document.removeEventListener('click', handleLinkClick, { capture: true });
  }, []);

  return {
    showModal,
    handleLeave,
    handleStay,
  };
};
