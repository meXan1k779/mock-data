'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import type { RootState } from '@/shared/api/store';
import { useAppDispatch } from '@/shared/api/store';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { ControlledPasswordField } from '@/shared/ui/password-field/controlled-password-field';
import { BackgroundPlate } from '@/shared/ui/plate';
import { ControlledTextField } from '@/shared/ui/text-field/controlled-text-field';

import { useLoginMutation } from '../../api/auth-api';
import { setCredentials, toggleLoginModal } from '../../models/auth-slice';
import type { LoginFormData } from '../../models/auth-types';

export const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isLoginPage = pathname.includes('/login');

  const isEmailError = useSelector((state: RootState) => state.auth.isEmailisUseError);
  const redirectAfterLogin = useSelector((state: RootState) => state.auth.redirectAfterLogin);

  const form = useForm<LoginFormData>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      if (isLoginPage) {
        router.push('/');
        return;
      }
      if (redirectAfterLogin) {
        dispatch(toggleLoginModal(false));
        router.push(redirectAfterLogin);
        return;
      }
      dispatch(toggleLoginModal(false));
    } catch (err: unknown) {
      console.error(err);

      // Проверяем статус ошибки
      if (err && typeof err === 'object' && 'status' in err) {
        const error = err as { status: number; data?: { message: string } };

        if (error.status === 401 && error.data?.message.includes('user not found')) {
          form.setError('email', { message: 'Tidak ada akun yang terdaftar untuk email ini.' });
          return;
        }
      }
      form.setError('password', {
        type: 'manual',
        message: 'Kata sandi mengandung karakter yang tidak valid.',
      });
    }
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-6">
      {isEmailError && (
        <BackgroundPlate type="info" className="mb-6">
          Email ini sudah terdaftar. Masukkan kata sandi untuk masuk.
        </BackgroundPlate>
      )}
      <ControlledTextField
        name="email"
        type="email"
        label="Email"
        rules={{
          required: 'Email diperlukan.',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Alamat email tidak valid.',
          },
        }}
        autoComplete="email"
        className="mb-4"
      />
      <ControlledPasswordField
        name="password"
        rules={{
          required: 'Kata sandi diperlukan.',
        }}
        label="Kata Sandi"
        className="mb-2"
      />
      <a
        href="/login/reset-password"
        className="font-semibold text-base-link text-[14px] inline-block mb-6"
      >
        Lupa kata sandi?
      </a>
      <Button type="submit" size="lg" className="w-full" loading={isLoading}>
        Masuk
      </Button>
      <div className="text-center pt-4 border-t border-gray-200">
        <span className="text-gray-600 mr-1">Belum mendaftar?</span>
        <Link href="/register" className="font-semibold text-base-link">
          Daftar.
        </Link>
      </div>
    </Form>
  );
};
