import type { ArticleStatus } from '@/shared/types/types';

export interface Attachment {
  id: string;
  url: string;
  filename: string;
  contentType: string;
  size: number;
  createdAt: string;
}

export interface ContentResponse {
  id: string;
  title: string;
  description: string;
  complexity: number;
  name?: string;
  previewUrl?: string;
  status: ArticleStatus;
  approveId?: string;
  createdAt?: string;
  creatorId: string;
  errorComment?: string | null;
  topics: string[];
  firstName?: string;
  alreadyVote?: string;
  vote: string;
  lastName?: string;
  commentCount?: number;
  AttachedFile?: { fileId: string; link: string; id: string }[];
  Creator: {
    createdAt: string;
    avatarUrl: string;
    email: string;
    iconUrl: string;
    id: string;
    isDeleted: boolean;
    isVerified: boolean;
    nickname: string;
    role: string;
  };
}

export interface ContentData {
  title?: string;
  description?: string;
  complexity?: number;
  name?: string;
  id?: string;
  status?: string;
}
