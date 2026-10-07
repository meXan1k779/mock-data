export const mockTopicksList: {
  title: string;
  isSelected: boolean;
  icon?: string;
  iconClassName?: string;
}[] = [
  {
    title: 'Pendaftaran dan masuk',
    isSelected: false,
    icon: '/category-icons/registration-login.svg',
  },
  { title: 'Verifikasi akun', isSelected: false, icon: '/category-icons/account-verification.svg' },
  {
    title: 'Deposit dan penarikan',
    isSelected: false,
    icon: '/category-icons/deposits-withdrawals.svg',
  },
  {
    title: 'Platform trading Finex',
    isSelected: false,
    icon: '/category-icons/trading-platform.svg',
  },
  { title: 'Dasar-dasar trading', isSelected: false, icon: '/category-icons/trading-basics.svg' },
  { title: 'Analisis Trading', isSelected: false, icon: '/category-icons/technical-analysis.svg' },
  { title: 'Alat trading', isSelected: false, icon: '/category-icons/trading-tools.svg' },
  { title: 'Manajemen risiko', isSelected: false, icon: '/category-icons/risk-management.svg' },
  {
    title: 'Emosi & Psikologi Trading',
    isSelected: false,
    icon: '/category-icons/shkala-kontrolya.svg',
    iconClassName: 'w-6 h-6',
  },
  { title: 'Lainnya', isSelected: false, icon: '/category-icons/other.svg' },
];
