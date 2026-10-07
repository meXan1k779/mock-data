import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { useDeleteContentByIdMutation } from '@/features/article/new-article/api/article-api';
import type { ContentResponse } from '@/features/article/new-article/api/types';
import { resetEditorData } from '@/features/article/new-article/models/article-slice';
import { DeleteArticleModal } from '@/features/profile/ui/delete-article-modal';
import { useAppDispatch } from '@/shared/api/store';
import { DotsIcons } from '@/shared/icons/dotsIcon';
import { InfoCircleIcon } from '@/shared/icons/infoCircleIcon';
import { ArticleStatus } from '@/shared/types/types';

import { Popup } from '../../popup/ui';

export const DraftCard = ({
  previewUrl,
  title,
  status,
  createdAt,
  id,
  className,
}: ContentResponse & { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteArticle, { isLoading }] = useDeleteContentByIdMutation();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const openPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const closePopup = () => setIsOpen(false);
  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
    closePopup();
  };

  const time =
    createdAt &&
    formatDistanceToNow(createdAt, {
      addSuffix: true,
      locale: localeId, // id - локаль индонезия
    });

  const closeModal = () => setIsModalOpen(false);

  const handleDelete = async () => {
    try {
      await deleteArticle(id);
      closeModal();
    } catch (e) {
      console.error('failed to delete article', e);
    }
  };

  const isReadOnly = [ArticleStatus.REGULATOR_REVIEW, ArticleStatus.MODERATOR_REVIEW].includes(
    status,
  );

  const handleEdit = () => {
    if (isReadOnly) {
      router.push(`/review/${id}`);
    }
    if (
      [
        ArticleStatus.REGULATOR_REJECTED,
        ArticleStatus.MODERATOR_REJECTED,
        ArticleStatus.DRAFT,
      ].includes(status)
    ) {
      // Открываем другую статью — сбрасываем черновик, оставшийся от предыдущей,
      // иначе редактор подставит чужой текст вместо содержимого этой статьи.
      dispatch(resetEditorData());
      router.push(`/new-article/${id}`);
    }
  };

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case ArticleStatus.MODERATOR_REJECTED:
      case ArticleStatus.REGULATOR_REJECTED:
        return {
          borderColor: '#FFDA9D',
          backgroundColor: '#FFF3E0',
          icon: <InfoCircleIcon color="#FF9800" className="mr-1" />,
          text: 'Perubahan diminta',
        };
      case ArticleStatus.MODERATOR_REVIEW:
        return {
          borderColor: '#A7D5F6',
          backgroundColor: '#E3F2FD',
          text: 'Dalam peninjauan internal',
        };
      case ArticleStatus.REGULATOR_REVIEW:
        return {
          borderColor: '#A7D5F6',
          backgroundColor: '#E3F2FD',
          text: 'Dalam peninjauan regulasi',
        };
      default:
        return {
          borderColor: '#E0E0E0',
          backgroundColor: '#F5F5F5',
          text: 'Draf',
        };
    }
  };

  const { borderColor, backgroundColor, icon, text } = getBadgeStyle(status);

  return (
    <div
      className={clsx(
        className,
        'flex items-center flex-col sm:flex-row py-6 sm:py-8 border-b border-b-border-tetriary ',
      )}
      onClick={handleEdit}
    >
      <div className="flex items-center mb-4 sm:mb-0 w-full">
        {previewUrl && (
          <Image src={previewUrl} width={75} height={56} alt="img" className="w-[75px] h-14 mr-4" />
        )}
        <div className="text-content-primary text-[18px] mr-4">{title}</div>
      </div>
      <div className="flex items-center justify-between w-full sm:w-fit">
        <div className="flex items-center sm:block sm:w-44">
          <div
            className="flex items-center py-0.5 px-2 border rounded-md whitespace-nowrap text-[12px] sm:mb-2 mr-3 sm:mr-4 w-fit"
            style={{
              borderColor: borderColor,
              backgroundColor: backgroundColor,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            {icon}
            {text}
          </div>
          <div className="text-[12px] text-content-tetriary">{time}</div>
        </div>
        <span ref={buttonRef} className="inline-block p-4">
          <DotsIcons onClick={openPopup} color="black" className="cursor-pointer" />
        </span>
      </div>
      <Popup anchorRef={buttonRef} isOpen={isOpen} onClose={closePopup}>
        <div className="flex flex-col">
          <div
            className="text-content-secondary p-3 text-[14px] cursor-pointer"
            onClick={handleEdit}
          >
            {isReadOnly ? 'Tampilkan' : 'Edit'}
            {isReadOnly && (
              <div className="text-content-tetriary text-xs">Pengeditan tidak diizinkan.</div>
            )}
          </div>
          <div className="text-base-negative p-3 text-[14px] cursor-pointer" onClick={openModal}>
            Hapus
          </div>
        </div>
      </Popup>
      <DeleteArticleModal
        isLoading={isLoading}
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        handleDelete={handleDelete}
      />
    </div>
  );
};
