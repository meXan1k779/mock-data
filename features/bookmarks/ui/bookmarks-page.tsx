'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useGetMyBookmarksQuery } from '@/features/bookmarks/api/bookmarks-api';
import { DISCOVER_VIDEOS } from '@/features/trading-videos/model/constants';
import { VideoCardLarge } from '@/features/trading-videos/ui/video-card-large';
import type { RootState } from '@/shared/api/store';
import { withAuth } from '@/shared/hocs/with-auth';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useVideoBookmarks } from '@/shared/hooks/useVideoBookmarks';
import { FinexLoader } from '@/shared/icons/finexLoader';
import { Card } from '@/shared/ui/card/card';
import { Tabs } from '@/shared/ui/tabs/ui';

const BookmarksPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const {
    data: bookmarkedArticles,
    isLoading,
    isFetching,
  } = useGetMyBookmarksQuery(undefined, { skip: activeTab !== 0 });

  const { bookmarkedVideoIds } = useVideoBookmarks();
  const bookmarkedVideos = DISCOVER_VIDEOS.filter((video) => bookmarkedVideoIds.includes(video.id));

  const user = useSelector((state: RootState) => state.auth.user);
  const { trackPageview } = useAnalytics();

  useEffect(() => {
    trackPageview('/bookmarks', user);
  }, []);

  return (
    <div className="max-w-[700px] m-auto px-4 md:px-0 pb-20 pt-4 md:pt-6 lg:pt-10 2xl:pt-7">
      <title>Finex kita - bookmarks</title>
      <h1 className="font-manrope font-bold text-content-primary text-[28px] leading-[36px] md:text-[40px] md:leading-[48px] mb-5">
        Tersimpan
      </h1>
      <Tabs tabs={['Artikel', 'Video']} defaultActive={activeTab} onTabChange={setActiveTab} />

      {activeTab === 0 && (
        <div className="mt-4">
          {(isLoading || isFetching) && (
            <FinexLoader
              className="fixed top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
              size={32}
            />
          )}
          {!isLoading &&
            !isFetching &&
            bookmarkedArticles?.map((item) => (
              <Card className="border-b border-border-tetriary" {...item} key={item.id} />
            ))}
          {!isLoading && !isFetching && !bookmarkedArticles?.length && (
            <div className="flex flex-col items-center justify-center gap-3 mt-[110px] text-center">
              <p className="font-manrope font-bold text-[20px] leading-7 text-content-primary">
                Koleksi Anda masih kosong
              </p>
              <p className="text-base text-content-secondary leading-6 tracking-[0.16px]">
                Simpan artikel yang relevan untuk membangun koleksi pengetahuan Anda sendiri.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 1 && (
        <div className="mt-4">
          {bookmarkedVideos.length ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              {bookmarkedVideos.map((video) => (
                <VideoCardLarge key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 mt-[110px] text-center">
              <p className="font-manrope font-bold text-[20px] leading-7 text-content-primary">
                Koleksi Anda masih kosong
              </p>
              <p className="text-base text-content-secondary leading-6 tracking-[0.16px]">
                Simpan video yang relevan untuk membangun koleksi pengetahuan Anda sendiri.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(withAuth(BookmarksPage)), { ssr: false });
