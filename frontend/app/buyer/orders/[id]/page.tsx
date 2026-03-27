'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Package, Truck, User, Clock, CheckCircle } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/types';
import { StatusBadge } from '@/components/ui/getStatusBadge';
import { ProduceIcon } from '@/components/ui/produce-icon';
import { ReleaseCodeModal } from '@/components/ui/modal';

const MOCK_ORDER: Order = {
  id: 'ORD-001', buyerId: 'b1', buyerName: 'Chukwuemeka Obi',
  farmerId: 'f1', farmerName: 'Emeka Farms',
  logisticsId: 'l1', logisticsName: 'FastTrack Logistics',
  listingId: '1', cropType: 'Tomato', quantity: 20, totalAmount: 16000,
  status: 'SHIPPED', releaseCode: '482917',
  pickupAddress: 'Kano Farm Hub, Kano State',
  deliveryAddress: '14 Marina Street, Lagos Island',
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  updatedAt: new Date().toISOString(),
  estimatedDelivery: new Date(Date.now() + 86400000).toISOString(),
};

const STATUS_STEPS = ['PAYMENT_HELD', 'IN_TRANSIT', 'SHIPPED', 'COMPLETED'];
const STEP_LABELS = { PAYMENT_HELD: 'Payment Held', IN_TRANSIT: 'In Transit', SHIPPED: 'Out for Delivery', COMPLETED: 'Delivered' };

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()!;
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [codeModal, setCodeModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ordersApi.getById(id).then(d => setOrder(d as Order)).catch(() => setOrder(MOCK_ORDER));
  }, [id]);

  const handleConfirm = async (code: string) => {
    setLoading(true);
    try {
      await ordersApi.updateStatus(id, 'COMPLETED');
      setOrder(o => o ? { ...o, status: 'COMPLETED' } : o);
      setCodeModal(false);
    } catch {
      setOrder(o => o ? { ...o, status: 'COMPLETED' } : o);
      setCodeModal(false);
    } finally {
      setLoading(false);
    }
  };

  if (!order) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#08C40E] border-t-transparent rounded-full animate-spin" /></div>;

  const curStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-[#046207] mb-5 hover:text-[#023103] transition-colors">
        <ArrowLeft size={16} /> Back to Orders
      </button>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-black text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>{order.id}</h1>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock size={11} /> {new Date(order.createdAt).toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <StatusBadge status={order.status} pulse />
      </div>

      {/* Produce card */}
      <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#E6FEE7] to-[#CEFDCF] flex items-center justify-center">
            <ProduceIcon cropType={order.cropType} size={36} />
          </div>
          <div className="flex-1">
            <p className="font-black text-[#023103] text-lg" style={{ fontFamily: 'var(--font-display)' }}>{order.cropType}</p>
            <p className="text-sm text-gray-400">{order.quantity}kg · {order.farmerName}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>₦{order.totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Shipment progress stepper */}
      {!['COMPLETED', 'DISPUTED', 'CANCELLED'].includes(order.status) && (
        <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5 mb-4">
          <p className="text-xs font-bold text-[#046207] uppercase tracking-wide mb-4">Shipment Progress</p>
          <div className="flex items-start gap-0">
            {STATUS_STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < curStep ? 'bg-[#08C40E] text-white' :
                    i === curStep ? 'bg-[#08C40E] text-white ring-2 ring-[#0AF511] ring-offset-2' :
                      'bg-[#E6FEE7] text-[#9DFBA0]'
                    }`}>
                    {i < curStep ? '✓' : i + 1}
                  </div>
                  <span className={`text-[9px] mt-1 text-center w-16 leading-tight ${i <= curStep ? 'text-[#046207] font-semibold' : 'text-gray-300'}`}>
                    {STEP_LABELS[s as keyof typeof STEP_LABELS]}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mt-3.5 transition-all ${i < curStep ? 'bg-[#08C40E]' : 'bg-[#E6FEE7]'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          {order.estimatedDelivery && (
            <p className="text-xs text-gray-400 mt-4">
              Estimated delivery: <span className="font-semibold text-[#023103]">
                {new Date(order.estimatedDelivery).toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </p>
          )}
        </div>
      )}

      {/* Parties */}
      <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5 mb-4">
        <p className="text-xs font-bold text-[#046207] uppercase tracking-wide mb-3">Order Parties</p>
        <div className="space-y-3">
          {[
            { icon: User, label: 'Farmer', value: order.farmerName },
            { icon: Truck, label: 'Logistics', value: order.logisticsName ?? 'Awaiting assignment' },
            { icon: MapPin, label: 'Pickup', value: order.pickupAddress },
            { icon: MapPin, label: 'Delivery', value: order.deliveryAddress },
          ].map(row => (
            <div key={row.label} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#E6FEE7] flex items-center justify-center shrink-0 mt-0.5">
                <row.icon size={13} className="text-[#08C40E]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">{row.label}</p>
                <p className="text-sm text-[#023103] font-medium">{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escrow summary */}
      <div className="bg-[#F0FEF1] border border-[#CEFDCF] rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-[#046207] uppercase tracking-wide">Escrow Amount</p>
            <p className="text-2xl font-black text-[#023103] mt-1" style={{ fontFamily: 'var(--font-display)' }}>₦{order.totalAmount.toLocaleString()}</p>
          </div>
          <div className="text-right text-xs text-[#06930A]">
            {order.status === 'COMPLETED' ? (
              <span className="flex items-center gap-1 text-[#08C40E] font-semibold"><CheckCircle size={14} /> Released</span>
            ) : (
              <><p>Held securely</p><p>in Prism Vault</p></>
            )}
          </div>
        </div>
      </div>

      {/* Confirm delivery CTA */}
      {order.status === 'SHIPPED' && (
        <button
          onClick={() => setCodeModal(true)}
          className="w-full py-4 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2 transition-all"
          style={{ background: '#08C40E', fontFamily: 'var(--font-display)', boxShadow: '0 6px 24px rgba(8,196,14,0.35)', animation: 'pulse-glow 2s infinite' }}
        >
          <CheckCircle size={22} /> Confirm Delivery — Release Funds
        </button>
      )}

      {order.status === 'COMPLETED' && (
        <div className="flex items-center justify-center gap-2 py-4 text-[#08C40E]">
          <CheckCircle size={20} />
          <span className="font-bold">Order completed. Funds released to farmer.</span>
        </div>
      )}

      <ReleaseCodeModal
        open={codeModal}
        onClose={() => setCodeModal(false)}
        onConfirm={handleConfirm}
        code={order.releaseCode}
        mode="show"
        loading={loading}
      />
    </div>
  );
}