import type { SVGProps } from 'react';

export const CupIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.33" d="M11 12.541H5" />
      <path
        fill="#093375"
        d="M8.665 11.207a.665.665 0 1 1-1.33 0h1.33Zm-.665 0h-.665V9.54h1.33v1.667H8Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.33"
        d="M7 5.207h2M3.667 8.54s-1.333-1-1.333-2.666V4.54a1.333 1.333 0 1 1 2.667 0v.667M12.333 8.54s1.333-1 1.333-2.666V4.54a1.333 1.333 0 1 0-2.667 0v.667"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.33"
        d="M11 6.447V3.874c0-.736-.597-1.333-1.333-1.333H6.333C5.597 2.541 5 3.138 5 3.874v2.573c0 .892.446 1.724 1.187 2.219l1.443.962c.224.15.516.15.74 0l1.443-.962A2.667 2.667 0 0 0 11 6.447Z"
      />
    </svg>
  );
};
