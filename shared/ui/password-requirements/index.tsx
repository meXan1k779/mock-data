import clsx from 'clsx';

interface ValidationRule {
  isError: boolean;
  isValid: boolean;
}

export interface PasswordValidation {
  validation: {
    length: ValidationRule;
    hasDigit: ValidationRule;
    hasLowercase: ValidationRule;
    hasUppercase: ValidationRule;
  };
  className?: string;
}

export const PasswordRequirements = ({ validation, className }: PasswordValidation) => {
  const requirements = [
    { key: 'length', value: validation.length, text: 'Gunakan 8 hingga 20 karakter' },
    { key: 'hasDigit', value: validation.hasDigit, text: 'Gunakan minimal 1 angka (0—9)' },
    { key: 'hasLowercase', value: validation.hasLowercase, text: 'Gunakan huruf kecil (a—z)' },
    { key: 'hasUppercase', value: validation.hasUppercase, text: 'Gunakan huruf besar (A—Z)' },
  ];

  return (
    <div className={className}>
      {requirements.map(({ key, value: { isValid, isError }, text }) => (
        <p
          key={key}
          className={clsx(
            'text-sm transition-colors flex items-center mt-0.5 first:mt-2',
            isError && 'text-extansion-negative',
            isValid && 'text-[#117716]',
            !isError && !isValid && 'text-content-secondary',
          )}
        >
          <span className="text-[8px] inline-block mr-2">●</span>
          {text}
        </p>
      ))}
    </div>
  );
};
