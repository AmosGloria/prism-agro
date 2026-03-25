'use client';

import { DashboardLayout } from "@/components/dashboard/layout";
import { SIDEBAR_CONFIGS } from "@/lib/sidbar-configs";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      links={SIDEBAR_CONFIGS.admin.links}
      role="admin"
      userName="Super Admin"
      searchPlaceholder="Search users, orders, disputes…"
    >
      {children}
    </DashboardLayout>
  );
}