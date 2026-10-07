import { Suspense } from 'react';

import { DiscoverArticles } from '@/widgets/discover-articles/ui';

// All four /discover routes (plain, /filters, /video, /video/filters) render the
// same DiscoverArticles — it reads pathname itself to pick the view/modal state.
// Rendering it here (instead of per-route in each page.tsx) keeps it mounted across
// those navigations, since a layout persists while its page.tsx children swap — so
// selectedTopics/sortBy/complexity (local useState) survive opening and closing the
// mobile/tablet Filters modal instead of resetting on every route change.
export default function DiscoverLayout() {
  return (
    <Suspense>
      <DiscoverArticles />
    </Suspense>
  );
}
