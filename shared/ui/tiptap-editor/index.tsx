'use client';

import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import type { ChangeEvent } from 'react';
import { useRef, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';

import {
  useAddAttachmentMutation,
  useGetMyContentByIdQuery,
} from '@/features/article/new-article/api/article-api';
import { setEditorData, setEditorTitle } from '@/features/article/new-article/models/article-slice';
import { ARTICLE_EDITOR_LABELS } from '@/features/article/new-article/ui/constants';
import { useAppDispatch, type RootState } from '@/shared/api/store';
import { useContentLoader } from '@/shared/hooks/useContentLoader';
import { useContentSaver } from '@/shared/hooks/useContentSaver';
import { useCursorLinePosition } from '@/shared/hooks/useCursorLinePosition';
import { useEditorFocus } from '@/shared/hooks/useEditFocus';
import { useImagePaste } from '@/shared/hooks/useImagePaste';
import { useLinkPopup } from '@/shared/hooks/useLinkPopup';
import { useMedia } from '@/shared/hooks/useMedia';
import { useSelectionMenu } from '@/shared/hooks/useSelectionMenu';
import { ImageIcon } from '@/shared/icons/ImageIcon';
import { FinexLoader } from '@/shared/icons/finexLoader';
import { getClampedPopupPosition, toAnchoredStyle } from '@/shared/utils/popup-position';

import { Accordion } from '../accordion/ui';
import { ErrorBlock } from '../error';

import { ContextMenuContent } from './context-menu-content';
import { MobileContextMenu } from './mobile-context-menu';

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: 'rounded-lg max-w-full w-full h-auto block my-4',
      },
      'data-temp-id': {
        default: null,
      },
    };
  },
});

const TiptapEditor = ({ className }: { className?: string }) => {
  const params = useParams();
  const articleId = params?.article as string;
  const { isMobile } = useMedia();
  const [addAttachment] = useAddAttachmentMutation();
  const [imgLoading, setImgLoading] = useState(true);
  const [isReduxSynced, setIsReduxSynced] = useState(false);
  const dispatch = useAppDispatch();

  const { editorData, editorTitle } = useSelector((state: RootState) => state.articleSave);

  // Extensions/editorProps must stay referentially stable across renders: useEditor()
  // calls editor.setOptions() whenever this config object changes identity, which
  // re-syncs the DOM selection and can re-trigger 'transaction' listeners (e.g.
  // useCursorLinePosition) — recreating this object inline on every render turns
  // that into an unbounded render loop that freezes the tab.
  const editorExtensions = useMemo(
    () => [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-2 text-base leading-relaxed',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({
        placeholder: 'Mulai menulis artikel…',
        emptyEditorClass: 'is-editor-empty',
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full w-full h-auto block my-4',
        },
      }),
    ],
    [],
  );

  const editorProps = useMemo(
    () => ({
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none active:outline-none',
        style: 'outline: none; font-size: 16px; line-height: 1.6;',
      },
    }),
    [],
  );

  const editor = useEditor({
    extensions: editorExtensions,
    content: '',
    immediatelyRender: false,
    editorProps,
  });

  const { data, isLoading, isFetching, isError } = useGetMyContentByIdQuery(articleId, {
    skip: !params?.article,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.title && !editorTitle) {
      dispatch(setEditorTitle(data.title));
    }
  }, [data?.title, editorTitle, dispatch]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (editorData && !isReduxSynced) {
      editor.commands.setContent(editorData);
      // Bookkeeping flags paired with the editor.commands.setContent() sync above.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsReduxSynced(true);
      setImgLoading(false);
      return;
    }
  }, [editor, editorData, data?.description, isReduxSynced]);

  useContentLoader(editor, data?.description, setImgLoading, data?.AttachedFile, () => {
    if (!editorData) {
      setIsReduxSynced(true);
    }
  });

  const { triggerSave } = useContentSaver(editor, editorTitle, data);

  const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setEditorTitle(e.target.value));
    triggerSave();
  };

  useEffect(() => {
    if (!editor) {
      return;
    }

    const handleUpdate = () => {
      const html = editor.getHTML();
      const plainText = editor.getText();

      if (plainText.trim() || html.includes('<img')) {
        if (html !== editorData) {
          dispatch(setEditorData(html));
        }
      } else if (!plainText.trim() && !html.includes('<img')) {
        if (editorData !== '') {
          dispatch(setEditorData(''));
        }
      }
      triggerSave();
    };

    editor.on('update', handleUpdate);
    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, triggerSave, dispatch, editorData]);

  const menuRef = useRef<HTMLDivElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);

  const { showContextMenu, selectionRect, setShowContextMenu } = useSelectionMenu(
    editor,
    isMobile,
    menuRef,
  );

  useImagePaste(editor, addAttachment, articleId);

  const {
    showLinkPopup,
    linkUrl,
    setLinkUrl,
    linkPopupRef,
    linkInputRef,
    openLinkPopup,
    closeLinkPopup,
    applyLink,
  } = useLinkPopup(editor);

  useEditorFocus(editor);

  const cursorLine = useCursorLinePosition(editor, editorWrapperRef);
  const IMAGE_BUTTON_SIZE = 24;
  const imageButtonTop = cursorLine
    ? cursorLine.top + (cursorLine.bottom - cursorLine.top) / 2 - IMAGE_BUTTON_SIZE / 2
    : null;

  const [menuStyle, setMenuStyle] = useState<{
    left: number;
    top: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (!showContextMenu || !selectionRect || !menuRef.current) {
      // Сбрасываем измеренную позицию, когда попап скрыт или выделение пропало.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMenuStyle(null);
      return;
    }

    const { width, height } = menuRef.current.getBoundingClientRect();
    setMenuStyle(getClampedPopupPosition(selectionRect, { width, height }));
  }, [showContextMenu, selectionRect]);

  const [linkMenuStyle, setLinkMenuStyle] = useState<{
    left: number;
    top: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (isMobile || !showLinkPopup || !selectionRect || !linkPopupRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLinkMenuStyle(null);
      return;
    }

    const { width, height } = linkPopupRef.current.getBoundingClientRect();
    setLinkMenuStyle(getClampedPopupPosition(selectionRect, { width, height }));
  }, [isMobile, showLinkPopup, selectionRect, linkPopupRef]);

  const linkPopupStyle = isMobile
    ? { left: 'calc(50% - 110px)', bottom: '70px' }
    : toAnchoredStyle(linkMenuStyle);

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) {
        return;
      }

      // Вставляем временное изображение с плейсхолдером
      const tempId = `temp-${Date.now()}`;

      if (editor) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'image',
            attrs: {
              src: '',
              alt: 'Загрузка...',
              'data-temp-id': tempId,
            },
          })
          .run();
      }

      try {
        const res = await addAttachment({ file, articleId });
        const id = res?.data?.id;

        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result;
          if (base64 && editor) {
            // Находим и обновляем временное изображение
            let found = false;
            editor.state.doc.descendants((node, pos) => {
              if (node.type.name === 'image' && node.attrs['data-temp-id'] === tempId && !found) {
                editor.commands.setNodeSelection(pos);
                editor.commands.updateAttributes('image', {
                  src: base64 as string,
                  alt: id || 'Изображение',
                  'data-temp-id': null,
                });
                found = true;
                return false;
              }
              return true;
            });
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Ошибка загрузки изображения:', error);
        // Удаляем временное изображение в случае ошибки
        editor?.state.doc.descendants((node, pos) => {
          if (node.type.name === 'image' && node.attrs['data-temp-id'] === tempId) {
            editor.commands.deleteRange({ from: pos, to: pos + node.nodeSize });
            return false;
          }
          return true;
        });
      }
    };
    input.click();
  };

  const handleLinkClick = () => {
    setShowContextMenu(false);
    setTimeout(openLinkPopup, 10);
  };

  if (isError) {
    return <ErrorBlock />;
  }

  if (!editor) {
    return <div />;
  }

  const isEditorDataLoading =
    (isLoading || isFetching || imgLoading) && !editorData && !isReduxSynced;

  if (isEditorDataLoading) {
    return (
      <FinexLoader className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={32} />
    );
  }

  const comment = data?.errorComment;

  return (
    <div
      className={clsx(
        className,
        'bg-background-primary max-w-[700px] w-full m-auto pt-3 mt-4 sm:mt-0 md:pt-4 2xl:pt-8 px-4 md:px-0',
        comment && 'mt-22',
      )}
    >
      {comment && (
        <Accordion
          label="Revisi artikel Anda"
          defaultOpen={false}
          className="fixed z-10 max-w-[700px] w-full top-20 mr-4"
        >
          <p>{comment}</p>
        </Accordion>
      )}
      <TextareaAutosize
        minRows={1}
        maxRows={4}
        value={editorTitle}
        onChange={handleTitleChange}
        placeholder={ARTICLE_EDITOR_LABELS.titlePlaceholder}
        className={clsx(
          '2xl:text-[40px] lg:text-[36px] md:text-[32px] text-[28px] font-manrope w-full outline-none font-bold resize-none leading-12',
          comment && ' sm:mt-20',
        )}
      />
      <div className="relative" ref={editorWrapperRef}>
        {!isMobile && (
          <ImageIcon
            color="#9FA5B2"
            className="absolute -left-8 transition-[top] duration-150 ease-out active:shadow-inner active:translate-y-0.5 hover:opacity-70 cursor-pointer"
            style={
              imageButtonTop !== null ? { top: `${imageButtonTop}px` } : { visibility: 'hidden' }
            }
            onClick={handleImageUpload}
          />
        )}
        <EditorContent editor={editor} className="py-2" />
      </div>

      {showContextMenu && !isMobile && (
        <div
          ref={menuRef}
          className="fixed bg-white rounded-lg shadow-lg z-50 px-4 py-4 flex"
          style={toAnchoredStyle(menuStyle)}
        >
          <ContextMenuContent
            editor={editor}
            setShowContextMenu={setShowContextMenu}
            handleLinkClick={handleLinkClick}
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 triangle" />
        </div>
      )}

      {showLinkPopup && (
        <div
          ref={linkPopupRef}
          className="fixed bg-white rounded-lg shadow-lg z-60"
          style={linkPopupStyle}
        >
          <div className="flex items-center p-3">
            <div></div>
            <input
              ref={linkInputRef}
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className="border-none outline-none text-sm w-48 px-2 py-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyLink();
                }
                if (e.key === 'Escape') {
                  closeLinkPopup();
                }
              }}
            />
            <button onClick={closeLinkPopup} className="text-gray-500 hover:text-gray-700 ml-2">
              ×
            </button>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 triangle" />
        </div>
      )}
      <MobileContextMenu
        handleImageUpload={handleImageUpload}
        editor={editor}
        handleLinkClick={handleLinkClick}
      />
    </div>
  );
};

export default TiptapEditor;
