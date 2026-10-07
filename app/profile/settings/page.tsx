'use client';

import { SettingsPage } from '@/features/settings/ui';
import { withAuth } from '@/shared/hocs/with-auth';

const ProtectedSettingsPage = withAuth(SettingsPage);

export default function Profile() {
  return <ProtectedSettingsPage />;
}
