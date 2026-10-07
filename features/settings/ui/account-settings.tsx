import { useState } from 'react';

import { logout } from '@/features/auth/models/auth-slice';
import { useAppDispatch } from '@/shared/api/store';
import { Button } from '@/shared/ui/button';

import { ChangePasswordModal } from './change-password-modal';
import { DeactivateAccountModal } from './deactivate-account-modal';

export const AccountSettings = ({ email }: { email: string }) => {
  const [isOpen, setOpen] = useState(false);
  const [isDeactivateOpen, setDeactivateOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div>
      <div className="font-manrope font-bold text-[18px] md:text-[24px] mb-4 md:mb-5">
        Pengaturan akun
      </div>
      <div className="flex justify-between flex-col sm:flex-row items-start sm:items-center">
        <div>
          <div className="font-semibold mb-1">Email</div>
          <div className="mb-4 sm:mb-6 text-content-primary">{email}</div>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="mb-6 sm:mb-0">
          Keluar
        </Button>
      </div>
      <div className="flex justify-between flex-col sm:flex-row items-start sm:items-center">
        <div>
          <div className="font-semibold mb-1">Kata sandi</div>
          <div className="mb-4 sm:mb-6 text-content-primary">
            Anda dapat mengubah kata sandi untuk menjaga keamanan akun Anda.
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="mb-6 sm:mb-0">
          Ubah kata sandi
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row justify-between mb-20 sm:mb-30 items-start sm:items-center">
        <div>
          <div className="font-semibold mb-1">Zona berbahaya</div>
          <div className="mb-6 text-content-primary max-w-[540px]">
            Anda dapat menonaktifkan akun hingga 30 hari. Anda dapat menghapus artikel tanpa
            menonaktifkan akun.
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="bg-red-50 text-white"
          onClick={() => setDeactivateOpen(true)}
        >
          Nonaktifkan akun
        </Button>
      </div>
      <ChangePasswordModal isOpen={isOpen} onClose={() => setOpen(false)} />
      <DeactivateAccountModal isOpen={isDeactivateOpen} onClose={() => setDeactivateOpen(false)} />
    </div>
  );
};
