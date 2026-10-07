import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/shared/api/store';
import { useAppDispatch } from '@/shared/api/store';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { ChevronLeftIcon } from '@/shared/icons/chevronLeftIcon';
import { FinexLoader } from '@/shared/icons/finexLoader';
import { ArticleStatus } from '@/shared/types/types';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card/card';
import { ErrorBlock } from '@/shared/ui/error';
import { Tabs } from '@/shared/ui/tabs/ui';
import { replacePlaceholdersWithImages } from '@/shared/utils/replacePlaceholdersWithImages';

import {
  useGetMyContentByIdQuery,
  useSubmitContentMutation,
} from '../../new-article/api/article-api';
import { resetEditorData, showConfirmModal } from '../../new-article/models/article-slice';

import { ArticlePreview } from './article-preview';

export const PreviewPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const params = useParams();
  const articleId = params?.id as string;
  const [submit, { isLoading: isSubmitLoading }] = useSubmitContentMutation();
  const dispatch = useAppDispatch();
  const { editorData, editorTitle, topics, complexity } = useSelector(
    (state: RootState) => state.articleSave,
  );

  const user = useSelector((state: RootState) => state.auth.user);

  const { trackPageview } = useAnalytics();

  useEffect(() => {
    trackPageview(`new-article/preview/${articleId}`, user);
  }, []);

  const router = useRouter();
  const onEdit = () => {
    router.replace(`/new-article/${articleId}`);
  };

  const isFirstRender = !!editorData || !!editorTitle;

  const { data, isLoading, isFetching, isError } = useGetMyContentByIdQuery(articleId, {
    skip: !articleId,
    refetchOnMountOrArgChange: true,
  });

  const handleSubmit = () => {
    dispatch(resetEditorData());
    submit(articleId).then(() => {
      // replace, не push — чтобы системная кнопка "назад" не возвращала
      // по шагам guide/topics/editor/preview уже отправленной статьи.
      router.replace('/');
      dispatch(showConfirmModal(true));
    });
  };

  const [descriptionWithImg, setDescription] = useState('');

  useEffect(() => {
    if (!data?.id) {
      return;
    }

    let cancelled = false;

    replacePlaceholdersWithImages(data.description || '', data.AttachedFile || [])
      .then((newDescription) => {
        if (!cancelled) {
          setDescription(newDescription);
        }
      })
      .catch((error) => {
        console.error('Ошибка загрузки изображений:', error);
      });

    return () => {
      cancelled = true;
    };
  }, [data]);

  const isEditorDataLoading = (isLoading || isFetching || !articleId) && !editorData;

  const isSubmitDisabled = !isFirstRender
    ? data?.description === '<p></p>' || !data?.title
    : editorData === '<p></p>' || !editorTitle;

  if (isError) {
    return <ErrorBlock />;
  }

  if (isEditorDataLoading) {
    return (
      <FinexLoader className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={32} />
    );
  }

  return (
    <div className="max-w-[700px] px-4 m-auto pt-3 lg:pt-10 md:px-0 h-[calc(100vh-120px)] flex flex-col">
      <Tabs
        tabs={['Artikel', 'Tampilan kartu']}
        defaultActive={0}
        onTabChange={setActiveTab}
        className="mb-6 shrink-0 mt-6 sm:mt-0"
      />
      <div className="flex-1 min-h-0 scrollbar-hide flex flex-col justify-between">
        {activeTab === 0 && (
          <ArticlePreview
            topics={topics || data?.topics}
            complexity={complexity || (data?.complexity as number)}
            title={editorTitle || data?.title}
            descriptionWithImg={editorData! || descriptionWithImg}
            nickname={user?.nickname}
            avatarUrl={user?.avatarUrl}
          />
        )}

        {activeTab === 1 && (
          <Card
            className="p-2 md:p-8 sm:shadow-[0_2px_12px_0_rgba(17,25,40,0.12)] rounded-2xl"
            topics={topics || data?.topics}
            complexity={complexity || (data?.complexity as number)}
            title={editorTitle || data?.title}
            description={editorData! || descriptionWithImg}
            Creator={{ nickname: user?.nickname }}
            previewUrl={data?.previewUrl}
            status={ArticleStatus.DRAFT}
          />
        )}
        <div className="flex flex-col-reverse sm:flex-row sm:space-x-4 shrink-0 pb-6 sm:pb-10">
          <Button className="w-full" size="lg" onClick={onEdit} variant="secondary">
            Ubah
          </Button>
          <Button
            className="w-full mb-4 sm:mb-0"
            size="lg"
            onClick={handleSubmit}
            loading={isSubmitLoading}
            disabled={isSubmitDisabled}
          >
            Kirim
          </Button>
        </div>
        <div
          className="hidden fixed 2xl:flex top-33 2xl:left-[calc((100vw-1200px)/2)] items-center cursor-pointer mt-10"
          onClick={() => router.replace(`/new-article/${articleId}`)}
        >
          <ChevronLeftIcon className="mr-2" />
          <span className="text-sm">Ubah</span>
        </div>
      </div>
    </div>
  );
};
