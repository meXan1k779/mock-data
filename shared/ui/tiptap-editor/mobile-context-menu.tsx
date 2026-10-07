import type { Editor } from '@tiptap/react';

import { useForceUpdateOnEditorChange } from '@/shared/hooks/useEditorUpdate';
import { useKeyboardHeight } from '@/shared/hooks/useKeyboardHeight';
import { ImageIcon } from '@/shared/icons/ImageIcon';
import { LinkIcon } from '@/shared/icons/linkIcon';
import { ListIcon } from '@/shared/icons/listIcon';
import { TIcon } from '@/shared/icons/tIcon';

import { EditorButton } from '../editor-button';

export const MobileContextMenu = ({
  editor,
  handleLinkClick,
  handleImageUpload,
}: {
  editor: Editor;
  handleLinkClick: () => void;
  handleImageUpload: () => void;
}) => {
  useForceUpdateOnEditorChange(editor);
  const keyboardHeight = useKeyboardHeight();

  return (
    <div
      className="flex md:hidden bg-white justify-between py-2 px-4 fixed left-0 w-full border-t border-border-tetriary"
      style={{ bottom: keyboardHeight }}
    >
      <EditorButton
        onClick={() => {
          editor.chain().focus().toggleBold().run();
        }}
        className={editor.isActive('bold') ? 'bg-blue-50 text-blue-600' : ''}
      >
        <span className="font-bold">B</span>
      </EditorButton>

      <EditorButton
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
        }}
        className={editor.isActive('italic') ? 'bg-blue-50 text-blue-600' : ''}
      >
        <span className="italic">i</span>
      </EditorButton>

      <EditorButton
        onClick={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
        className={editor.isActive('bulletList') ? 'bg-blue-50 text-blue-600' : ''}
      >
        <ListIcon />
      </EditorButton>

      <EditorButton
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-blue-50 text-blue-600' : ''}
      >
        <TIcon />
      </EditorButton>

      <EditorButton
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 4 }).run();
        }}
        className={editor.isActive('heading', { level: 4 }) ? 'bg-blue-50 text-blue-600' : ''}
      >
        <TIcon className="w-2 h-3.5" />
      </EditorButton>
      <EditorButton
        onClick={handleLinkClick}
        className={editor.isActive('link') ? 'bg-blue-50 text-blue-600' : ''}
      >
        <LinkIcon />
      </EditorButton>
      <EditorButton onClick={handleImageUpload}>
        <ImageIcon className="w-6 h-6" fill="#000" />
      </EditorButton>
    </div>
  );
};
