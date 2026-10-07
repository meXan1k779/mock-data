'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ChevronLeftIcon } from '@/shared/icons/chevronLeftIcon';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { ControlledTextField } from '@/shared/ui/text-field/controlled-text-field';

import { useRestoreEmailMutation } from '../../api/auth-api';

export const ResetPasswordForm = () => {
  const router = useRouter();
  const form = useForm<{ email: string }>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
    },
  });

  const [sendEmail, { isLoading }] = useRestoreEmailMutation();

  const onSubmit = async (values: { email: string }) => {
    try {
      await sendEmail(values);

      router.push(`/login/reset-password-success?email=${values.email}`);
    } catch {
      form.setError('email', { message: 'something went wrong' });
    }
  };

  const handleBack = () => {
    router.push('/login');
  };

  return (
    <>
      <div className="text-center relative">
        <ChevronLeftIcon onClick={handleBack} className="absolute top-3 sm:top-4 cursor-pointer" />
        <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] mb-2 text-content-primary font-bold font-manrope">
          Reset kata sandi
        </h2>
        <p className="text-sm text-content-secondary mb-6 text-center">
          Masukkan email untuk mendapatkan tautan reset.
        </p>
      </div>
      <Form form={form} onSubmit={onSubmit} className="space-y-6">
        <ControlledTextField
          name="email"
          type="email"
          label="Email"
          rules={{
            required: 'Masukkan email Anda.',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Alamat email tidak valid.',
            },
          }}
          autoComplete="email"
          className="mb-6 w-full"
        />
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          Kirim email reset
        </Button>
      </Form>
    </>
  );
};
