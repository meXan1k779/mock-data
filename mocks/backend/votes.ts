// Votes on articles/videos, kept in localStorage (synchronous — the video
// pages read it during render to seed their initial vote display).
// `currentVote` is the count already shown in the UI — it seeds the local
// count the first time this id is voted on, so the number increments from
// what the user already saw rather than jumping to some unrelated value.
const STORAGE_KEY = 'useberry-votes';

export type VoteStatus = 'upvote' | 'downvote' | 'unvote';

export interface VoteRecord {
  count: number;
  status: VoteStatus;
}

const statusValue = (status: VoteStatus) =>
  status === 'upvote' ? 1 : status === 'downvote' ? -1 : 0;

const readVotes = (): Record<string, VoteRecord> => {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
};

const writeVotes = (votes: Record<string, VoteRecord>) => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
};

export const getStoredVote = (id: string): VoteRecord | undefined => readVotes()[id];

export const castVote = (id: string, status: VoteStatus, currentVote?: string) => {
  const votes = readVotes();
  const existing = votes[id];
  const baseline = existing ? existing.count : Number(currentVote ?? 0) || 0;
  const prevStatus = existing?.status ?? 'unvote';
  const nextCount = Math.max(0, baseline + statusValue(status) - statusValue(prevStatus));

  votes[id] = { count: nextCount, status };
  writeVotes(votes);
  return nextCount;
};
