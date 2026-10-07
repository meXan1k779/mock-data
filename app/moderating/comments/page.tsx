'use client';

import { withAuth } from '@/shared/hocs/with-auth';
import { ModeratingCommentsPage } from '@/widgets/moderating-comments';

const ProtectedModeratingCommentsPage = withAuth(ModeratingCommentsPage);

export default function ModeratingComments() {
  return <ProtectedModeratingCommentsPage />;
}
