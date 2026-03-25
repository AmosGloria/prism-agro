'use client';
import React, { useState } from 'react';
import type { SidebarLink, UserRole } from '@/types';
import { DashboardNavbar } from './header';
import { Sidebar } from './sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  links: SidebarLink[];
  role: UserRole;
  userName?: string;
  walletBalance?: number;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export function DashboardLayout({
  children,
  links,
  role,
  userName,
  walletBalance,
  searchPlaceholder,
  onSearch,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <Sidebar
        links={links}
        role={role}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        userName={userName}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <DashboardNavbar
          userName={userName}
          walletBalance={walletBalance}
          role={role}
          onMenuToggle={() => setMobileOpen(v => !v)}
          menuOpen={mobileOpen}
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
        />

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}