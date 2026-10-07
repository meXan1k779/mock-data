import { getInitialContent } from '@/features/article/new-article/api/get-initial-content';
import { Home } from '@/widgets/home/ui';

export const dynamic = 'force-dynamic';

// "Cara Gampang Sambungkan Akun Kamu ke MT5"'s own cover is a blurry Play Store
// screenshot that looks out of place in the "Artikel terbaru" list next to the
// others' proper photography/illustration — borrow another article's nicer cover
// for display here (the link still goes to the real article). Pulled from the
// same already-fetched page-0 list below, so the swapped-in URL is always
// freshly signed rather than a hardcoded (and expiring) S3 link.
const LOW_QUALITY_COVER_ARTICLE_ID = '4ad6352f-d046-4f02-8c03-0bec9b9e2da9';
const BETTER_COVER_SOURCE_ARTICLE_ID = '19219679-7b07-40a4-9069-5445a180d144';

export default async function HomePage() {
  const initialCards = await getInitialContent();
  const betterCover = initialCards.find(
    (card) => card.id === BETTER_COVER_SOURCE_ARTICLE_ID,
  )?.previewUrl;

  const latestArticles = initialCards.slice(0, 3).map((card) =>
    card.id === LOW_QUALITY_COVER_ARTICLE_ID && betterCover
      ? { ...card, previewUrl: betterCover }
      : card,
  );

  return <Home latestArticles={latestArticles} />;
}
