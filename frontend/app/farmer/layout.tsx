'use client';
import React from 'react';
import { useUser } from '@/hooks';
import { SIDEBAR_CONFIGS } from '@/lib/sidbar-configs';
import { DashboardLayout } from '@/components/dashboard/layout';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const user = useUser();

  return (
    <DashboardLayout
      links={SIDEBAR_CONFIGS.farmer.links}
      role="farmer"
      userName={user?.name ?? 'Farmer'}
      walletBalance={user?.walletBalance}
      searchPlaceholder="Search your listings…"
    >
      {children}
    </DashboardLayout>
  );
}