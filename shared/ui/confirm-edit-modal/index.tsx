import { useRouter } from 'next/navigation';
import Modal from 'react-modal';

import { useUpdateContentMutation } from '@/features/article/new-article/api/article-api';

import { Button } from '../button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export const ConfirmEditModal = ({ isOpen, onClose, id }: Props) => {
  const [updateContent] = useUpdateContentMutation();
  const router = useRouter();

  const handleEdit = async () => {
    try {
      await updateContent({ id, status: 'draft' });
      onClose();
      router.push(`/new-article/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={onClose}
      className="border-none outline-0 max-w-[480px] w-full m-4 py-4 px-6 bg-background-primary max-h-[200px] rounded-2xl overflow-scroll"
      ariaHideApp={false}
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <div className="font-manrope sm:text-[20px] font-bold mb-2">Ubah artikel?</div>
      <div className="mb-6">
        Artikel Anda akan disembunyikan dari tampilan publik selama Anda mengeditnya. Artikel akan
        dipublikasikan kembali setelah disetujui.
      </div>
      <div className="flex gap-4">
        <Button size="lg" variant="secondary" onClick={onClose} className="w-full">
          Batal
        </Button>
        <Button size="lg" onClick={handleEdit} className="w-full">
          Ubah
        </Button>
      </div>
    </Modal>
  );
};
