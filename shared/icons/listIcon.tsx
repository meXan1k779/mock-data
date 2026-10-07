import type { SVGProps } from 'react';

export const ListIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path stroke="#111928" strokeLinecap="round" strokeWidth="2" d="M10 7h9M10 12h9M10 17h9" />
    <circle
      cx="5"
      cy="7"
      r="1"
      fill="#111928"
      stroke="#111928"
      strokeLinecap="round"
      strokeWidth="1.33"
    />
    <circle
      cx="5"
      cy="12"
      r="1"
      fill="#111928"
      stroke="#111928"
      strokeLinecap="round"
      strokeWidth="1.33"
    />
    <circle
      cx="5"
      cy="17"
      r="1"
      fill="#111928"
      stroke="#111928"
      strokeLinecap="round"
      strokeWidth="1.33"
    />
  </svg>
);
