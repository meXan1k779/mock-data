import type { Editor } from '@tiptap/react';
import type { SetStateAction } from 'react';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../api/store';
import { replacePlaceholdersWithImages } from '../utils/replacePlaceholdersWithImages';

export const useContentLoader = (
  editor: Editor | null,
  content: string | undefined,
  setImgLoading: (value: SetStateAction<boolean>) => void,
  attachedFiles?: { fileId: string; link: string; id: string }[],
  onLoaded?: () => void,
) => {
  const isInitialLoadRef = useRef(true);
  const { editorData } = useSelector((state: RootState) => state.articleSave);

  useEffect(() => {
    if (!editor) {
      return;
    }
    const loadContent = async () => {
      if (editorData === null) {
        const files = attachedFiles || [];
        const editorDataWithImages = await replacePlaceholdersWithImages(content!, files);
        editor.commands.setContent(editorDataWithImages);
        setImgLoading(false);
      }
      isInitialLoadRef.current = false;
      onLoaded?.();
    };

    loadContent();
  }, [editor, content, onLoaded]);

  return { isInitialLoadRef };
};
