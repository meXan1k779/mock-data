import Modal from 'react-modal';

import { Button } from '@/shared/ui/button';

interface Props {
  isModalOpen: boolean;
  closeModal: () => void;
  handleDelete: () => void;
  isLoading: boolean;
}

export const DeleteArticleModal = ({ isModalOpen, closeModal, handleDelete, isLoading }: Props) => {
  return (
    <Modal
      className="border-none outline-0 max-w-[480px] w-full m-4 bg-background-primary rounded-2xl overflow-scroll"
      ariaHideApp={false}
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black/50"
      isOpen={isModalOpen}
      onRequestClose={closeModal}
    >
      <div className="p-6 pt-4" onClick={(e) => e.stopPropagation()}>
        <div className="font-manrope text-xl font-bold mb-4.5">Hapus artikel ini?</div>
        <div className="text-content-primary mb-6">
          Tindakan ini tidak dapat dibatalkan. Anda akan kehilangan artikel ini beserta
          statistiknya.
        </div>
        <div className="flex justify-between gap-4">
          <Button size="lg" variant="secondary" className="w-full" onClick={closeModal}>
            Batal
          </Button>
          <Button size="lg" className="w-full" onClick={handleDelete} loading={isLoading}>
            Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
};
