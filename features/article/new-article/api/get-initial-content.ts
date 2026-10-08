import { filterPublished } from '@/mocks/backend/content';
import type { MockArticle } from '@/mocks/backend/db';
import seedArticles from '@/mocks/backend/fixtures/articles.json';

import type { ContentResponse } from './types';

// Prototype build: SSR renders the first feed page straight from the mock
// backend's seed snapshot. The client then refetches through RTK Query, which
// also picks up anything changed locally in the browser.
export async function getInitialContent(): Promise<ContentResponse[]> {
  return filterPublished(seedArticles as unknown as MockArticle[], 0).map(
    ({ AttachedFile: _attachments, ...article }) => article as ContentResponse,
  );
}
