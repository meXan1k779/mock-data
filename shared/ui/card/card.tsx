'use client';

import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import DOMPurify from 'isomorphic-dompurify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { useDeleteContentByIdMutation } from '@/features/article/new-article/api/article-api';
import type { ContentResponse } from '@/features/article/new-article/api/types';
import { DeleteArticleModal } from '@/features/profile/ui/delete-article-modal';
import type { RootState } from '@/shared/api/store';
import { MOCK_COMMENTS_COUNT } from '@/shared/constants/mock-comments-count';
import { CommentIcon } from '@/shared/icons/commentIcon';
import { DotsIcons } from '@/shared/icons/dotsIcon';
import { ArticleStatus } from '@/shared/types/types';
import { getReadingTime } from '@/shared/utils/getReadingTime';

import { ArticleActions } from '../article-actions';
import { Avatar } from '../avatar';
import { ConfirmEditModal } from '../confirm-edit-modal';
import { LevelBadge } from '../level-badge';
import { Popup } from '../popup/ui';
import { VoteBlock } from '../vote-block/vote-block';

interface CardProps {
  className?: string;
  level?: number;
  selected?: 'upvote' | 'downvote';
  isEditable?: boolean;
  showReadingTime?: boolean;
  isPriority?: boolean;
  name?: string;
  title?: string;
  description: string;
  previewUrl?: string;
  complexity: number;
  status?: ArticleStatus;
  approveId?: string;
  createdAt?: string;
  id?: string;
  creatorId?: string;
  errorComment?: string | null;
  topics: string[];
  firstName?: string;
  alreadyVote?: string;
  vote?: string;
  lastName?: string;
  commentCount?: number;
  AttachedFile?: { fileId: string; link: string; id: string }[];
  Creator?: {
    createdAt?: string;
    avatarUrl?: string;
    email?: string;
    iconUrl?: string;
    id?: string;
    isDeleted?: boolean;
    isVerified?: boolean;
    nickname?: string;
    role?: string;
  };
}

export function removeImgTags(html: string) {
  if (!html) {
    return '';
  }
  return html.replace(/<img[^>]*>/gi, '');
}

export const Card = ({
  title,
  description,
  className,
  topics,
  complexity,
  id,
  isEditable,
  showReadingTime,
  isPriority,
  vote,
  previewUrl,
  alreadyVote,
  createdAt,
  status,
  Creator,
  name,
  creatorId,
  errorComment,
  firstName,
  lastName,
  approveId,
  AttachedFile,
  commentCount,
}: CardProps) => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const time =
    createdAt &&
    formatDistanceToNow(createdAt, {
      addSuffix: true,
      locale: localeId, // id - локаль индонезия
    });

  const [deleteArticle, { isLoading }] = useDeleteContentByIdMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  let articleForActions: ContentResponse | null = null;
  if (id) {
    articleForActions = {
      id,
      title: title ?? '',
      description,
      complexity,
      status: status!,
      creatorId: creatorId ?? Creator?.id ?? '',
      topics,
      vote: vote ?? '',
      Creator: Creator as ContentResponse['Creator'],
      name,
      previewUrl,
      approveId,
      createdAt,
      firstName,
      alreadyVote,
      lastName,
      AttachedFile,
      errorComment,
    };
  }

  const handleCloseDeleteModal = () => {
    setIsModalOpen(false);
  };
  const isDraft = status === ArticleStatus.DRAFT;
  const handleOpenDeleteModal = () => {
    setIsOpen(false);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteArticle(id!);
      handleCloseDeleteModal();
    } catch (e) {
      console.error('failed to delete article', e);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpenContextMenu = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const handleEdit = () => {
    setIsOpen(false);
    setIsConfirmModalOpen(true);
  };

  return (
    <>
      <Link href={`/article/${id}`} className="group">
        <div className={clsx(className, 'bg-background-primary py-6')}>
          {/* Mobile (<sm): avatar + name/time stacked */}
          <div className="flex sm:hidden items-center gap-2 mb-3">
            <Avatar
              size="lg"
              // Own-content list ("Dipublikasikan") doesn't include Creator from the
              // backend since the author is always the current user — fall back there.
              // Other lists (bookmarks, home feed) show other people's articles, so a
              // missing Creator must not leak the current user's avatar onto them.
              nickname={Creator?.nickname || (isEditable ? user?.nickname : undefined)}
              avatarUrl={Creator?.avatarUrl || (isEditable ? user?.avatarUrl : undefined)}
            />
            <div className="flex flex-col gap-0.5">
              <div className="text-sm text-content-primary">{Creator?.nickname}</div>
              <div className="flex items-center gap-1 text-sm text-content-secondary">
                <span>{time}</span>
                {showReadingTime && (
                  <>
                    <span>•</span>
                    <span>{getReadingTime(description)} menit membaca</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tablet/Desktop (sm+): avatar + name + time in one flowing row */}
          <div className="hidden sm:flex flex-wrap items-center gap-1 mb-3">
            <div className="flex items-center gap-2">
              <Avatar
                size="sm"
                nickname={Creator?.nickname || (isEditable ? user?.nickname : undefined)}
                avatarUrl={Creator?.avatarUrl || (isEditable ? user?.avatarUrl : undefined)}
              />
              <span className="text-sm text-content-primary">{Creator?.nickname}</span>
            </div>
            <span className="flex items-center gap-1 text-sm text-content-secondary">
              <span>•</span>
              <span>{time}</span>
            </span>
            {showReadingTime && (
              <span className="flex items-center gap-1 text-sm text-content-secondary">
                <span>•</span>
                <span>{getReadingTime(description)} menit membaca</span>
              </span>
            )}
          </div>
          <div className="sm:flex mb-4 sm:mb-0">
            <div className="w-full sm:w-[75%] mr-[52px]">
              <div className="font-manrope font-bold text-[18px] leading-6 sm:text-[20px] sm:leading-7 2md:font-noto 2md:font-semibold 2md:text-[24px] 2md:leading-[32px] mb-1 sm:mb-2 text-content-primary transition-colors group-hover:text-content-secondary">
                {title}
              </div>
              <div
                className="text-base leading-6 text-content-primary transition-colors group-hover:text-content-secondary mb-4 sm:mb-0 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: removeImgTags(DOMPurify.sanitize(description)),
                }}
              ></div>
              <div className="flex items-center flex-wrap mb-5 sm:mb-6 mt-3 gap-1">
                <LevelBadge level={complexity} />
                {topics?.map((topic) => (
                  <div
                    key={topic}
                    className="text-xs text-base-tech px-2 py-1 rounded-sm inline-block bg-background-secondary"
                  >
                    {topic}
                  </div>
                ))}
              </div>
            </div>
            {previewUrl ? (
              <img
                className="w-full sm:w-[177px] sm:h-[133px] sm:ml-3 h-full mt-[13px] object-cover"
                src={previewUrl}
                alt="preview"
                fetchPriority={isPriority ? 'high' : undefined}
                loading={isPriority ? 'eager' : 'lazy'}
              />
            ) : (
              <div className="w-[408px] !sm:w-[177px] !sm:h-[133px] sm:ml-10 h-full mt-[13px]" />
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isDraft && id && vote && <VoteBlock vote={vote} alreadyVote={alreadyVote} id={id} />}
            <div className="ml-auto flex items-center gap-2">
              {id && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/article/${id}#comments`);
                  }}
                  className="inline-flex items-center justify-center gap-1 h-8 px-2 bg-background-secondary rounded-3xl text-content-secondary hover:bg-border-tetriary transition-colors"
                >
                  <CommentIcon className="shrink-0" />
                  <span className="text-sm leading-none">
                    {commentCount ?? MOCK_COMMENTS_COUNT}
                  </span>
                </button>
              )}
              {!isDraft && articleForActions && <ArticleActions article={articleForActions} />}
              {isEditable && (
                <span
                  onClick={handleOpenContextMenu}
                  ref={buttonRef}
                  className="h-8 w-8 rounded-full bg-background-secondary flex items-center justify-center"
                >
                  <DotsIcons />
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <Popup anchorRef={buttonRef} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col">
          <div
            className="text-content-secondary p-3 text-[14px] cursor-pointer"
            onClick={handleEdit}
          >
            Batalkan publikasi dan edit
          </div>
          <div
            className="text-base-negative p-3 text-[14px] cursor-pointer"
            onClick={handleOpenDeleteModal}
          >
            Hapus
          </div>
        </div>
      </Popup>
      {id && (
        <>
          <DeleteArticleModal
            isLoading={isLoading}
            closeModal={handleCloseDeleteModal}
            isModalOpen={isModalOpen}
            handleDelete={handleDelete}
          />
          <ConfirmEditModal
            id={id}
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
          />
        </>
      )}
    </>
  );
};
