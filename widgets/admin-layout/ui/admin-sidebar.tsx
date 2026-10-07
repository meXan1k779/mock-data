'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType, SVGProps } from 'react';

import { useGetModeratorContentQuery } from '@/features/article/new-article/api/article-api';
import { useGetCommentReportsQuery } from '@/features/moderating/api/comment-reports-api';
import { ChatAlt3Icon } from '@/shared/icons/chatAlt3Icon';
import { OrderIcon } from '@/shared/icons/orderIcon';
import { ArticleStatus } from '@/shared/types/types';

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/moderating', label: 'Article moderation', icon: OrderIcon },
  { href: '/moderating/comments', label: 'Reported comments', icon: ChatAlt3Icon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  // selectFromResult: сайдбару нужны только счётчики, а не весь список статей/репортов —
  // так компонент не держит и не ре-рендерится на изменение полного пейлоада,
  // только на изменение самого числа.
  const { count: articlesCount } = useGetModeratorContentQuery(ArticleStatus.MODERATOR_REVIEW, {
    selectFromResult: ({ data }) => ({ count: data?.length ?? 0 }),
  });

  const { count: pendingCommentReportsCount } = useGetCommentReportsQuery(
    { status: 'pending' },
    {
      selectFromResult: ({ data }) => ({ count: data?.length ?? 0 }),
    },
  );

  const counts: Record<string, number> = {
    '/moderating': articlesCount,
    '/moderating/comments': pendingCommentReportsCount,
  };

  return (
    <div className="flex flex-col gap-4 pt-10 w-[280px] shrink-0 border-r border-border-tetriary">
      <p className="px-4 text-sm font-semibold text-content-secondary">ADMIN PANEL</p>
      <nav className="flex flex-col gap-1 pr-5 w-full">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          const count = counts[href];
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex h-[52px] items-center justify-between rounded-xl px-4 transition-colors',
                isActive ? 'bg-background-secondary' : 'hover:bg-background-secondary',
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className="text-content-primary" />
                <span className="text-base font-semibold text-content-primary">{label}</span>
              </span>
              {count > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary-bg text-xs font-semibold text-content-primary">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
