import clsx from 'clsx';
import Image from 'next/image';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
  nickname?: string;
  avatarUrl?: string;
}

export const Avatar = ({ size = 'sm', avatarUrl, nickname, onClick, className }: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-[72px] h-[72px] text-[24px]',
  };
  const sizePx = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 72,
  };
  const containerSizeClass = sizeClasses[size];

  if (!nickname) {
    return null;
  }

  return avatarUrl ? (
    <Image
      alt="avatar"
      onClick={onClick}
      width={sizePx[size]}
      height={sizePx[size]}
      src={avatarUrl}
      className={clsx(className, `${containerSizeClass} rounded-full object-cover`)}
    />
  ) : (
    <div
      onClick={onClick}
      className={clsx(
        className,
        `rounded-full ${containerSizeClass} uppercase bg-base-link text-background-primary flex items-center justify-center text-xs`,
      )}
    >
      {nickname?.[0] || 'N'}
      {nickname?.[1] || 'A'}
    </div>
  );
};
