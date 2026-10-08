import type { ContentResponse } from '@/features/article/new-article/api/types';
import type { AuthResponse } from '@/features/auth/api/types';

// Prototype build: there is no backend — every RTK Query endpoint resolves
// against this in-browser "database" instead. It's seeded from a snapshot of
// the real backend (fixtures/articles.json, images in public/mock-assets) and
// everything the user does afterwards (new drafts, edits, uploaded images,
// profile changes) is persisted in IndexedDB, so it survives a reload.
// IndexedDB rather than localStorage because uploaded images are stored
// inline as data URLs, which would quickly blow the ~5MB localStorage quota.

export interface MockAttachedFile {
  id: string;
  contentId: string;
  fileId: string;
  link: string;
  craatedAt?: string;
}

export type MockArticle = Omit<ContentResponse, 'AttachedFile'> & {
  views?: string;
  previewId?: string | null;
  AttachedFile: MockAttachedFile[];
};

export type MockUser = AuthResponse['user'];

interface MockDb {
  version: number;
  articles: MockArticle[];
  // `null` until the profile is first edited — the auth slice's built-in
  // mock user is used until then.
  user: MockUser | null;
}

// Bump to force every browser to drop its local state and reseed (e.g. after
// re-snapshotting the fixtures).
const SEED_VERSION = 1;

const DB_NAME = 'finex-mock-backend';
const STORE_NAME = 'state';
const DB_KEY = 'db';

let idbPromise: Promise<IDBDatabase | null> | null = null;

const openIdb = (): Promise<IDBDatabase | null> => {
  if (!idbPromise) {
    idbPromise = new Promise((resolve) => {
      if (typeof indexedDB === 'undefined') {
        resolve(null);
        return;
      }
      try {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
        request.onsuccess = () => resolve(request.result);
        // Private mode / blocked storage — fall back to in-memory only.
        request.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
  return idbPromise;
};

const idbGet = async (): Promise<MockDb | undefined> => {
  const idb = await openIdb();
  if (!idb) {
    return undefined;
  }
  return new Promise((resolve) => {
    const request = idb.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(DB_KEY);
    request.onsuccess = () => resolve(request.result as MockDb | undefined);
    request.onerror = () => resolve(undefined);
  });
};

const idbSet = async (db: MockDb) => {
  const idb = await openIdb();
  if (!idb) {
    return;
  }
  await new Promise<void>((resolve) => {
    const tx = idb.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(db, DB_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
};

const createSeed = async (): Promise<MockDb> => {
  // Dynamic import keeps the ~500KB snapshot out of the main bundle — it's
  // only needed on the very first visit (or after a reset).
  const { default: articles } = await import('./fixtures/articles.json');
  return {
    version: SEED_VERSION,
    articles: structuredClone(articles) as unknown as MockArticle[],
    user: null,
  };
};

let dbPromise: Promise<MockDb> | null = null;

export const readDb = (): Promise<MockDb> => {
  if (!dbPromise) {
    dbPromise = (async () => {
      const stored = await idbGet();
      if (stored?.version === SEED_VERSION) {
        return stored;
      }
      const seed = await createSeed();
      await idbSet(seed);
      return seed;
    })();
  }
  return dbPromise;
};

// Writes are serialized so two mutations firing together (e.g. autosave +
// attachment upload) can't persist interleaved snapshots.
let writeChain: Promise<unknown> = Promise.resolve();

export const writeDb = <T>(mutate: (db: MockDb) => T): Promise<T> => {
  const run = writeChain.then(async () => {
    const db = await readDb();
    const result = mutate(db);
    await idbSet(db);
    return result;
  });
  writeChain = run.catch(() => undefined);
  return run;
};

// Wipes everything the user did and reseeds from the fixtures. Also clears
// the smaller localStorage-backed stores (votes, bookmarks, comments).
export const resetMockBackend = async () => {
  const seed = await createSeed();
  await idbSet(seed);
  dbPromise = Promise.resolve(seed);
  if (typeof window !== 'undefined') {
    ['useberry-votes', 'useberry-bookmarks', 'useberry-comments-overlay'].forEach((key) =>
      localStorage.removeItem(key),
    );
  }
};

// Small latency so loading states/skeletons still show up like with a real API.
export const simulateLatency = () => new Promise((resolve) => setTimeout(resolve, 150));

export const genId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `local-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
