import { Suspense } from 'react';

import { NewPasswordForm } from '@/features/auth/ui/new-password-form';

export default function NewPasswordPage() {
  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white sm:p-8 m-auto mt-[72px] w-full max-w-[524px] rounded-2xl">
        <Suspense>
          <NewPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
