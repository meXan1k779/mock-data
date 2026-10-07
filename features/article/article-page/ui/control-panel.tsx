import { useRouter } from 'next/navigation';
import type { ChangeEvent, SetStateAction, Dispatch } from 'react';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { ConfirmPublishModal } from '@/features/moderating/modals/confirm-publish';
import { Button } from '@/shared/ui/button';

import { ARTICLE_EDITOR_LABELS } from '../../new-article/ui/constants';
import { usePushArtcileStageMutation, useRequestChangesMutation } from '../api/article-api';

interface Props {
  isModeratorReviewStatus: boolean;
  articleId: string;
  setTextAreaOpen: Dispatch<SetStateAction<boolean>>;
  isTextAreaOpen: boolean;
}

export const ControlPanel = ({
  isModeratorReviewStatus,
  articleId,
  setTextAreaOpen,
  isTextAreaOpen,
}: Props) => {
  const [comment, setComment] = useState('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const router = useRouter();

  const [requestChanges, { isLoading: isRequestLoading }] = useRequestChangesMutation();
  const [pushArticle, { isLoading }] = usePushArtcileStageMutation();

  const pushArticleToRegulator = async () => {
    try {
      await pushArticle({ articleId });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestChanges = async () => {
    try {
      await requestChanges({ articleId, comment }).unwrap();
      router.push('/moderating');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = () => {
    if (isTextAreaOpen) {
      handleRequestChanges();
      return;
    }
    if (isModeratorReviewStatus) {
      pushArticleToRegulator();
      router.push('/moderating');
      return;
    }
    setIsPublishModalOpen(true);
  };

  const approveButtonText = isTextAreaOpen
    ? 'Kirim permintaan'
    : isModeratorReviewStatus
      ? 'Setujui'
      : ARTICLE_EDITOR_LABELS.publish;
  const secondaryButtonText = isTextAreaOpen ? 'Batalkan' : 'Minta perubahan';

  const handleSecondaryButtonClick = () => {
    setTextAreaOpen(!isTextAreaOpen);
  };

  return (
    <div className="fixed flex flex-col py-5 border-t border-border-tetriary items-center justify-center bg-white w-screen left-1/2 -translate-x-1/2 bottom-0">
      {isTextAreaOpen && (
        <TextareaAutosize
          minRows={4}
          maxRows={8}
          value={comment}
          onChange={handleTitleChange}
          placeholder="Tulis komentar regulator kepada penulis"
          className="font-manrope w-full p-4 rounded-xl max-w-[700px] outline-none font-bold mb-8 border border-content-primary/10"
        />
      )}
      <div className="flex max-w-[700px] gap-4 w-full justify-center">
        <Button
          size="lg"
          variant="secondary"
          className="w-full"
          onClick={handleSecondaryButtonClick}
        >
          {secondaryButtonText}
        </Button>
        <Button
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          loading={isRequestLoading || isLoading}
        >
          {approveButtonText}
        </Button>
      </div>
      <ConfirmPublishModal
        id={articleId}
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />
    </div>
  );
};
