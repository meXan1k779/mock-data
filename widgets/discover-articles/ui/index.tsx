'use client';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';

import { useGetAllContentQuery } from '@/features/article/new-article/api/article-api';
import { setAllCards } from '@/features/article/new-article/models/article-slice';
import { LoginModal } from '@/features/auth/ui/login-modal';
import { EmptyBlock } from '@/features/main/empty-block';
import { VideoCardLarge } from '@/features/trading-videos/ui/video-card-large';
import type { RootState } from '@/shared/api/store';
import { useAppDispatch } from '@/shared/api/store';
import { MOCK_COMMENTS_COUNT } from '@/shared/constants/mock-comments-count';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { ChevronLeftIcon } from '@/shared/icons/chevronLeftIcon';
import { DropdownCheckIcon } from '@/shared/icons/dropdownCheckIcon';
import { FilterIcon } from '@/shared/icons/filterIcon';
import { FinexLoader } from '@/shared/icons/finexLoader';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card/card';
import { CardSkeleton } from '@/shared/ui/card/skeleton';
import { arrayToTopicString } from '@/shared/utils/arrayToTopicsString';
import { mockTopicksList } from '@/widgets/topics/ui/constants';

import {
  DIFFICULTY_TABS,
  DISCOVER_VIDEOS,
  getMockEngagementBaseline,
  SORT_OPTIONS,
  type SortBy,
} from './constants';
import { FiltersModal } from './filters-modal';
import { TopicChip } from './topic-chip';

export function DiscoverArticles() {
  const pathname = usePathname();
  const router = useRouter();
  // Articles and video live at separate URLs (/discover and /discover/video)
  // so each view is independently linkable/shareable and survives a refresh.
  // "/filters" nests under whichever of those is active (see below), so this
  // must match the prefix, not the exact path.
  const viewMode: 'articles' | 'video' = pathname.startsWith('/discover/video')
    ? 'video'
    : 'articles';
  const [complexity, setComplexity] = useState<number | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [sortOpen, setSortOpen] = useState(false);
  // The Filters modal is its own URL too (/discover/filters, /discover/video/filters) —
  // same "distinct, shareable, survives a refresh" reasoning as the tabs above, plus the
  // browser/hardware back button closes it for free since opening it is a router.push.
  const filtersBasePath = viewMode === 'video' ? '/discover/video' : '/discover';
  const filtersModalOpen = pathname === `${filtersBasePath}/filters`;
  const openFiltersModal = () => router.push(`${filtersBasePath}/filters`);
  const closeFiltersModal = () => router.push(filtersBasePath);
  const sortRef = useRef<HTMLDivElement>(null);
  useClickOutside(sortRef, () => setSortOpen(false), sortOpen);

  const user = useSelector((state: RootState) => state.auth.user);
  const { trackPageview } = useAnalytics();

  // Useberry usability-test screen tracking — the Filters modal is a distinct
  // URL (see filtersModalOpen above), so it needs its own pageview the same
  // way every other screen in the app reports one on mount.
  useEffect(() => {
    if (filtersModalOpen) {
      trackPageview(`${filtersBasePath}/filters`, user);
    }
  }, [filtersModalOpen]);

  // Only the difficulty/sort row pins on scroll (the title above it scrolls away) — the
  // pinned row gets its own white background + top padding per Figma's "stuck" state,
  // so a sentinel placed right above it tells us when it has actually latched to lg:top-17.
  const [isFiltersRowStuck, setIsFiltersRowStuck] = useState(false);
  const filtersRowSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = filtersRowSentinelRef.current;
    if (!sentinel) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsFiltersRowStuck(!entry.isIntersecting),
      { rootMargin: '-69px 0px 0px 0px', threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);
  const dispatch = useAppDispatch();

  const allCards = useSelector((state: RootState) => state.articleSave.allCards);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Reset pagination when the server-side filter (topic) changes. Complexity
    // is filtered client-side over the already-fetched pages below, so it must
    // NOT wipe allCards here — page/topic would stay unchanged, no refetch
    // would fire, and the list would go blank with no way to repopulate it.
    setPage(0);
    dispatch(setAllCards([]));
    setHasMore(true);
  }, [selectedTopics, dispatch]);

  const { data, isFetching, isLoading } = useGetAllContentQuery(
    { page, topic: arrayToTopicString(selectedTopics) },
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (!data) {
      return;
    }
    if (data.length === 0) {
      setHasMore(false);
      return;
    }
    dispatch(setAllCards([...allCards, ...data]));
  }, [data]);

  useEffect(() => {
    return () => {
      dispatch(setAllCards([]));
    };
  }, []);

  // No complexity/level filter exists on the API — filter the fetched page
  // client-side instead. `null` means no tab is selected, so nothing is filtered out.
  // A per-article mock baseline is added on top of the real vote/commentCount (see
  // getMockEngagementBaseline) so sorting below has something visible to reorder by.
  const cards = useMemo(
    () =>
      allCards
        .filter((card) => complexity === null || card.complexity === complexity)
        .map((card) => {
          const baseline = getMockEngagementBaseline(card.id ?? card.title ?? '');
          return {
            ...card,
            vote: String(baseline.vote + Number(card.vote ?? 0)),
            commentCount: baseline.commentCount + (card.commentCount ?? 0),
          };
        }),
    [allCards, complexity],
  );

  // The API only returns newest-first — "Most popular"/"Most commented" are
  // applied client-side over the already-loaded cards.
  const sortedCards = useMemo(() => {
    if (sortBy === 'popular') {
      return [...cards].sort((a, b) => Number(b.vote ?? 0) - Number(a.vote ?? 0));
    }
    if (sortBy === 'commented') {
      return [...cards].sort(
        (a, b) => (b.commentCount ?? MOCK_COMMENTS_COUNT) - (a.commentCount ?? MOCK_COMMENTS_COUNT),
      );
    }
    return cards;
  }, [cards, sortBy]);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  const handleToggleComplexity = (value: number) => {
    setComplexity((prev) => (prev === value ? null : value));
  };

  const handleToggleTopic = (title: string) => {
    setSelectedTopics((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title],
    );
  };

  const filteredVideos = useMemo(
    () =>
      DISCOVER_VIDEOS.filter(
        (video) =>
          (complexity === null || video.complexity === complexity) &&
          (selectedTopics.length === 0 || selectedTopics.includes(video.topic)),
      ),
    [complexity, selectedTopics],
  );

  const sortedVideos = useMemo(() => {
    if (sortBy === 'popular') {
      return [...filteredVideos].sort((a, b) => b.voteCount - a.voteCount);
    }
    if (sortBy === 'commented') {
      return [...filteredVideos].sort((a, b) => b.commentCount - a.commentCount);
    }
    return filteredVideos;
  }, [filteredVideos, sortBy]);

  // Drives the dot on the mobile/tablet filter button — it's the only way those
  // breakpoints surface that the (otherwise hidden) Topics/Sort modal has something
  // active, since the difficulty tabs already show their own state inline.
  const hasActiveModalFilters = selectedTopics.length > 0 || sortBy !== 'newest';

  return (
    <div className="px-4 md:px-8 lg:px-10 xl:px-0 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_326px] lg:gap-[60px] xl:gap-20 lg:items-start">
        <div className="min-w-0">
          <div className="pt-4 md:pt-6 lg:pt-7">
            <div className="flex items-start justify-between gap-1 md:gap-4 mb-3 lg:mb-5">
              <div className="flex flex-wrap items-center gap-1.5 max-[359px]:flex-nowrap">
                <h1 className="font-noto font-semibold text-content-primary text-[20px] leading-[28px] pt-1 pb-2 max-[359px]:text-[18px] max-[359px]:leading-[24px] md:pt-0 md:pb-1 md:text-[24px] md:leading-[32px] lg:text-[28px] lg:leading-[36px]">
                  Temukan
                </h1>
                <button
                  onClick={() => router.push('/discover')}
                  className={clsx(
                    'font-noto font-semibold rounded-full px-3 pt-1 pb-2 text-[20px] leading-[28px] transition-colors max-[359px]:text-[18px] max-[359px]:leading-[24px] md:pt-0 md:pb-1 md:text-[24px] md:leading-[32px] lg:text-[28px] lg:leading-[36px]',
                    viewMode === 'articles'
                      ? 'bg-content-primary text-background-primary'
                      : 'bg-background-secondary text-content-primary hover:opacity-85',
                  )}
                >
                  artikel
                </button>
                {/* Mobile uses a compact "/" separator (per Figma) so the row fits on one line;
                    md+ has room for the full word. */}
                <span className="md:hidden font-noto font-semibold text-content-primary text-[18px] leading-[24px] pt-1 pb-2">
                  /
                </span>
                <span className="hidden md:inline-block font-noto font-semibold text-content-primary md:text-[24px] md:leading-[32px] md:pt-0 md:pb-1 lg:text-[28px] lg:leading-[36px]">
                  atau
                </span>
                <button
                  onClick={() => router.push('/discover/video')}
                  className={clsx(
                    'font-noto font-semibold rounded-full px-3 pt-1 pb-2 text-[20px] leading-[28px] transition-colors max-[359px]:text-[18px] max-[359px]:leading-[24px] md:pt-0 md:pb-1 md:text-[24px] md:leading-[32px] lg:text-[28px] lg:leading-[36px]',
                    viewMode === 'video'
                      ? 'bg-content-primary text-background-primary'
                      : 'bg-background-secondary text-content-primary hover:opacity-85',
                  )}
                >
                  video
                </button>
              </div>

              <button
                onClick={openFiltersModal}
                aria-label="Filters"
                className="md:hidden relative flex items-center justify-center size-10 max-[359px]:size-9 rounded-full shrink-0 bg-background-secondary transition-colors"
              >
                <FilterIcon className="size-4 text-content-primary" />
                {hasActiveModalFilters && (
                  <span className="absolute -top-px -right-px size-3 rounded-full border-2 border-background-primary bg-[#FF9800]" />
                )}
              </button>
            </div>
          </div>

          <div ref={filtersRowSentinelRef} />

          <div
            className={clsx(
              'sticky top-16 md:top-17 z-10 transition-[padding]',
              isFiltersRowStuck && 'bg-background-primary pt-4 md:pt-5 lg:pt-7',
            )}
          >
            <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
              <div className="flex items-center gap-2 min-w-0 overflow-x-auto scrollbar-hide flex-nowrap -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
                {DIFFICULTY_TABS.map((tab) => (
                  <button
                    key={tab.complexity}
                    onClick={() => handleToggleComplexity(tab.complexity)}
                    className={clsx(
                      'h-8 px-3 rounded-full text-base whitespace-nowrap shrink-0 transition-colors',
                      complexity === tab.complexity
                        ? 'bg-content-primary text-background-primary'
                        : 'bg-background-secondary text-content-primary hover:opacity-85',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative hidden lg:block" ref={sortRef}>
                <Button
                  variant="text"
                  size="sm"
                  onClick={() => setSortOpen((prev) => !prev)}
                  rightIcon={
                    <ChevronLeftIcon
                      className={clsx('w-2 h-3', sortOpen ? 'rotate-90' : '-rotate-90')}
                    />
                  }
                >
                  {SORT_OPTIONS.find((option) => option.value === sortBy)?.label}
                </Button>

                {sortOpen && (
                  <div className="absolute right-0 top-full mt-2 z-30 w-max min-w-[196px] rounded-xl bg-background-primary p-3 shadow-[0_2px_12px_0_rgba(17,25,40,0.12)]">
                    {SORT_OPTIONS.map((option) => {
                      const isActive = option.value === sortBy;
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setSortOpen(false);
                          }}
                          className={clsx(
                            'flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-lg pl-3 pr-2 py-3 text-left text-sm font-medium leading-6 transition-colors',
                            isActive
                              ? 'bg-background-secondary text-content-primary'
                              : 'text-content-secondary hover:bg-background-secondary',
                          )}
                        >
                          {option.label}
                          {isActive && (
                            <DropdownCheckIcon className="shrink-0 text-content-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={openFiltersModal}
                aria-label="Filters"
                className="hidden md:flex lg:hidden relative items-center justify-center size-10 rounded-full shrink-0 bg-background-secondary transition-colors"
              >
                <FilterIcon className="size-4 text-content-primary" />
                {hasActiveModalFilters && (
                  <span className="absolute -top-px -right-px size-3 rounded-full border-2 border-background-primary bg-[#FF9800]" />
                )}
              </button>
            </div>
          </div>

          {viewMode === 'articles' && (
            <>
              {/* Card/CardSkeleton carry their own top padding, which would otherwise stack
                  on top of the filters row's mb-5 and overshoot the macket's intended
                  20px gap to the first card — this cancels exactly that padding back out. */}
              {isLoading && cards.length === 0 && (
                <div className="-mt-4 space-y-6 sm:-mt-8">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <CardSkeleton key={index} />
                  ))}
                </div>
              )}

              {!!sortedCards.length && (
                <div className="-mt-4 sm:-mt-8">
                  <InfiniteScroll
                    dataLength={sortedCards.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={isFetching ? <FinexLoader className="mx-auto my-4" size={32} /> : null}
                  >
                    {sortedCards.map((item, i) => (
                      <div key={item.id} className="contents">
                        <Card {...item} showReadingTime isPriority={i === 0} />
                        {i !== sortedCards.length - 1 && (
                          // No self-margin here: the macket's 24px gap already equals
                          // Card's own py-6 on each side, so a bare border line between
                          // two cards lands exactly on the macket's spacing with nothing
                          // extra added.
                          <div className="border-t border-border-tetriary" />
                        )}
                      </div>
                    ))}
                  </InfiniteScroll>
                </div>
              )}

              {!cards.length && !isLoading && !isFetching && <EmptyBlock />}
            </>
          )}

          {viewMode === 'video' &&
            (sortedVideos.length ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                {sortedVideos.map((video) => (
                  <VideoCardLarge key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <EmptyBlock />
            ))}
        </div>

        <aside
          className={clsx(
            'hidden lg:flex lg:sticky lg:top-17 flex-col items-start gap-3 transition-[padding]',
            // Tracks the same stuck/unstuck state as the difficulty/sort row (both pin at
            // the same lg:top-17) so the topic chips stay aligned with it either way —
            // unstuck they match its natural position below the title, stuck they match
            // its pt-7 (28px) sticky-state padding.
            isFiltersRowStuck ? 'lg:pt-7' : 'lg:pt-[100px] 2xl:pt-[88px]',
          )}
        >
          <div className="flex flex-col items-start gap-2">
            {mockTopicksList.map((topic) => (
              <TopicChip
                key={topic.title}
                topic={topic}
                isSelected={selectedTopics.includes(topic.title)}
                onToggle={() => handleToggleTopic(topic.title)}
              />
            ))}
          </div>
        </aside>
      </div>

      <FiltersModal
        isOpen={filtersModalOpen}
        onClose={closeFiltersModal}
        selectedTopics={selectedTopics}
        onToggleTopic={handleToggleTopic}
        sortBy={sortBy}
        onChangeSort={setSortBy}
      />

      <LoginModal />
    </div>
  );
}
