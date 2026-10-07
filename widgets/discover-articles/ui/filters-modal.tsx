import ReactModal from 'react-modal';

import { ModalCloseIcon } from '@/shared/icons/modalCloseIcon';
import { RadioGroup } from '@/shared/ui/radio-group';
import { mockTopicksList } from '@/widgets/topics/ui/constants';

import { SORT_OPTIONS, type SortBy } from './constants';
import { TopicChip } from './topic-chip';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTopics: string[];
  onToggleTopic: (title: string) => void;
  sortBy: SortBy;
  onChangeSort: (value: SortBy) => void;
}

export function FiltersModal({
  isOpen,
  onClose,
  selectedTopics,
  onToggleTopic,
  sortBy,
  onChangeSort,
}: FiltersModalProps) {
  return (
    <ReactModal
      className="border-none outline-0 w-full h-full bg-background-primary overflow-y-auto"
      ariaHideApp={false}
      overlayClassName="fixed inset-0 bg-background-primary z-40"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <div className="sticky top-0 z-10 bg-background-primary flex items-center gap-4 px-4 pt-4 pb-4">
        <p className="flex-1 font-manrope font-bold text-[18px] leading-6 text-content-primary">
          Filters & Sorting
        </p>
        <button
          onClick={onClose}
          className="flex items-center justify-center size-8 shrink-0"
          aria-label="Close"
        >
          <ModalCloseIcon className="size-6 text-content-tetriary" />
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-6">
        <p className="font-semibold text-sm text-content-primary">Filter by Topics</p>
        <div className="flex flex-col items-start gap-2">
          {mockTopicksList.map((topic) => (
            <TopicChip
              key={topic.title}
              topic={topic}
              isSelected={selectedTopics.includes(topic.title)}
              onToggle={() => onToggleTopic(topic.title)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-10">
        <p className="font-semibold text-sm text-content-primary">Urutkan berdasarkan</p>
        <RadioGroup
          value={sortBy}
          onChange={(value) => onChangeSort(value as SortBy)}
          options={SORT_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
          optionLabelClassName="text-base text-content-primary"
          optionsGapClassName="flex flex-col gap-3"
        />
      </div>
    </ReactModal>
  );
}
