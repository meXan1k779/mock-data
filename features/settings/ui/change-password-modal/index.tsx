import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Modal from 'react-modal';

import { useChangePasswordMutation } from '@/features/auth/api/auth-api';
import type { ApiError } from '@/features/auth/api/types';
import {
  PASSWORD_ALLOWED_CHARS_MESSAGE,
  PASSWORD_ALLOWED_CHARS_PATTERN,
} from '@/shared/constants/password';
import { usePasswordValidation } from '@/shared/hooks/usePasswordValidation';
import { CrossIcon } from '@/shared/icons/crossIcon';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { ControlledPasswordField } from '@/shared/ui/password-field/controlled-password-field';
import { PasswordRequirements } from '@/shared/ui/password-requirements';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface ChangePasswordForm {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export const ChangePasswordModal = ({ isOpen = true, onClose }: Props) => {
  const form = useForm<ChangePasswordForm>({
    mode: 'onSubmit',
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [setNewPassword, { isLoading }] = useChangePasswordMutation();

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen]);

  const password = useWatch({ control: form.control, name: 'password' });

  const { validation, setValidationErrors, isValid } = usePasswordValidation(password);

  const onSubmit = async (values: ChangePasswordForm) => {
    setValidationErrors();
    if (!isValid) {
      return;
    }
    try {
      await setNewPassword({
        newPassword: values.password,
        oldPassword: values.currentPassword,
      }).unwrap();

      onClose();
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? (err as ApiError).data?.message
          : undefined;

      form.setError('currentPassword', {
        message: message || 'Kata sandi saat ini salah.',
      });
    }
  };
  return (
    <Modal
      className="border-none relative outline-0 max-w-[480px] w-full m-4 bg-background-primary rounded-2xl overflow-scroll z-40 px-6 py-4"
      ariaHideApp={false}
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black/50 z-40"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <CrossIcon
        className=" absolute right-5 top-6 w-3.5 h-3.5 text-content-tetriary cursor-pointer"
        onClick={onClose}
      />
      <h2 className="text-[24px] sm:text-[20px] mb-3 text-content-primary font-bold font-manrope">
        Ubah kata sandi
      </h2>
      <Form form={form} onSubmit={onSubmit} className="space-y-6">
        <ControlledPasswordField
          name="currentPassword"
          label="Kata sandi saat ini"
          className="my-4"
          rules={{
            required: 'Masukkan kata sandi Anda saat ini.',
            pattern: {
              value: PASSWORD_ALLOWED_CHARS_PATTERN,
              message: PASSWORD_ALLOWED_CHARS_MESSAGE,
            },
          }}
          autoComplete="new-password"
        />
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
          label="Konfirmasikan kata sandi baru"
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
              validateNotSameAsCurrent: (value) => {
                return (
                  value !== form.getValues('currentPassword') ||
                  'Tidak boleh menggunakan kata sandi lama.'
                );
              },
            },
          }}
          autoComplete="new-password"
        />
        <PasswordRequirements validation={validation} className="mb-6" />
        <div className="flex gap-4 flex-wrap sm:flex-nowrap flex-col-reverse sm:flex-row">
          <Button size="lg" variant="secondary" className="w-full" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" size="lg" className="w-full" loading={isLoading}>
            Simpan kata sandi
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
