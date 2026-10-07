import clsx from 'clsx';

interface SpinnerProps {
  size: 'sm' | 'md' | 'lg';
}

export const Spinner = ({ size }: SpinnerProps) => {
  const sizeClass = {
    sm: 'w-3 h-3',
    md: 'w-[18px] h-[18px]',
    lg: 'w-[18px] h-[18px]',
  }[size];

  return (
    <svg
      className={clsx(sizeClass, 'animate-spin')}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="31.4"
        strokeDashoffset="0"
        fill="none"
      />
    </svg>
  );
};
