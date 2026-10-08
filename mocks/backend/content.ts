import type {
  Attachment,
  ContentData,
  ContentResponse,
} from '@/features/article/new-article/api/types';
import { ArticleStatus } from '@/shared/types/types';

import { countComments } from './comments';
import { genId, readDb, writeDb, type MockArticle, type MockUser } from './db';
import { fileToDataUrl } from './user';
import { getStoredVote } from './votes';

export const PAGE_SIZE = 10;

export class MockNotFoundError extends Error {
  constructor() {
    super('Content not found');
  }
}

// Same ordering the real backend uses for the public feed: most votes first,
// then most views. Sorted on the stored (seed) counts rather than local votes
// so cards don't reshuffle between pages while the user is voting.
const byPopularity = (a: MockArticle, b: MockArticle) =>
  Number(b.vote) - Number(a.vote) || Number(b.views ?? 0) - Number(a.views ?? 0);

// `&topic=A&topic=B` (see shared/utils/arrayToTopicsString.tsx) — split on the
// full separator because topic names themselves can contain `&`.
const parseTopics = (topicQuery: string) => topicQuery.split('&topic=').filter(Boolean);

// The real backend returns the article snapshot with the caller's own vote
// and the live comment count merged in — do the same with local state.
const withLocalState = (article: MockArticle): ContentResponse => {
  const stored = getStoredVote(article.id);
  return {
    ...(article as unknown as ContentResponse),
    vote: stored ? String(stored.count) : article.vote,
    alreadyVote: stored && stored.status !== 'unvote' ? stored.status : undefined,
    commentCount: (article.commentCount ?? 0) + countComments(article.id),
  };
};

// Feed responses don't carry the attachment list (also keeps bookmark
// snapshots in localStorage small).
const toListItem = (article: MockArticle) => {
  const { AttachedFile: _attachments, ...rest } = withLocalState(article);
  return rest as ContentResponse;
};

export const filterPublished = (articles: MockArticle[], page: number, topicQuery = '') => {
  const topics = parseTopics(topicQuery);
  return articles
    .filter((a) => a.status === ArticleStatus.APPROVED)
    .filter((a) => topics.length === 0 || a.topics.some((t) => topics.includes(t)))
    .sort(byPopularity)
    .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
};

export const listPublished = async (page: number, topicQuery: string) => {
  const { articles } = await readDb();
  return filterPublished(articles, page, topicQuery).map(toListItem);
};

export const getPublishedById = async (id: string) => {
  const article = await writeDb(({ articles }) => {
    const found = articles.find((a) => a.id === id && a.status !== ArticleStatus.DELETED);
    if (found) {
      found.views = String(Number(found.views ?? 0) + 1);
    }
    return found;
  });
  if (!article) {
    throw new MockNotFoundError();
  }
  return withLocalState(article);
};

const findMine = (articles: MockArticle[], id: string, user: MockUser) =>
  articles.find(
    (a) => a.id === id && a.creatorId === user.id && a.status !== ArticleStatus.DELETED,
  );

export const getMyById = async (id: string, user: MockUser) => {
  const { articles } = await readDb();
  const article = findMine(articles, id, user);
  if (!article) {
    throw new MockNotFoundError();
  }
  return withLocalState(article);
};

// `status=draft&status=moderatorReview…` (see features/profile/ui/profile-page.tsx)
export const listMine = async (statusQuery: string, user: MockUser) => {
  const statuses = new URLSearchParams(statusQuery).getAll('status');
  const { articles } = await readDb();
  return articles
    .filter((a) => a.creatorId === user.id && a.status !== ArticleStatus.DELETED)
    .filter((a) => statuses.length === 0 || statuses.includes(a.status))
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .map(toListItem);
};

const toCreator = (user: MockUser) =>
  ({
    id: user.id,
    nickname: user.nickname,
    avatarUrl: user.avatarUrl,
    email: user.email,
    iconUrl: user.iconUrl ?? '',
    role: user.role,
    isDeleted: false,
    isVerified: true,
    createdAt: new Date().toISOString(),
  }) satisfies ContentResponse['Creator'];

export const createContent = async (data: ContentData, user: MockUser) => {
  const article: MockArticle = {
    id: genId(),
    title: data.title ?? '',
    description: data.description ?? '',
    complexity: data.complexity ?? 1,
    status: ArticleStatus.DRAFT,
    creatorId: user.id,
    createdAt: new Date().toISOString(),
    errorComment: null,
    topics: [],
    vote: '0',
    views: '0',
    commentCount: 0,
    previewId: null,
    previewUrl: '',
    AttachedFile: [],
    Creator: toCreator(user),
  };
  await writeDb(({ articles }) => {
    articles.push(article);
  });
  return withLocalState(article);
};

// The cover is the first image in the body, like on the real backend.
const syncPreview = (article: MockArticle) => {
  const firstImageId = /<img[^>]*alt=["']?([^"'\s>]+)/i.exec(article.description)?.[1];
  const cover = article.AttachedFile.find((f) => f.fileId === firstImageId);
  article.previewId = cover?.fileId ?? null;
  article.previewUrl = cover?.link ?? '';
};

// Callers send back the whole article they fetched (often stale — e.g. its
// AttachedFile list predates an upload), so only the editable fields are
// taken from the body, like the real PUT endpoint.
export const updateContent = async (data: ContentData & { topics?: string[] }, user: MockUser) => {
  const updated = await writeDb(({ articles }) => {
    const article = findMine(articles, data.id ?? '', user);
    if (!article) {
      return undefined;
    }
    if (data.title !== undefined) {
      article.title = data.title;
    }
    if (data.description !== undefined) {
      article.description = data.description;
    }
    if (data.complexity !== undefined) {
      article.complexity = data.complexity;
    }
    if (data.topics !== undefined) {
      article.topics = data.topics;
    }
    if (data.status !== undefined) {
      article.status = data.status as ArticleStatus;
    }
    syncPreview(article);
    return article;
  });
  if (!updated) {
    throw new MockNotFoundError();
  }
  return withLocalState(updated);
};

export const deleteContent = async (id: string, user: MockUser) => {
  const deleted = await writeDb(({ articles }) => {
    const article = findMine(articles, id, user);
    if (article) {
      article.status = ArticleStatus.DELETED;
    }
    return article;
  });
  if (!deleted) {
    throw new MockNotFoundError();
  }
  return withLocalState(deleted);
};

export const submitContent = async (id: string, user: MockUser) => {
  const submitted = await writeDb(({ articles }) => {
    const article = findMine(articles, id, user);
    if (article) {
      article.status = ArticleStatus.MODERATOR_REVIEW;
      article.errorComment = null;
    }
    return article;
  });
  if (!submitted) {
    throw new MockNotFoundError();
  }
};

// Uploaded images are stored inline as data URLs. The returned `id` is the
// fileId the editor puts into the image's alt (see shared/ui/tiptap-editor).
export const addAttachment = async (articleId: string, file: File): Promise<Attachment> => {
  const link = await fileToDataUrl(file);
  const fileId = genId();
  const createdAt = new Date().toISOString();

  await writeDb(({ articles }) => {
    const article = articles.find((a) => a.id === articleId);
    article?.AttachedFile.push({
      id: genId(),
      contentId: articleId,
      fileId,
      link,
      craatedAt: createdAt,
    });
  });

  return {
    id: fileId,
    url: link,
    filename: file.name,
    contentType: file.type,
    size: file.size,
    createdAt,
  };
};

export const deleteAttachment = (attachmentId: string) =>
  writeDb(({ articles }) => {
    articles.forEach((article) => {
      article.AttachedFile = article.AttachedFile.filter((f) => f.id !== attachmentId);
    });
  });

// --- Moderation -----------------------------------------------------------

export const listForModeration = async (status: ArticleStatus) => {
  const { articles } = await readDb();
  return articles
    .filter((a) => a.status === status)
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, 30)
    .map(toListItem);
};

export const getForModeration = async (id: string) => {
  const { articles } = await readDb();
  const article = articles.find((a) => a.id === id);
  if (!article) {
    throw new MockNotFoundError();
  }
  return withLocalState(article);
};

// moderatorReview → regulatorReview → approved (with the regulator's approval number).
export const raiseStage = (id: string, approveId?: string) =>
  writeDb(({ articles }) => {
    const article = articles.find((a) => a.id === id);
    if (!article) {
      return;
    }
    if (article.status === ArticleStatus.MODERATOR_REVIEW) {
      article.status = ArticleStatus.REGULATOR_REVIEW;
    } else if (article.status === ArticleStatus.REGULATOR_REVIEW) {
      article.status = ArticleStatus.APPROVED;
      article.approveId = approveId ?? article.approveId;
    }
  });

export const requestChanges = (id: string, comment: string) =>
  writeDb(({ articles }) => {
    const article = articles.find((a) => a.id === id);
    if (!article) {
      return;
    }
    article.status =
      article.status === ArticleStatus.REGULATOR_REVIEW
        ? ArticleStatus.REGULATOR_REJECTED
        : ArticleStatus.MODERATOR_REJECTED;
    article.errorComment = comment;
  });
