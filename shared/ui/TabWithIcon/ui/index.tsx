import clsx from 'clsx';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  badge?: number;
  isSelected: boolean;
  className?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export const TabWithIcon = ({ title, isSelected, className, onClick, icon }: Props) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        className,
        'rounded-2xl cursor-pointer border border-content-tetriary hover:bg-background-secondary flex flex-col items-center w-full py-5',
        isSelected && 'bg-background-secondary',
      )}
    >
      {icon}
      <div>{title}</div>
    </div>
  );
};
