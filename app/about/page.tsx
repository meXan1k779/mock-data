import { Suspense } from 'react';

import { AboutForm } from '@/features/auth/ui/about-form';

export default function AboutPage() {
  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white sm:p-8 m-auto mt-[72px] w-full max-w-[524px] rounded-2xl">
        <Suspense>
          <AboutForm />
        </Suspense>
      </div>
    </div>
  );
}
