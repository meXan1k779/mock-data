import React, { useId } from 'react';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  error?: string | { message?: string };
  helperText?: string;
  className?: string;
  radioClassName?: string;
  labelClassName?: string;
  optionLabelClassName?: string;
  optionsGapClassName?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  options,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  radioClassName = '',
  labelClassName = '',
  optionLabelClassName = '',
  optionsGapClassName = '',
  orientation = 'vertical',
}) => {
  const id = useId();
  const groupName = name || id;

  const errorMessage = typeof error === 'string' ? error : error?.message;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const defaultGap =
    orientation === 'vertical' ? 'flex flex-col space-y-4' : 'flex flex-wrap gap-4';
  const containerClasses = `
    ${optionsGapClassName || defaultGap}
    ${className}
  `;

  const getRadioClasses = (isChecked: boolean, isDisabled: boolean) => {
    if (isDisabled) {
      return 'bg-gray-100 border-gray-300 cursor-not-allowed';
    }

    if (isChecked) {
      return 'bg-base-positive border-base-positive';
    }
    return 'bg-white border border-[#CFD4DD]';
  };

  return (
    <div className="relative">
      <fieldset>
        {label && (
          <legend
            className={`
              font-manrope mb-2 block text-sm font-medium text-content-primary
              ${disabled ? 'text-gray-400' : ''}
              ${labelClassName}
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </legend>
        )}

        <div className={containerClasses}>
          {options.map((option) => {
            const optionId = `${groupName}-${option.value}`;
            const isChecked = value === option.value;
            const isDisabled = disabled || option.disabled;

            return (
              <label
                key={option.value}
                htmlFor={optionId}
                className={`
                  inline-flex items-center cursor-pointer
                  ${isDisabled ? 'cursor-not-allowed opacity-60' : ''}
                  ${radioClassName}
                `}
              >
                <input
                  type="radio"
                  id={optionId}
                  name={groupName}
                  value={option.value}
                  checked={isChecked}
                  onChange={handleChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  disabled={isDisabled}
                  required={required}
                  className="sr-only"
                />

                <div
                  className={`
                    relative flex items-center justify-center
                    w-5 h-5 rounded-full transition-colors duration-150
                    ${getRadioClasses(isChecked, !!isDisabled)}
                    ${errorMessage ? 'border-red-500 ring-1 ring-red-500' : ''}
                  `}
                >
                  {isChecked && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" aria-hidden="true" />
                  )}
                </div>

                <span className={`ml-2 ${optionLabelClassName || 'text-sm text-gray-700'}`}>
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>

        {(errorMessage || helperText) && (
          <div className="mt-2">
            <p className={`text-sm ${errorMessage ? 'text-red-600' : 'text-gray-500'}`}>
              {errorMessage || helperText}
            </p>
          </div>
        )}
      </fieldset>
    </div>
  );
};
