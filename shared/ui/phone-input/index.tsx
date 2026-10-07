import React from 'react';

import type { FloatingLabelInputProps } from '../text-field/text-field';
import { TextField } from '../text-field/text-field';

interface PhoneInputProps extends Omit<FloatingLabelInputProps, 'type' | 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, ...props }) => {
  const handleChange = (inputValue: string) => {
    const filtered = inputValue.replace(/[^\d+]/g, '');
    onChange(filtered);
  };

  const externalError = typeof props.error === 'string' ? props.error : props.error?.message;
  const finalError = externalError;

  return (
    <TextField {...props} type="tel" value={value} onChange={handleChange} error={finalError} />
  );
};
