import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useMemo, useRef } from 'react';

import { DotsIcons } from '@/shared/icons/dotsIcon';
import type { CommentVoteStatus } from '@/shared/types/comment';
import { Avatar } from '@/shared/ui/avatar';
import { Popup } from '@/shared/ui/popup/ui';
import { VoteBlock } from '@/shared/ui/vote-block/vote-block';

import { useGetCommentThreadQuery } from '../../api/comments-api';

import { EditBox } from './edit-box';
import { MenuItems } from './menu-items';
import { ReplyForm } from './reply-form';
import type { Comment, Reply } from './types';
import { mapCommentDto } from './utils';
import type { VoteState } from './utils';

interface CommentItemProps {
  comment: Comment | Reply;
  isReply?: boolean;
  parentId?: string;
  meId: string;
  editId: string | null;
  editReplyState: { id: string; parentId: string } | null;
  replyToId: string | null;
  menuId: string | null;
  expandedIds: Set<string>;
  votes: Record<string, VoteState>;
  onEdit: (id: string) => void;
  onSaveEdit: (id: string, text: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string, parentId?: string) => void;
  onReport: (id: string) => void;
  onVote: (id: string, nextVote: CommentVoteStatus, currentScore: number) => void;
  onToggleReplies: (id: string) => void;
  onReply: (id: string) => void;
  onSubmitReply: (parentId: string, text: string) => void;
  onCancelReply: () => void;
  onMenuToggle: (id: string) => void;
  onEditReply: (id: string, parentId: string) => void;
  onSaveEditReply: (id: string, parentId: string, text: string) => void;
  onCancelEditReply: () => void;
  onDeleteReply: (id: string, parentId: string) => void;
}

export function CommentItem({
  comment,
  isReply = false,
  parentId,
  meId,
  editId,
  editReplyState,
  replyToId,
  menuId,
  expandedIds,
  votes,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onReport,
  onVote,
  onToggleReplies,
  onReply,
  onSubmitReply,
  onCancelReply,
  onMenuToggle,
  onEditReply,
  onSaveEditReply,
  onCancelEditReply,
  onDeleteReply,
}: CommentItemProps) {
  const isComment = !isReply;
  const c = comment as Comment;
  const isOwn = !!meId && comment.authorId === meId;
  const isEditing = editId === comment.id;
  const isEditingReply = editReplyState?.id === comment.id && editReplyState?.parentId === parentId;
  const showMenu = menuId === comment.id;
  const isReplying = replyToId === comment.id;
  const showReplies = c.expanded || isReplying;
  const replyCount = c.replyCount;

  const { data: threadData } = useGetCommentThreadQuery(comment.id, { skip: !showReplies });
  const replies = useMemo(
    () =>
      (Array.isArray(threadData) ? threadData : []).map((dto) =>
        mapCommentDto(dto, expandedIds, votes),
      ),
    [threadData, expandedIds, votes],
  );

  const actualEditing = isComment ? isEditing : isEditingReply;
  const menuAnchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Avatar nickname={comment.nickname} avatarUrl={comment.avatarUrl} size="sm" />
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-normal text-content-secondary">
              {comment.nickname}
              {isOwn && <span className="ml-1">(Anda)</span>}
            </span>
            <span className="text-sm text-content-tetriary">
              • {formatDistanceToNow(comment.ts, { addSuffix: true, locale: localeId })}
            </span>
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <button
            ref={menuAnchorRef}
            onClick={() => onMenuToggle(comment.id)}
            className="w-7 h-7 flex items-center justify-center rounded-fullgj
             hover:bg-background-secondary transition-colors cursor-pointer"
          >
            <DotsIcons />
          </button>
          <Popup
            anchorRef={menuAnchorRef}
            isOpen={showMenu}
            onClose={() => onMenuToggle(comment.id)}
          >
            <MenuItems
              isOwn={isOwn}
              onEdit={() => {
                if (isComment) {
                  onEdit(comment.id);
                } else {
                  onEditReply(comment.id, parentId!);
                }
              }}
              onDelete={() => {
                if (isComment) {
                  onDelete(comment.id);
                } else {
                  onDeleteReply(comment.id, parentId!);
                }
              }}
              onReport={() => onReport(comment.id)}
            />
          </Popup>
        </div>
      </div>

      {/* Body */}
      {actualEditing ? (
        <EditBox
          initialText={comment.text}
          onSave={(text) => {
            if (isComment) {
              onSaveEdit(comment.id, text);
            } else {
              onSaveEditReply(comment.id, parentId!, text);
            }
          }}
          onCancel={isComment ? onCancelEdit : onCancelEditReply}
        />
      ) : (
        <p className="text-base text-content-primary leading-relaxed mb-3 break-words">
          {comment.text}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <VoteBlock
          vote={String(comment.score)}
          alreadyVote={comment.vote ?? undefined}
          onVote={(nextVote) => onVote(comment.id, nextVote, comment.score)}
        />
        {replyCount > 0 && (
          <button
            onClick={() => onToggleReplies(comment.id)}
            className="text-xs font-medium text-content-primary px-3 py-2 rounded-md hover:bg-background-secondary transition-colors cursor-pointer"
          >
            {c.expanded ? 'Sembunyikan balasan' : `${replyCount} balasan`}
          </button>
        )}
        <button
          onClick={() => onReply(comment.id)}
          className="text-xs font-medium text-content-primary px-3 py-2 rounded-md hover:bg-background-secondary transition-colors cursor-pointer"
        >
          Balas
        </button>
      </div>

      {/* Replies — рекурсивный рендер для любой глубины */}
      {showReplies && (
        <div className="relative mt-4 pl-9 sm:pl-10">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border-tetriary" />
          {isReplying && (
            <ReplyForm
              onSubmit={(text) => onSubmitReply(comment.id, text)}
              onCancel={onCancelReply}
            />
          )}
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="py-3 border-b border-background-secondary last:border-b-0 last:pb-0"
            >
              <CommentItem
                comment={reply}
                isReply
                parentId={comment.id}
                meId={meId}
                editId={editId}
                editReplyState={editReplyState}
                replyToId={replyToId}
                menuId={menuId}
                expandedIds={expandedIds}
                votes={votes}
                onEdit={onEdit}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                onDelete={onDelete}
                onReport={onReport}
                onVote={onVote}
                onToggleReplies={onToggleReplies}
                onReply={onReply}
                onSubmitReply={onSubmitReply}
                onCancelReply={onCancelReply}
                onMenuToggle={onMenuToggle}
                onEditReply={onEditReply}
                onSaveEditReply={onSaveEditReply}
                onCancelEditReply={onCancelEditReply}
                onDeleteReply={onDeleteReply}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
