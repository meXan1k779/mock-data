import type { SVGProps } from 'react';

export const MoratarBoardIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" fill="none" {...props}>
      <path
        stroke="#0E3010"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.33"
        d="M2.667 6.333 8 3.666l5.334 2.667L8 9 2.667 6.333ZM13.333 6.333V9"
      />
      <path
        stroke="#0E3010"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.33"
        d="M4.667 7.667V11S4.97 12.333 8 12.333c3.03 0 3.334-1.333 3.334-1.333V7.667"
      />
    </svg>
  );
};
