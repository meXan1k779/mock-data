import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';

import { usePushArtcileStageMutation } from '@/features/article/article-page/api/article-api';
import { CrossIcon } from '@/shared/icons/crossIcon';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { ControlledTextField } from '@/shared/ui/text-field/controlled-text-field';

interface PublishModalFormData {
  number: string;
}

export const ConfirmPublishModal = ({
  isOpen,
  onClose,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}) => {
  const form = useForm<PublishModalFormData>({
    mode: 'onSubmit',
    defaultValues: {
      number: '',
    },
  });

  const router = useRouter();

  const [pushArticle, { isLoading }] = usePushArtcileStageMutation();

  const onSubmit = async (data: PublishModalFormData) => {
    try {
      await pushArticle({ articleId: id, approveId: data.number });
      router.push('/moderating');
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) {
    return null;
  }
  return (
    <Modal
      className="border-none relative outline-0 max-w-[480px] w-full m-4 bg-background-primary rounded-2xl overflow-scroll z-40 px-6 py-4"
      ariaHideApp={false}
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black/50 z-40"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <Form form={form} onSubmit={onSubmit} className="space-y-6">
        <CrossIcon
          className=" absolute right-5 top-6 w-3.5 h-3.5 text-content-tetriary cursor-pointer"
          onClick={onClose}
        />
        <h3 className="text-lg font-bold text-[20px] mb-4.5">Nomor persetujuan</h3>
        <p className="text-gray-600 mb-6">
          Masukkan nomor persetujuan regulator untuk artikel ini.
        </p>
        <ControlledTextField
          name="number"
          type="text"
          label="Nomor"
          rules={{
            required: 'Number is required',
          }}
          autoComplete="email"
          className="mb-6"
        />
        <div className="flex justify-end flex-wrap sm:flex-nowrap flex-col-reverse sm:flex-row gap-3">
          <Button size="lg" variant="secondary" type="submit" className="w-full" onClick={onClose}>
            Batal
          </Button>
          <Button loading={isLoading} size="lg" className="w-full">
            Simpan
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
