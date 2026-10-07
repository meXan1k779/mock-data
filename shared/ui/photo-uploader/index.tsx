import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { useUploadAvatarMutation } from '@/features/auth/api/auth-api';

import { Avatar } from '../avatar';

interface PhotoUploadProps {
  className?: string;
  avatarUrl: string;
  nickname: string;
}

export const PhotoUpload = ({ avatarUrl, nickname, className }: PhotoUploadProps) => {
  const [img, setImg] = useState<string>(avatarUrl || '');

  const [uploadAvatar] = useUploadAvatarMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0] || null;
    if (file) {
      setImg(URL.createObjectURL(file as Blob));
      uploadAvatar({ avatar: file });
    }
  };

  useEffect(() => {
    return () => {
      if (img) {
        URL.revokeObjectURL(img);
      }
    };
  }, [img]);

  const handleDeletePhoto = () => {
    setImg('');
    uploadAvatar({ avatar: '' });
  };

  return (
    <div className={clsx(className, 'flex')}>
      <Avatar nickname={nickname} avatarUrl={avatarUrl} size="xl" />
      <div className="flex flex-col items-start ml-6 relative">
        {img && (
          <div
            onClick={handleDeletePhoto}
            className="text-base-negative text-sm absolute right-2 top-2 cursor-pointer font-medium"
          >
            Hapus foto
          </div>
        )}
        <input
          type="file"
          id="photo-upload"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="photo-upload" className="cursor-pointer text-sm py-2 font-medium">
          Ganti foto
        </label>
        <p className="mt-1 text-sm text-content-secondary">JPG atau PNG, hingga 5 MB.</p>
      </div>
    </div>
  );
};
