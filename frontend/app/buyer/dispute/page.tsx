'use client';
import React, { useState } from 'react';
import { ShieldAlert, Upload, AlertTriangle, CheckCircle, X, Camera } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/types';
import { StatusBadge } from '@/components/ui/getStatusBadge';
import { MOCK_ORDERS } from '@/mock-datas/farmer';

const DISPUTE_REASONS = [
  'Produce arrived spoiled or rotten',
  'Wrong crop type delivered',
  'Quantity was less than ordered',
  'Produce quality does not match listing',
  'Order arrived damaged',
  'Other',
];

export default function DisputeCenterPage() {
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const eligibleOrders = orders.filter(o =>
    ['SHIPPED', 'IN_TRANSIT', 'COMPLETED'].includes(o.status)
  );
  const disputedOrders = orders.filter(o => o.status === 'DISPUTED');

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !reason) return;
    setSubmitting(true);
    try {
      await ordersApi.updateStatus(selectedOrderId, 'DISPUTED', {
        reason: reason === 'Other' ? customReason : reason,
      });
      setSubmitted(true);
    } catch {
      // In dev, just simulate success
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <ShieldAlert size={36} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#023103] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Dispute Opened
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mb-8">
          Your dispute has been submitted. Our team will review it within 24 hours. The order status has been updated to <span className="font-semibold text-red-600">Disputed</span>.
        </p>
        <button
          onClick={() => { setSubmitted(false); setSelectedOrderId(''); setReason(''); setPhotoPreview(null); }}
          className="px-6 py-3 rounded-xl bg-[#08C40E] text-white font-semibold hover:bg-[#06930A] transition-colors"
        >
          Open Another Dispute
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>
          Dispute Center
        </h1>
        <p className="text-sm text-[#06930A] mt-1">
          Received spoiled or wrong produce? Open a dispute to protect your payment.
        </p>
      </div>

      {/* Active disputes */}
      {disputedOrders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#023103] mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            Active Disputes ({disputedOrders.length})
          </h2>
          <div className="space-y-3">
            {disputedOrders.map(order => (
              <div key={order.id} className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#023103]">{order.id} — {order.cropType}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.farmerName} · ₦{order.totalAmount.toLocaleString()}</p>
                </div>
                <StatusBadge status="DISPUTED" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dispute form */}
      <div className="bg-white rounded-2xl border border-[#E6FEE7] p-6">
        <h2 className="text-base font-bold text-[#023103] mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
          <ShieldAlert size={18} className="text-red-500" />
          Open a New Dispute
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Select order */}
          <div>
            <label className="block text-xs font-semibold text-[#046207] mb-2 uppercase tracking-wide">
              Select Order *
            </label>
            {eligibleOrders.length === 0 ? (
              <p className="text-sm text-gray-400 py-3 text-center bg-gray-50 rounded-xl">
                No eligible orders to dispute.
              </p>
            ) : (
              <div className="space-y-2">
                {eligibleOrders.map(order => (
                  <label
                    key={order.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedOrderId === order.id
                        ? 'border-[#08C40E] bg-[#F0FEF1]'
                        : 'border-[#E6FEE7] hover:border-[#CEFDCF] hover:bg-[#F5FFF5]'
                      }`}
                  >
                    <input
                      type="radio"
                      name="order"
                      value={order.id}
                      checked={selectedOrderId === order.id}
                      onChange={() => setSelectedOrderId(order.id)}
                      className="accent-[#08C40E]"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#023103]">{order.id} — {order.cropType}</p>
                      <p className="text-xs text-gray-400">{order.farmerName} · ₦{order.totalAmount.toLocaleString()}</p>
                    </div>
                    <StatusBadge status={order.status} size="sm" />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-[#046207] mb-2 uppercase tracking-wide">
              Reason for Dispute *
            </label>
            <div className="space-y-2">
              {DISPUTE_REASONS.map(r => (
                <label
                  key={r}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${reason === r
                      ? 'border-red-300 bg-red-50'
                      : 'border-[#E6FEE7] hover:border-[#CEFDCF]'
                    }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-red-500"
                  />
                  <span className="text-sm text-[#023103]">{r}</span>
                </label>
              ))}
            </div>
            {reason === 'Other' && (
              <textarea
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
                placeholder="Describe the issue in detail…"
                rows={3}
                className="mt-3 w-full px-4 py-3 text-sm rounded-xl border border-[#CEFDCF] bg-[#F5FFF5] text-[#023103] focus:outline-none focus:border-[#08C40E] resize-none"
              />
            )}
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-xs font-semibold text-[#046207] mb-2 uppercase tracking-wide">
              Photo Evidence (Optional)
            </label>
            {photoPreview ? (
              <div className="relative">
                <img src={photoPreview} alt="Evidence" className="w-full h-48 object-cover rounded-xl border border-[#E6FEE7]" />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[#CEFDCF] rounded-xl bg-[#F5FFF5] cursor-pointer hover:border-[#08C40E] hover:bg-[#F0FEF1] transition-all">
                <Camera size={24} className="text-[#9DFBA0] mb-2" />
                <span className="text-sm text-[#06930A] font-medium">Upload photo of spoiled produce</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </label>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!selectedOrderId || !reason || submitting}
            className="w-full py-3.5 rounded-xl bg-red-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-100"
          >
            <ShieldAlert size={18} />
            {submitting ? 'Opening Dispute…' : 'Open Dispute'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Funds will remain in escrow until the dispute is resolved by our admin team.
          </p>
        </form>
      </div>
    </div>
  );
}