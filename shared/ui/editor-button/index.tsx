import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export const EditorButton = ({ children, onClick, className }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`text-center w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 mr-1 ${className}`}
    >
      {children}
    </button>
  );
};
