'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import type { ContentResponse } from '@/features/article/new-article/api/types';
import { LoginModal } from '@/features/auth/ui/login-modal';
import { learningPaths } from '@/features/learning-paths/model/constants';
import { PathCard } from '@/features/learning-paths/ui/path-card';
import { EmptyBlock } from '@/features/main/empty-block';
import { TradingVideosSection } from '@/features/trading-videos/ui/trading-videos-section';
import type { RootState } from '@/shared/api/store';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card/card';

import { OpinionCard } from './opinion-card';
import { ShareKnowledgeCard } from './share-knowledge-card';

interface HomeProps {
  latestArticles: ContentResponse[];
}

export function Home({ latestArticles }: HomeProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const { trackPageview } = useAnalytics();

  useEffect(() => {
    trackPageview('/', user);
  }, []);

  return (
    <div>
      <title>Finex kita</title>
      <section>
        <div className="container xl:px-0 max-w-[1200px]">
          <div className="grid grid-cols-1 2md:grid-cols-[minmax(0,1fr)_auto] gap-6 2md:gap-20 px-4 md:px-8 xl:px-0 pb-[88px]">
            <div className="min-w-0">
              <div className="mt-5 md:mt-6 lg:mt-10 mb-8 lg:mb-10">
                <h1 className="font-noto font-semibold text-[18px] leading-[24px] md:font-manrope md:text-[20px] md:leading-[28px] lg:font-noto lg:text-[24px] lg:leading-[32px] text-content-primary mb-0.5 lg:mb-1">
                  Jalur belajar Anda
                </h1>
                <p className="text-content-primary text-sm leading-5 md:text-base md:leading-6 mb-4 lg:mb-5">
                  Koleksi artikel pilihan untuk menguasai skill trading langkah demi langkah
                </p>
                <div className="grid grid-cols-3 gap-1 sm:gap-3 2md:gap-4">
                  {learningPaths.map((path) => (
                    <PathCard key={path.id} path={path} />
                  ))}
                </div>
              </div>

              <TradingVideosSection />

              <div className="relative z-10 flex items-center justify-between sm:-mb-4">
                <h2 className="font-noto font-semibold text-[18px] leading-[24px] md:font-manrope md:text-[20px] md:leading-[28px] lg:font-noto lg:text-[24px] lg:leading-[32px] text-content-primary">
                  Artikel terbaru
                </h2>
                <Button variant="text" size="sm" onClick={() => router.push('/discover')}>
                  Lihat semua artikel
                </Button>
              </div>

              {latestArticles.length > 0 ? (
                <>
                  <div className="flex flex-col">
                    {latestArticles.map((article, i) => (
                      <div key={article.id} className="contents">
                        <Card {...article} showReadingTime isPriority={i === 0} />
                        {i === 0 && (
                          <>
                            <div className="py-2 2md:hidden">
                              <ShareKnowledgeCard className="w-full" />
                            </div>
                            {/* No self-margin here: the macket's 24px gap already equals
                                Card's own py-6 on each side, so a bare border line lands
                                exactly on the macket's spacing with nothing extra added.
                                Mobile/tablet use the banner above as the visual separator
                                instead — this divider only appears once that's hidden at
                                2md+. */}
                            <div className="hidden 2md:block border-t border-border-tetriary" />
                          </>
                        )}
                        {i === 1 && latestArticles.length > 2 && (
                          <div className="border-t border-border-tetriary" />
                        )}
                        {i === 2 && (
                          <div className="py-2 2md:hidden">
                            <OpinionCard className="w-full" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full mt-2 2md:-mt-2"
                    onClick={() => router.push('/discover')}
                  >
                    Lihat semua artikel
                  </Button>
                </>
              ) : (
                <EmptyBlock />
              )}
            </div>

            <div className="hidden 2md:block">
              <div className="sticky top-[108px] mt-4 md:mt-6 lg:mt-10 flex flex-col gap-3">
                <ShareKnowledgeCard className="w-[326px]" />
                <OpinionCard className="w-[326px]" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <LoginModal />
    </div>
  );
}
