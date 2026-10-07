'use client';

import clsx from 'clsx';
import { useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { toggleLoginModal } from '@/features/auth/models/auth-slice';
import type { RootState } from '@/shared/api/store';
import { useAppDispatch } from '@/shared/api/store';
import type { CommentVoteStatus } from '@/shared/types/comment';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/ui/toast';

import type { CommentDto } from '../../api/types';
import {
  useDeleteCommentMutation,
  useGetCommentsQuery,
  usePostCommentMutation,
  useReportCommentMutation,
  useUpdateCommentMutation,
  useVoteCommentMutation,
} from '../../api/comments-api';

import { CommentItem } from './comment-item';
import { ReportModal } from './report-modal';
import type { Comment } from './types';
import { countComments, mapCommentDto } from './utils';
import type { VoteState } from './utils';

interface CommentsSectionProps {
  contentId: string;
  /**
   * Added on top of the real fetched count. Needed for mock content (e.g.
   * trading videos) whose id doesn't exist on the backend, so the real fetch
   * always comes back empty — without this the heading would always read
   * "0 komentar" regardless of the count shown on the card that linked here.
   */
  seedCount?: number;
  /**
   * Rendered alongside the real (empty, for mock content) fetched comments,
   * oldest-looking first after sorting — so the section isn't just an empty
   * list under a nonzero "X komentar" heading. Doesn't affect totalCount,
   * which stays driven by seedCount so it keeps matching the Discover card.
   */
  seedComments?: CommentDto[];
}

export const CommentsSection = ({
  contentId,
  seedCount = 0,
  seedComments = [],
}: CommentsSectionProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isAuthLoading = useSelector((state: RootState) => state.auth.isLoading);
  const dispatch = useAppDispatch();

  const meId = user?.id ?? '';

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      dispatch(toggleLoginModal(true));
      return;
    }
    action();
  };

  // Дожидаемся initializeAuth, иначе запрос может уйти без accessToken и
  // навсегда закэшировать alreadyVote как "не голосовал" для всех комментариев.
  const { data: commentsData } = useGetCommentsQuery(
    { contentId, page: 0, limit: 50 },
    { skip: !contentId || isAuthLoading },
  );
  const [postComment] = usePostCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [voteComment] = useVoteCommentMutation();
  const [reportComment] = useReportCommentMutation();

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [votes, setVotes] = useState<Record<string, VoteState>>({});
  const [newText, setNewText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editReplyState, setEditReplyState] = useState<{ id: string; parentId: string } | null>(
    null,
  );
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const { showToast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const commentsList = Array.isArray(commentsData) ? commentsData : [];
  const displayedDtos = useMemo(
    () =>
      [...seedComments, ...commentsList].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [seedComments, commentsList],
  );
  const comments = useMemo<Comment[]>(
    () => displayedDtos.map((dto) => mapCommentDto(dto, expandedIds, votes)),
    [displayedDtos, expandedIds, votes],
  );
  const totalCount = countComments(commentsList) + seedCount;

  // Scroll to comments (when URL has #comments hash) is handled in ArticlePage,
  // once the article body and its images finish loading, since scrolling here
  // on mount happens before that content pushes this section further down the page.

  const handleSubmitComment = async () => {
    if (!newText.trim()) {
      return;
    }
    try {
      await postComment({ contentId, message: newText.trim(), parentId: null }).unwrap();
      setNewText('');
      setInputFocused(false);
    } catch (err) {
      console.error('failed to post comment', err);
    }
  };

  const handleEdit = (id: string) => {
    setEditId(id);
    setMenuId(null);
  };

  const handleSaveEdit = async (id: string, text: string) => {
    try {
      await updateComment({ commentId: id, message: text, parentId: null }).unwrap();
      setEditId(null);
    } catch (err) {
      console.error('failed to update comment', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteComment(id).unwrap();
      setMenuId(null);
    } catch (err) {
      console.error('failed to delete comment', err);
    }
  };

  const handleEditReply = (id: string, parentId: string) => {
    setEditReplyState({ id, parentId });
    setMenuId(null);
  };

  const handleSaveEditReply = async (id: string, parentId: string, text: string) => {
    try {
      await updateComment({ commentId: id, message: text, parentId }).unwrap();
      setEditReplyState(null);
    } catch (err) {
      console.error('failed to update comment', err);
    }
  };

  const handleDeleteReply = async (id: string, _parentId: string) => {
    try {
      await deleteComment(id).unwrap();
      setMenuId(null);
    } catch (err) {
      console.error('failed to delete comment', err);
    }
  };

  const handleReport = (id: string) => {
    requireAuth(() => {
      setReportTarget(id);
      setMenuId(null);
    });
  };

  const handleSubmitReport = async (reason: string) => {
    const commentId = reportTarget;
    setReportTarget(null);
    if (!commentId) {
      return;
    }
    try {
      await reportComment({ commentId, tag: reason }).unwrap();
      showToast('reported');
    } catch (err) {
      console.error('failed to report comment', err);
    }
  };

  // Авторизацию проверяет сам VoteBlock перед вызовом onVote.
  const handleVote = async (id: string, nextVote: CommentVoteStatus, currentScore: number) => {
    try {
      const result = await voteComment({ commentId: id, vote: nextVote, currentScore }).unwrap();
      setVotes((prev) => ({
        ...prev,
        [id]: {
          score: result.vote,
          vote: result.alreadyVote === 'unvote' ? null : result.alreadyVote,
        },
      }));
    } catch (err) {
      console.error('failed to vote comment', err);
    }
  };

  const handleToggleReplies = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleReply = (id: string) => {
    requireAuth(() => {
      setExpandedIds((prev) => new Set(prev).add(id));
      setReplyToId(id);
      setMenuId(null);
    });
  };

  const handleSubmitReply = async (parentId: string, text: string) => {
    try {
      await postComment({ contentId, message: text, parentId }).unwrap();
      setExpandedIds((prev) => new Set(prev).add(parentId));
      setReplyToId(null);
    } catch (err) {
      console.error('failed to post reply', err);
    }
  };

  const sharedProps = {
    editId,
    editReplyState,
    replyToId,
    menuId,
    expandedIds,
    votes,
    onEdit: handleEdit,
    onSaveEdit: handleSaveEdit,
    onCancelEdit: () => setEditId(null),
    onDelete: handleDelete,
    onReport: handleReport,
    onVote: handleVote,
    onToggleReplies: handleToggleReplies,
    onReply: handleReply,
    onSubmitReply: handleSubmitReply,
    onCancelReply: () => setReplyToId(null),
    onMenuToggle: (id: string) => setMenuId((prev) => (prev === id ? null : id)),
    onEditReply: handleEditReply,
    onSaveEditReply: handleSaveEditReply,
    onCancelEditReply: () => setEditReplyState(null),
    onDeleteReply: handleDeleteReply,
  };

  // ── Render ─────────────────────────────────────────────────────

  return (
    <section id="comments" className="pt-8 mt-2">
      {/* Heading */}
      <h2 className="text-[20px] leading-[28px] md:text-[24px] md:leading-[32px] lg:text-[28px] lg:leading-[36px] font-manrope font-semibold text-content-primary mb-5 lg:mb-6">
        {totalCount} komentar
      </h2>
      {/* Write comment */}
      <div className="mb-6">
        <textarea
          ref={textareaRef}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onFocus={() => requireAuth(() => setInputFocused(true))}
          placeholder="Bagikan pendapat Anda di sini..."
          rows={inputFocused || newText ? 3 : 1}
          readOnly={!isAuthenticated}
          className={clsx(
            'w-full px-4 py-3 border rounded-xl text-sm text-content-primary font-noto resize-none outline-none transition-all',
            inputFocused || newText ? 'border-base-link' : 'border-border-tetriary',
            !isAuthenticated && 'cursor-pointer',
          )}
        />
        {(inputFocused || newText) && (
          <div className="flex gap-2 mt-2">
            <Button
              variant="primary"
              size="md"
              disabled={!newText.trim()}
              onClick={handleSubmitComment}
            >
              Kirim
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setNewText('');
                setInputFocused(false);
                textareaRef.current?.blur();
              }}
            >
              Batal
            </Button>
          </div>
        )}
      </div>
      <div>
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="py-5 first:pt-0 border-b border-border-tetriary last:border-b-0"
          >
            <CommentItem comment={comment} meId={meId} {...sharedProps} />
          </div>
        ))}
      </div>
      {reportTarget && (
        <ReportModal onClose={() => setReportTarget(null)} onSubmit={handleSubmitReport} />
      )}
    </section>
  );
};
