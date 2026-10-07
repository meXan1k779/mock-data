'use client';

import clsx from 'clsx';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';

import type { ContentResponse } from '@/features/article/new-article/api/types';
import { toggleLoginModal } from '@/features/auth/models/auth-slice';
import {
  useAddBookmarkMutation,
  useGetMyBookmarksQuery,
  useRemoveBookmarkMutation,
} from '@/features/bookmarks/api/bookmarks-api';
import { useAppDispatch, type RootState } from '@/shared/api/store';
import { useIsMounted } from '@/shared/hooks/useIsMounted';
import { BookmarkFilledIcon, BookmarkIcon } from '@/shared/icons/bookmarkIcon';
import { LinkIcon } from '@/shared/icons/linkIcon';
import { useToast } from '@/shared/ui/toast';

interface TooltipState {
  text: string;
  top: number;
  left: number;
}

function ActionTooltip({ tooltip }: { tooltip: TooltipState }) {
  return createPortal(
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{ top: tooltip.top, left: tooltip.left, transform: 'translate(-50%, -100%)' }}
    >
      <div className="drop-shadow-[0px_2px_6px_rgba(17,25,40,0.12)] flex flex-col items-center">
        <div className="bg-white rounded-xl px-4 py-3 text-xs text-[#374151] whitespace-nowrap">
          {tooltip.text}
        </div>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
          <path d="M0 0 L12 12 L24 0 Z" fill="white" />
        </svg>
      </div>
    </div>,
    document.body,
  );
}

interface ArticleActionsProps {
  article: ContentResponse;
  isDarkMode?: boolean;
  hrefBase?: string;
  /**
   * When set, bookmark state/toggling is controlled externally instead of going
   * through the real bookmark API — used for mock video content that has no
   * matching row in the real Content table (see useVideoBookmarks).
   */
  bookmarkOverride?: { isBookmarked: boolean; onToggle: () => void };
}

export const ArticleActions = ({
  article,
  isDarkMode,
  hrefBase = '/article',
  bookmarkOverride,
}: ArticleActionsProps) => {
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: bookmarks } = useGetMyBookmarksQuery(undefined, {
    skip: !isAuthenticated || !!bookmarkOverride,
  });
  const isBookmarked = bookmarkOverride
    ? bookmarkOverride.isBookmarked
    : Boolean(bookmarks?.some((item) => item.id === article.id));
  const [addBookmark] = useAddBookmarkMutation();
  const [removeBookmark] = useRemoveBookmarkMutation();
  const mounted = useIsMounted();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const bookmarkBtnRef = useRef<HTMLButtonElement>(null);
  const copylinkBtnRef = useRef<HTMLButtonElement>(null);

  const showTooltip = (ref: React.RefObject<HTMLButtonElement | null>, text: string) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    setTooltip({ text, top: rect.top - 8, left: rect.left + rect.width / 2 });
  };

  const hideTooltip = () => setTooltip(null);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    hideTooltip();
    if (bookmarkOverride) {
      bookmarkOverride.onToggle();
      if (!bookmarkOverride.isBookmarked) {
        showToast('bookmarked');
      }
      return;
    }
    if (!isAuthenticated) {
      dispatch(toggleLoginModal(true));
      return;
    }
    try {
      if (isBookmarked) {
        await removeBookmark(article.id).unwrap();
      } else {
        await addBookmark({ contentId: article.id, article }).unwrap();
        showToast('bookmarked');
      }
    } catch (err) {
      console.error('failed to toggle bookmark', err);
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    hideTooltip();
    const url = `${window.location.origin}${hrefBase}/${article.id}`;
    await navigator.clipboard.writeText(url);
    showToast('copied');
  };

  return (
    <>
      <button
        ref={bookmarkBtnRef}
        onClick={handleBookmark}
        onMouseEnter={() =>
          showTooltip(
            bookmarkBtnRef,
            isBookmarked ? 'Hapus dari artikel tersimpan' : 'Tambahkan ke artikel tersimpan',
          )
        }
        onMouseLeave={hideTooltip}
        className={clsx(
          'inline-flex items-center justify-center transition-colors',
          isDarkMode
            ? 'size-10 rounded-full bg-content-primary text-background-secondary hover:opacity-90'
            : 'h-8 px-2 rounded-2xl bg-background-secondary text-content-secondary hover:bg-border-tetriary',
        )}
      >
        {isBookmarked ? (
          <BookmarkFilledIcon className={isDarkMode ? '' : 'text-content-primary'} />
        ) : (
          <BookmarkIcon />
        )}
      </button>
      <button
        ref={copylinkBtnRef}
        onClick={handleCopyLink}
        onMouseEnter={() => showTooltip(copylinkBtnRef, 'Salin tautan artikel')}
        onMouseLeave={hideTooltip}
        className={clsx(
          'inline-flex items-center justify-center rounded-3xl transition-colors',
          isDarkMode
            ? 'h-10 px-3 bg-content-primary text-background-secondary hover:opacity-90 max-sm:hidden'
            : 'h-8 px-2 bg-background-secondary text-content-secondary hover:bg-border-tetriary',
        )}
      >
        <LinkIcon />
      </button>
      {mounted && tooltip && <ActionTooltip tooltip={tooltip} />}
    </>
  );
};
