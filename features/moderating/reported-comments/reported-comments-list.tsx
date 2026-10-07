'use client';

import clsx from 'clsx';
import { useState } from 'react';

import { COMMENT_REPORT_REASONS } from '@/shared/constants/comment-report-reasons';
import { FinexLoader } from '@/shared/icons/finexLoader';
import { Tabs } from '@/shared/ui/tabs/ui';

import type { ModeratedComment } from '../api/comment-reports-api';
import {
  useGetCommentReportsQuery,
  useResolveCommentReportMutation,
} from '../api/comment-reports-api';

import { ReportCard } from './report-card';

const REASON_FILTERS = [{ value: null, label: 'All reasons' }, ...COMMENT_REPORT_REASONS];

export function ReportedCommentsList() {
  const [resolveCommentReport] = useResolveCommentReportMutation();

  const [activeTab, setActiveTab] = useState(0);
  const [activeReason, setActiveReason] = useState<string | null>(null);
  // Решения, принятые в текущей сессии: карточка остаётся в списке и просто
  // меняет вид на тег с решением — список не рефетчим до перезагрузки страницы.
  const [localDecisions, setLocalDecisions] = useState<Record<string, boolean>>({});

  const status = activeTab === 1 ? 'resolved' : 'pending';
  const { data, isLoading, isFetching } = useGetCommentReportsQuery({
    status,
    tag: activeReason ?? undefined,
  });

  // Резолв инвалидирует кэш (нужно для счётчика в сайдбаре), но список на
  // экране от этого дёргаться не должен — застываем на снапшоте и обновляем
  // его только когда реально сменили таб/фильтр, а не из-за фонового рефетча.
  const argsKey = `${status}:${activeReason ?? ''}`;
  const [snapshot, setSnapshot] = useState<{ key: string; comments: ModeratedComment[] } | null>(
    null,
  );

  // Обновление state прямо в рендере — санкционированный Реактом способ
  // подхватить новые данные при смене таба/фильтра без лишнего effect-цикла.
  if (data && snapshot?.key !== argsKey) {
    setSnapshot({ key: argsKey, comments: data });
  }

  const comments = snapshot?.key === argsKey ? snapshot.comments : [];
  const isBusy = (isLoading || isFetching) && snapshot?.key !== argsKey;

  const handleResolve = async (comment: ModeratedComment, resolve: boolean) => {
    await resolveCommentReport({ commentId: comment.id, resolve }).unwrap();
    setLocalDecisions((prev) => ({ ...prev, [comment.id]: resolve }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0">
        <h1 className="font-manrope text-[40px] font-bold leading-12 text-content-primary mb-7 mt-10">
          Reported comments
        </h1>

        <Tabs tabs={['Pending', 'Resolved']} defaultActive={0} onTabChange={setActiveTab} />

        <div className="flex flex-wrap gap-2 mt-4 mb-2">
          {REASON_FILTERS.map((reason) => {
            const isActive = activeReason === reason.value;
            return (
              <button
                key={reason.label}
                onClick={() => setActiveReason(reason.value)}
                className={clsx(
                  'rounded-lg px-3 py-1.5 text-sm transition-colors cursor-pointer',
                  isActive
                    ? 'bg-content-primary text-background-primary font-semibold'
                    : 'bg-background-secondary text-content-primary hover:bg-secondary-hover',
                )}
              >
                {reason.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        {isBusy && <FinexLoader className="mx-auto mt-16" size={32} />}

        {!isBusy && comments.length === 0 && (
          <p className="text-sm text-content-secondary mt-10">No reports found.</p>
        )}

        {!isBusy && comments.length > 0 && (
          <div className="mt-2">
            {comments.map((comment) => {
              const resolvedAs =
                comment.id in localDecisions
                  ? localDecisions[comment.id]
                  : activeTab === 1
                    ? comment.isDeleted
                    : null;
              return (
                <ReportCard
                  key={comment.id}
                  comment={comment}
                  resolvedAs={resolvedAs}
                  onResolve={handleResolve}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
