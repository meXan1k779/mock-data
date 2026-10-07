import React from 'react';

import { CheckIcon } from '@/shared/icons/checkIcon';

export interface CustomCheckboxProps {
  checked: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  id?: string;
}

export const CustomCheckbox = ({
  checked = true,
  onChange,
  hasError = false,
  disabled = false,
  className = '',
  label,
  ...props
}: CustomCheckboxProps) => {
  const getCheckboxClasses = () => {
    let baseClasses = `
      absolute top-0 left-0 w-5 h-5 rounded-sm 
      flex items-center justify-center
      transition-all duration-200 ease-in-out
      border
    `;

    if (checked) {
      baseClasses += ' bg-base-positive border-base-positive';
    } else if (hasError) {
      baseClasses += ' border-base-negative bg-[#FFECEC]';
    } else {
      baseClasses += ' bg-white border-[#CFD4DD]';
    }

    if (!disabled) {
      baseClasses += ' hover:opacity-80';
    }

    return baseClasses;
  };

  return (
    <label
      className={`
        inline-flex items-center relative w-5 h-5
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${className}
      `}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="absolute opacity-0 w-0 h-0"
        {...props}
      />
      <span className={getCheckboxClasses()}>{checked && <CheckIcon />}</span>
      {label && <span className="ml-7">{label}</span>}
    </label>
  );
};
