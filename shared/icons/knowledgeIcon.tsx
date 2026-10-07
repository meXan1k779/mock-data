import type { SVGProps } from 'react';

export const KnowledgeIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} viewBox="0 0 24 24" width="24" height="24" fill="none">
      <path
        stroke="#111928"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m4 10 8-4 8 4-8 4-8-4ZM20 10v4"
      />
      <path
        stroke="#111928"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 12v5s.455 2 5 2c4.546 0 5-2 5-2v-5"
      />
    </svg>
  );
};
