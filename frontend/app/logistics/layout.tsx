'use client';
import { DashboardLayout } from '@/components/dashboard/layout';
import { useUser } from '@/hooks';
import { SIDEBAR_CONFIGS } from '@/lib/sidbar-configs';

export default function LogisticsLayout({ children }: { children: React.ReactNode }) {
  const user = useUser();
  return (
    <DashboardLayout
      links={SIDEBAR_CONFIGS.logistics.links}
      role="logistics"
      userName={user?.name ?? 'Driver'}
      walletBalance={user?.walletBalance}
      searchPlaceholder="Search loads, routes…"
    >
      {children}
    </DashboardLayout>
  );
}