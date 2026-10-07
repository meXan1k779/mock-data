import { ResetPasswordForm } from '@/features/auth/ui/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white sm:p-8 m-auto mt-[72px] w-full max-w-[524px] rounded-2xl">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
