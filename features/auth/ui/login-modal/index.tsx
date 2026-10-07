import ReactModal from 'react-modal';
import { useSelector } from 'react-redux';

import type { RootState } from '@/shared/api/store';
import { useAppDispatch } from '@/shared/api/store';
import { CrossIcon } from '@/shared/icons/crossIcon';

import { toggleLoginModal } from '../../models/auth-slice';
import { LoginForm } from '../login-form';

export const LoginModal = () => {
  const isOpen = useSelector((state: RootState) => state.auth.isLoginModalOpen);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleLoginModal(false));
  };

  return (
    <ReactModal
      className="border-none outline-0 max-w-[520px] w-full p-6 bg-background-primary rounded-2xl overflow-scroll z-40 relative"
      ariaHideApp={false}
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black/50 z-40"
      isOpen={isOpen}
      onRequestClose={handleClose}
    >
      <CrossIcon
        className=" absolute right-5 top-6 w-3.5 h-3.5 text-content-tetriary cursor-pointer"
        onClick={handleClose}
      />

      <div className="bg-white m-auto w-full rounded-2xl mt-8">
        <div className="text-center">
          <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] mb-6 text-content-primary font-manrope font-bold">
            Masuk ke Finex Kita
          </h2>
        </div>
        <LoginForm />
      </div>
    </ReactModal>
  );
};
