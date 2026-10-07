'use client';

import Link from 'next/link';
import { createContext, useCallback, useContext, useRef, useState } from 'react';

type ToastType = 'bookmarked' | 'copied' | 'reported';

interface ToastItem {
  id: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (type: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const showToast = useCallback(
    (type: ToastType) => {
      const id = crypto.randomUUID();
      const duration = type === 'bookmarked' ? 7000 : type === 'reported' ? 5000 : 3000;
      setToasts((prev) => [...prev.filter((t) => t.type !== type), { id, type }]);
      timers.current[id] = setTimeout(() => remove(id), duration);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 w-[calc(100vw-32px)] sm:w-[464px]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-start justify-end bg-[#0b111b] rounded-xl overflow-hidden"
          >
            <div className="flex flex-1 gap-2 items-start p-4 min-w-0">
              {toast.type === 'copied' && (
                <svg className="shrink-0 size-6" viewBox="0 0 24 24" fill="none">
                  <path
                    fillRule="evenodd"
                    d="M10.8047 15.375L16.3828 9.82031L15.1875 8.625L10.8047 12.9844L8.8125 11.0156L7.61719 12.2109L10.8047 15.375ZM12 21C10.7656 21 9.60156 20.7656 8.50781 20.2969C7.41406 19.8281 6.45703 19.1836 5.63672 18.3633C4.81641 17.543 4.17188 16.5859 3.70312 15.4922C3.23438 14.3984 3 13.2344 3 12C3 10.75 3.23438 9.58203 3.70312 8.49609C4.17188 7.41016 4.81641 6.45703 5.63672 5.63672C6.45703 4.81641 7.41406 4.17188 8.50781 3.70312C9.60156 3.23438 10.7656 3 12 3C13.25 3 14.418 3.23438 15.5039 3.70312C16.5898 4.17188 17.543 4.81641 18.3633 5.63672C19.1836 6.45703 19.8281 7.41016 20.2969 8.49609C20.7656 9.58203 21 10.75 21 12C21 13.2344 20.7656 14.3984 20.2969 15.4922C19.8281 16.5859 19.1836 17.543 18.3633 18.3633C17.543 19.1836 16.5898 19.8281 15.5039 20.2969C14.418 20.7656 13.25 21 12 21Z"
                    fill="white"
                  />
                </svg>
              )}
              <div className="flex flex-col gap-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-5">
                  {toast.type === 'copied' && 'Tautan disalin'}
                  {toast.type === 'bookmarked' && 'Artikel tersimpan'}
                  {toast.type === 'reported' && 'Thanks for reporting!'}
                </p>
                {toast.type === 'bookmarked' && (
                  <Link
                    href="/bookmarks"
                    onClick={() => remove(toast.id)}
                    className="inline-flex items-center bg-white border border-[#cfd4dd] rounded-lg px-3 py-[5px] text-xs font-medium text-content-primary whitespace-nowrap w-fit"
                  >
                    Lihat semua artikel tersimpan
                  </Link>
                )}
              </div>
            </div>
            <div className="p-1.5 shrink-0">
              <button
                onClick={() => remove(toast.id)}
                className="bg-[rgba(17,25,40,0.07)] backdrop-blur-sm rounded-full p-0.5 flex items-center justify-center text-white"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4.26667 12.6667L3.33333 11.7333L7.06667 8L3.33333 4.26667L4.26667 3.33333L8 7.06667L11.7333 3.33333L12.6667 4.26667L8.93333 8L12.6667 11.7333L11.7333 12.6667L8 8.93333L4.26667 12.6667Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
