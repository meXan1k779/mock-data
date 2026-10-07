'use client';

import { PaymentGuide } from '@/features/article/new-article/ui/payment-guide';
import { withAuth } from '@/shared/hocs/with-auth';

const ProtectedGuidePage = withAuth(PaymentGuide);

export default function NewArticlePage() {
  return <ProtectedGuidePage />;
}
