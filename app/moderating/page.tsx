'use client';

import { withAuth } from '@/shared/hocs/with-auth';
import { ModeratingPage } from '@/widgets/moderating';

const ProtectedModeratingPage = withAuth(ModeratingPage);

export default function Moderating() {
  return <ProtectedModeratingPage />;
}
