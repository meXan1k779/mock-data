'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

import { toggleLoginModal } from '@/features/auth/models/auth-slice';
import type { RootState } from '@/shared/api/store';
import { useAppDispatch } from '@/shared/api/store';

export const ShareKnowledgeCard = ({ className }: { className?: string }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleClick = () => {
    if (!isAuthenticated) {
      dispatch(toggleLoginModal(true));
      return;
    }
    router.push('/new-article/guide');
  };

  return (
    <div className={className}>
      {/* Mobile (<sm) and desktop sidebar (2md+): image stacked above text */}
      <button
        onClick={handleClick}
        className="group relative bg-background-secondary hover:bg-secondary-default transition-colors rounded-2xl sm:rounded-3xl w-full p-2 flex sm:hidden 2md:flex flex-col items-start overflow-hidden text-left cursor-pointer"
      >
        <div className="absolute -translate-x-1/2 left-1/2 top-2 w-[239px] h-[79px] overflow-hidden pointer-events-none">
          <img
            src="/home-sidebar-v3/illustration.png"
            alt=""
            className="absolute h-full left-[-5.16%] max-w-none top-0 w-[123.44%]"
          />
          <div
            aria-hidden="true"
            className="absolute left-[30px] top-[21px] w-[2.5px] h-[16px] bg-secondary-default opacity-0 [animation:cursor-blink_1s_linear_infinite] 2md:[animation:none] 2md:group-hover:[animation:cursor-blink_1s_linear_infinite]"
          />
        </div>
        <div className="relative bg-background-primary rounded-2xl p-4 flex flex-col gap-1 w-full mt-[80px]">
          <div className="flex gap-1 items-end w-full text-content-primary">
            <p className="font-semibold text-lg leading-7">Bagikan pengetahuan Anda</p>
            <img src="/home-sidebar-v3/chevron-right.svg" alt="" className="size-6 shrink-0" />
          </div>
          <p className="text-base leading-6 text-content-primary">
            Jadilah penulis Finex Kita dan dapatkan voucer marketplace senilai{' '}
            <span className="font-semibold">Rp1.000.000,00</span> untuk setiap artikel yang
            dipublikasikan.
          </p>
        </div>
      </button>

      {/* Tablet (sm to <2md): image beside text */}
      <button
        onClick={handleClick}
        className="group hidden sm:flex 2md:hidden items-center gap-4 bg-background-secondary hover:bg-secondary-default transition-colors rounded-3xl p-2 w-full text-left cursor-pointer"
      >
        <div className="relative w-[239px] h-[79px] shrink-0 overflow-hidden pointer-events-none">
          <img
            src="/home-sidebar-v3/illustration.png"
            alt=""
            className="absolute h-full left-[-5.16%] max-w-none top-0 w-[123.44%]"
          />
          <div
            aria-hidden="true"
            className="absolute left-[30px] top-[21px] w-[2.5px] h-[16px] bg-secondary-default opacity-0 [animation:cursor-blink_1s_linear_infinite]"
          />
        </div>
        <div className="flex-1 min-w-0 bg-background-primary rounded-2xl p-4 flex flex-col gap-1">
          <div className="flex gap-1 items-end w-full text-content-primary">
            <p className="font-semibold text-lg leading-7">Bagikan pengetahuan Anda</p>
            <img src="/home-sidebar-v3/chevron-right.svg" alt="" className="size-6 shrink-0" />
          </div>
          <p className="text-base leading-6 text-content-primary">
            Jadilah penulis Finex Kita dan dapatkan voucer marketplace senilai{' '}
            <span className="font-semibold">Rp1.000.000,00</span> untuk setiap artikel yang
            dipublikasikan.
          </p>
        </div>
      </button>
    </div>
  );
};
