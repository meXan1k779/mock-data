import { useState } from 'react';

interface TabsProps {
  tabs: string[];
  defaultActive?: number;
  onTabChange?: (activeIndex: number) => void;
  className?: string;
}

export const Tabs = ({ tabs, defaultActive = 0, onTabChange, className = '' }: TabsProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultActive);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    onTabChange?.(index);
  };

  return (
    <div className="@container">
      <div
        className={`flex gap-1 p-1 rounded-lg bg-background-secondary overflow-x-auto scrollbar-hide scroll-fade-x @min-[400px]:gap-3 @min-[400px]:bg-none ${className}`}
      >
        {tabs.map((label, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              className={`
                flex-1 min-w-32 whitespace-nowrap px-3 py-1.5 transition-all rounded-lg text-[14px] font-semibold
                ${isActive ? 'bg-background-primary text-content-primary' : 'text-content-black-diabled'}
              `}
              onClick={() => handleTabClick(index)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
