import type { SVGProps } from 'react';

export const LoaderIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{
        animation: 'spin 2s linear infinite',
        transformOrigin: 'center',
      }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 9C0 4.02944 4.02944 0 9 0C9.55229 0 10 0.447715 10 1C10 1.55228 9.55229 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16C12.866 16 16 12.866 16 9C16 8.44772 16.4477 8 17 8C17.5523 8 18 8.44772 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z"
        fill="#111928"
      />
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </svg>
  );
};
