import type { CommentDto, CommentVoteStatus } from '../../api/types';

import type { Reply } from './types';

export interface VoteState {
  score: number;
  vote: 'upvote' | 'downvote' | null;
}

function toUiVote(vote: CommentVoteStatus | undefined): 'upvote' | 'downvote' | null {
  return vote === 'upvote' || vote === 'downvote' ? vote : null;
}

export function mapCommentDto(
  dto: CommentDto,
  expandedIds: Set<string>,
  votes: Record<string, VoteState>,
): Reply {
  const voteState = votes[dto.id];
  return {
    id: dto.id,
    authorId: dto.userId,
    nickname: dto.user?.nickname ?? '',
    avatarUrl: dto.user?.avatarUrl ?? undefined,
    ts: new Date(dto.createdAt),
    text: dto.message,
    score: voteState?.score ?? dto.vote ?? 0,
    vote: voteState?.vote ?? toUiVote(dto.alreadyVote),
    expanded: expandedIds.has(dto.id),
    replyCount: dto.replies,
    replies: [],
  };
}

export function countComments(dtos: CommentDto[]): number {
  return dtos.reduce((sum, dto) => sum + 1 + dto.replies, 0);
}
