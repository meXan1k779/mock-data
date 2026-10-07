'use client';

import { PreviewPage } from '@/features/article/preview/ui';
import { withAuth } from '@/shared/hocs/with-auth';

const ProtectedArticlePage = withAuth(PreviewPage);

export default function NewArticlePage() {
  return <ProtectedArticlePage />;
}
