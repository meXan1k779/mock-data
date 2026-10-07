import type { Editor } from '@tiptap/react';

import { LinkIcon } from '@/shared/icons/linkIcon';
import { ListIcon } from '@/shared/icons/listIcon';
import { TIcon } from '@/shared/icons/tIcon';

import { EditorButton } from '../editor-button';

interface Props {
  editor: Editor;
  setShowContextMenu: (val: boolean) => void;
  handleLinkClick: () => void;
}

export const ContextMenuContent = ({ editor, setShowContextMenu, handleLinkClick }: Props) => {
  return (
    <>
      <EditorButton
        onClick={() => {
          editor.chain().focus().toggleBold().run();
          setShowContextMenu(false);
        }}
        className={editor.isActive('bold') ? 'bg-blue-50 text-blue-600' : ''}
      >
        <span className="font-bold">B</span>
      </EditorButton>

      <EditorButton
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
          setShowContextMenu(false);
        }}
        className={editor.isActive('italic') ? 'bg-blue-50 text-blue-600' : ''}
      >
        <span className="italic">i</span>
      </EditorButton>

      <EditorButton
        onClick={() => {
          editor.chain().focus().toggleBulletList().run();
          setShowContextMenu(false);
        }}
        className={editor.isActive('bulletList') ? 'bg-blue-50 text-blue-600' : ''}
      >
        <ListIcon />
      </EditorButton>

      <EditorButton
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
          setShowContextMenu(false);
        }}
        className={
          editor.isActive('heading', { level: 2 }) ? 'bg-blue-50 text-blue-600 font-bold' : ''
        }
      >
        <TIcon />
      </EditorButton>

      <EditorButton
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 4 }).run();
          setShowContextMenu(false);
        }}
        className={
          editor.isActive('heading', { level: 4 }) ? 'bg-blue-50 text-blue-600 font-bold' : ''
        }
      >
        <TIcon className="w-2 h-3.5" />
      </EditorButton>

      <EditorButton
        onClick={handleLinkClick}
        className={editor.isActive('link') ? 'bg-blue-50 text-blue-600' : ''}
      >
        <LinkIcon />
      </EditorButton>
    </>
  );
};
