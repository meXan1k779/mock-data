import type { SVGProps } from 'react';

export const BookmarkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.5 2.5h9a.5.5 0 0 1 .5.5v10.764a.25.25 0 0 1-.382.213L8 11.103l-4.618 2.874A.25.25 0 0 1 3 13.764V3a.5.5 0 0 1 .5-.5Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
  </svg>
);

export const BookmarkFilledIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.5 2.5h9a.5.5 0 0 1 .5.5v10.764a.25.25 0 0 1-.382.213L8 11.103l-4.618 2.874A.25.25 0 0 1 3 13.764V3a.5.5 0 0 1 .5-.5Z"
      fill="currentColor"
    />
  </svg>
);
