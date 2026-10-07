'use client';

import Modal from 'react-modal';

import { Button } from '@/shared/ui/button';

import type { LearningPathDefinition } from '../model/constants';

interface PathCompletedModalProps {
  isOpen: boolean;
  onClose: () => void;
  path: LearningPathDefinition;
  totalCount: number;
  totalMinutes: number;
}

export const PathCompletedModal = ({
  isOpen,
  onClose,
  path,
  totalCount,
  totalMinutes,
}: PathCompletedModalProps) => {
  return (
    <Modal
      className="border-none outline-0 max-w-[520px] w-full m-4 bg-background-primary rounded-2xl shadow-[0px_1px_0px_0px_#e6e6e6] overflow-hidden relative"
      ariaHideApp={false}
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <div className="flex justify-end pt-4 pr-4 pb-2 pl-6">
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex items-center justify-center size-8"
        >
          <img src="/learning-paths/close-icon.svg" alt="" className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-8 px-6 pt-3 pb-6">
        <div className="flex flex-col items-center gap-6 w-full">
          <img src="/learning-paths/path-completed-badge.svg" alt="" className="size-20" />

          <div className="flex flex-col items-center gap-3 w-full">
            <p className="text-xs font-medium text-content-secondary text-center">JALUR SELESAI</p>
            <p className="font-noto font-semibold text-[28px] text-content-primary text-center">
              {path.title}
            </p>
            <div className="px-4 py-2 rounded-full bg-background-secondary">
              <p className="text-sm text-content-primary whitespace-nowrap">
                {totalCount} artikel · ~{totalMinutes} menit membaca
              </p>
            </div>
            <p className="text-base text-content-primary text-center">
              Anda telah menyelesaikan semua artikel — fondasi yang kuat untuk langkah trading Anda
              selanjutnya.
            </p>
          </div>
        </div>

        <Button size="lg" className="w-full" onClick={onClose}>
          Kerja Bagus
        </Button>
      </div>
    </Modal>
  );
};
