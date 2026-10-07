import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import Link from 'next/link';
import { useState } from 'react';

import { useGetContentByIdQuery } from '@/features/article/new-article/api/article-api';
import { getCommentReportReasonLabel } from '@/shared/constants/comment-report-reasons';
import { ErrorCircleIcon } from '@/shared/icons/errorCircleIcon';
import { PositiveCheckmarkIcon } from '@/shared/icons/positiveCheckmarkIcon';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';

import type { ModeratedComment } from '../api/comment-reports-api';

import { getReasonCounts } from './utils';

// Порог из дизайна: 3+ репортов на комментарий подсвечиваем красным.
const SEVERE_THRESHOLD = 3;

interface ReportCardProps {
  comment: ModeratedComment;
  // null — репорт ещё не решён (показываем кнопки Keep/Hide).
  // true/false — решение уже принято (показываем тег + "Change decision").
  resolvedAs: boolean | null;
  onResolve: (comment: ModeratedComment, resolve: boolean) => Promise<void>;
}

export function ReportCard({ comment, resolvedAs, onResolve }: ReportCardProps) {
  const [pendingAction, setPendingAction] = useState<'keep' | 'hide' | null>(null);
  const [isChangingDecision, setIsChangingDecision] = useState(false);
  const [error, setError] = useState(false);
  const isSevere = comment.reportCount >= SEVERE_THRESHOLD;
  const reasonCounts = getReasonCounts(comment.reports);
  const { data: article } = useGetContentByIdQuery(comment.contentId);

  const showButtons = resolvedAs === null || isChangingDecision;

  const handleClick = async (resolve: boolean) => {
    setPendingAction(resolve ? 'hide' : 'keep');
    setError(false);
    try {
      await onResolve(comment, resolve);
      setIsChangingDecision(false);
    } catch (err) {
      console.error('failed to resolve comment report', err);
      setError(true);
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="py-6 border-b border-border-tetriary last:border-b-0">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-12">
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <p className="text-base text-content-primary leading-6 break-words">{comment.message}</p>
          <div className="flex items-center gap-2 text-sm text-content-secondary">
            <Avatar
              size="sm"
              nickname={comment.user.nickname}
              avatarUrl={comment.user.avatarUrl ?? undefined}
            />
            <span>
              {comment.user.nickname} •{' '}
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: localeId,
              })}
            </span>
          </div>
          {article?.title && (
            <Link
              href={`/article/${comment.contentId}`}
              className="text-sm text-base-link underline w-fit"
            >
              {article.title}
            </Link>
          )}
        </div>

        <div className="w-full lg:w-auto lg:min-w-[272px] shrink-0 flex flex-col gap-4">
          <div
            className={clsx(
              'flex flex-col items-center gap-0.5 rounded-xl border py-3 w-full',
              isSevere
                ? 'bg-[#FFECEC] border-[#FBB0B0]'
                : 'bg-background-secondary border-border-tetriary',
            )}
          >
            <span
              className={clsx(
                'text-base font-semibold',
                isSevere ? 'text-extansion-negative' : 'text-content-primary',
              )}
            >
              {comment.reportCount}
            </span>
            <span
              className={clsx(
                'text-xs',
                isSevere ? 'text-extansion-negative' : 'text-content-secondary',
              )}
            >
              Total user reports
            </span>
          </div>

          {reasonCounts.length > 0 && (
            <div className="flex flex-col gap-1 w-full">
              {reasonCounts.map(({ tag, count }) => (
                <div key={tag} className="flex items-center justify-center gap-1 w-full">
                  <span className="rounded-md bg-background-secondary px-2 py-1 text-xs text-content-primary text-center">
                    {getCommentReportReasonLabel(tag)}
                  </span>
                  {count > 1 && (
                    <span className="rounded-md bg-background-secondary px-2 py-1 text-xs text-content-primary">
                      x{count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showButtons ? (
        <div className="flex items-center gap-4 mt-5">
          <Button
            variant="secondary"
            size="md"
            loading={pendingAction === 'keep'}
            disabled={pendingAction !== null}
            onClick={() => handleClick(false)}
          >
            Keep comment
          </Button>
          <Button
            variant="outline"
            size="md"
            loading={pendingAction === 'hide'}
            disabled={pendingAction !== null}
            onClick={() => handleClick(true)}
          >
            Hide comment
          </Button>
          {error && (
            <span className="text-sm text-extansion-negative">
              Failed to save decision, try again.
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 mt-5">
          <span
            className={clsx(
              'inline-flex items-center gap-0.5 rounded-md border px-2 py-1 text-xs text-content-primary',
              resolvedAs ? 'bg-[#FFECEC] border-[#FBB0B0]' : 'bg-green border-[#A0E8A0]',
            )}
          >
            {resolvedAs ? (
              <ErrorCircleIcon className="size-4 shrink-0" />
            ) : (
              <PositiveCheckmarkIcon className="size-4 shrink-0" />
            )}
            {resolvedAs ? 'Comment hidden' : 'Comment kept'}
          </span>
          <Button variant="text" size="md" onClick={() => setIsChangingDecision(true)}>
            Change decision
          </Button>
        </div>
      )}
    </div>
  );
}
