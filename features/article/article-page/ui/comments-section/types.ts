export interface Reply {
  id: string;
  authorId: string;
  nickname: string;
  avatarUrl?: string;
  ts: Date;
  text: string;
  score: number;
  vote: 'upvote' | 'downvote' | null;
  replies: Reply[];
  replyCount: number;
  expanded: boolean;
}

export interface Comment extends Reply {
  replies: Reply[];
  expanded: boolean;
}
