'use client';

import { TopicsSelectFragment } from '@/features/article/new-article/ui/topics-select-fragment';
import { withAuth } from '@/shared/hocs/with-auth';

const ProtectedTocisPage = withAuth(TopicsSelectFragment);

export default function NewArticlePage() {
  return <ProtectedTocisPage />;
}
