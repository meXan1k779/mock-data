'use client';

import { NewArticle } from '@/features/article/new-article/ui';
import { withAuth } from '@/shared/hocs/with-auth';

const ProtectedArticlePage = withAuth(NewArticle);

export default function NewArticlePage() {
  return <ProtectedArticlePage />;
}
