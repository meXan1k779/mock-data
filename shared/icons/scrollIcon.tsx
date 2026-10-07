import type { SVGProps } from 'react';

export const ScrollIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" {...props}>
    <path
      fill="#fff"
      d="m8 5.334.471-.472L8 4.391l-.471.471zm-.667 8a.667.667 0 1 0 1.334 0H7.333m4.667-4 .471-.472-4-4L8 5.333l-.471.472 4 4zm-4-4-.471-.472-4 4L4 9.334l.471.47 4-4zm0 0h-.667v8h1.334v-8z"
    />
    <path stroke="#fff" strokeWidth="1.333" d="M12.668 2H3.335" />
  </svg>
);
