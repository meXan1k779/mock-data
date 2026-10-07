'use client';

import clsx from 'clsx';
import type { SetStateAction } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';

import { ChevronLeftIcon } from '@/shared/icons/chevronLeftIcon';
import { Tab } from '@/shared/ui/tab/ui/tab';

interface Topics {
  title: string;
  isSelected: boolean;
  icon?: string;
  iconClassName?: string;
}

interface Props {
  setTopics: (value: SetStateAction<Topics[]>) => void;
  className?: string;
  topics: Topics[];
}

const Topics = ({ topics, setTopics, className }: Props) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const updateArrowsVisibility = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  const handleScroll = useCallback(() => {
    updateArrowsVisibility();
  }, [updateArrowsVisibility]);

  const scrollLeft = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }
    container.scrollBy({ left: -container.clientWidth * 0.8, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }
    container.scrollBy({ left: container.clientWidth * 0.8, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    updateArrowsVisibility();
    window.addEventListener('resize', updateArrowsVisibility);
    return () => window.removeEventListener('resize', updateArrowsVisibility);
  }, [updateArrowsVisibility]);

  const handleSelect = (title: string) => {
    setTopics((prev) =>
      prev.map((item) => (item.title === title ? { ...item, isSelected: !item.isSelected } : item)),
    );
  };

  return (
    <div
      className={clsx(
        className,
        'pt-4 bg-background-primary rounded-2xl max-h-22 sm:w-[97%] xl:w-[95%] md:max-h-full relative overflow-visible -mr-4 ml-8 sm:ml-8 sm:mr-2 -left-6',
      )}
    >
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className="absolute -left-2 md:-left-2 top-9 -translate-y-1/2 px-3 py-2.5  md:px-4 md:py-3.5 bg-white rounded-full shadow-[0_3px_7px_rgba(17,25,40,0.12)] z-10"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute  -right-2 md:-right-2 top-9 -translate-y-1/2 px-3 py-2.5 md:px-4 md:py-3.5 bg-white rounded-full shadow-[0_3px_7px_rgba(17,25,40,0.12)] z-10"
          aria-label="Scroll right"
        >
          <ChevronLeftIcon className="rotate-180" />
        </button>
      )}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex items-center md:max-h-10 overflow-x-scroll scrollbar-hide justify-start"
      >
        {topics.map(({ title, isSelected, icon, iconClassName }) => (
          <Tab
            title={title}
            key={title}
            isSelected={isSelected}
            onClick={() => handleSelect(title)}
            className="mr-2 menu-item mb-2 md:mb-0 shrink-0"
            icon={icon}
            iconClassName={iconClassName}
          />
        ))}
      </div>
    </div>
  );
};

export default Topics;
