// shared/hooks/useSelectionMenu.ts
import type { Editor } from '@tiptap/react';
import { useState, useCallback, useMemo, useEffect } from 'react';

import { debounce } from '@/shared/utils/debounce';

import { useClickOutside } from './useClickOutside';

export interface SelectionRect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  centerX: number;
}

const SELECTION_CHANGE_DEBOUNCE_MS = 50;

export const useSelectionMenu = (
  editor: Editor | null,
  isMobile: boolean,
  menuRef: React.RefObject<HTMLElement | null>,
) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);

  const calculateSelectionRect = useCallback((): SelectionRect | null => {
    if (!editor) {
      return null;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.toString().trim().length === 0) {
      return null;
    }

    // Игнорируем выделения вне редактора (например, в заголовке статьи или другом тексте
    // страницы) — selectionchange глобальный и иначе реагирует на любое выделение на странице.
    if (!editor.view.dom.contains(selection.anchorNode)) {
      return null;
    }

    const range = selection.getRangeAt(0);
    let rect: DOMRect | DOMRectReadOnly = range.getBoundingClientRect();

    if (rect.width === 0 && rect.height === 0) {
      // getBoundingClientRect может вернуть пустой прямоугольник, если диапазон проходит
      // по границе нескольких узлов (например, задевает жирный/курсив/ссылку). Берём
      // клиентские прямоугольники диапазона — без мутации DOM (surroundContents бросает
      // исключение на многоузловых диапазонах и небезопасен внутри ProseMirror).
      const fallbackRect = range.getClientRects()[0];
      if (!fallbackRect || (fallbackRect.width === 0 && fallbackRect.height === 0)) {
        return null;
      }
      rect = fallbackRect;
    }

    return {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      centerX: rect.left + rect.width / 2,
    };
  }, [editor]);

  const updateFromSelection = useCallback(() => {
    const rect = calculateSelectionRect();
    if (rect) {
      setSelectionRect(rect);
      setShowContextMenu(true);
    } else {
      setShowContextMenu(false);
    }
  }, [calculateSelectionRect]);

  const debouncedUpdate = useMemo(
    () => debounce(updateFromSelection, SELECTION_CHANGE_DEBOUNCE_MS),
    [updateFromSelection],
  );

  useEffect(() => debouncedUpdate.cancel, [debouncedUpdate]);

  useEffect(() => {
    if (!editor || isMobile) {
      return;
    }

    document.addEventListener('selectionchange', debouncedUpdate);
    return () => document.removeEventListener('selectionchange', debouncedUpdate);
  }, [editor, isMobile, debouncedUpdate]);

  useEffect(() => {
    if (!showContextMenu) {
      return;
    }

    // Координаты выделения — viewport-relative, как и сам fixed-попап, поэтому при
    // скролле/ресайзе позицию нужно пересчитывать, иначе меню "отклеится" от текста.
    // capture: true ловит скролл и во вложенных прокручиваемых контейнерах, не только окна.
    window.addEventListener('scroll', updateFromSelection, true);
    window.addEventListener('resize', updateFromSelection);

    return () => {
      window.removeEventListener('scroll', updateFromSelection, true);
      window.removeEventListener('resize', updateFromSelection);
    };
  }, [showContextMenu, updateFromSelection]);

  const closeMenu = useCallback(() => setShowContextMenu(false), []);

  useClickOutside(menuRef, closeMenu, showContextMenu);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeMenu]);

  return {
    showContextMenu,
    selectionRect,
    setShowContextMenu,
  };
};
