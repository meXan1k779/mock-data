'use client';

import type { FormHTMLAttributes } from 'react';
import type { UseFormReturn, FieldValues, SubmitHandler } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';

interface FormProps<TFieldValues extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  disabled?: boolean;
}

export function Form<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  disabled,
  children,
  ...props
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form {...props} onSubmit={disabled ? undefined : form.handleSubmit(onSubmit)} noValidate>
        <fieldset disabled={disabled} className={disabled ? 'opacity-60 cursor-not-allowed' : ''}>
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
}
