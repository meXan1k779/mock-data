import Modal from 'react-modal';

import { CrossIcon } from '@/shared/icons/crossIcon';
import { Button } from '@/shared/ui/button';

export const UnsavedChangesModal = ({
  isOpen,
  onStay,
  onClose,
}: {
  isOpen: boolean;
  onStay: () => void;
  onClose: () => void;
}) => {
  if (!isOpen) {
    return null;
  }
  return (
    <Modal
      className="border-none relative outline-0 max-w-[480px] w-full m-4 bg-background-primary rounded-2xl overflow-scroll z-40 px-4 sm:px-6 py-4"
      ariaHideApp={false}
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black/50 z-40"
      isOpen={isOpen}
      onRequestClose={onStay}
    >
      <CrossIcon
        className=" absolute right-5 top-6 w-3.5 h-3.5 text-content-tetriary cursor-pointer"
        onClick={onStay}
      />
      <h3 className="text-lg font-bold text-[20px] mb-4.5">
        Apakah Anda yakin ingin keluar tanpa menyimpan?
      </h3>
      <p className="text-gray-600 mb-6">
        Semua perubahan yang belum disimpan akan hilang jika Anda melanjutkan.
      </p>
      <div className="flex justify-end flex-wrap sm:flex-nowrap flex-col-reverse sm:flex-row gap-3">
        <Button size="lg" variant="secondary" className="w-full" onClick={onStay}>
          Keluar
        </Button>
        <Button size="lg" className="w-full" onClick={onClose}>
          Tetap di sini
        </Button>
      </div>
    </Modal>
  );
};
