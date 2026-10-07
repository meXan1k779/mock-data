import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/ui/button';

export const EmptyBlock = ({
  text,
  className,
  description,
}: {
  text: string;
  className?: string;
  description: string;
}) => {
  const router = useRouter();
  return (
    <div className={clsx(className, 'flex flex-col justify-end items-center mt-[110px]')}>
      <div className="font-manrope text-content-primary md:text-[20px] font-bold mb-3">{text}</div>
      <div className="text-content-secondary mb-6 text-center">{description}</div>
      <Button onClick={() => router.push('/new-article/guide')}>Buat artikel</Button>
    </div>
  );
};
