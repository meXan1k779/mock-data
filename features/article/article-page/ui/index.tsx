'use client';

import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import DOMPurify from 'dompurify';
import { notFound, useParams, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { LoginModal } from '@/features/auth/ui/login-modal';
import { getLearningPathById } from '@/features/learning-paths/model/constants';
import { usePathProgress } from '@/features/learning-paths/model/use-path-progress';
import { usePathSteps } from '@/features/learning-paths/model/use-path-steps';
import {
  markArticleRead,
  markCompletedModalShown,
} from '@/features/learning-paths/models/learning-paths-slice';
import { PathCompletedModal } from '@/features/learning-paths/ui/path-completed-modal';
import { useAppDispatch, type RootState } from '@/shared/api/store';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { CommentIcon } from '@/shared/icons/commentIcon';
import { ScrollIcon } from '@/shared/icons/scrollIcon';
import { ArticleStatus } from '@/shared/types/types';
import { ArticleActions } from '@/shared/ui/article-actions';
import { Avatar } from '@/shared/ui/avatar';
import { LevelBadge } from '@/shared/ui/level-badge';
import { VoteBlock } from '@/shared/ui/vote-block/vote-block';
import { getReadingTime } from '@/shared/utils/getReadingTime';
import { injectImageUrls } from '@/shared/utils/injectImageUrls';

import {
  useGetContentByIdQuery,
  useGetModeratorContentByIdQuery,
  useGetMyContentByIdQuery,
} from '../../new-article/api/article-api';
import { useGetCommentsQuery } from '../api/comments-api';
import { setArticleData } from '../models/current-article-slice';

import { BappebtiBadge } from './bappebti-badge';
import { CommentsSection } from './comments-section';
import { countComments } from './comments-section/utils';
import { ControlPanel } from './control-panel';
import { PathPaginationBar } from './path-pagination-bar';
import { PathSidebar } from './path-sidebar';
import { ArticlePageSkeleton } from './skeleton';
import { WhatTradersReadNext } from './what-traders-read-next';

const SCROLL_THRESHOLD = 300;
const READ_SCROLL_PERCENT = 0.8;

export const ArticlePage = () => {
  const [descriptionWithImg, setDescription] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isTextAreaOpen, setTextAreaOpen] = useState(false);
  const loadedImgSrcs = useRef(new Set<string>());
  const contentRef = useRef<HTMLDivElement>(null);
  const scrolledToCommentsRef = useRef(false);

  const dispatch = useAppDispatch();
  const data = useSelector((state: RootState) => state.article).article;

  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthLoading = useSelector((state: RootState) => state.auth.isLoading);

  const isModerator = user?.role === 'moderator';

  const path = usePathname();
  const isReadOnly = path.includes('review'); // приходим из профиля
  const isModerating = path.includes('moderation'); // приходим из модерации

  const params = useParams();
  const articleId = params?.id as string;

  const searchParams = useSearchParams();
  const pathId = searchParams.get('path');
  const learningPath = pathId ? getLearningPathById(pathId) : null;
  const pathProgress = usePathProgress(pathId ?? '');
  const { steps: pathSteps } = usePathSteps(pathId ?? '');
  const readArticleIds = useSelector((state: RootState) => state.learningPaths.readArticleIds);
  const hasMarkedReadRef = useRef(false);
  const [showPathCompleted, setShowPathCompleted] = useState(false);

  const pathStepIndex = pathId ? pathSteps.findIndex((step) => step.id === articleId) : -1;
  const isLastPathStep = pathStepIndex !== -1 && pathStepIndex === pathSteps.length - 1;
  const [isCourseMenuOpen, setCourseMenuOpen] = useState(false);

  useEffect(() => {
    setCourseMenuOpen(false);
  }, [articleId]);

  const { trackPageview } = useAnalytics();

  useEffect(() => {
    trackPageview(`/article/${articleId}`, user);
  }, []);

  const {
    data: articleData,
    isLoading: articleLoading,
    isFetching: isContentFetching,
    error,
  } = useGetContentByIdQuery(articleId, {
    skip: !articleId || isReadOnly || isModerating || isAuthLoading,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: articleModeratingData,
    isLoading: articleModeratingLoading,
    isFetching: isArticleModeratingDataFetching,
  } = useGetModeratorContentByIdQuery(articleId, {
    skip: !articleId || !isModerating || isAuthLoading,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: reviewData,
    isLoading: isReviewLoading,
    isFetching: isMyContentFetching,
  } = useGetMyContentByIdQuery(articleId, {
    skip: !articleId || !isReadOnly || isAuthLoading,
    refetchOnMountOrArgChange: true,
  });

  const { data: commentsData } = useGetCommentsQuery(
    { contentId: articleId, page: 0, limit: 50 },
    { skip: !articleId },
  );
  const commentsCount = countComments(Array.isArray(commentsData) ? commentsData : []);

  const getInfoText = () => {
    switch (true) {
      case isModeratorReviewStatus:
        return 'Artikel ini sedang dalam peninjauan moderator.';
      case isRegulatorReviewStatus:
        return 'Artikel ini sedang dalam peninjauan regulator.';
      case isRequestChangesStatus:
        return 'Anda telah mengirim permintaan perubahan kepada penulis.';
      default:
        return '';
    }
  };

  const isLoading =
    isAuthLoading ||
    articleLoading ||
    isReviewLoading ||
    articleModeratingLoading ||
    isArticleModeratingDataFetching ||
    isMyContentFetching ||
    isContentFetching;
  const isModeratorReviewStatus = ArticleStatus.MODERATOR_REVIEW === data?.status && isModerator;
  const isRegulatorReviewStatus = ArticleStatus.REGULATOR_REVIEW === data?.status && isModerator;
  const isApprovedStatus = ArticleStatus.APPROVED === data?.status;
  const isRequestChangesStatus =
    data?.status &&
    [ArticleStatus.MODERATOR_REJECTED, ArticleStatus.REGULATOR_REJECTED].includes(data?.status) &&
    isModerator;

  const updateDescription = (freshData: {
    description?: string;
    AttachedFile?: { fileId: string; id: string; link: string }[];
  }) => {
    setDescription(injectImageUrls(freshData.description || '', freshData.AttachedFile || []));
  };

  if (error) {
    notFound();
  }

  useEffect(() => {
    const freshData = articleData || reviewData || articleModeratingData;
    if (freshData?.id) {
      dispatch(setArticleData(freshData));
      // Local derived-description state paired with the Redux sync above.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      updateDescription(freshData);
    }
  }, [articleData, reviewData, articleModeratingData]);

  useEffect(() => {
    if (!contentRef.current || !descriptionWithImg) {
      return;
    }
    contentRef.current.innerHTML = DOMPurify.sanitize(descriptionWithImg);
    const imgs = contentRef.current.querySelectorAll<HTMLImageElement>('img');

    // Images have no reserved aspect-ratio (see .my-img in globals.css), so their
    // real height — known only once loaded — can shift the comments section below
    // them. Scroll there right away for instant feedback, then do one silent
    // correction once images settle, capped so a slow/broken image can't stall it.
    const shouldScrollToComments =
      window.location.hash === '#comments' && !scrolledToCommentsRef.current;
    if (shouldScrollToComments) {
      scrolledToCommentsRef.current = true;
      document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' });
    }

    let pendingImages = imgs.length;
    let settled = false;
    const settleScroll = () => {
      if (settled || !shouldScrollToComments) {
        return;
      }
      settled = true;
      document.getElementById('comments')?.scrollIntoView({ behavior: 'auto' });
    };
    if (pendingImages === 0) {
      settleScroll();
    } else if (shouldScrollToComments) {
      setTimeout(settleScroll, 1200);
    }

    imgs.forEach((img) => {
      const markLoaded = () => {
        img.classList.add('loaded');
        loadedImgSrcs.current.add(img.src);
        pendingImages -= 1;
        if (pendingImages === 0) {
          settleScroll();
        }
      };
      if (loadedImgSrcs.current.has(img.src) || img.complete) {
        markLoaded();
      } else {
        img.addEventListener('load', markLoaded, { once: true });
      }
    });
  }, [descriptionWithImg]);

  // Отслеживаем прокрутку страницы
  useEffect(() => {
    const handleScroll = () => {
      // Показываем кнопку, если прокрутили больше порога
      setShowScrollButton(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Marks the article as read (globally, whether opened via a learning path or
  // not — per spec, reading it outside path context still counts toward
  // progress) once the reader has scrolled through most of it.
  //
  // The last article of a path is the exception: it's marked read (and the
  // path-completed modal shown) only from an explicit "Finish" click —
  // see handleFinish — not just from scrolling past it.
  useEffect(() => {
    if (!articleId || hasMarkedReadRef.current || isLastPathStep) {
      return;
    }

    const handleReadProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = scrollable > 0 ? window.scrollY / scrollable : 1;
      if (scrolled < READ_SCROLL_PERCENT) {
        return;
      }

      hasMarkedReadRef.current = true;
      window.removeEventListener('scroll', handleReadProgress);
      dispatch(markArticleRead(articleId));
    };

    window.addEventListener('scroll', handleReadProgress);
    handleReadProgress();

    return () => window.removeEventListener('scroll', handleReadProgress);
  }, [articleId, isLastPathStep, dispatch]);

  // Explicit completion: clicking "Finish" on the last article of a path
  // marks it read and, if that's the article completing the path, shows the
  // path-completed modal.
  const handleFinish = () => {
    const wasAlreadyRead = readArticleIds.includes(articleId);
    dispatch(markArticleRead(articleId));

    if (
      !wasAlreadyRead &&
      pathId &&
      pathProgress.totalCount > 0 &&
      pathProgress.completedCount + 1 === pathProgress.totalCount
    ) {
      dispatch(markCompletedModalShown(pathId));
      setShowPathCompleted(true);
    }
  };

  useEffect(() => {
    if (isLoading) {
      document.title = 'Finex kita - loading';
    } else if (articleData?.title) {
      document.title = `Finex kita - ${articleData.title}`;
    }
  }, [articleData?.title, isLoading]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const isEditorDataLoading = isLoading || !articleId;

  const time =
    data?.createdAt &&
    formatDistanceToNow(data.createdAt, {
      addSuffix: true,
      locale: localeId,
    });

  if (!data || isEditorDataLoading) {
    return <ArticlePageSkeleton />;
  }

  return (
    <div
      className={
        (clsx('relative mb-10'),
        isModeratorReviewStatus || isRegulatorReviewStatus
          ? isTextAreaOpen
            ? 'pb-76'
            : 'pb-28'
          : '')
      }
    >
      {isApprovedStatus && (
        <div className="text-xs leading-4 flex p-3 items-center justify-center bg-background-secondary w-screen left-1/2 -translate-x-1/2 relative">
          Transaksi Derivatif adalah Transaksi High Risk High Return
        </div>
      )}
      {(isModeratorReviewStatus || isRegulatorReviewStatus || isRequestChangesStatus) && (
        <div className="text-sm flex px-4 items-center justify-center h-15 bg-background-warning w-screen left-1/2 -translate-x-1/2 relative">
          {getInfoText()}
        </div>
      )}

      {isRequestChangesStatus && (
        <div className="mt-6 p-4 max-w-[700px] bg-background-secondary border border-[#CFD4DD] rounded-xl m-auto">
          <div className="font-semibold">Komentar untuk penulis</div>
          <div>{data?.errorComment}</div>
        </div>
      )}
      <div className={learningPath ? 'w-screen ml-[calc(50%-50vw)]' : undefined}>
        <div
          className={clsx(
            'pt-6',
            learningPath
              ? 'px-4 sm:px-8 lg:px-10 max-w-7xl mx-auto lg:grid lg:grid-cols-[360px_1fr] lg:gap-[44px] xl:gap-[140px]'
              : 'mx-4 sm:mx-8 md:m-auto max-w-[700px]',
          )}
        >
          {learningPath && (
            <PathSidebar
              pathId={learningPath.id}
              articleId={articleId}
              className="hidden lg:flex lg:sticky lg:top-[92px] lg:max-h-[calc(100vh-116px)] lg:self-start"
            />
          )}
          <div className={learningPath ? 'lg:max-w-[700px] min-w-0' : ''}>
            {data?.approveId && <BappebtiBadge aprovalNumber={data?.approveId} />}
            <div className="2xl:text-[40px] lg:text-[36px] md:text-[32px] text-[28px] font-manrope w-full outline-none font-bold leading-8 md:leading-12">
              {data?.title}
            </div>
            <div className="flex items-center flex-wrap my-4 gap-1">
              <LevelBadge level={data?.complexity} />
              {data?.topics.map((topic) => (
                <div
                  key={topic}
                  className="text-xs text-base-tech px-2 py-1 rounded-sm inline-block bg-background-secondary mr-1"
                >
                  {topic}
                </div>
              ))}
            </div>

            <div className="flex justify-between flex-wrap items-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Avatar
                  nickname={data?.Creator?.nickname}
                  avatarUrl={data?.Creator?.avatarUrl}
                  size="lg"
                />
                <div className="flex flex-col gap-0.5">
                  <div className="text-sm text-content-primary">{data?.Creator?.nickname}</div>
                  <div className="flex items-center gap-1 text-sm text-content-secondary">
                    {time && <span>{time}</span>}
                    {data?.description && (
                      <>
                        {time && <span>•</span>}
                        <span>{getReadingTime(data.description)} menit membaca</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isApprovedStatus && (
                  <button
                    onClick={() =>
                      document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="inline-flex items-center justify-center gap-1 h-8 px-2 bg-background-secondary rounded-3xl text-content-secondary hover:bg-border-tetriary transition-colors"
                  >
                    <CommentIcon className="shrink-0" />
                    <span className="text-sm leading-none">{commentsCount}</span>
                  </button>
                )}
                {isApprovedStatus && data && <ArticleActions article={data} />}
                {!isReadOnly && !isModerating && (
                  <VoteBlock
                    vote={data?.vote}
                    alreadyVote={data?.alreadyVote}
                    id={data?.id}
                    className="hidden sm:flex"
                  />
                )}
              </div>
            </div>
            <div ref={contentRef} className="my-img mb-20 sm:mb-25 tiptap" />
            {isApprovedStatus && <CommentsSection contentId={articleId} />}
            {isApprovedStatus && !learningPath && <WhatTradersReadNext className="mt-20 mb-25" />}
            {learningPath && (
              <PathPaginationBar
                pathId={learningPath.id}
                articleId={articleId}
                onOpenCourseMenu={() => setCourseMenuOpen(true)}
                onFinish={handleFinish}
              />
            )}
          </div>
        </div>
      </div>
      {learningPath && isCourseMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-background-primary flex flex-col">
          <PathSidebar
            pathId={learningPath.id}
            articleId={articleId}
            onClose={() => setCourseMenuOpen(false)}
            className="h-full p-4 md:p-8"
          />
        </div>
      )}
      {showScrollButton && (
        // Fixed (viewport-relative), but the wrapper mirrors the exact grid/padding of the
        // main content wrapper above (sidebar column + gap at lg+) so the row lands in the
        // same horizontal position as the article column at every breakpoint, instead of
        // guessing a fixed left offset that would sit under the sidebar on desktop.
        <div className={clsx('fixed inset-x-0 z-20', learningPath ? 'bottom-[72px]' : 'bottom-4')}>
          <div
            className={clsx(
              learningPath
                ? 'px-4 sm:px-8 lg:px-10 max-w-7xl mx-auto lg:grid lg:grid-cols-[360px_1fr] lg:gap-[44px] xl:gap-[140px]'
                : 'mx-4 sm:mx-8 md:m-auto max-w-[700px]',
            )}
          >
            {learningPath && <div className="hidden lg:block" />}
            <div className="lg:max-w-[700px] grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="flex items-center gap-1 sm:gap-2 justify-self-start">
                {isApprovedStatus && (
                  <button
                    onClick={() =>
                      document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="inline-flex items-center justify-center gap-1 h-10 px-3 rounded-3xl bg-content-primary text-background-secondary hover:opacity-90 transition-colors"
                  >
                    <CommentIcon className="shrink-0" />
                    <span className="text-sm leading-none">{commentsCount}</span>
                  </button>
                )}
                {isApprovedStatus && data && <ArticleActions article={data} isDarkMode />}
              </div>
              {!isReadOnly && !isModerating && (
                <VoteBlock
                  vote={data?.vote}
                  alreadyVote={data?.alreadyVote}
                  isDarkMode
                  id={data?.id}
                  className="h-10 justify-self-center"
                />
              )}
              <div />
            </div>
          </div>
        </div>
      )}
      {showScrollButton && (
        <span
          onClick={scrollToTop}
          className={clsx(
            'rounded-full inline-flex justify-center items-center bg-content-primary w-10 h-10 text-white fixed right-4 z-20 2xl:right-[calc((100vw-1200px)/2)] cursor-pointer',
            learningPath ? 'bottom-[72px]' : 'bottom-4',
          )}
        >
          <ScrollIcon />
        </span>
      )}
      {(isModeratorReviewStatus || isRegulatorReviewStatus) && (
        <ControlPanel
          isModeratorReviewStatus={isModeratorReviewStatus}
          articleId={articleId}
          setTextAreaOpen={setTextAreaOpen}
          isTextAreaOpen={isTextAreaOpen}
        />
      )}
      <LoginModal />
      {learningPath && (
        <PathCompletedModal
          isOpen={showPathCompleted}
          onClose={() => setShowPathCompleted(false)}
          path={learningPath}
          totalCount={pathProgress.totalCount}
          totalMinutes={pathProgress.totalMinutes}
        />
      )}
    </div>
  );
};
