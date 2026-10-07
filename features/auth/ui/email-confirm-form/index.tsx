'use client';

import { useSearchParams } from 'next/navigation';

import mailImg from '@/shared/img/mail.png';
import { Button } from '@/shared/ui/button';

import { useResendEmailMutation } from '../../api/auth-api';

export const EmailConfirmForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [sendEmail, { isLoading }] = useResendEmailMutation();

  const handleClick = () => {
    try {
      if (email) {
        sendEmail(email);
      }
    } catch (e: unknown) {
      console.warn(e);
    }
  };

  return (
    <div>
      <img src={mailImg.src} className="m-auto" />
      <h3 className="text-[24px] sm:text-[32px] text-bold text-center text-content-primary mb-3">
        Email konfirmasi telah dikirim
      </h3>
      <p className="text-[14px] sm:text-[16px] text-center text-content-primary mb-8">
        Untuk melakukan verifikasi, konfirmasikan email Anda. Klik tautan yang kami kirimkan ke{' '}
        <span className="font-semibold">{email}</span>.
      </p>
      <Button onClick={handleClick} loading={isLoading} className="w-full mb-4" size="lg">
        Kirim ulang email konfirmasi
      </Button>
      <p className="text-[14px] sm:text-[16px] text-content-secondary text-center">
        Tidak menerima email? Periksa folder Spam
      </p>
    </div>
  );
};
