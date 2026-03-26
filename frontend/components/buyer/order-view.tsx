'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, MapPin, Clock, CheckCircle, AlertCircle, ChevronRight, Download, Truck } from 'lucide-react';
import { useFetch } from '@/hooks';
import { ordersApi } from '@/lib/api';
import type { Order, OrderStatus } from '@/types';
import { StatusBadge } from '@/components/ui/getStatusBadge';
import { EmptyState } from '@/components/ui/empty-state';
import { ReleaseCodeModal } from '@/components/ui/modal';
import { MOCK_ORDERS } from '@/mock-datas/farmer';
import { OrderCard } from '../ui/order-card';

// orders view 
interface OrdersViewProps {
  filterStatus?: OrderStatus | OrderStatus[];
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyDesc: string;
}

export function OrdersView({ filterStatus, title, subtitle, emptyTitle, emptyDesc }: OrdersViewProps) {
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [codeModal, setCodeModal] = useState<{ open: boolean; order: Order | null }>({ open: false, order: null });
  const [loading, setLoading] = useState(false);

  const filtered = filterStatus
    ? orders.filter(o => Array.isArray(filterStatus) ? filterStatus.includes(o.status) : o.status === filterStatus)
    : orders;

  const handleConfirmDelivery = async (code: string) => {
    if (!codeModal.order) return;
    setLoading(true);
    try {
      await ordersApi.updateStatus(codeModal.order.id, 'COMPLETED');
      // Update local state
      setCodeModal({ open: false, order: null });
    } catch (err) {
      alert('Failed to confirm delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h1>
        <p className="text-sm text-[#06930A] mt-1">{subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Orders', value: orders.length, icon: Package },
          { label: 'In Transit', value: orders.filter(o => o.status === 'IN_TRANSIT').length, icon: Truck },
          { label: 'Completed', value: orders.filter(o => o.status === 'COMPLETED').length, icon: CheckCircle },
          { label: 'Disputed', value: orders.filter(o => o.status === 'DISPUTED').length, icon: AlertCircle },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-[#E6FEE7] p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E6FEE7] flex items-center justify-center">
              <stat.icon size={18} className="text-[#08C40E]" />
            </div>
            <div>
              <p className="text-lg font-black text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</p>
              <p className="text-[10px] text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Track Shipments map placeholder */}
      {filterStatus === 'IN_TRANSIT' && filtered.length > 0 && (
        <div className="mb-6 bg-white rounded-2xl border border-[#E6FEE7] overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-[#E6FEE7] to-[#CEFDCF] flex flex-col items-center justify-center">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-sm font-semibold text-[#046207]">Live Tracking Map</p>
            <p className="text-xs text-[#06930A]">Google Maps integration — coming in production</p>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDesc}
          action={filterStatus ? undefined : { label: 'Browse Marketplace', href: '/buyer/marketplace' }}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((order, i) => (
            <div key={order.id} style={{ animationDelay: `${i * 60}ms` }}>
              <OrderCard
                order={order}
                onConfirmDelivery={order.status === 'SHIPPED'
                  ? (o) => setCodeModal({ open: true, order: o })
                  : undefined}
              />
            </div>
          ))}
        </div>
      )}

      {/* Release code modal */}
      <ReleaseCodeModal
        open={codeModal.open}
        onClose={() => setCodeModal({ open: false, order: null })}
        onConfirm={handleConfirmDelivery}
        code={codeModal.order?.releaseCode}
        mode="show"
        loading={loading}
      />
    </div>
  );
}