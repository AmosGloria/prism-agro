'use client';
import React, { useState } from 'react';
import { Gavel, User, Package, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/ui/getStatusBadge';
import { adminApi } from '@/lib/api';
import { DisputeCase } from '@/types';
import { MOCK_DISPUTES } from '@/mock-datas/admin';


export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<DisputeCase[]>(MOCK_DISPUTES);
  const [resolving, setResolving] = useState<string | null>(null);

  const resolve = async (disputeId: string, orderId: string, winner: 'buyer' | 'farmer') => {
    setResolving(disputeId);
    try {
      await adminApi.resolveDispute({ orderId, resolution: winner });
      setDisputes(prev => prev.map(d =>
        d.id === disputeId
          ? { ...d, status: winner === 'buyer' ? 'RESOLVED_BUYER' : 'RESOLVED_FARMER' }
          : d
      ));
    } catch {
      setDisputes(prev => prev.map(d =>
        d.id === disputeId
          ? { ...d, status: winner === 'buyer' ? 'RESOLVED_BUYER' : 'RESOLVED_FARMER' }
          : d
      ));
    } finally {
      setResolving(null);
    }
  };

  const open = disputes.filter(d => d.status === 'OPEN');
  const resolved = disputes.filter(d => d.status !== 'OPEN');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Dispute Resolution
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Review flagged orders and issue final payment rulings.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Open Disputes', value: open.length, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/20' },
          { label: 'Resolved', value: resolved.length, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-900/20' },
          { label: 'Total Funds', value: `₦${disputes.reduce((a, d) => a + d.amount, 0).toLocaleString()}`, icon: Package, color: 'text-blue-400', bg: 'bg-blue-900/20' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-gray-800 p-4" style={{ backgroundColor: '#111827' }}>
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className={`text-xl font-black ${s.color}`} style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Open cases */}
      {open.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
            <AlertTriangle size={14} /> Open Cases ({open.length})
          </h2>
          <div className="space-y-4">
            {open.map(dispute => (
              <div key={dispute.id} className="rounded-2xl border border-gray-700 p-5 animate-fade-up" style={{ backgroundColor: '#111827' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                      <Gavel size={16} className="text-red-400" />
                      {dispute.id}
                      <span className="text-gray-500 font-normal text-xs">({dispute.orderId})</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(dispute.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <StatusBadge status="DISPUTED" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-blue-900/20 border border-blue-800/40">
                    <p className="text-[10px] text-blue-400 uppercase font-semibold mb-1">Buyer</p>
                    <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <User size={13} className="text-blue-400" />
                      {dispute.buyerName}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-900/20 border border-green-800/40">
                    <p className="text-[10px] text-green-400 uppercase font-semibold mb-1">Farmer</p>
                    <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <User size={13} className="text-green-400" />
                      {dispute.farmerName}
                    </p>
                  </div>
                </div>

                <div className="mb-4 p-3 rounded-xl border border-gray-700 bg-gray-900/50">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Dispute Reason</p>
                  <p className="text-sm text-gray-200">{dispute.reason}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {dispute.cropType} · ₦{dispute.amount.toLocaleString()} in escrow
                  </p>
                </div>

                <p className="text-xs text-gray-400 mb-3 font-medium">Issue ruling — who receives the funds?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => resolve(dispute.id, dispute.orderId, 'buyer')}
                    disabled={resolving === dispute.id}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    {resolving === dispute.id ? '…' : 'Refund Buyer'}
                  </button>
                  <button
                    onClick={() => resolve(dispute.id, dispute.orderId, 'farmer')}
                    disabled={resolving === dispute.id}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    <CheckCircle size={16} />
                    {resolving === dispute.id ? '…' : 'Pay Farmer'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
            <CheckCircle size={14} /> Resolved ({resolved.length})
          </h2>
          <div className="space-y-3">
            {resolved.map(dispute => (
              <div key={dispute.id} className="rounded-2xl border border-gray-800 p-4 flex items-center justify-between" style={{ backgroundColor: '#111827' }}>
                <div>
                  <p className="text-sm font-semibold text-gray-300">{dispute.id} — {dispute.cropType}</p>
                  <p className="text-xs text-gray-500">{dispute.buyerName} vs {dispute.farmerName}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${dispute.status === 'RESOLVED_BUYER'
                  ? 'bg-blue-900/40 text-blue-400'
                  : 'bg-green-900/40 text-green-400'
                  }`}>
                  {dispute.status === 'RESOLVED_BUYER' ? 'Buyer Refunded' : 'Farmer Paid'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}