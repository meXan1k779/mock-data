import { useRouter } from 'next/navigation';
import type { FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';

import { useUpdateUserMutation } from '@/features/auth/api/auth-api';
import { useAppDispatch, type RootState } from '@/shared/api/store';
import { CrossIcon } from '@/shared/icons/crossIcon';
import victoryImg from '@/shared/img/victory.png';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { ControlledPhoneInput } from '@/shared/ui/phone-input/controlled-phone-input';

import { showConfirmModal } from '../new-article/models/article-slice';

export const ConfirmModal = () => {
  const router = useRouter();
  const [saveUserData] = useUpdateUserMutation();
  const phoneNumber = useSelector((state: RootState) => state.auth.user?.phoneNumber);
  const { isConfirmModalVisible } = useSelector((state: RootState) => state.articleSave);

  const getDefaultValues = (): { phoneNumber: string } => ({
    phoneNumber: '',
  });

  const form = useForm<{ phoneNumber: string }>({
    mode: 'onSubmit',
    defaultValues: getDefaultValues(),
  });

  const handleSubmit = async (values: FieldValues) => {
    if (!phoneNumber) {
      await saveUserData({ phoneNumber: values.phoneNumber });
    }
    handleClose();
  };

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(showConfirmModal(false));
  };

  const handleGoToProfile = () => {
    handleClose();
    router.push('/profile');
  };

  return (
    <Modal
      className="border-none outline-0 max-w-[480px] w-full m-4 bg-background-primary rounded-2xl overflow-scroll z-40"
      ariaHideApp={false}
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black/50 z-40"
      isOpen={isConfirmModalVisible}
      onRequestClose={handleClose}
    >
      <div className="relative">
        <CrossIcon
          className=" absolute right-5 top-5 w-3.5 h-3.5 text-content-tetriary cursor-pointer"
          onClick={handleClose}
        />
        <img src={victoryImg.src} alt="" />
        <div className="p-6 pt-0 -mt-2.5">
          <div className="font-manrope sm:text-[20px] font-bold mb-2">
            Artikel Anda sedang dalam peninjauan
          </div>
          <div className="mb-2">
            Setelah disetujui, artikel akan dipublikasikan dan kartu hadiah marketplace senilai
            Rp1.000.000,00 akan dikreditkan ke nomor telepon Anda. Anda dapat memeriksa statusnya di
            <span
              className="font-semibold text-base-link cursor-pointer"
              onClick={handleGoToProfile}
            >
              {' '}
              profil Anda.
            </span>
          </div>
          <Form form={form} onSubmit={handleSubmit}>
            {!phoneNumber && (
              <>
                <div className="mb-2">
                  Untuk menerbitkan voucer, berikan nomor telepon aktif Anda.
                </div>

                <ControlledPhoneInput name="phoneNumber" placeholder="Nomor telepon" />
              </>
            )}
            <Button type="submit" className="w-full mt-6" size="lg">
              Mengerti
            </Button>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
