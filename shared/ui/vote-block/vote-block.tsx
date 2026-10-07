import clsx from 'clsx';
import type { MouseEvent } from 'react';
import { useSelector } from 'react-redux';

import { setArticleVote } from '@/features/article/article-page/models/current-article-slice';
import { setVote } from '@/features/article/new-article/models/article-slice';
import { toggleLoginModal } from '@/features/auth/models/auth-slice';
import { useVoteMutation } from '@/features/main/api/main-api';
import type { RootState } from '@/shared/api/store';
import { useAppDispatch } from '@/shared/api/store';
import { UpVoteIcon } from '@/shared/icons/upVoteIcon';
import type { CommentVoteStatus } from '@/shared/types/comment';

import { IconWrapper } from './icon-wrapper';

interface Props {
  id?: string;
  className?: string;
  isDarkMode?: boolean;
  vote: string;
  alreadyVote?: string;
  // Позволяет использовать VoteBlock для сущностей, отличных от статьи
  // (например, комментариев) — вызов API и обновление стейта делает вызывающий код.
  onVote?: (newVoteStatus: CommentVoteStatus) => void;
}

export const VoteBlock = ({ id, className, isDarkMode, vote, alreadyVote, onVote }: Props) => {
  const isUpVote = alreadyVote === 'upvote';
  const isDownVote = alreadyVote === 'downvote';

  const bgColor = isDarkMode ? 'bg-content-primary' : 'bg-background-secondary';
  const positiveBgColor = isDarkMode ? 'bg-content-primary' : 'bg-green';
  const negativeBgColor = isDarkMode ? 'bg-content-primary' : 'bg-[#FFECEC]';

  const strokeRight = isDarkMode ? 'stroke-background-secondary' : 'stroke-green-40';
  const strokeLeft = isDarkMode ? 'stroke-background-secondary' : 'stroke-red-40';
  const dispatch = useAppDispatch();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [sendVote] = useVoteMutation();

  const handleVote = async (e: MouseEvent<HTMLElement>, voteType: 'upvote' | 'downvote') => {
    e.preventDefault();
    if (!isAuthenticated) {
      dispatch(toggleLoginModal(true));
      return;
    }

    const newVoteStatus = voteType === alreadyVote ? 'unvote' : voteType;

    if (onVote) {
      onVote(newVoteStatus);
      return;
    }

    if (!id) {
      return;
    }

    try {
      const response = await sendVote({ articleId: id, vote: newVoteStatus, currentVote: vote });

      if (response?.data) {
        dispatch(setVote({ id, vote: response?.data?.vote, alreadyVote: newVoteStatus }));
        dispatch(setArticleVote({ vote: response?.data?.vote, alreadyVote: newVoteStatus }));
      }
    } catch (e) {
      console.error('fail vote', e);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      dispatch(toggleLoginModal(true));
    }
  };

  return (
    <div
      className={clsx(
        className,
        'flex items-center rounded-3xl  w-fit py-1.5 relative',
        !isUpVote && !isDownVote && bgColor,
        isUpVote && positiveBgColor,
        isDownVote && negativeBgColor,
      )}
      onClick={handleClick}
    >
      <IconWrapper
        isDownVote={isDownVote}
        isDarkMode={isDarkMode}
        isUpVote={isUpVote}
        direction="left-0"
        onClick={(e: MouseEvent<HTMLElement>) => handleVote(e, 'upvote')}
      >
        <UpVoteIcon
          className={clsx(
            !isUpVote &&
              !isDownVote &&
              `${isDarkMode ? 'stroke-background-secondary' : 'stroke-content-secondary'} group-hover/vote:stroke-green-40`,
            isUpVote && 'stroke-green-40',
            isDownVote && strokeLeft,
          )}
          color={isUpVote ? '#14B215' : 'transparent'}
        />
      </IconWrapper>
      <span
        className={clsx(
          'mx-9 text-sm ',
          !isUpVote && !isDownVote && isDarkMode
            ? 'text-background-secondary'
            : 'text-content-secondary',
          isUpVote && 'text-green-40',
          isDownVote && 'text-red-40',
        )}
      >
        {vote || 0}
      </span>
      <IconWrapper
        isDarkMode={isDarkMode}
        isDownVote={isDownVote}
        isUpVote={isUpVote}
        direction="right-0"
        onClick={(e) => handleVote(e, 'downvote')}
      >
        <UpVoteIcon
          className={clsx(
            'rotate-180',
            !isUpVote &&
              !isDownVote &&
              ` ${isDarkMode ? 'stroke-background-secondary' : 'stroke-content-secondary'} group-hover/vote:stroke-red-40`,
            isUpVote && strokeRight,
            isDownVote && 'stroke-red-40',
          )}
          color={isDownVote ? '#EA3939' : 'transparent'}
        />
      </IconWrapper>
    </div>
  );
};
