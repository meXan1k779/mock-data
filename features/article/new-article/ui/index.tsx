import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/shared/api/store';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { ChevronLeftIcon } from '@/shared/icons/chevronLeftIcon';

import { ARTICLE_EDITOR_LABELS } from './constants';

const TiptapEditor = dynamic(() => import('@/shared/ui/tiptap-editor/index'), {
  ssr: false,
});

export const NewArticle = () => {
  const router = useRouter();
  const params = useParams();
  const articleId = params?.article as string;

  const user = useSelector((state: RootState) => state.auth.user);

  const { trackPageview } = useAnalytics();

  useEffect(() => {
    trackPageview(`new-article/${articleId}`, user);
  }, []);

  const handlePreviewClick = () => {
    router.replace(`/new-article/preview/${articleId}`);
  };

  return (
    <div className="flex items-start max-w-[1200px] m-auto">
      <div
        className="hidden fixed 2xl:flex items-center cursor-pointer mt-13"
        onClick={() => router.replace(`/new-article/topics/${articleId}`)}
      >
        <ChevronLeftIcon className="mr-2" />
        <span className="text-sm">Topik</span>
      </div>
      <TiptapEditor />
      <div
        onClick={handlePreviewClick}
        className="hidden fixed right-[calc((100vw-1200px)/2)] 2xl:flex items-center cursor-pointer mt-13"
      >
        <span className="mr-2 text-sm">{ARTICLE_EDITOR_LABELS.preview}</span>
        <ChevronLeftIcon className="rotate-180" />
      </div>
    </div>
  );
};
