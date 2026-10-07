import type { ModeratedCommentReport } from '../api/comment-reports-api';

import type { ReasonCount } from './types';

export function getReasonCounts(reports: ModeratedCommentReport[]): ReasonCount[] {
  const tagCounts = new Map<string, number>();
  for (const report of reports) {
    for (const tag of report.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
