'use client';

import React, { useState, forwardRef } from 'react';

import { CrossIcon } from '@/shared/icons/crossIcon';

export interface FloatingLabelInputProps {
  label?: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string | { message?: string };
  success?: boolean;
  warning?: boolean;
  helperText?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  autoComplete?: string;
  maxLength?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  placeholder?: string;
  ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  id?: string;
}

export const TextField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FloatingLabelInputProps
>(
  (
    {
      label,
      name,
      type = 'text',
      value,
      onChange,
      onFocus,
      onBlur,
      required = false,
      disabled = false,
      readOnly = false,
      error,
      helperText,
      className = '',
      inputClassName = '',
      labelClassName = '',
      autoComplete,
      maxLength,
      prefix,
      suffix,
      variant = 'default',
      placeholder,
      id: externalId,
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const id = externalId || `field-${name}`;

    const isFloating = isFocused || value !== '';
    const isTextarea = type === 'textarea';

    const errorMessage = typeof error === 'string' ? error : error?.message;

    const variantStyles = {
      default: 'bg-white border',
      filled: 'bg-gray-50 border-b border-t-0 border-l-0 border-r-0 rounded-none',
      outlined: 'bg-transparent border',
    };

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e.target.value);
    };

    const getStatusColors = () => {
      if (errorMessage) {
        return {
          border: 'border-base-negative focus:border-base-negative',
          ring: 'focus:ring-red-100',
          hover: 'hover:border-red-400',
        };
      }
      if (isFocused) {
        return {
          border: 'border-base-link focus:border-base-link',
          hover: 'hover:border-blue-400',
        };
      }
      return {
        border: 'border-gray-300',
        hover: 'hover:border-gray-400',
      };
    };

    const colors = getStatusColors();

    const InputComponent = isTextarea ? 'textarea' : 'input';

    return (
      <div className={`relative ${className}`}>
        <div
          className="relative"
          onMouseEnter={() => !disabled && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {prefix && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">{prefix}</div>
          )}
          <InputComponent
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={ref as any}
            id={id}
            name={name}
            type={isTextarea ? undefined : type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            autoComplete={autoComplete}
            maxLength={maxLength}
            rows={isTextarea ? 3 : undefined}
            className={`font-manrope w-full h-14 px-3 ${label ? 'pt-6' : 'pt-2'} pb-2 border rounded-xl bg-white text-gray-900 text-base transition-all duration-300 ease-out
            focus:outline-none focus:border-2 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed read-only:bg-gray-50 read-only:cursor-default
            ${variantStyles[variant]}
            ${colors.border}
            ${isHovered && !isFocused && !disabled ? colors.hover : ''}
            ${prefix ? 'pl-10' : ''}
            ${suffix ? 'pr-10' : ''}
            ${inputClassName}
          `}
            style={{
              transform: isFocused ? 'translateY(1px)' : 'translateY(0)',
            }}
          />

          {suffix && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">{suffix}</div>
          )}

          {label && (
            <label
              htmlFor={id}
              className={`
            font-manrope
            absolute
            left-3
            pointer-events-none
            transition-all
            duration-300
            ease-out
            origin-left
            bg-white
            px-1
            font-medium
            text-content-tetriary
            ${disabled ? 'text-gray-400' : ''}
            ${isFloating ? 'top-2 text-xs' : 'top-1/2 text-base transform -translate-y-1/2'}
            ${prefix && isFloating ? 'left-10' : ''}
            ${labelClassName}
          `}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>

        {(errorMessage || helperText) && (
          <div className="flex justify-between items-start mt-1">
            <div
              className={`text-sm flex items-center ${errorMessage ? 'text-extansion-negative' : 'text-content-tetriary'}`}
            >
              {!helperText && <CrossIcon className="mr-1.5 text-extansion-negative" />}{' '}
              {errorMessage || helperText}
            </div>
          </div>
        )}
      </div>
    );
  },
);
