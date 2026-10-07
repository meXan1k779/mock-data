import clsx from 'clsx';
import type { ReactNode } from 'react';

import { InfoCircleIcon } from '@/shared/icons/infoCircleIcon';
import { PositiveCheckmarkIcon } from '@/shared/icons/positiveCheckmarkIcon';

interface Props {
  className?: string;
  children: ReactNode;
  type: 'info' | 'positive';
}

export const BackgroundPlate = ({ className, children, type }: Props) => {
  const getTypeClasses = () => {
    switch (type) {
      case 'info': {
        return { class: 'bg-[#E3F2FD]', icon: <InfoCircleIcon color="#3C95FB" /> };
      }
      case 'positive': {
        return { class: 'bg-[#EFFCEF]', icon: <PositiveCheckmarkIcon /> };
      }
    }
  };

  const typeClasses = getTypeClasses();

  return (
    <div
      className={clsx(
        className,
        `${typeClasses.class} p-4 rounded-xl flex items-start text-sm pr-16`,
      )}
    >
      <div className="mr-2.5 mt-0.5">{typeClasses.icon}</div>
      {children}
    </div>
  );
};
