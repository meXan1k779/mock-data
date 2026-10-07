import type { SVGProps } from 'react';

export const LinkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} width="16" height="16" fill="none">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.33"
      d="M9.646 6.354 6.352 9.648"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.33"
      d="m11.295 8.824 1.647-1.647a2.912 2.912 0 0 0-4.118-4.118L7.177 4.706m-2.47 2.47L3.058 8.825a2.912 2.912 0 1 0 4.118 4.118l1.647-1.647"
    />
  </svg>
);
