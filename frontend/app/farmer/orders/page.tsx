'use client';
import React, { useState } from 'react';
import { Package, Truck, MapPin, User, Banknote } from 'lucide-react';
import type { Order } from '@/types';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/getStatusBadge';
import { CROP_EMOJI, MOCK_ORDERS } from '@/mock-datas/farmer';



export default function FarmerOrdersPage() {
  const [orders] = useState<Order[]>(MOCK_ORDERS);

  const held = orders.filter(o => o.status === 'PAYMENT_HELD');
  const transit = orders.filter(o => o.status === 'IN_TRANSIT');
  const completed = orders.filter(o => o.status === 'COMPLETED');

  const totalHeld = held.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>
          Order History
        </h1>
        <p className="text-sm text-[#06930A] mt-1">
          Track every order from payment to delivery.
        </p>
      </div>

      {/* Escrow summary */}
      {held.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <Banknote size={22} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900" style={{ fontFamily: 'var(--font-display)' }}>
              ₦{totalHeld.toLocaleString()} held in Prism Vault
            </p>
            <p className="text-xs text-amber-600">
              Funds release automatically when buyers confirm delivery.
            </p>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="When buyers purchase your produce, their orders will appear here."
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#E6FEE7] p-4 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms`, boxShadow: '0 2px 8px rgba(2,49,3,0.05)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6FEE7] flex items-center justify-center text-xl">
                    {CROP_EMOJI[order.cropType] ?? '🌱'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>
                      {order.id}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <StatusBadge status={order.status} pulse />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <User size={12} className="text-[#08C40E]" />
                  <span>{order.buyerName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Package size={12} className="text-[#08C40E]" />
                  <span>{order.cropType} · {order.quantity}kg</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <MapPin size={12} className="text-[#08C40E]" />
                  <span className="truncate">{order.deliveryAddress}</span>
                </div>
                {order.logisticsName && (
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Truck size={12} className="text-[#08C40E]" />
                    <span>{order.logisticsName}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#F0FEF1]">
                <span className="text-xs text-gray-400">Total Amount</span>
                <span className="text-base font-black text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>
                  ₦{order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}