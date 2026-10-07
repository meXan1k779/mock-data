'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { ControlledTextField } from '@/shared/ui/text-field/controlled-text-field';

import { useRestoreEmailMutation } from '../../api/auth-api';

export const ChangeEmailForm = () => {
  const form = useForm<{ email: string }>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
    },
  });

  const router = useRouter();

  const [sendEmail, { isLoading }] = useRestoreEmailMutation();

  const onSubmit = async (values: { email: string }) => {
    try {
      await sendEmail(values);

      router.push(`/login/reset-password-success?email=${values.email}`);
    } catch {
      form.setError('email', { message: 'something went wrong' });
    }
  };

  return (
    <>
      <div className="text-center relative">
        <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] mb-2 text-content-primary font-bold font-manrope">
          Ubah alamat email
        </h2>
        <p className="text-sm sm:text-[16px] text-content-secondary mb-8 text-center">
          Di sini Anda dapat mengubah alamat email yang ditautkan ke profil Finex.
        </p>
      </div>
      <Form form={form} onSubmit={onSubmit} className="space-y-6">
        <ControlledTextField
          name="email"
          type="email"
          label="Masukkan email baru"
          rules={{
            required: 'email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          autoComplete="email"
          className="mb-6"
        />
        <Button loading={isLoading} size="lg" type="submit" className="w-full mb-4">
          Ubah email
        </Button>
      </Form>
    </>
  );
};
