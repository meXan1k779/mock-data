'use client';

import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { ControlledTextField } from '@/shared/ui/text-field/controlled-text-field';

import type { UpdateProfileData, UserProfile } from '../models/profile-types';

interface ProfileFormProps {
  profile: UserProfile;
}

export const ProfileForm = ({ profile }: ProfileFormProps) => {
  const form = useForm<UpdateProfileData>({
    defaultValues: {
      email: profile.email,
      username: profile.username,
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthDate: profile.birthDate,
    },
  });

  // TO DO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (data: UpdateProfileData) => {
    // update profile
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ControlledTextField
          name="firstName"
          label="Имя"
          rules={{
            required: 'Имя обязательно',
            minLength: {
              value: 2,
              message: 'Имя должно содержать минимум 2 символа',
            },
          }}
        />
        <ControlledTextField
          name="lastName"
          label="Фамилия"
          rules={{
            required: 'Фамилия обязательна',
            minLength: {
              value: 2,
              message: 'Фамилия должна содержать минимум 2 символа',
            },
          }}
        />
      </div>
      <ControlledTextField
        name="username"
        label="Никнейм"
        rules={{
          required: 'Никнейм обязателен',
          minLength: {
            value: 3,
            message: 'Никнейм должен содержать минимум 3 символа',
          },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: 'Никнейм может содержать только буквы, цифры и нижнее подчеркивание',
          },
        }}
      />
      <ControlledTextField
        name="email"
        label="Email"
        type="email"
        rules={{
          required: 'Email обязателен',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Введите корректный email адрес',
          },
        }}
      />
      <Button type="submit" disabled={!form.formState.isDirty} className="w-full md:w-auto">
        Сохранить изменения
      </Button>
    </Form>
  );
};
