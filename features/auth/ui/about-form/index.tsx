'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useAppDispatch } from '@/shared/api/store';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { ControlledRadioGroup } from '@/shared/ui/radio-group/controlled-radoi-group';
import { ControlledTextField } from '@/shared/ui/text-field/controlled-text-field';

import { useUpdateUserMutation, useVerifyMutation } from '../../api/auth-api';
import { setCredentials } from '../../models/auth-slice';

interface AboutFrom {
  name: string;
  experience: string;
}

export const AboutForm = () => {
  const form = useForm<AboutFrom>({
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      experience: '',
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const code = searchParams?.get('code');
  const email = searchParams?.get('email');

  const [verifyAccount] = useVerifyMutation();
  const [saveUserData] = useUpdateUserMutation();

  const options = [
    { value: 'Di bawah 1 tahun', label: 'Di bawah 1 tahun' },
    { value: 'Lebih dari 1 tahun', label: 'Lebih dari 1 tahun' },
  ];

  const onSubmit = async (values: AboutFrom) => {
    if (code && email) {
      try {
        const response = await verifyAccount({ verifyCode: code, email });
        if (response?.data?.refreshToken) {
          dispatch(
            setCredentials({
              user: null,
              refreshToken: response.data?.refreshToken,
              accessToken: response.data?.accessToken,
            }),
          );
        }
        await saveUserData({
          nickname: values.name,
          experience: values.experience,
          accessToken: response.data?.accessToken,
        });

        router.push('/');
      } catch (e) {
        console.error(e);
        form.setError('name', { message: 'Nama pengguna tidak tersedia. Coba yang lain.' });
      }
    }
  };

  return (
    <>
      <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] mb-6 text-content-primary text-center font-bold font-manrope">
        Ceritakan tentang Anda
      </h2>
      <p className="font-meduim mb-2">Buat nama pengguna unik untuk Finex Kita.</p>
      <Form form={form} onSubmit={onSubmit} className="space-y-6">
        <ControlledTextField name="name" label="Nama pengguna" className="mb-6" />
        <p className="font-medium mb-2">
          Sudah berapa lama Anda trading? <span className="text-base-negative">*</span>
        </p>
        <ControlledRadioGroup
          options={options}
          name="experience"
          orientation="horizontal"
          className="sm:gap-30"
          rules={{
            required: 'Pilih tingkat pengalaman Anda.',
          }}
        />
        <Button type="submit" className="w-full mt-6" size="lg">
          Lanjutkan
        </Button>
      </Form>
    </>
  );
};
