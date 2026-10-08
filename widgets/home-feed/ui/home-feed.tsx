'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';

import { ConfirmModal } from '@/features/article/modals/confirm-modal';
import { useGetAllContentQuery } from '@/features/article/new-article/api/article-api';
import type { ContentResponse } from '@/features/article/new-article/api/types';
import { setAllCards } from '@/features/article/new-article/models/article-slice';
import { LoginModal } from '@/features/auth/ui/login-modal';
import { EmptyBlock } from '@/features/main/empty-block';
import { OpinionBanner } from '@/features/main/opinion-banner';
import { RegulatorBanner } from '@/features/main/regulator-banner';
import { SideInfo } from '@/features/main/side-info';
import type { RootState } from '@/shared/api/store';
import { useAppDispatch } from '@/shared/api/store';
import { FinexLoader } from '@/shared/icons/finexLoader';
import { Card } from '@/shared/ui/card/card';
import { CardSkeleton } from '@/shared/ui/card/skeleton';
import { arrayToTopicString } from '@/shared/utils/arrayToTopicsString';
import { mockTopicksList } from '@/widgets/topics/ui/constants';

const Topics = dynamic(() => import('@/widgets/topics/ui/topics'), { ssr: false });

interface HomeFeedProps {
  initialCards: ContentResponse[];
}

export function HomeFeed({ initialCards }: HomeFeedProps) {
  const [isTopicsVisible, setIsTopicsVisible] = useState(true);
  const lastScrollTopRef = useRef(0);
  const animationLockRef = useRef(false);
  const [topics, setTopics] = useState(mockTopicksList);
  const dispatch = useAppDispatch();

  const allCards = useSelector((state: RootState) => state.articleSave.allCards);
  const cards = allCards.length > 0 ? allCards : initialCards;

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);

  const selectedTopics = useMemo(
    () => topics.filter((topic) => topic.isSelected).map((item) => item.title),
    [topics],
  );

  useEffect(() => {
    // Resets pagination alongside the Redux cards cache below when the topic
    // filter changes — tied to that external-store sync, not derived render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(0);
    dispatch(setAllCards([]));
    setHasMore(true);
  }, [selectedTopics]);

  const { data, isFetching, isLoading } = useGetAllContentQuery(
    {
      page,
      topic: arrayToTopicString(selectedTopics),
    },
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (data) {
      if (data.length === 0) {
        // Local flag paired with the Redux cards sync in this same effect.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasMore(false);
      } else {
        // Keep the already-rendered previewUrl for cards we got from SSR: previewUrl
        // is a presigned link re-signed on every request, so taking the fresh one here
        // would change the <img> src and force a redundant re-download of the same image.
        const patched = data.map((item) => {
          const initial = initialCards.find((card) => card.id === item.id);
          return initial ? { ...item, previewUrl: initial.previewUrl } : item;
        });
        dispatch(setAllCards([...allCards, ...patched]));
      }
    }
  }, [data, initialCards]);

  useEffect(() => {
    return () => {
      dispatch(setAllCards([]));
    };
  }, []);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  const handleScroll = useCallback(() => {
    if (!scrollContainer) {
      return;
    }

    const scrollTop = scrollContainer.scrollTop;
    const isScrollingDown = scrollTop > lastScrollTopRef.current;
    const isNearTop = scrollTop < 200;

    if (animationLockRef.current) {
      return;
    }

    if (isScrollingDown && scrollTop > 200 && isTopicsVisible) {
      animationLockRef.current = true;
      setIsTopicsVisible(false);
      setTimeout(() => {
        animationLockRef.current = false;
      }, 500);
    } else if ((!isScrollingDown || isNearTop) && !isTopicsVisible) {
      animationLockRef.current = true;
      setIsTopicsVisible(true);
      setTimeout(() => {
        animationLockRef.current = false;
      }, 500);
    }
    lastScrollTopRef.current = scrollTop;
  }, [scrollContainer, isTopicsVisible]);

  useEffect(() => {
    if (!scrollContainer) {
      return;
    }
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [scrollContainer, handleScroll]);

  return (
    <div>
      <title>Finex kita</title>
      <section>
        <div className="container xl:px-0 max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-6 px-4 md:px-8 xl:px-0">
            <div className="grid grid-rows-[auto_1fr] gap-0 h-[calc(100vh-85px)] md:h-[calc(100vh-80px)]">
              <div
                className={clsx(
                  'transition-all duration-500 ease-in-out overflow-hidden max-w-[820px] mt-4',
                  isTopicsVisible
                    ? 'opacity-100 translate-y-0 max-h-[500px]'
                    : 'opacity-0 -translate-y-4 max-h-0',
                )}
              >
                <Topics setTopics={setTopics} topics={topics} className="sm:mb-2 mt-0" />
              </div>

              {isLoading && cards.length === 0 && (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <CardSkeleton key={index} />
                  ))}
                </div>
              )}

              {!!cards.length && (
                <div
                  ref={setScrollContainer}
                  className="overflow-y-auto scrollbar-hide max-w-[794px] min-h-0"
                  id="scrollable-container"
                >
                  <InfiniteScroll
                    dataLength={cards.length}
                    next={loadMore}
                    loader={
                      isFetching ? (
                        <FinexLoader
                          className="fixed bottom-1 left-1/2 2md:left-2/5 -translate-x-1/2 -translate-y-1/2"
                          size={32}
                        />
                      ) : null
                    }
                    hasMore={hasMore}
                    scrollableTarget="scrollable-container"
                  >
                    {cards.length > 0 && (
                      <>
                        <Card
                          {...cards[0]}
                          key={cards[0].id}
                          className="min-h-[310px] 2md:border-b 2md:border-border-tetriary"
                          showReadingTime
                          isPriority
                        />
                        {cards[1] && (
                          <Card
                            {...cards[1]}
                            key={cards[1].id}
                            className="2md:border-b 2md:border-border-tetriary"
                            showReadingTime
                          />
                        )}
                        <RegulatorBanner
                          key="regulator-banner-inline"
                          className="2md:hidden block w-full my-6 sm:my-0"
                        />
                        {cards.slice(2, 4).map((item, i) => (
                          <Card
                            {...item}
                            key={item.id}
                            className={clsx(i !== 1 && 'border-b border-border-tetriary')}
                            showReadingTime
                          />
                        ))}
                        <SideInfo key="inline-banner" className="2md:hidden block w-full my-6" />
                        {cards.slice(4, 6).map((item, i) => (
                          <Card
                            {...item}
                            key={item.id}
                            className={clsx(i !== 1 && 'border-b border-border-tetriary')}
                            showReadingTime
                          />
                        ))}
                        <OpinionBanner
                          key="opinion-banner-inline"
                          className="2md:hidden block w-full my-6"
                        />
                        {cards.slice(6).map((item, i) => (
                          <Card
                            {...item}
                            key={item.id}
                            className={clsx(i !== 1 && 'border-b border-border-tetriary')}
                            showReadingTime
                          />
                        ))}
                      </>
                    )}
                  </InfiniteScroll>
                </div>
              )}
              {!cards.length && !isLoading && !isFetching && <EmptyBlock />}
            </div>

            <div className="flex flex-col gap-4">
              <RegulatorBanner className="2md:block hidden max-w-[326px] mt-7" />
              <SideInfo className="2md:block hidden max-w-[326px]" />
              <OpinionBanner className="2md:block hidden max-w-[326px]" />
            </div>
          </div>
        </div>
      </section>
      <ConfirmModal />
      <LoginModal />
    </div>
  );
}
