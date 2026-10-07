import clsx from 'clsx';
import React, { useState } from 'react';

import { ChevronLeftIcon } from '@/shared/icons/chevronLeftIcon';

import Collapse from '../../collapse/ui';

interface AccordionProps {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  className?: string;
  duration?: number;
}

export const Accordion: React.FC<AccordionProps> = ({
  label,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  className,
  duration = 300,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleToggle = () => {
    const newOpen = !isOpen;
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onToggle?.(newOpen);
  };

  const buttonPaddingBottom = isOpen ? '4px' : '16px';

  return (
    <div
      className={clsx('border border-border-warning rounded-lg bg-background-warning', className)}
    >
      <button
        onClick={handleToggle}
        className="flex justify-between items-center w-full text-left font-medium focus:outline-none"
        style={{
          paddingTop: '16px',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: buttonPaddingBottom,
          transition: `padding-bottom ${duration}ms ease`,
        }}
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <ChevronLeftIcon
          className="transition-transform duration-300 -rotate-90"
          style={{ transitionDuration: `${duration}ms` }}
        />
      </button>

      <Collapse open={isOpen} duration={duration}>
        <div className="p-4 pt-0">{children}</div>
      </Collapse>
    </div>
  );
};
