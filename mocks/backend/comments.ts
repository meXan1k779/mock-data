import type {
  CommentDto,
  CommentReportDto,
  CommentVoteStatus,
} from '@/features/article/article-page/api/types';
import type {
  CommentReportStatus,
  ModeratedComment,
  ModeratedCommentReport,
} from '@/features/moderating/api/comment-reports-api';

import { genId } from './db';

// Comments live in localStorage. The backend snapshot had no comments, so
// everything here is created by the user. The shape (added + edited/deleted/
// votes keyed by id) is kept from when this was an overlay on top of real
// backend comments, so state saved by earlier builds keeps working.
const STORAGE_KEY = 'useberry-comments-overlay';

interface CommentStore {
  added: CommentDto[];
  edited: Record<string, string>;
  deleted: string[];
  votes: Record<string, { vote: number; alreadyVote: CommentVoteStatus }>;
  reports: ModeratedCommentReport[];
}

const emptyStore = (): CommentStore => ({
  added: [],
  edited: {},
  deleted: [],
  votes: {},
  reports: [],
});

const readStore = (): CommentStore => {
  if (typeof window === 'undefined') {
    return emptyStore();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...emptyStore(), ...JSON.parse(raw) } : emptyStore();
  } catch {
    return emptyStore();
  }
};

const writeStore = (store: CommentStore) => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

// Applies edits/votes/deletions and recomputes reply counts for one scope.
const selectComments = (belongsToScope: (c: CommentDto) => boolean) => {
  const store = readStore();
  const deleted = new Set(store.deleted);

  const replyCount = (parentId: string) =>
    store.added.filter((c) => c.parentId === parentId && !deleted.has(c.id)).length;

  return store.added
    .filter(belongsToScope)
    .filter((c) => !deleted.has(c.id))
    .map((c) => {
      let next = c;
      if (store.edited[c.id] !== undefined) {
        next = { ...next, message: store.edited[c.id] };
      }
      const voteOverride = store.votes[c.id];
      if (voteOverride) {
        next = { ...next, vote: voteOverride.vote, alreadyVote: voteOverride.alreadyVote };
      }
      if (!next.parentId) {
        next = { ...next, replies: replyCount(next.id) };
      }
      return next;
    });
};

export const getComments = (contentId: string) =>
  selectComments((c) => c.contentId === contentId && !c.parentId);

export const getCommentThread = (commentId: string) =>
  selectComments((c) => c.parentId === commentId);

export const countComments = (contentId: string) =>
  selectComments((c) => c.contentId === contentId).length;

export const addComment = (comment: Omit<CommentDto, 'id'>): CommentDto => {
  const newComment = { ...comment, id: genId() };
  const store = readStore();
  store.added.push(newComment);
  writeStore(store);
  return newComment;
};

export const editComment = (commentId: string, message: string): CommentDto => {
  const store = readStore();
  store.edited[commentId] = message;
  writeStore(store);

  const match = store.added.find((c) => c.id === commentId);
  return match ? { ...match, message } : ({ id: commentId, message } as CommentDto);
};

// Deleting a comment hides its whole reply branch too, like the backend does.
export const deleteComment = (commentId: string) => {
  const store = readStore();
  const toDelete = new Set([commentId]);
  store.added.forEach((c) => {
    if (c.parentId && toDelete.has(c.parentId)) {
      toDelete.add(c.id);
    }
  });
  store.deleted = [...new Set([...store.deleted, ...toDelete])];
  writeStore(store);
};

export const voteComment = (
  commentId: string,
  vote: CommentVoteStatus,
  currentScore?: number,
): { vote: number; alreadyVote: CommentVoteStatus } => {
  const store = readStore();
  const existing = store.votes[commentId];
  const baseline = existing ? existing.vote : (currentScore ?? 0);
  const statusValue = (status: CommentVoteStatus) =>
    status === 'upvote' ? 1 : status === 'downvote' ? -1 : 0;
  const prevStatus = existing?.alreadyVote ?? 'unvote';
  const nextVote = Math.max(0, baseline + statusValue(vote) - statusValue(prevStatus));

  store.votes[commentId] = { vote: nextVote, alreadyVote: vote };
  writeStore(store);
  return { vote: nextVote, alreadyVote: vote };
};

export const reportComment = (commentId: string, tag: string): CommentReportDto => {
  const now = new Date().toISOString();
  const report: ModeratedCommentReport = {
    id: genId(),
    commentId,
    tags: [tag],
    resolve: false,
    createdAt: now,
    updatedAt: now,
  };
  const store = readStore();
  store.reports.push(report);
  writeStore(store);
  return { id: report.id, commentId, tags: report.tags, resolve: false };
};

export const getReportedComments = ({
  status,
  tag,
}: {
  status?: CommentReportStatus;
  tag?: string | null;
}): ModeratedComment[] => {
  const store = readStore();
  const deleted = new Set(store.deleted);

  return store.added
    .map((comment): ModeratedComment | null => {
      const reports = store.reports.filter((r) => r.commentId === comment.id);
      if (reports.length === 0) {
        return null;
      }
      const isPending = reports.some((r) => !r.resolve);
      if (status === 'pending' && !isPending) {
        return null;
      }
      if (status === 'resolved' && isPending) {
        return null;
      }
      if (tag && !reports.some((r) => r.tags.includes(tag))) {
        return null;
      }
      return {
        id: comment.id,
        userId: comment.userId,
        contentId: comment.contentId,
        parentId: comment.parentId,
        message: store.edited[comment.id] ?? comment.message,
        createdAt: comment.createdAt,
        updatedAt: comment.createdAt,
        isDeleted: deleted.has(comment.id),
        user: comment.user ?? { nickname: 'Anonim', avatarUrl: null },
        reports,
        reportCount: reports.length,
      };
    })
    .filter((c): c is ModeratedComment => c !== null);
};

// `hide = true` hides the comment (with its replies), `false` keeps it.
// Either way every open report on it is marked resolved.
export const resolveCommentReports = (commentId: string, hide: boolean) => {
  const store = readStore();
  const now = new Date().toISOString();
  let resolvedReports = 0;
  store.reports = store.reports.map((r) => {
    if (r.commentId !== commentId || r.resolve) {
      return r;
    }
    resolvedReports += 1;
    return { ...r, resolve: true, updatedAt: now };
  });
  if (hide) {
    store.deleted = [...new Set([...store.deleted, commentId])];
  } else {
    store.deleted = store.deleted.filter((id) => id !== commentId);
  }
  writeStore(store);

  if (hide) {
    deleteComment(commentId);
  }
  return { commentId, commentDeleted: hide, resolvedReports };
};
