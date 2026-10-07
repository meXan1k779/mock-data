import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  duration?: number;
  children: React.ReactNode;
}

const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
  ({ open, children, duration = 300, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'grid transition-[grid-template-rows] ease-in-out bg-background-warning',
          className,
        )}
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          transitionDuration: `${duration}ms`,
          ...style,
        }}
        {...props}
      >
        <div className="min-h-0 overflow-hidden">{children}</div>
      </div>
    );
  },
);

Collapse.displayName = 'Collapse';

export default Collapse;
