import { readDb, writeDb, type MockUser } from './db';

export const getStoredProfile = async (): Promise<MockUser | null> => (await readDb()).user;

// Persists the profile and keeps the author card on the user's own articles
// in sync with the new name/avatar.
export const saveProfile = (user: MockUser) =>
  writeDb((db) => {
    db.user = user;
    db.articles
      .filter((a) => a.creatorId === user.id)
      .forEach((a) => {
        a.Creator = { ...a.Creator, nickname: user.nickname, avatarUrl: user.avatarUrl };
      });
    return user;
  });

export const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
