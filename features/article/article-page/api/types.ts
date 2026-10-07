import type { CommentVoteStatus } from '@/shared/types/comment';

export type { CommentVoteStatus } from '@/shared/types/comment';

export interface RequestChanges {
  articleId: string;
  comment: string;
}

export interface CommentAuthor {
  nickname: string;
  avatarUrl: string | null;
}

export interface CommentDto {
  id: string;
  userId: string;
  contentId: string;
  parentId: string | null;
  message: string;
  createdAt: string;
  isDeleted: boolean;
  user?: CommentAuthor;
  replies: number;
  alreadyVote?: CommentVoteStatus;
  vote?: number;
}

export interface GetCommentsParams {
  contentId: string;
  page?: number;
  limit?: number;
}

export interface PostCommentRequest {
  contentId: string;
  message: string;
  parentId?: string | null;
}

export interface UpdateCommentRequest {
  commentId: string;
  message: string;
  parentId?: string | null;
}

export interface VoteCommentRequest {
  commentId: string;
  vote: CommentVoteStatus;
  // Score already shown in the UI — seeds the local mock vote count the first
  // time this comment is voted on (see comments-api.ts).
  currentScore?: number;
}

export interface VoteCommentResponse {
  vote: number;
  alreadyVote: CommentVoteStatus;
}

export interface ReportCommentRequest {
  commentId: string;
  tag: string;
}

export interface CommentReportDto {
  id: string;
  commentId: string;
  tags: string[];
  resolve: boolean;
}
