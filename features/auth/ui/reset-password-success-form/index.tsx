'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useTimerWithPersist } from '@/shared/hooks/ useTimerWIthPersist';
import { PositiveCheckmarkIcon } from '@/shared/icons/positiveCheckmarkIcon';
import { Button } from '@/shared/ui/button';

import { useRestoreEmailMutation } from '../../api/auth-api';

export const ResetPasswordSuccessForm = () => {
  const router = useRouter();
  const [sendEmail, { isLoading }] = useRestoreEmailMutation();

  const searchParams = useSearchParams();
  const email = searchParams?.get('email') as string;

  const { isActive, startTimer, formatTime } = useTimerWithPersist();

  const onSubmit = async () => {
    if (email) {
      try {
        await sendEmail({ email });
        startTimer(60);
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    }
  };

  const getButtonText = () => {
    if (isActive) {
      return `Kirim email lagi dalam ${formatTime()}`;
    }
    return 'Kirim email lagi';
  };

  useEffect(() => {
    if (!email) {
      router.push('/login/reset-password');
    }
  }, [email, router]);

  return (
    <>
      <div className="text-center relative">
        <PositiveCheckmarkIcon className="m-auto mt-4 mb-9 h-[78px] w-[78px]" />
        <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] mb-2 text-content-primary font-bold font-manrope">
          Email reset telah terkirim
        </h2>
        <p className="text-sm sm:text-[16px] text-content-secondary mb-8 text-center">
          Ikuti tautan yang kami kirimkan ke {email} untuk mereset kata sandi Anda.
        </p>
      </div>
      <Button
        onClick={onSubmit}
        type="button"
        size="lg"
        className="w-full mb-4"
        disabled={isActive || isLoading}
      >
        {getButtonText()}
      </Button>
      <p className="text-sm text-content-secondary mb-6 text-center w-[400px] m-auto">
        Tidak menerima email? Periksa folder Spam atau{' '}
        <span
          onClick={() => router.push('/login/change-email')}
          className="text-base-link cursor-pointer"
        >
          ubah alamat email.
        </span>
      </p>
    </>
  );
};
