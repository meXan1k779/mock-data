import type { Editor } from '@tiptap/react';
import { useState, useEffect, useCallback } from 'react';

export interface CursorLineRect {
  top: number;
  bottom: number;
}

/**
 * Tracks the vertical extent of the line the caret is currently on, relative to
 * `containerRef`, so UI anchored to the container (e.g. the image-attach button)
 * can follow the cursor as it moves between lines.
 */
export const useCursorLinePosition = (
  editor: Editor | null,
  containerRef: React.RefObject<HTMLElement | null>,
) => {
  const [lineRect, setLineRect] = useState<CursorLineRect | null>(null);

  const updatePosition = useCallback(() => {
    if (!editor || !containerRef.current) {
      return;
    }

    const { from } = editor.state.selection;
    const caretCoords = editor.view.coordsAtPos(from);
    const containerRect = containerRef.current.getBoundingClientRect();

    const top = caretCoords.top - containerRect.top;
    const bottom = caretCoords.bottom - containerRect.top;

    // editor.setOptions() runs on every TiptapEditor render (its extensions/editorProps
    // are rebuilt inline each time), which re-syncs the DOM selection and re-fires
    // 'transaction'. Bailing out when the line hasn't actually moved stops that from
    // turning into an unbounded render loop (setState → re-render → setOptions → transaction → setState → ...).
    setLineRect((prev) =>
      prev && prev.top === top && prev.bottom === bottom ? prev : { top, bottom },
    );
  }, [editor, containerRef]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    updatePosition();

    editor.on('selectionUpdate', updatePosition);
    editor.on('transaction', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      editor.off('selectionUpdate', updatePosition);
      editor.off('transaction', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [editor, updatePosition]);

  return lineRect;
};
