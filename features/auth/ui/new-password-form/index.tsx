'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';

import {
  PASSWORD_ALLOWED_CHARS_MESSAGE,
  PASSWORD_ALLOWED_CHARS_PATTERN,
} from '@/shared/constants/password';
import { usePasswordValidation } from '@/shared/hooks/usePasswordValidation';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { ControlledPasswordField } from '@/shared/ui/password-field/controlled-password-field';
import { PasswordRequirements } from '@/shared/ui/password-requirements';

import { useSetNewPasswordMutation } from '../../api/auth-api';

interface NewPasswordFormProps {
  password: string;
  confirmPassword: string;
}

export const NewPasswordForm = () => {
  const form = useForm<NewPasswordFormProps>({
    mode: 'onSubmit',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const router = useRouter();

  const [setNewPassword, { isLoading }] = useSetNewPasswordMutation();

  const searchParams = useSearchParams();
  const hash = searchParams?.get('hash');
  const email = searchParams?.get('email');

  const password = useWatch({ control: form.control, name: 'password' });

  const { validation, setValidationErrors, isValid } = usePasswordValidation(password);

  const onSubmit = async (values: NewPasswordFormProps) => {
    setValidationErrors();
    if (!isValid || !email || !hash) {
      return;
    }
    try {
      await setNewPassword({ password: values.password, email, hash });
      router.push('/login');
    } catch {
      form.setError('confirmPassword', { message: 'something wrong' });
    }
  };

  return (
    <>
      <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] mb-3 text-content-primary font-bold font-manrope">
        Kata sandi baru
      </h2>
      <PasswordRequirements validation={validation} className="mb-6" />
      <Form form={form} onSubmit={onSubmit} className="space-y-6">
        <ControlledPasswordField
          name="password"
          label="Kata sandi baru"
          rules={{
            required: 'Masukkan kata sandi baru Anda.',
            pattern: {
              value: PASSWORD_ALLOWED_CHARS_PATTERN,
              message: PASSWORD_ALLOWED_CHARS_MESSAGE,
            },
          }}
          autoComplete="new-password"
        />
        <ControlledPasswordField
          name="confirmPassword"
          label="Ulangi kata sandi baru"
          className="mt-4 mb-6"
          rules={{
            required: 'Ulangi kata sandi baru Anda.',
            pattern: {
              value: PASSWORD_ALLOWED_CHARS_PATTERN,
              message: PASSWORD_ALLOWED_CHARS_MESSAGE,
            },
            validate: {
              validatePasswordMatch: (value) => {
                return value === password || 'Kata sandi tidak sama.';
              },
            },
          }}
          autoComplete="new-password"
        />
        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          Ubah kata sandi
        </Button>
      </Form>
    </>
  );
};
