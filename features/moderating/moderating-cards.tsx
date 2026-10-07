import { FinexLoader } from '@/shared/icons/finexLoader';
import { ModeratingCard } from '@/shared/ui/moderating-card';
import { Tabs } from '@/shared/ui/tabs/ui';

import type { ContentResponse } from '../article/new-article/api/types';

interface Props {
  data?: ContentResponse[];
  handleTabChange: (num: number) => void;
  activeTab: number;
  isLoading: boolean;
}

export const ModeratingCards = ({ data, handleTabChange, activeTab, isLoading }: Props) => {
  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="shrink-0">
        <Tabs
          tabs={['Perlu peninjauan', 'Dikirim ke regulator', 'Perubahan diminta']}
          defaultActive={0}
          onTabChange={handleTabChange}
        />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        {isLoading && <FinexLoader className="mx-auto mt-16" size={32} />}
        {!isLoading && (
          <div className="mt-4">
            {data?.map((item) => (
              <ModeratingCard {...item} key={item.id} isInteractive={activeTab === 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
