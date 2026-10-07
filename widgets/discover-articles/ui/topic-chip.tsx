import clsx from 'clsx';

import type { mockTopicksList } from '@/widgets/topics/ui/constants';

interface TopicChipProps {
  topic: (typeof mockTopicksList)[number];
  isSelected: boolean;
  onToggle: () => void;
}

export function TopicChip({ topic, isSelected, onToggle }: TopicChipProps) {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        'flex items-center gap-2 h-10 pl-1 pr-4 rounded-full text-left transition-colors',
        isSelected
          ? 'bg-content-primary text-background-primary'
          : 'bg-background-secondary text-content-primary hover:opacity-85',
      )}
    >
      <span className="flex items-center justify-center size-8 bg-white rounded-full shrink-0 overflow-hidden">
        {topic.icon && (
          <img
            src={topic.icon}
            alt=""
            className={clsx(topic.iconClassName ?? 'w-4 h-4', 'object-contain')}
          />
        )}
      </span>
      <span className="text-base">{topic.title}</span>
    </button>
  );
}
