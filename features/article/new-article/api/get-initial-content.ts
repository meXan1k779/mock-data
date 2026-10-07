import type { ContentResponse } from './types';

function getServerBaseUrl(): string {
  const raw = process.env.BASE_API_URL ?? '';
  return raw.replace(/\/+$/, '');
}

export async function getInitialContent(): Promise<ContentResponse[]> {
  const base = getServerBaseUrl();
  if (!base) {
    return [];
  }

  try {
    const res = await fetch(`${base}/api/content?page=0`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return [];
    }

    const data = (await res.json()) as unknown;
    return Array.isArray(data) ? (data as ContentResponse[]) : [];
  } catch {
    return [];
  }
}
