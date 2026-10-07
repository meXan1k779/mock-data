import React from 'react';

import type { FloatingLabelInputProps } from '../text-field/text-field';
import { TextField } from '../text-field/text-field';

interface DateInputProps extends Omit<FloatingLabelInputProps, 'type' | 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
}

export const DateInput: React.FC<DateInputProps> = ({ value, onChange, ...props }) => {
  // Форматирование ввода: только цифры, автоматические точки
  const formatDateInput = (input: string): string => {
    const digits = input.replace(/\D/g, '');
    const limited = digits.slice(0, 8);
    let formatted = '';
    if (limited.length >= 3) {
      formatted += limited.slice(0, 2) + '.';
      if (limited.length >= 5) {
        formatted += limited.slice(2, 4) + '.';
        formatted += limited.slice(4, 8);
      } else {
        formatted += limited.slice(2);
      }
    } else {
      formatted = limited;
    }
    return formatted;
  };

  const handleChange = (rawValue: string) => {
    const formatted = formatDateInput(rawValue);
    onChange(formatted);
  };

  return (
    <TextField
      {...props}
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="DD.MM.YYYY"
    />
  );
};
