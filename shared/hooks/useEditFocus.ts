// hooks/useEditorFocus.ts
import type { Editor } from '@tiptap/react';
import { useEffect } from 'react';

export const useEditorFocus = (editor: Editor | null) => {
  useEffect(() => {
    if (editor) {
      requestAnimationFrame(() => {
        editor.commands.focus();
      });
    }
  }, [editor]);
};
