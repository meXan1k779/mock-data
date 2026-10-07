import { Suspense } from 'react';

import { ResetPasswordSuccessForm } from '@/features/auth/ui/reset-password-success-form';

export default function ResetPasswordSuccessPage() {
  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white sm:p-8 m-auto mt-[72px] w-full max-w-[524px] rounded-2xl">
        <Suspense>
          <ResetPasswordSuccessForm />
        </Suspense>
      </div>
    </div>
  );
}
