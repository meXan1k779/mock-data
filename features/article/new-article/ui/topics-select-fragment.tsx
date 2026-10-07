import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, type RootState } from '@/shared/api/store';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { ColumnsIcon } from '@/shared/icons/columnsIcon';
import { CupIcon } from '@/shared/icons/cupIcon';
import { KnowledgeIcon } from '@/shared/icons/knowledgeIcon';
import { TabWithIcon } from '@/shared/ui/TabWithIcon/ui';
import { Button } from '@/shared/ui/button';
import { Tab } from '@/shared/ui/tab/ui/tab';
import { mockTopicksList } from '@/widgets/topics/ui/constants';

import { useGetMyContentByIdQuery, useUpdateContentMutation } from '../api/article-api';
import { setEditorComplexity, setEditorTopics } from '../models/article-slice';

const levelsData = [
  { title: 'Untuk pemula', value: 1, icon: <KnowledgeIcon />, isSelected: false },
  {
    title: 'Untuk trader tingkat lanjut',
    value: 2,
    icon: <ColumnsIcon className="h-6 w-6" />,
    isSelected: false,
  },
  { title: 'Untuk ahli', value: 3, icon: <CupIcon className="h-6 w-6" />, isSelected: false },
];

const AVAILABLE_LIMIT = 3;

export const TopicsSelectFragment = () => {
  const [topics, setTopics] = useState(mockTopicksList);

  const [levels, setLevels] = useState(levelsData);
  const dispatch = useAppDispatch();

  const params = useParams();
  const articleId = params?.id as string;

  const { data } = useGetMyContentByIdQuery(articleId, {
    skip: !articleId,
    refetchOnMountOrArgChange: true,
  });

  const router = useRouter();
  const [updateContent, { isLoading }] = useUpdateContentMutation();

  const user = useSelector((state: RootState) => state.auth.user);

  const { trackPageview } = useAnalytics();

  useEffect(() => {
    trackPageview(`new-article/topics/${articleId}`, user);
  }, []);

  useEffect(() => {
    if (data?.topics?.length) {
      // Initializing local selection state from freshly-fetched server data.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTopics(
        mockTopicksList.map((item) => ({
          ...item,
          isSelected: data?.topics.includes(item.title),
        })),
      );
    }

    if (data?.complexity) {
      setLevels(
        levelsData.map((item) => ({ ...item, isSelected: item.value === data.complexity })),
      );
    }
  }, [data?.topics]);

  const isLevelSelcted = levels.some((item) => !!item.isSelected);
  const topicsSelected = topics.filter((item) => item.isSelected).map((item) => item.title);

  const selectedLevel = levels.find((level) => level.isSelected)?.value;

  const handleSelectLevel = (title: string) => {
    setLevels((prev) =>
      prev.map((item) =>
        item.title === title ? { ...item, isSelected: true } : { ...item, isSelected: false },
      ),
    );
  };

  const isMaxTopicsSelected = topics.filter((item) => item.isSelected).length === AVAILABLE_LIMIT;

  const handleSelect = (title: string) => {
    setTopics((prev) => {
      const isTopicsLimit = prev.filter((item) => item.isSelected).length === AVAILABLE_LIMIT;
      const selectedItems = prev.filter((item) => item.isSelected);

      if (isTopicsLimit && !selectedItems.some((item) => item.title === title)) {
        return prev;
      }
      return prev.map((item) =>
        item.title === title ? { ...item, isSelected: !item.isSelected } : item,
      );
    });
  };

  const handleContinue = async () => {
    const articleData = {
      ...data,
      complexity: selectedLevel!,
      topics: topicsSelected,
    };
    try {
      dispatch(setEditorTopics(topicsSelected));
      dispatch(setEditorComplexity(selectedLevel!));

      await updateContent(articleData).unwrap();
      router.replace(`/new-article/${articleId}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="m-auto max-w-[700px] pt-8 2xl:pt-10 px-3 md:px-0 sm:px-5 ">
      <p className="text-[20px] md:text-2xl lg:text-[28px]  font-manrope font-bold mb-6">
        Pilih hingga 3 topik
      </p>
      <div>
        <p className="font-semibold mb-2">Memulai trading di Finex</p>
        <div className="flex flex-wrap mb-4">
          {topics.slice(0, 5).map(({ title, isSelected, icon }) => (
            <Tab
              title={title}
              key={title}
              isDisabled={isMaxTopicsSelected}
              isSelected={isSelected}
              onClick={() => handleSelect(title)}
              className="mr-2 mb-2"
              icon={icon}
            />
          ))}
        </div>
      </div>
      <div className="mb-2">
        <p className="font-semibold mb-2">Meningkatkan keterampilan trading</p>
        <div className="flex flex-wrap ">
          {topics.slice(5, 11).map(({ title, isSelected, icon }) => (
            <Tab
              title={title}
              key={title}
              isDisabled={!isSelected && isMaxTopicsSelected}
              isSelected={isSelected}
              onClick={() => handleSelect(title)}
              className="mr-2 mb-2"
              icon={icon}
            />
          ))}
        </div>
      </div>
      <p className="text-[20px] md:text-2xl lg:text-[28px] font-manrope font-bold mb-6 mt-12">
        Untuk siapa artikel ini?
      </p>
      <div className="mb-13 flex flex-col space-y-2 md:space-y-0 md:flex-row justify-between w-full space-x-3">
        {levels.map((item) => (
          <TabWithIcon {...item} key={item.title} onClick={() => handleSelectLevel(item.title)} />
        ))}
      </div>
      <Button
        onClick={handleContinue}
        loading={isLoading}
        size="lg"
        className="w-full sm:w-fit mb-4"
        disabled={!(isLevelSelcted && topicsSelected.length)}
      >
        Lanjutkan
      </Button>
    </div>
  );
};
