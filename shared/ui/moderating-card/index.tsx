import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useState, type MouseEvent } from 'react';

import type { ContentResponse } from '@/features/article/new-article/api/types';
import { ConfirmPublishModal } from '@/features/moderating/modals/confirm-publish';

import { Avatar } from '../avatar';
import { Button } from '../button';

interface Props extends ContentResponse {
  isInteractive?: boolean;
}

export const ModeratingCard = ({ Creator, title, id, isInteractive, createdAt }: Props) => {
  const router = useRouter();
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const time =
    createdAt &&
    formatDistanceToNow(createdAt, {
      addSuffix: true,
      locale: localeId, // id - локаль индонезия
    });

  const hadnlePublish = (e: MouseEvent) => {
    e.stopPropagation();
    setIsPublishModalOpen(true);
  };

  const handleChanges = (e: MouseEvent) => {
    e.stopPropagation();
    handleClick();
  };

  const handleClick = () => {
    router.push(`moderation/${id}`);
  };
  return (
    <>
      <div
        className="flex items-center flex-col sm:flex-row py-6 sm:py-8 border-b border-b-border-tetriary"
        onClick={handleClick}
      >
        <div className="w-full">
          <div className="flex mb-4 sm:mb-0 w-full flex-col">
            <div className="flex items-center mb-1">
              <Avatar nickname={Creator?.nickname} avatarUrl={Creator?.avatarUrl} />
              <div className="text-sm text-content-secondary mx-2">{Creator?.nickname}</div>
            </div>
            <div className="text-content-primary text-[18px] font-semibold mr-4">{title}</div>
          </div>
          {isInteractive && (
            <div className="mt-4">
              <Button size="sm" variant="outline" onClick={hadnlePublish}>
                Publish
              </Button>
              <Button size="sm" variant="text" onClick={handleChanges}>
                Minta perubahan
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between w-full sm:w-fit">
          <div className="flex items-center sm:block sm:w-44 justify-items-end">
            <div className={clsx('text-[12px] text-content-tetriary', isInteractive && 'mb-8')}>
              {time}
            </div>
          </div>
        </div>
      </div>
      <ConfirmPublishModal
        id={id}
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />
    </>
  );
};
