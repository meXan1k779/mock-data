'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { toggleLoginModal } from '@/features/auth/models/auth-slice';
import { getStoredVote, useVoteMutation } from '@/features/main/api/main-api';
import { useAppDispatch, type RootState } from '@/shared/api/store';
import { useVideoBookmarks } from '@/shared/hooks/useVideoBookmarks';
import { BookmarkFilledIcon, BookmarkIcon } from '@/shared/icons/bookmarkIcon';
import { CommentIcon } from '@/shared/icons/commentIcon';
import { LinkIcon } from '@/shared/icons/linkIcon';
import type { CommentVoteStatus } from '@/shared/types/comment';
import { Avatar } from '@/shared/ui/avatar';
import { LevelBadge } from '@/shared/ui/level-badge';
import { VoteBlock } from '@/shared/ui/vote-block/vote-block';

import type { DiscoverVideoItem } from '../model/constants';

interface VideoCardLargeProps {
  video: DiscoverVideoItem;
  className?: string;
}

export function VideoCardLarge({ video, className }: VideoCardLargeProps) {
  const {
    title,
    authorName,
    authorAvatarUrl,
    thumbnailUrl,
    duration,
    timeAgo,
    complexity,
    topic,
    voteCount,
    commentCount,
  } = video;

  const { isBookmarked, toggleBookmark } = useVideoBookmarks();
  const bookmarked = isBookmarked(video.id);

  // Videos are mock-only content, not the `article` Redux slice that VoteBlock's
  // built-in `id` path updates — voting is driven locally instead, the same way
  // the video detail page manages its own vote state (see video-page/ui/index.tsx).
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [sendVote] = useVoteMutation();
  const [voteState, setVoteState] = useState(() => {
    const stored = getStoredVote(video.id);
    return stored
      ? { vote: String(stored.count), alreadyVote: stored.status }
      : { vote: String(voteCount), alreadyVote: undefined as CommentVoteStatus | undefined };
  });

  const handleVideoVote = async (nextStatus: CommentVoteStatus) => {
    if (!isAuthenticated) {
      dispatch(toggleLoginModal(true));
      return;
    }
    try {
      const response = await sendVote({
        articleId: video.id,
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

  return (
    <Link href={`/video/${video.id}`} className={clsx('group flex flex-col gap-3', className)}>
      <div className="relative aspect-video w-full overflow-hidden rounded">
        <img src={thumbnailUrl} alt="" className="absolute inset-0 size-full object-cover" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex size-[52px] items-center justify-center rounded-full bg-[rgba(17,25,40,0.48)]">
            <img src="/trading-videos/play-fill.svg" alt="" className="size-6" />
          </div>
        </div>

        <div className="absolute right-3 bottom-3 rounded bg-[rgba(17,25,40,0.48)] px-[6px] pb-[2px] text-xs leading-4 font-medium text-white">
          {duration}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex flex-wrap items-center gap-1">
            <div className="flex items-center gap-2">
              <Avatar size="sm" nickname={authorName} avatarUrl={authorAvatarUrl} />
              <span className="text-sm text-content-primary">{authorName}</span>
            </div>
            <span className="flex items-center gap-1 text-sm text-content-secondary">
              <span>•</span>
              <span>{timeAgo}</span>
            </span>
          </div>

          <p className="text-[20px] leading-7 font-semibold text-content-primary transition-colors group-hover:text-content-secondary">
            {title}
          </p>

          <div className="flex flex-wrap items-center gap-1 py-2">
            <LevelBadge level={complexity} />
            <span className="flex h-6 items-center rounded-md bg-background-secondary px-2 text-xs text-content-primary">
              {topic}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
          <VoteBlock vote={voteState.vote} alreadyVote={voteState.alreadyVote} onVote={handleVideoVote} />
          <div className="flex items-center gap-2">
            <span className="flex h-8 items-center gap-1 rounded-3xl bg-background-secondary px-2 text-sm text-content-secondary">
              <CommentIcon />
              {commentCount}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(video.id);
              }}
              className="flex size-8 items-center justify-center rounded-full bg-background-secondary text-content-secondary"
            >
              {bookmarked ? (
                <BookmarkFilledIcon className="text-content-primary" />
              ) : (
                <BookmarkIcon />
              )}
            </button>
            <span className="flex size-8 items-center justify-center rounded-3xl bg-background-secondary text-content-secondary">
              <LinkIcon />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
