import type { Editor } from '@tiptap/react';
import { useEffect, useState } from 'react';

export const useForceUpdateOnEditorChange = (editor: Editor | null) => {
  const [_, forceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const update = () => forceUpdate((n) => n + 1);

    editor.on('selectionUpdate', update);
    editor.on('transaction', update);

    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);
};
