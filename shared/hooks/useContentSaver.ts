import type { Editor } from '@tiptap/react';
import { useCallback, useRef, useEffect } from 'react';

import {
  useDeleteAttachmentMutation,
  useUpdateContentMutation,
} from '@/features/article/new-article/api/article-api';
import type { ContentResponse } from '@/features/article/new-article/api/types';
import {
  setEditorData,
  setEditorTitle,
  setSavingStatus,
} from '@/features/article/new-article/models/article-slice';
import { useAppDispatch } from '@/shared/api/store';
import { useAutoSave } from '@/shared/hooks/useAutoSave';

import { replaceAllImgTagsWithOne } from '../utils/replaceImg';

const useCleanupTimer = (timerRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timerRef]);
};

export const useContentSaver = (editor: Editor | null, title: string, data?: ContentResponse) => {
  const dispatch = useAppDispatch();
  const [updateContent] = useUpdateContentMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation(); // Добавляем
  const isSavingRef = useRef(false);
  const savedTimerRef = useRef<NodeJS.Timeout | null>(null);

  const saveContent = useCallback(async () => {
    if (!editor || isSavingRef.current || !data) {
      return;
    }

    isSavingRef.current = true;
    dispatch(setSavingStatus({ status: 'saving', articleId: data.id }));

    try {
      const html = editor.getHTML() || '';
      const descriptionWithReplacedImg = await replaceAllImgTagsWithOne(html);

      // 🔥 НАХОДИМ И УДАЛЯЕМ НЕИСПОЛЬЗУЕМЫЕ КАРТИНКИ
      const currentImageIds = extractImageIdsFromHtml(html);
      const idsToDelete =
        data.AttachedFile?.filter((file) => !currentImageIds.includes(file.fileId)).map(
          (file) => file.id,
        ) || [];

      if (idsToDelete.length > 0) {
        await Promise.all(idsToDelete.map((id) => deleteAttachment(id)));
      }

      const articleData = {
        ...data,
        title,
        description: descriptionWithReplacedImg,
        // Обновленный список AttachedFile после удаления
        AttachedFile:
          data.AttachedFile?.filter((file) => currentImageIds.includes(file.fileId)) || [],
      };

      dispatch(setEditorData(html));
      dispatch(setEditorTitle(title));
      await updateContent(articleData).unwrap();

      dispatch(setSavingStatus({ status: 'saved', articleId: data.id }));

      if (savedTimerRef.current) {
        clearTimeout(savedTimerRef.current);
      }
      savedTimerRef.current = setTimeout(() => {
        dispatch(setSavingStatus({ status: 'idle', articleId: data.id }));
      }, 2000);
    } catch (error) {
      console.error('Ошибка при сохранении статьи:', error);
      dispatch(setSavingStatus({ status: 'idle', articleId: data.id }));
    } finally {
      isSavingRef.current = false;
    }
  }, [editor, title, updateContent, deleteAttachment, data, dispatch]);

  const { triggerSave: debouncedSave } = useAutoSave(saveContent, 1000);

  const triggerSave = useCallback(() => {
    if (savedTimerRef.current) {
      clearTimeout(savedTimerRef.current);
      savedTimerRef.current = null;
    }

    if (data && editor) {
      dispatch(setSavingStatus({ status: 'saving', articleId: data.id }));
    }

    debouncedSave();
  }, [data, editor, dispatch, debouncedSave]);

  useCleanupTimer(savedTimerRef);

  return { triggerSave };
};

// Вспомогательная функция для извлечения ID картинок из HTML
const extractImageIdsFromHtml = (html: string): string[] => {
  const imgRegex = /<img[^>]*alt=["']([^"']+)["'][^>]*>/gi;
  const ids: string[] = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    ids.push(match[1]);
  }
  return ids;
};
