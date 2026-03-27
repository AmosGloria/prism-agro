'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface Props {
  children: React.ReactNode;
  allowedRole: string;
}

export function RoleGuard({ children, allowedRole }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role !== allowedRole && allowedRole !== 'any') {
      // Redirect to the correct dashboard
      const HOME: Record<string, string> = {
        buyer: '/buyer/marketplace',
        farmer: '/farmer/dashboard',
        logistics: '/logistics/loads',
        admin: '/admin/disputes',
      };
      router.replace(HOME[user.role] ?? '/login');
    }
  }, [user, loading, allowedRole, router]);

  if (loading || !user || (user.role !== allowedRole && allowedRole !== 'any')) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F5FFF5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#08C40E] border-t-transparent animate-spin" />
          <p className="text-sm text-[#06930A] font-medium">Loading PrismAgro...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}