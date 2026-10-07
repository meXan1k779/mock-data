'use client';

import { useParams } from 'next/navigation';

import { PathDetailPage } from '@/features/learning-paths/ui/path-detail-page';

export default function LearningPathRoute() {
  const params = useParams();
  const pathId = params?.id as string;

  return <PathDetailPage pathId={pathId} />;
}
