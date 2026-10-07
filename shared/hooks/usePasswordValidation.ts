import { useState, useMemo, useCallback } from 'react';

import type { PasswordValidation } from '../ui/password-requirements';

export const usePasswordValidation = (password: string) => {
  const validity = useMemo(
    () => ({
      length: password.length >= 8 && password.length <= 20,
      hasDigit: /\d/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
    }),
    [password],
  );

  const [showErrors, setShowErrors] = useState(false);

  const [prevPassword, setPrevPassword] = useState(password);
  if (password !== prevPassword) {
    setPrevPassword(password);
    setShowErrors(false);
  }

  const validation = useMemo<PasswordValidation['validation']>(
    () => ({
      length: { isError: showErrors && !validity.length, isValid: validity.length },
      hasDigit: { isError: showErrors && !validity.hasDigit, isValid: validity.hasDigit },
      hasLowercase: {
        isError: showErrors && !validity.hasLowercase,
        isValid: validity.hasLowercase,
      },
      hasUppercase: {
        isError: showErrors && !validity.hasUppercase,
        isValid: validity.hasUppercase,
      },
    }),
    [validity, showErrors],
  );

  const isValid =
    validity.length && validity.hasDigit && validity.hasLowercase && validity.hasUppercase;

  const setValidationErrors = useCallback(() => {
    setShowErrors(true);
  }, []);

  return { validation, setValidationErrors, isValid };
};
