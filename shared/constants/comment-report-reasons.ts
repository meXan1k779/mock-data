export const COMMENT_REPORT_REASONS = [
  { value: 'spam', label: 'Spam or Promotion' },
  { value: 'harassment', label: 'Harassment or Offensive Content' },
  { value: 'misleading', label: 'Misleading or False Information' },
  { value: 'scam', label: 'Scam or Suspicious Links' },
  { value: 'other', label: 'Other' },
];

export function getCommentReportReasonLabel(tag: string): string {
  return COMMENT_REPORT_REASONS.find((reason) => reason.value === tag)?.label ?? tag;
}
