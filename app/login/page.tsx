import { LoginForm } from '@/features/auth/ui/login-form';

export default function LoginPage() {
  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8">
      <title>Finex kita - login </title>
      <div className="bg-white sm:p-8 m-auto mt-[72px] w-full max-w-[524px] rounded-2xl">
        <div className="text-center">
          <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] mb-6 text-content-primary font-manrope font-bold">
            Masuk ke Finex Kita
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
