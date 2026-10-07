'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useGetAllMyContentQuery } from '@/features/article/new-article/api/article-api';
import type { RootState } from '@/shared/api/store';
import { withAuth } from '@/shared/hocs/with-auth';
import { useAnalytics } from '@/shared/hooks/useAnalytics';

import { CardsBlock } from './cards-block';
import { PersonalInfo } from './profile-info';

const defaultStatuses =
  'status=draft&status=moderatorReview&status=moderator_rejected&status=regulatorReview&status=regulator_rejected';
const published = 'status=approved';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const { data, isLoading, isFetching } = useGetAllMyContentQuery(
    activeTab === 0 ? defaultStatuses : published,
  );

  const user = useSelector((state: RootState) => state.auth.user);

  const handleTabChange = useCallback((number: number) => {
    setActiveTab(number);
  }, []);

  const { trackPageview } = useAnalytics();

  useEffect(() => {
    trackPageview('/profile', user);
  }, []);

  return (
    <div className="max-w-[700px] m-auto px-4 md:px-0">
      <title>Finex kita - profile </title>
      <PersonalInfo />
      <CardsBlock
        data={data}
        handleTabChange={handleTabChange}
        activeTab={activeTab}
        isLoading={isLoading || isFetching}
      />
    </div>
  );
};

export default dynamic(() => Promise.resolve(withAuth(ProfilePage)), { ssr: false });
