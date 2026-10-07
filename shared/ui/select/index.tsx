import React, { useState, useId, useRef, useEffect } from 'react';

import { ChevronLeftIcon } from '@/shared/icons/chevronLeftIcon';

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string | { message?: string };
  helperText?: string;
  className?: string;
  selectClassName?: string;
  labelClassName?: string;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  options,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  helperText,
  className = '',
  selectClassName = '',
  labelClassName = '',
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const errorMessage = typeof error === 'string' ? error : error?.message;
  const isFloating = isFocused || value !== '';

  const selectedOption = options.find((opt) => opt.value === value);

  const handleToggle = () => {
    if (!disabled && !readOnly) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        onFocus?.();
        setIsFocused(true);
      } else {
        onBlur?.();
        setIsFocused(false);
      }
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  const variantStyles = {
    default: 'bg-white border',
    filled: 'bg-gray-50 border-b border-t-0 border-l-0 border-r-0 rounded-none',
    outlined: 'bg-transparent border',
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

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        className="relative"
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {name && <input type="hidden" name={name} value={value} />}

        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`
            font-manrope w-full h-14 px-3 ${label ? 'pt-6' : 'pt-2'} pb-2
            pr-10 border rounded-xl bg-white text-gray-900 text-base
            transition-all duration-300 ease-out text-left
            focus:outline-none focus:border-2 disabled:bg-gray-100 disabled:text-gray-500
            disabled:cursor-not-allowed read-only:bg-gray-50 read-only:cursor-default
            ${variantStyles[variant]}
            ${colors.border}
            ${isHovered && !isFocused && !disabled ? colors.hover : ''}
            ${selectClassName}
          `}
          style={{
            transform: isFocused ? 'translateY(1px)' : 'translateY(0)',
          }}
        >
          <span
            className={`block truncate ${!selectedOption && placeholder ? 'text-content-tetriary' : ''}`}
          >
            {selectedOption ? selectedOption.label : placeholder || ''}
          </span>
        </button>

        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronLeftIcon
            color="#9FA5B2"
            className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-270'}`}
          />
        </div>

        {label && (
          <label
            htmlFor={id}
            className={`
              font-manrope absolute left-3 pointer-events-none transition-all duration-300
              ease-out origin-left bg-white px-1 font-medium text-content-tetriary
              ${disabled ? 'text-gray-400' : ''}
              ${isFloating ? 'top-2 text-xs' : 'top-1/2 text-base transform -translate-y-1/2'}
              ${labelClassName}
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>

      {(errorMessage || helperText) && (
        <div className="flex justify-between items-start mt-2">
          <div
            className={`text-sm ${errorMessage ? 'text-extansion-negative' : 'text-content-tetriary'}`}
          >
            {errorMessage || helperText}
          </div>
        </div>
      )}

      {isOpen && !disabled && !readOnly && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto p-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              disabled={option.disabled}
              className={`
                w-full text-left px-4 py-3 text-sm hover:bg-gray-100 rounded-lg
                ${option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
