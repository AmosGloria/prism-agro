'use client';
import React, { useState } from 'react';
import { Truck, CheckCircle, MapPin, Package, Navigation } from 'lucide-react';
import { deliveryApi } from '@/lib/api';
import type { Order } from '@/types';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/getStatusBadge';
import { ReleaseCodeModal } from '@/components/ui/modal';
import { CROP_EMOJI } from '@/mock-datas/farmer';
import { MOCK_ACTIVE } from '@/mock-datas/logistics';

export default function ActiveShipmentsPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ACTIVE);
  const [codeModal, setCodeModal] = useState<{ open: boolean; orderId: string }>({ open: false, orderId: '' });
  const [loading, setLoading] = useState(false);

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handlePickup = async (orderId: string) => {
    try {
      await deliveryApi.confirmPickup(orderId);
      updateOrderStatus(orderId, 'IN_TRANSIT');
    } catch {
      updateOrderStatus(orderId, 'IN_TRANSIT'); // optimistic
    }
  };

  const handleDeliveryCode = async (code: string) => {
    setLoading(true);
    try {
      await deliveryApi.confirmDelivery(codeModal.orderId, code);
      updateOrderStatus(codeModal.orderId, 'COMPLETED');
      setCodeModal({ open: false, orderId: '' });
    } catch {
      alert('Invalid release code. Please check with the buyer.');
    } finally {
      setLoading(false);
    }
  };

  const active = orders.filter(o => ['PAYMENT_HELD', 'IN_TRANSIT', 'SHIPPED'].includes(o.status));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>
          Active Shipments
        </h1>
        <p className="text-sm text-[#06930A] mt-1">
          Manage your current deliveries from pickup to handover.
        </p>
      </div>

      {active.length === 0 ? (
        <EmptyState
          title="No active shipments"
          description="Claim a load from Available Loads to start your next delivery."
          action={{ label: 'Browse Available Loads', href: '/logistics/loads' }}
        />
      ) : (
        <div className="space-y-4">
          {active.map((order, i) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#E6FEE7] p-5 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms`, boxShadow: '0 2px 10px rgba(2,49,3,0.05)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#E6FEE7] flex items-center justify-center text-2xl">
                    {CROP_EMOJI[order.cropType] ?? '🌱'}
                  </div>
                  <div>
                    <p className="font-bold text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>{order.id}</p>
                    <p className="text-xs text-gray-400">{order.cropType} · {order.quantity}kg · {order.farmerName}</p>
                  </div>
                </div>
                <StatusBadge status={order.status} pulse />
              </div>

              {/* Route display */}
              <div className="mb-4 p-3 bg-[#F5FFF5] rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#08C40E]" />
                  <span className="text-gray-500">Pickup: </span>
                  <span className="font-medium text-[#023103]">{order.pickupAddress}</span>
                </div>
                <div className="ml-1.5 h-3 border-l-2 border-dashed border-[#9DFBA0]" />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#046207]" />
                  <span className="text-gray-500">Delivery: </span>
                  <span className="font-medium text-[#023103]">{order.deliveryAddress}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-xs text-gray-400">Buyer: <span className="font-medium text-[#023103]">{order.buyerName}</span></span>
                <span className="text-sm font-black text-[#08C40E]" style={{ fontFamily: 'var(--font-display)' }}>
                  ₦{Math.round(order.totalAmount * 0.08).toLocaleString()} <span className="text-xs font-normal text-gray-400">fee</span>
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <a
                  href={`https://www.google.com/maps/dir/${encodeURIComponent(order.pickupAddress)}/${encodeURIComponent(order.deliveryAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#CEFDCF] text-[#046207] text-xs font-semibold hover:bg-[#F0FEF1] transition-colors"
                >
                  <Navigation size={14} /> Map
                </a>

                {order.status === 'PAYMENT_HELD' && (
                  <button
                    onClick={() => handlePickup(order.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-all shadow-md shadow-blue-100"
                  >
                    <Package size={14} /> Confirm Pickup
                  </button>
                )}

                {order.status === 'IN_TRANSIT' && (
                  <button
                    onClick={() => setCodeModal({ open: true, orderId: order.id })}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#08C40E] text-white text-xs font-semibold hover:bg-[#06930A] transition-all shadow-md shadow-green-200 animate-pulse-glow"
                  >
                    <CheckCircle size={14} /> Confirm Delivery
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Code entry modal */}
      <ReleaseCodeModal
        open={codeModal.open}
        onClose={() => setCodeModal({ open: false, orderId: '' })}
        onConfirm={handleDeliveryCode}
        mode="enter"
        loading={loading}
      />
    </div>
  );
}