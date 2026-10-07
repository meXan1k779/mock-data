import type { Editor } from '@tiptap/react';
import { useEffect } from 'react';

import type { Attachment } from '@/features/article/new-article/api/types';

export const useImagePaste = (
  editor: Editor | null,
  addAttachment: (props: { file: File; articleId: string }) => Promise<{ data?: Attachment }>,
  articleId: string,
) => {
  useEffect(() => {
    if (!editor) {
      return;
    }

    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) {
        return;
      }

      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          event.preventDefault();
          const file = item.getAsFile();
          if (!file) {
            continue;
          }

          addAttachment({ file, articleId }).then((res: { data?: Attachment }) => {
            const id = res?.data?.id;
            const reader = new FileReader();
            reader.onload = (e) => {
              const base64 = e.target?.result;
              if (base64 && editor) {
                editor
                  .chain()
                  .focus()
                  .setImage({ src: base64 as string, alt: id })
                  .run();
              }
            };
            reader.readAsDataURL(file);
          });
          break;
        }
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('paste', handlePaste);
    return () => editorElement.removeEventListener('paste', handlePaste);
  }, [editor]);
};
