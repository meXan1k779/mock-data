import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import DOMPurify from 'dompurify';

import { Avatar } from '@/shared/ui/avatar';
import { LevelBadge } from '@/shared/ui/level-badge';

interface Props {
  complexity: number;
  topics?: string[];
  title?: string;
  createdAt?: string | null;
  descriptionWithImg?: string;
  nickname?: string;
  avatarUrl?: string;
}

export const ArticlePreview = ({
  complexity,
  topics,
  title,
  createdAt,
  descriptionWithImg,
  nickname,
  avatarUrl,
}: Props & {
  descriptionWithImg: string;
}) => {
  const time =
    createdAt &&
    formatDistanceToNow(createdAt, {
      addSuffix: true,
      locale: localeId, // id - локаль индонезия
    });

  return (
    <div>
      <div className="font-manrope text-[28px] sm:text-[32px] md:text-[40px] font-bold mb-4 leading-12">
        {title}
      </div>
      <div className="flex items-center flex-wrap mb-5 sm:mb-6 gap-1">
        <LevelBadge level={complexity} />
        {topics?.map((topic) => (
          <div
            key={topic}
            className="text-xs text-base-tech px-2 py-1 rounded-sm inline-block bg-background-secondary"
          >
            {topic}
          </div>
        ))}
      </div>
      <div className="flex items-center mb-3">
        <Avatar nickname={nickname} avatarUrl={avatarUrl} size="lg" />
        <div className="text-sm text-content-secondary mx-2">{nickname}</div>
        {time && <div className="text-sm text-content-tetriary">• {time}</div>}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(descriptionWithImg) }}
        className="mb-10 my-img tiptap"
      ></div>
    </div>
  );
};
