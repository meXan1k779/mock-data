'use client';

import clsx from 'clsx';
import Link from 'next/link';

import { Close24Icon } from '@/shared/icons/close24Icon';
import { Avatar } from '@/shared/ui/avatar';

interface UserMenuPanelProps {
  nickname?: string;
  email?: string;
  avatarUrl?: string;
  isMobile?: boolean;
  onNavigate: () => void;
  onLogout: () => void;
  onClose: () => void;
  className?: string;
}

// On mobile the panel wrapper already gives a 16px edge (px-4); these rows add
// their own pl-3/pr-2 for the hover-highlight box, which would double up to a
// 28px/24px edge. The negative margin cancels that so the text still lines up
// at 16px while the hover box keeps its larger hit area. Desktop's dropdown
// uses a different (smaller) outer inset, so it keeps the un-cancelled padding.
const linkClassName = (isMobile?: boolean) =>
  clsx(
    'text-left text-sm font-medium leading-6 text-content-primary rounded-lg pl-3 pr-2 py-2 hover:bg-background-secondary transition-colors',
    isMobile && '-ml-3 -mr-2',
  );

export const UserMenuPanel = ({
  nickname,
  email,
  avatarUrl,
  isMobile,
  onNavigate,
  onLogout,
  onClose,
  className,
}: UserMenuPanelProps) => {
  return (
    <div
      className={clsx(
        'bg-background-primary flex flex-col',
        isMobile
          ? 'h-full justify-between px-4 pt-3 pb-3'
          : 'rounded-xl shadow-[0px_2px_12px_0px_rgba(17,25,40,0.12)] p-3',
        className,
      )}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            onClick={onNavigate}
            className={clsx(
              'flex flex-1 min-w-0 items-center gap-2 p-3 rounded-lg hover:bg-background-secondary transition-colors',
              isMobile && '-mx-3',
            )}
          >
            <Avatar size="lg" nickname={nickname} avatarUrl={avatarUrl} />
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="font-semibold text-lg leading-7 text-content-primary truncate">
                {nickname}
              </p>
              <p className="text-sm leading-5 text-content-secondary truncate">{email}</p>
            </div>
          </Link>
          {isMobile && (
            <button onClick={onClose} aria-label="Close" className="p-2 -m-2 shrink-0">
              <Close24Icon className="text-content-tetriary size-6" />
            </button>
          )}
        </div>

        <div className={clsx('border-t border-border-tetriary my-2', !isMobile && 'mx-3')} />

        <Link href="/bookmarks" onClick={onNavigate} className={linkClassName(isMobile)}>
          Buka tersimpan
        </Link>
        <Link href="/profile/settings" onClick={onNavigate} className={linkClassName(isMobile)}>
          Ubah profil
        </Link>

        <div className={clsx('border-t border-border-tetriary my-2', !isMobile && 'mx-3')} />

        <button onClick={onLogout} className={linkClassName(isMobile)}>
          Keluar
        </button>
      </div>

      <div>
        <div className={clsx('border-t border-border-tetriary my-2', !isMobile && 'mx-3')} />
        <div
          className={clsx(
            'pl-3 pr-2 py-2 rounded-lg text-sm text-base-link',
            isMobile ? 'flex flex-col gap-4 -ml-3 -mr-2' : 'flex flex-wrap gap-x-8 gap-y-3',
          )}
        >
          <Link href="/aboutus" onClick={onNavigate}>
            Tentang kami
          </Link>
          <Link href="/privacy-policy" onClick={onNavigate}>
            Kebijakan Privasi
          </Link>
          <Link href="/terms" onClick={onNavigate}>
            Syarat dan Ketentuan
          </Link>
        </div>
      </div>
    </div>
  );
};
