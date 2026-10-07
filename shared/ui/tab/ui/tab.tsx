import clsx from 'clsx';
import { memo } from 'react';

interface Props {
  title: string;
  badge?: number;
  isSelected: boolean;
  className?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  icon?: string;
  iconClassName?: string;
}

export const Tab = memo(
  ({ title, isSelected, onClick, className, badge, isDisabled, icon, iconClassName }: Props) => {
    const tabBackground = isDisabled
      ? 'bg-background-secondary text-content-black-diabled'
      : 'bg-background-secondary text-content-primary';
    return (
      <button
        onClick={onClick}
        className={clsx(
          className,
          'flex items-center gap-2 whitespace-nowrap',
          icon
            ? 'pl-1 pr-4 py-1 rounded-full'
            : 'py-1.5 px-3 text-sm md:text-[16px] md:py-2 md:px-4 rounded-lg',
          isDisabled ? '' : 'hover:opacity-85',
          isSelected ? 'bg-content-primary text-background-primary' : tabBackground,
        )}
      >
        {icon && (
          <span className="flex items-center justify-center w-8 h-8 bg-white rounded-full shrink-0 overflow-hidden">
            <img src={icon} alt="" className={clsx(iconClassName ?? 'w-4 h-4', 'object-contain')} />
          </span>
        )}
        <span className={icon ? 'text-sm md:text-[16px]' : undefined}>{title}</span>
        <span
          className={clsx(
            'text-[8px] pt-0.5 ml-1',
            isSelected ? 'text-background-primary' : 'text-content-tetriary',
          )}
        >
          {badge}
        </span>
      </button>
    );
  },
  (prevProps, nextProps) => {
    const shouldRerender =
      prevProps.title !== nextProps.title ||
      prevProps.isSelected !== nextProps.isSelected ||
      prevProps.isDisabled !== nextProps.isDisabled ||
      prevProps.className !== nextProps.className ||
      prevProps.icon !== nextProps.icon ||
      prevProps.iconClassName !== nextProps.iconClassName;

    return !shouldRerender;
  },
);
