import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

import { type RootState } from '@/shared/api/store';
import { EditIcon } from '@/shared/icons/editIcon';
import { Avatar } from '@/shared/ui/avatar';

export const PersonalInfo = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="relative mb-6 py-8 px-4 md:px-8 rounded-3xl shadow-[0_8px_34px_0_rgba(0,0,0,0.08)] flex flex-col items-center mt-8 md:mt-10 2xl:mt-10">
      <Avatar nickname={user?.nickname} avatarUrl={user?.avatarUrl} size="xl" className="mb-2" />
      <span
        onClick={() => router.push('/profile/settings')}
        className="absolute right-8 top-8 h-10 w-10 bg-secondary-default rounded-full flex items-center justify-center cursor-pointer"
      >
        <EditIcon />
      </span>
      <div className="mb-2 font-bold font-manrope text-[28px] md:text-[32px] 2xl:text-[40px] text-content-primary leading-12">
        {user?.nickname}
      </div>
      <div className="text-content-primary mb-4 text-center">{user?.aboutYou}</div>
      <div className="flex max-w-[500px] w-full">
        <div className="flex-1 px-2 flex items-center flex-col">
          {' '}
          {/* flex-1 для равной ширины */}
          <div className="text-[18px] text-content-primary font-semibold">{user?.Content}</div>
          <div className="text-content-secondary text-[14px]">Dipublikasikan</div>
        </div>
        <div className="flex-1 px-2 flex items-center flex-col">
          <div className="text-[18px] text-content-primary font-semibold">{user?.views}</div>
          <div className="text-content-secondary text-[14px]">Tampilan</div>
        </div>
        <div className="flex-1 px-2 flex items-center flex-col">
          <div className="text-[18px] text-content-primary font-semibold">{user?.votes}</div>
          <div className="text-content-secondary text-[14px]">Upvote</div>
        </div>
      </div>
    </div>
  );
};
