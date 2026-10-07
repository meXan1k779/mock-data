'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { useUpdateUserMutation } from '@/features/auth/api/auth-api';
import type { RootState } from '@/shared/api/store';
import { cityOptions } from '@/shared/constants/cities';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useUnsavedChanges } from '@/shared/hooks/useUnsavedChanges';
import { Button } from '@/shared/ui/button';
import { ControlledDateInput } from '@/shared/ui/date-input/controlled-date-input';
import { Form } from '@/shared/ui/form';
import { ControlledPhoneInput } from '@/shared/ui/phone-input/controlled-phone-input';
import { PhotoUpload } from '@/shared/ui/photo-uploader';
import { ControlledRadioGroup } from '@/shared/ui/radio-group/controlled-radoi-group';
import { ControlledSelect } from '@/shared/ui/select/controlled-select';
import { ControlledTextField } from '@/shared/ui/text-field/controlled-text-field';
import { validateBirthDate } from '@/shared/utils/dateValidation';

import type { FormValues } from '../types';

import { AccountSettings } from './account-settings';
import { UnsavedChangesModal } from './unsaved-changes-modal';

export const SettingsPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [saveUserData] = useUpdateUserMutation();

  const getDefaultValues = (): FormValues => ({
    userName: user?.nickname || '',
    about: user?.aboutYou || '',
    phoneNumber: user?.phoneNumber || '',
    birthDate: user?.birthDate || '',
    gender: user?.gender || '',
    city: user?.city || '',
  });

  const form = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: getDefaultValues(),
  });

  const [initialValues, setInitialValues] = useState<FormValues>(getDefaultValues());
  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    const newDefaultValues = getDefaultValues();
    // Обновляем форму и референс только если данные реально изменились
    if (JSON.stringify(newDefaultValues) !== JSON.stringify(initialValues)) {
      form.reset(newDefaultValues);
      // Bookkeeping tied to the form.reset() external-system sync above, not derived render state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitialValues(newDefaultValues);
    }
  }, [user, form]);

  const hasBasicChanges =
    watchedValues.userName !== initialValues.userName ||
    watchedValues.about !== initialValues.about;

  const hasAdditionalChanges =
    watchedValues.phoneNumber !== initialValues.phoneNumber ||
    watchedValues.birthDate !== initialValues.birthDate ||
    watchedValues.gender !== initialValues.gender ||
    watchedValues.city !== initialValues.city;

  const hasUnsavedChanges = hasBasicChanges || hasAdditionalChanges;

  const { showModal, handleLeave, handleStay } = useUnsavedChanges(hasUnsavedChanges);

  const aboutLength = watchedValues.about?.length ?? 0;

  const additionalFields = ['phoneNumber', 'birthDate', 'gender', 'city'] as const;
  const isAdditionalInfoValid = additionalFields.every(
    (field) => !form.formState.errors[field as keyof FormValues],
  );

  const genderOptions = [
    { value: 'Laki-laki', label: 'Laki-laki' },
    { value: 'Perempuan', label: 'Perempuan' },
    { value: 'Memilih untuk tidak menyebutkan', label: 'Memilih untuk tidak menyebutkan' },
  ];

  const handleSubmit = async (data: FormValues) => {
    try {
      await saveUserData({
        nickname: data.userName,
        aboutYou: data.about,
        phoneNumber: data.phoneNumber,
        birthDate: data.birthDate,
        gender: data.gender,
        city: data.city,
      });

      // После успешного сохранения синхронизируем референс
      setInitialValues({ ...data });
      form.reset(data);
    } catch (error) {
      console.error('Save failed', error);
    }
  };

  const discardBasic = () => {
    form.setValue('userName', initialValues.userName);
    form.setValue('about', initialValues.about);
  };

  const discardAdditional = () => {
    form.setValue('phoneNumber', initialValues.phoneNumber);
    form.setValue('birthDate', initialValues.birthDate);
    form.setValue('gender', initialValues.gender);
    form.setValue('city', initialValues.city);
  };

  const buttonGroupClasses = (isVisible: boolean) =>
    `flex flex-wrap gap-4 sm:mb-[12px] mb-2 transition-all duration-300 ease-out ${
      isVisible
        ? 'opacity-100 visible translate-y-0'
        : 'opacity-0 h-0 invisible -translate-y-1 pointer-events-none'
    }`;

  const { trackPageview } = useAnalytics();

  useEffect(() => {
    trackPageview('/profile/settings', user);
  }, []);

  if (!user?.id) {
    return null;
  }

  return (
    <>
      <div className="max-w-[700px] m-auto px-4 sm:px-8 lg:px-0 pt-6">
        <title>Finex kita - settings</title>
        <div className="font-manrope font-bold text-[28px] md:text-[32px] 2xl:text-[40px] mb-6 leading-12">
          Pengaturan profil
        </div>
        {user?.id && (
          <PhotoUpload className="mb-6" nickname={user?.nickname} avatarUrl={user?.avatarUrl} />
        )}
        <Form form={form} onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="font-semibold mb-2">Nama pengguna</div>
            <ControlledTextField
              rules={{
                required: 'Enter your username',
              }}
              name="userName"
              className="mb-6"
            />
            <div className="font-semibold mb-2">Tentang Anda</div>
            <ControlledTextField
              inputClassName="h-[120px]"
              type="textarea"
              name="about"
              className="mb-6"
              placeholder="Gaya trading, pengalaman, atau tujuan Anda."
              helperText={`${aboutLength}/150`}
              rules={{
                maxLength: {
                  value: 160,
                  message: 'Maximum 150 characters',
                },
              }}
              maxLength={150}
            />
            <div className={buttonGroupClasses(hasBasicChanges)}>
              <Button type="submit" size="lg">
                Simpan
              </Button>
              <Button type="button" size="lg" variant="secondary" onClick={discardBasic}>
                Batalkan
              </Button>
            </div>
          </div>
          <div>
            <div className="font-manrope font-bold text-[18px] md:text-[24px] mb-4 md:mb-5">
              Informasi tambahan
            </div>
            <div className="font-semibold mb-2">Nomor telepon</div>
            <ControlledPhoneInput
              name="phoneNumber"
              placeholder="Untuk imbalan penulisan"
              className="mb-6"
            />
            <div className="font-semibold mb-2">Tanggal lahir</div>
            <ControlledDateInput
              name="birthDate"
              className="mb-6"
              placeholder="Ketuk untuk memilih"
              rules={{
                validate: (value) => validateBirthDate(value, 18),
              }}
            />
            <div className="font-semibold mb-2">Jenis kelamin</div>
            <ControlledRadioGroup required options={genderOptions} name="gender" className="mb-6" />
            <div className="font-semibold mb-2">Kota</div>
            <ControlledSelect
              options={cityOptions}
              name="city"
              placeholder="Pilih kota"
              className="mb-6"
            />
            <div className={buttonGroupClasses(hasAdditionalChanges)}>
              <Button type="submit" size="lg" disabled={!isAdditionalInfoValid}>
                Simpan
              </Button>
              <Button type="button" size="lg" variant="secondary" onClick={discardAdditional}>
                Batalkan
              </Button>
            </div>
          </div>
        </Form>
        <AccountSettings email={user?.email} />
      </div>
      <UnsavedChangesModal isOpen={showModal} onStay={handleStay} onClose={handleLeave} />
    </>
  );
};
