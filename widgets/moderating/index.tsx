'use client';
import { useState, useCallback } from 'react';

import { useGetModeratorContentQuery } from '@/features/article/new-article/api/article-api';
import { ModeratingCards } from '@/features/moderating/moderating-cards';
import { ArticleStatus } from '@/shared/types/types';
import { AdminLayout } from '@/widgets/admin-layout';

const getStatus = (activeTab: number) => {
  switch (activeTab) {
    case 1:
      return ArticleStatus.REGULATOR_REVIEW;
    case 2:
      return `${ArticleStatus.MODERATOR_REJECTED}&status=${ArticleStatus.REGULATOR_REJECTED}` as ArticleStatus;
    default:
      return ArticleStatus.MODERATOR_REVIEW;
  }
};

export const ModeratingPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const { data, isLoading, isFetching } = useGetModeratorContentQuery(getStatus(activeTab), {
    refetchOnMountOrArgChange: true,
  });

  const handleTabChange = useCallback((number: number) => {
    setActiveTab(number);
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col h-full">
        <div className="shrink-0 font-manrope text-[40px] font-bold mb-7 leading-12 mt-10">
          Article moderation
        </div>
        <ModeratingCards
          data={data}
          handleTabChange={handleTabChange}
          activeTab={activeTab}
          isLoading={isLoading || isFetching}
        />
      </div>
    </AdminLayout>
  );
};
