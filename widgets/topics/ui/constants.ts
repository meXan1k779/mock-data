export const mockTopicksList: {
  title: string;
  isSelected: boolean;
  icon?: string;
  iconClassName?: string;
}[] = [
  {
    title: 'Pendaftaran dan Masuk',
    isSelected: false,
    icon: '/category-icons/registration-login.svg',
  },
  { title: 'Verifikasi Akun', isSelected: false, icon: '/category-icons/account-verification.svg' },
  {
    title: 'Deposit dan Penarikan',
    isSelected: false,
    icon: '/category-icons/deposits-withdrawals.svg',
  },
  {
    title: 'Platform Trading Finex',
    isSelected: false,
    icon: '/category-icons/trading-platform.svg',
  },
  { title: 'Dasar-Dasar Trading', isSelected: false, icon: '/category-icons/trading-basics.svg' },
  { title: 'Analisis Trading', isSelected: false, icon: '/category-icons/technical-analysis.svg' },
  { title: 'Alat Trading', isSelected: false, icon: '/category-icons/trading-tools.svg' },
  { title: 'Manajemen Risiko', isSelected: false, icon: '/category-icons/risk-management.svg' },
  {
    title: 'Emosi dan Psikologi Trading',
    isSelected: false,
    icon: '/category-icons/shkala-kontrolya.svg',
    iconClassName: 'w-6 h-6',
  },
  { title: 'Lainnya', isSelected: false, icon: '/category-icons/other.svg' },
];
