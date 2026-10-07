import type { SVGProps } from 'react';

export const ColumnsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.33"
        d="M14 13.334H2M6.667 10.667v-4a1.333 1.333 0 0 0-2.667 0v4M12 10.666V4a1.333 1.333 0 0 0-2.667 0v6.666"
      />
    </svg>
  );
};
