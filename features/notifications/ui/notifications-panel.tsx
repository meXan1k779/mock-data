'use client';

import clsx from 'clsx';

import type { NotificationItem } from '../model/mock-data';

const TYPE_ICON: Record<NotificationItem['type'], string> = {
  article: '/notifications/type-article.svg',
  social: '/notifications/type-social.svg',
  system: '/notifications/type-system.svg',
};

interface NotificationsPanelProps {
  notifications: NotificationItem[];
  unreadCount: number;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  className?: string;
}

export const NotificationsPanel = ({
  notifications,
  unreadCount,
  onClose,
  onMarkAllAsRead,
  className,
}: NotificationsPanelProps) => {
  return (
    <div
      className={clsx('bg-background-primary rounded-2xl overflow-hidden flex flex-col', className)}
    >
      <div className="h-14 border-b border-border-tetriary pl-5 pr-3 flex items-center justify-between shrink-0">
        <p className="font-semibold text-lg leading-7 text-content-primary">
          Yang terbaru <span className="text-[#9fa5b2]">({unreadCount})</span>
        </p>
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex items-center justify-center size-8"
        >
          <img src="/notifications/close.svg" alt="" className="size-6" />
        </button>
      </div>

      <div className="flex flex-col overflow-y-auto pt-2 flex-1 min-h-0">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-start px-5 py-3 w-full hover:bg-background-secondary transition-colors"
          >
            <div className="flex flex-1 gap-[11px] items-start min-w-0">
              <img src={TYPE_ICON[item.type]} alt="" className="size-5 shrink-0" />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="font-semibold text-sm leading-5 text-content-primary">{item.title}</p>
                <p className="text-xs leading-4 text-content-primary">{item.description}</p>
                <p className="text-xs leading-4 text-content-secondary">{item.time}</p>
              </div>
            </div>
            <div className="size-[22px] flex items-center justify-center shrink-0">
              {item.isNew && <span className="size-2 rounded-full bg-base-positive" />}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border-tetriary px-5 py-3 shrink-0">
        <button
          onClick={onMarkAllAsRead}
          className="w-full min-w-[80px] px-3 py-2 rounded-md text-xs font-medium text-content-primary hover:bg-background-secondary transition-colors"
        >
          Tandai semua telah dibaca
        </button>
      </div>
    </div>
  );
};
