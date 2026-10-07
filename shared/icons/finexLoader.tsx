interface FinexLoaderProps {
  size?: number;
  className?: string;
}

export const FinexLoader = ({ size = 32, className }: FinexLoaderProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <style>{`
        @keyframes finex-top {
          0%, 19.28% { fill: #109F12; }
          25%, 100%  { fill: #F5F7FA; }
        }
        @keyframes finex-right {
          0%, 19.28%   { fill: #F5F7FA; }
          25%, 44.28%  { fill: #109F12; }
          50%, 100%    { fill: #F5F7FA; }
        }
        @keyframes finex-bottom {
          0%, 44.28%  { fill: #F5F7FA; }
          50%, 69.28% { fill: #109F12; }
          75%, 100%   { fill: #F5F7FA; }
        }
        @keyframes finex-left {
          0%, 69.28%  { fill: #F5F7FA; }
          75%, 94.28% { fill: #109F12; }
          100%        { fill: #F5F7FA; }
        }
      `}</style>
      <path
        d="M7.2474 14.0782L1.91406 8.7449L10.6663 0H21.333L7.2474 14.0782"
        style={{ animation: 'finex-top 1.4s linear infinite' }}
      />
      <path
        d="M17.9219 7.25911L23.2552 1.92578L31.9952 10.6658V21.3324L17.9219 7.25911"
        style={{ animation: 'finex-right 1.4s linear infinite' }}
      />
      <path
        d="M10.6719 31.9986H21.3385L30.0589 23.2708L24.7256 17.9375L10.6719 31.9986"
        style={{ animation: 'finex-bottom 1.4s linear infinite' }}
      />
      <path
        d="M14.066 24.73L8.73263 30.0634L0 21.3307V10.6641L14.066 24.73"
        style={{ animation: 'finex-left 1.4s linear infinite' }}
      />
      <path
        d="M15.9863 9.20119L9.17969 16.0078L15.9863 22.8144L22.7929 16.0078L15.9863 9.20119"
        fill="#FBC02D"
      />
    </svg>
  );
};
