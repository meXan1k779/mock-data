import clsx from 'clsx';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { Spinner } from '@/shared/icons/spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  loader?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      loading = false,
      loader,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = loading || disabled;

    const content = (
      <>
        {loading ? (loader ?? <Spinner size={size} />) : leftIcon}
        {children}
        {!loading && rightIcon}
      </>
    );

    return (
      <button
        ref={ref}
        className={clsx(
          'btn',
          `cursor-pointer whitespace-nowrap btn--${variant}`,
          `btn--${size}`,
          loading && 'btn--loading',
          className,
        )}
        disabled={isDisabled}
        {...props}
      >
        <span className="btn-content inline-flex items-center gap-2">{content}</span>
      </button>
    );
  },
);
