import type { ContentResponse } from '@/features/article/new-article/api/types';
import { FinexLoader } from '@/shared/icons/finexLoader';
import { Card } from '@/shared/ui/card/card';
import { DraftCard } from '@/shared/ui/draft-card/ui';
import { Tabs } from '@/shared/ui/tabs/ui';

import { EmptyBlock } from './empty-block';

interface Props {
  data?: ContentResponse[];
  handleTabChange: (num: number) => void;
  activeTab: number;
  isLoading: boolean;
}

export const CardsBlock = ({ data, handleTabChange, activeTab, isLoading }: Props) => {
  const emptyText =
    activeTab === 1 ? 'Belum ada artikel yang dipublikasikan' : 'Draf Anda akan muncul di sinii';
  const emptyDescription =
    activeTab === 1
      ? 'Buat dan publikasikan artikel pertama Anda atau selesaikan draf yang ada.'
      : 'Buat artikel, tinjau masukan, dan edit sebelum dipublikasikan.';

  return (
    <div>
      <div className="pb-20">
        <Tabs
          key={activeTab}
          tabs={['Draf', 'Dipublikasikan']}
          defaultActive={activeTab}
          onTabChange={handleTabChange}
        />
        {isLoading && (
          <FinexLoader
            className="fixed top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
            size={32}
          />
        )}
        {!isLoading && (
          <div className="mt-4">
            {activeTab === 1 &&
              data?.map((item) => (
                <Card
                  className="border-b border-border-tetriary"
                  {...item}
                  key={item.id}
                  isEditable
                />
              ))}
            {activeTab === 0 &&
              data?.map((item) => <DraftCard className="" {...item} key={item.id} />)}
          </div>
        )}
        {!data?.length && !isLoading && (
          <EmptyBlock text={emptyText} description={emptyDescription} />
        )}
      </div>
    </div>
  );
};
