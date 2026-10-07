export interface NotificationItem {
  id: string;
  type: 'article' | 'social' | 'system';
  isNew: boolean;
  title: string;
  description: string;
  time: string;
}

export const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'article',
    isNew: true,
    title: 'Your article has passed moderator review',
    description: 'Risk Management: The 2% Rule is now pending regulatory review.',
    time: '3 hours ago',
  },
  {
    id: '2',
    type: 'social',
    isNew: true,
    title: 'New comment on your article',
    description:
      'budi_santoso: "Insightful points! The 2% rule really helps manage risk effectively..."',
    time: '1 hour ago',
  },
  {
    id: '3',
    type: 'article',
    isNew: true,
    title: 'Your article has passed moderator review',
    description: 'Risk Management: The 2% Rule is now pending regulatory review.',
    time: '3 hours ago',
  },
  {
    id: '4',
    type: 'system',
    isNew: false,
    title: 'Your account password was just changed.',
    description: "If this wasn't you, secure your account immediately.",
    time: '1 hour ago',
  },
  {
    id: '5',
    type: 'system',
    isNew: false,
    title: 'Your account password was just changed.',
    description: "If this wasn't you, secure your account immediately.",
    time: '1 hour ago',
  },
  {
    id: '6',
    type: 'social',
    isNew: false,
    title: 'New comment on your article',
    description:
      'budi_santoso: "Insightful points! The 2% rule really helps manage risk effectively..."',
    time: '1 hour ago',
  },
  {
    id: '7',
    type: 'social',
    isNew: false,
    title: 'New comment on your article',
    description:
      'budi_santoso: "Insightful points! The 2% rule really helps manage risk effectively..."',
    time: '1 hour ago',
  },
  {
    id: '8',
    type: 'social',
    isNew: false,
    title: 'New comment on your article',
    description:
      'budi_santoso: "Insightful points! The 2% rule really helps manage risk effectively..."',
    time: '1 hour ago',
  },
];
