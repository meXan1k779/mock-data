import type { Editor } from '@tiptap/react';
import { useState, useRef, useCallback, useEffect } from 'react';

import { useClickOutside } from './useClickOutside';

export const useLinkPopup = (editor: Editor | null) => {
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const linkPopupRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const openLinkPopup = useCallback(() => {
    setShowLinkPopup(true);
    if (editor?.isActive('link')) {
      const href = editor.getAttributes('link').href;
      setLinkUrl(href || '');
    }
  }, [editor]);

  const closeLinkPopup = useCallback(() => {
    setShowLinkPopup(false);
    setLinkUrl('');
  }, []);

  const applyLink = useCallback(() => {
    if (!editor || !linkUrl.trim()) {
      return;
    }
    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    editor.chain().focus().setLink({ href: url }).run();
    closeLinkPopup();
  }, [editor, linkUrl, closeLinkPopup]);

  useClickOutside(linkPopupRef, closeLinkPopup, showLinkPopup);

  useEffect(() => {
    if (showLinkPopup && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkPopup]);

  return {
    showLinkPopup,
    linkUrl,
    setLinkUrl,
    linkPopupRef,
    linkInputRef,
    openLinkPopup,
    closeLinkPopup,
    applyLink,
  };
};
