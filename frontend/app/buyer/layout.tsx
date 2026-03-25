'use client';
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { useUser } from '@/hooks';
import { SIDEBAR_CONFIGS } from '@/lib/sidbar-configs';

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const user = useUser();

  return (
    <DashboardLayout
      links={SIDEBAR_CONFIGS.buyer.links}
      role="buyer"
      userName={user?.name}
      walletBalance={user?.walletBalance}
      searchPlaceholder="Search produce, locations…"
    >
      {children}
    </DashboardLayout>
  );
}