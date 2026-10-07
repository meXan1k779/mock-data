import type { ReactNode, RefObject } from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

import { useMedia } from '@/shared/hooks/useMedia';
import { CrossIcon } from '@/shared/icons/crossIcon';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
  placement?: 'bottom-start' | 'bottom' | 'bottom-end';
  offset?: number;
  mobileBreakpoint?: number;
  closeOnSwipe?: boolean;
}

export const Popup = ({
  isOpen,
  onClose,
  anchorRef,
  children,
  placement = 'bottom-start',
  offset = 8,
  closeOnSwipe = true,
}: PopupProps) => {
  const { isMobile } = useMedia();
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (!anchorRef?.current || isMobile) {
      return;
    }
    const rect = anchorRef.current.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + offset;
    const left = rect.left + window.scrollX;

    setPosition({ top, left });
  }, [anchorRef, isMobile, placement, offset]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isMobile]);

  useEffect(() => {
    if (!isOpen || isMobile) {
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    updatePosition();
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, isMobile, anchorRef, updatePosition, onClose]);

  useEffect(() => {
    if (isOpen && !isMobile) {
      updatePosition();
    }
  }, [isOpen, isMobile, updatePosition, children]);

  useEffect(() => {
    if (!isOpen || !isMobile || !closeOnSwipe) {
      return;
    }

    let startY = 0;
    let currentY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!popupRef.current) {
        return;
      }
      currentY = e.touches[0].clientY;
      const delta = currentY - startY;
      if (delta > 0) {
        popupRef.current.style.transform = `translateY(${delta}px)`;
      }
    };
    const handleTouchEnd = () => {
      if (!popupRef.current) {
        return;
      }
      const delta = currentY - startY;
      if (delta > 50) {
        onClose();
      } else {
        popupRef.current.style.transform = '';
      }
      startY = 0;
      currentY = 0;
    };

    const popup = popupRef.current;
    if (popup) {
      popup.addEventListener('touchstart', handleTouchStart);
      popup.addEventListener('touchmove', handleTouchMove);
      popup.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (popup) {
        popup.removeEventListener('touchstart', handleTouchStart);
        popup.removeEventListener('touchmove', handleTouchMove);
        popup.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isOpen, isMobile, closeOnSwipe, onClose]);

  if (!isOpen) {
    return null;
  }

  if (isMobile) {
    return createPortal(
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
        onClick={onClose}
      >
        <div
          ref={popupRef}
          className="bg-white dark:bg-gray-800 rounded-t-2xl p-4 w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-transform duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
          style={{ transform: 'translateY(0)' }}
        >
          <div className="flex justify-between items-center">
            <div className="font-manrope text-content-primary font-bold">Options</div>
            <CrossIcon onClick={onClose} className="w-3.5 h-3.5 text-content-tetriary" />
          </div>
          {children}
        </div>
      </div>,
      document.body,
    );
  }

  if (!anchorRef) {
    return null;
  }

  return createPortal(
    <div
      ref={popupRef}
      style={{
        position: 'absolute',
        top: position.top - 108,
        left: position.left - 100,
        zIndex: 9999,
      }}
      className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-[0_2px_12px_0_rgba(17,25,40,0.12)]"
    >
      {children}
    </div>,
    document.body,
  );
};
