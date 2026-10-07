import clsx from 'clsx';
import type { MouseEvent, ReactNode } from 'react';

export const IconWrapper = ({
  children,
  isDownVote,
  isDarkMode,
  isUpVote,
  direction,
  onClick,
}: {
  children: ReactNode;
  isDownVote: boolean;
  isDarkMode?: boolean;
  isUpVote: boolean;
  direction: string;
  onClick: (e: MouseEvent<HTMLElement>) => void;
}) => {
  return (
    <span
      onClick={onClick}
      className={clsx(
        'cursor-pointer absolute  group/vote rounded-[50%] p-2.5',
        !isUpVote && !isDownVote && !isDarkMode && 'hover:bg-secondary-default',
        isUpVote && !isDarkMode && 'hover:bg-green-5',
        isDownVote && !isDarkMode && 'hover:bg-red-5',
        direction,
      )}
    >
      {children}
    </span>
  );
};
