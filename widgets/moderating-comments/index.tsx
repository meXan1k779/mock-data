'use client';

import { ReportedCommentsList } from '@/features/moderating/reported-comments/reported-comments-list';
import { AdminLayout } from '@/widgets/admin-layout';

export const ModeratingCommentsPage = () => {
  return (
    <AdminLayout>
      <ReportedCommentsList />
    </AdminLayout>
  );
};
