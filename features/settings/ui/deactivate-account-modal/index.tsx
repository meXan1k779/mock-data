import { useForm } from 'react-hook-form';
import Modal from 'react-modal';

import { useDeleteProfileMutation } from '@/features/auth/api/auth-api';
import { CrossIcon } from '@/shared/icons/crossIcon';
import { Button } from '@/shared/ui/button';
import { ControlledCheckbox } from '@/shared/ui/checkbox/controlled-checkbox';
import { Form } from '@/shared/ui/form';
import { ControlledTextField } from '@/shared/ui/text-field/controlled-text-field';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface DeactivateAccountForm {
  keyWord: string;
}

export const DeactivateAccountModal = ({ isOpen = true, onClose }: Props) => {
  const form = useForm<DeactivateAccountForm>({
    mode: 'onSubmit',
    defaultValues: {
      keyWord: '',
    },
  });

  const [deactivateAccount, { isLoading }] = useDeleteProfileMutation();

  const onSubmit = async (values: DeactivateAccountForm) => {
    try {
      if (values.keyWord === 'NONAKTIFKAN') {
        await deactivateAccount();
      }
    } catch {
      form.setError('keyWord', { message: 'something wrong' }); // notify TO DO
    }
  };
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
        <h2 className="text-[24px] sm:text-[20px] mb-4.5 text-content-primary font-bold font-manrope">
          Nonaktifkan akun?
        </h2>
        <div className="text-content-primary mb-5">
          Akun Anda akan dinonaktifkan hingga 30 hari. Setelah itu, data akun Anda akan dihapus.
        </div>
        <ControlledCheckbox
          label="Hapus semua artikel yang telah saya publikasikan."
          className="mb-5 w-full"
          name="deleteArticles"
        />
        <div className="text-content-primary font-bold mb-2">
          Ketik NONAKTIFKAN untuk mengonfirmasi
        </div>
        <ControlledTextField name="keyWord" label="NONAKTIFKAN" className="mb-6" />
        <div className="flex gap-4 flex-wrap sm:flex-nowrap flex-col-reverse sm:flex-row">
          <Button size="lg" variant="secondary" className="w-full" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            size="lg"
            className="w-full bg-base-negative text-white"
            loading={isLoading}
          >
            Nonaktifkan akun
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
