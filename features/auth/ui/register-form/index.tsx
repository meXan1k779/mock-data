'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { useAppDispatch } from '@/shared/api/store';
import {
  PASSWORD_ALLOWED_CHARS_MESSAGE,
  PASSWORD_ALLOWED_CHARS_PATTERN,
} from '@/shared/constants/password';
import { usePasswordValidation } from '@/shared/hooks/usePasswordValidation';
import { Button } from '@/shared/ui/button';
import { ControlledCheckbox } from '@/shared/ui/checkbox/controlled-checkbox';
import { Form } from '@/shared/ui/form';
import { ControlledPasswordField } from '@/shared/ui/password-field/controlled-password-field';
import { PasswordRequirements } from '@/shared/ui/password-requirements';
import { ControlledTextField } from '@/shared/ui/text-field/controlled-text-field';

import { useRegisterMutation } from '../../api/auth-api';
import type { ApiError } from '../../api/types';
import { setCredentials, toggleEmailError } from '../../models/auth-slice';
import type { RegisterFormData } from '../../models/auth-types';

export const RegisterForm = () => {
  const router = useRouter();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const dispatch = useAppDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<RegisterFormData>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
      policy: false,
    },
  });

  const {
    formState: { errors },
  } = form;

  const password = useWatch({ control: form.control, name: 'password' });

  const { validation, setValidationErrors, isValid } = usePasswordValidation(password);

  const onSubmit = async (data: RegisterFormData) => {
    setValidationErrors();
    if (!isValid) {
      return;
    }

    try {
      const { tokens, ...user } = await register({
        password: data.password,
        email: data.email,
      }).unwrap();

      dispatch(
        setCredentials({
          user: user,
          refreshToken: tokens.refreshToken,
          accessToken: tokens.accessToken,
        }),
      );

      router.push('/');
    } catch (err: unknown) {
      console.error(err);
      const errorMesage = (err as ApiError)?.data?.message;
      if (errorMesage === 'email already in use') {
        dispatch(toggleEmailError(true));
        router.push('/login');
        return;
      }
      form.setError('email', {
        type: 'email',
        message: errorMesage,
      });
    }
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-6">
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
        onFocus={() => setIsPasswordFocused(false)}
      />

      <ControlledPasswordField
        name="password"
        label="Buat kata sandi"
        className="mt-4"
        rules={{
          required: 'Kata sandi diperlukan.',
          pattern: {
            value: PASSWORD_ALLOWED_CHARS_PATTERN,
            message: PASSWORD_ALLOWED_CHARS_MESSAGE,
          },
        }}
        autoComplete="new-password"
        onFocus={() => setIsPasswordFocused(true)}
      />

      {isPasswordFocused && !errors.password?.message && (
        <PasswordRequirements validation={validation} />
      )}

      <div className="mt-4 relative flex">
        <ControlledCheckbox
          name="policy"
          rules={{
            validate: (val) => {
              return val;
            },
          }}
          className="mr-2 top-1"
        />
        <div className="ml-2">
          <span className="text-content-primary mr-1">Saya menerima </span>
          <a
            href="/privacy-policy"
            target="_blank"
            className="font-medium text-base-link transition-colors"
          >
            Kebijakan Privasi
          </a>
          <span className="text-content-primary mr-1">,</span>
          <a
            href="/terms"
            target="_blank"
            className="font-medium text-base-link transition-colors inline-block"
          >
            Syarat dan Ketentuan
          </a>
          <span className="text-content-primary mr-1">
            dan risiko yang terkait dengan aktivitas trading.
          </span>
        </div>
      </div>

      <Button type="submit" className="w-full mt-4" size="lg" loading={isLoading}>
        Daftar
      </Button>

      <div className="text-center pt-6 border-t border-gray-200">
        <span className="text-content-primary mr-1">Sudah mendaftar?</span>
        <Link href="/login" className="font-medium text-base-link transition-colors">
          Masuk.
        </Link>
      </div>
    </Form>
  );
};
