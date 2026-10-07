'use client';

import clsx from 'clsx';
import { useState } from 'react';

import { EyeIcon } from '@/shared/icons/eyeIcon';
import { EyeOffIcon } from '@/shared/icons/offEyeIcon';

import { Button } from '../button';
import type { FloatingLabelInputProps } from '../text-field/text-field';
import { TextField } from '../text-field/text-field';

export type PasswordFieldProps = Omit<FloatingLabelInputProps, 'type'>;

export const PasswordField = (props: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <TextField
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={clsx('', props.className)}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="absolute right-2 top-3.5 transform h-7 w-8 p-0 border-none bg-transparent hover:bg-transparent shadow-none"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? <EyeOffIcon className="h-4 w-4 text-gray-500" /> : <EyeIcon />}
        <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
      </Button>
    </div>
  );
};
