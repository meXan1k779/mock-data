'use client';

import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { BappebtiBadge } from '@/features/article/article-page/ui/bappebti-badge';
import { CommentsSection } from '@/features/article/article-page/ui/comments-section';
import { toggleLoginModal } from '@/features/auth/models/auth-slice';
import { LoginModal } from '@/features/auth/ui/login-modal';
import { getStoredVote, useVoteMutation } from '@/features/main/api/main-api';
import { useAppDispatch, type RootState } from '@/shared/api/store';
import { useVideoBookmarks } from '@/shared/hooks/useVideoBookmarks';
import { ScrollIcon } from '@/shared/icons/scrollIcon';
import type { CommentVoteStatus } from '@/shared/types/comment';
import { ArticleActions } from '@/shared/ui/article-actions';
import { Avatar } from '@/shared/ui/avatar';
import { LevelBadge } from '@/shared/ui/level-badge';
import { VoteBlock } from '@/shared/ui/vote-block/vote-block';

import { videoContentById } from '../model/constants';
import { getSeedComments } from '../model/mock-comments';

import { VideoPlaceholder } from './video-placeholder';

const SCROLL_THRESHOLD = 300;

export const VideoPage = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const params = useParams();
  const videoId = params?.id as string;
  const data = videoContentById[videoId];

  const { isBookmarked, toggleBookmark } = useVideoBookmarks();

  // Videos are mock-only content (see features/trading-videos) rendered from
  // a plain object, not the `article` Redux slice that VoteBlock's built-in
  // `id` path updates — so that path never re-renders here. Voting is driven
  // locally instead, the same way CommentsSection already manages its own
  // vote state for comments.
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [sendVote] = useVoteMutation();
  const [voteState, setVoteState] = useState(() => {
    const stored = getStoredVote(videoId);
    return stored
      ? { vote: String(stored.count), alreadyVote: stored.status }
      : { vote: data?.vote, alreadyVote: data?.alreadyVote };
  });

  const handleVideoVote = async (nextStatus: CommentVoteStatus) => {
    if (!isAuthenticated) {
      dispatch(toggleLoginModal(true));
      return;
    }
    try {
      const response = await sendVote({
        articleId: videoId,
        vote: nextStatus,
        currentVote: voteState.vote,
      }).unwrap();
      setVoteState({
        vote: response.vote,
        alreadyVote: nextStatus === 'unvote' ? undefined : nextStatus,
      });
    } catch (err) {
      console.error('failed to vote', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data) {
    notFound();
  }

  const time =
    data.createdAt &&
    formatDistanceToNow(data.createdAt, {
      addSuffix: true,
      locale: localeId,
    });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="relative mb-10">
      <div className="text-xs leading-4 flex p-3 items-center justify-center bg-background-secondary w-screen left-1/2 -translate-x-1/2 relative">
        Transaksi Derivatif adalah Transaksi High Risk High Return
      </div>

      <div className="pt-6 mx-4 sm:mx-8 md:m-auto max-w-[700px]">
        {data.approveId && (
          <BappebtiBadge
            aprovalNumber={data.approveId}
            label="Video telah disetujui oleh BAPPEBTI"
          />
        )}

        <VideoPlaceholder />

        <div className="flex items-center flex-wrap mt-4 mb-2 lg:mb-3 gap-1">
          <LevelBadge level={data.complexity} />
          {data.topics.map((topic) => (
            <div
              key={topic}
              className="text-xs text-base-tech px-2 py-1 rounded-md inline-block bg-background-secondary"
            >
              {topic}
            </div>
          ))}
        </div>

        <div className="text-[24px] leading-[32px] md:text-[28px] md:leading-[36px] lg:text-[32px] lg:leading-[40px] font-manrope font-semibold w-full outline-none mb-2 lg:mb-3">
          {data.title}
        </div>

        <div className="flex justify-between flex-wrap items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Avatar
              nickname={data.Creator?.nickname}
              avatarUrl={data.Creator?.avatarUrl}
              size="lg"
            />
            <div className="flex flex-col gap-0.5">
              <div className="text-sm text-content-primary">{data.Creator?.nickname}</div>
              <div className="flex items-center gap-1 text-sm text-content-secondary">
                {time && <span>{time}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <VoteBlock
              vote={voteState.vote}
              alreadyVote={voteState.alreadyVote}
              onVote={handleVideoVote}
            />
            <ArticleActions
              article={data}
              hrefBase="/video"
              bookmarkOverride={{
                isBookmarked: isBookmarked(data.id),
                onToggle: () => toggleBookmark(data.id),
              }}
            />
          </div>
        </div>

        <CommentsSection
          contentId={data.id}
          seedCount={data.commentCount}
          seedComments={getSeedComments(data.id)}
        />
      </div>

      {showScrollButton && (
        <div className="fixed inset-x-0 bottom-4 z-20">
          <div className="mx-4 sm:mx-8 md:m-auto max-w-[700px]">
            <div className="lg:max-w-[700px] grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="flex items-center gap-1 sm:gap-2 justify-self-start">
                <ArticleActions
                  article={data}
                  hrefBase="/video"
                  isDarkMode
                  bookmarkOverride={{
                    isBookmarked: isBookmarked(data.id),
                    onToggle: () => toggleBookmark(data.id),
                  }}
                />
              </div>
              <VoteBlock
                vote={voteState.vote}
                alreadyVote={voteState.alreadyVote}
                isDarkMode
                onVote={handleVideoVote}
                className="h-10 justify-self-center"
              />
              <div />
            </div>
          </div>
        </div>
      )}
      {showScrollButton && (
        <span
          onClick={scrollToTop}
          className={clsx(
            'rounded-full inline-flex justify-center items-center bg-content-primary w-10 h-10 text-white fixed right-4 bottom-4 z-20 2xl:right-[calc((100vw-1200px)/2)] cursor-pointer',
          )}
        >
          <ScrollIcon />
        </span>
      )}

      <LoginModal />
    </div>
  );
};
