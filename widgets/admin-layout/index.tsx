'use client';

import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/shared/api/store';

import { AdminSidebar } from './ui/admin-sidebar';

export function AdminLayout({ children }: { children: ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user?.role && user.role !== 'moderator') {
    notFound();
  }

  return (
    <div>
      <div className="max-w-[1200px] mx-auto">
        <div className="lg:hidden">not available on mobile device</div>
        <div className="hidden lg:flex gap-[54px] h-[calc(100vh-68px)]">
          <AdminSidebar />
          <div className="flex-1 min-w-0 h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
