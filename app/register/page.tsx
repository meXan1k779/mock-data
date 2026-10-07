import { RegisterForm } from '@/features/auth/ui/register-form';

export default function RegisterPage() {
  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8">
      <title>Finex kita - registration</title>
      <div className="bg-white sm:p-8 m-auto mt-[72px] w-full max-w-[524px] rounded-2xl">
        <div className="text-center">
          <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] mb-6 text-content-primary font-bold font-manrope">
            Selamat datang di&nbsp;Finex&nbsp;Kita
          </h2>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
