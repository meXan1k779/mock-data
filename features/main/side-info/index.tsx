import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

import { toggleLoginModal } from '@/features/auth/models/auth-slice';
import type { RootState } from '@/shared/api/store';
import { useAppDispatch } from '@/shared/api/store';
import { Button } from '@/shared/ui/button';

export const SideInfo = ({ className }: { className?: string }) => {
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
    <div
      className={clsx(
        className,
        'bg-background-secondary rounded-3xl p-4 sm:px-8 sm:py-6 sm:min-w-[326px] mb-2 sm:mb-0',
      )}
    >
      <p className="font-semibold mb-1 text-lg">Bagikan pengetahuan Anda</p>
      <p className="mb-4">
        Jadilah penulis Finex Kita dan dapatkan voucer marketplace senilai{' '}
        <span className="font-bold">Rp1.000.000</span> untuk setiap artikel yang dipublikasikan.
      </p>
      <Button size="md" onClick={handleClick}>
        Buat artikel
      </Button>
    </div>
  );
};
