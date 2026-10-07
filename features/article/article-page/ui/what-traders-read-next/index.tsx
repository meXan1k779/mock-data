import clsx from 'clsx';

import { ArticleMiniCard } from '@/shared/ui/article-mini-card';

import { whatTradersReadNextMock } from './constants';

interface WhatTradersReadNextProps {
  className?: string;
}

export const WhatTradersReadNext = ({ className }: WhatTradersReadNextProps) => {
  if (!whatTradersReadNextMock.length) {
    return null;
  }

  return (
    <div className={clsx(className, 'flex flex-col gap-6 w-full')}>
      <p className="font-manrope font-bold text-[28px] leading-9 text-content-primary">
        Bacaan trader berikutnya
      </p>
      <div className="flex flex-col sm:flex-row gap-5 items-start w-full">
        {whatTradersReadNextMock.map((article) => (
          <ArticleMiniCard key={article.id} {...article} />
        ))}
      </div>
    </div>
  );
};
