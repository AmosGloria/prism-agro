'use client';
import React, { useState } from 'react';
import { Vault, Lock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { MOCK_PAYMENTS } from '@/mock-datas/admin';
import { CROP_EMOJI } from '@/mock-datas/market-place';



const STATUS_STYLE: Record<string, { bg: string; text: string; icon: typeof Lock }> = {
  HELD: { bg: '#292524', text: '#FCD34D', icon: Lock },
  RELEASED: { bg: '#14342A', text: '#4ADE80', icon: CheckCircle },
  DISPUTED: { bg: '#3B1515', text: '#FCA5A5', icon: AlertTriangle },
  REFUNDED: { bg: '#1E3A5F', text: '#93C5FD', icon: RefreshCw },
};


export default function AdminEscrowPage() {
  const [filter, setFilter] = useState('All');

  const held = MOCK_PAYMENTS.filter(p => p.status === 'HELD').reduce((a, p) => a + p.amt, 0);
  const released = MOCK_PAYMENTS.filter(p => p.status === 'RELEASED').reduce((a, p) => a + p.amt, 0);
  const disputed = MOCK_PAYMENTS.filter(p => p.status === 'DISPUTED').reduce((a, p) => a + p.amt, 0);
  const total = MOCK_PAYMENTS.reduce((a, p) => a + p.amt, 0);

  const filtered = filter === 'All' ? MOCK_PAYMENTS : MOCK_PAYMENTS.filter(p => p.status === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Escrow Audit
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Prism Vault — complete transparency into all held and released funds.
        </p>
      </div>

      {/* Vault summary */}
      <div
        className="rounded-2xl p-5 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F1F0F, #1A2E1A)', border: '1px solid #1F3A1F' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#08C40E]/20 flex items-center justify-center">
            <Vault size={20} className="text-[#08C40E]" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Prism Vault Total</p>
            <p className="text-3xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
              ₦{total.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Currently Held', value: held, color: '#FCD34D', icon: Lock },
            { label: 'Released', value: released, color: '#4ADE80', icon: CheckCircle },
            { label: 'Under Dispute', value: disputed, color: '#FCA5A5', icon: AlertTriangle },
          ].map(s => (
            <div key={s.label} className="bg-black/20 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <s.icon size={12} style={{ color: s.color }} />
                <span className="text-[10px] text-gray-400">{s.label}</span>
              </div>
              <p className="text-base font-black" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>
                ₦{s.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {['All', 'HELD', 'RELEASED', 'DISPUTED'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-[#111827] border border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
          >
            {f === 'All' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            <span className="ml-1.5 text-[10px] opacity-70">
              ({f === 'All' ? MOCK_PAYMENTS.length : MOCK_PAYMENTS.filter(p => p.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Transactions table */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_1fr] px-4 py-3 border-b border-gray-800 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
          <span>Payment ID</span><span>Buyer</span><span>Farmer</span><span>Produce</span><span>Amount</span><span>Status</span>
        </div>

        {filtered.map((p, i) => {
          const s = STATUS_STYLE[p.status];
          const Icon = s?.icon ?? Lock;
          return (
            <div
              key={p.id}
              className="grid grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_1fr] px-4 py-3.5 border-b border-gray-800/50 last:border-0 hover:bg-white/5 transition-colors text-sm"
              style={{ animation: `fadeInUp .25s ease ${i * 40}ms both` }}
            >
              <div>
                <p className="font-bold text-white text-xs">{p.id}</p>
                <p className="text-[10px] text-gray-500">{p.orderId} · {p.date}</p>
              </div>
              <span className="text-gray-300 text-xs self-center">{p.buyer.split(' ')[0]}</span>
              <span className="text-gray-300 text-xs self-center">{p.farmer.split(' ')[0]}</span>
              <span className="text-gray-300 text-xs self-center flex items-center gap-1">
                <span>{CROP_EMOJI[p.crop]}</span>{p.crop}
              </span>
              <span className="font-black text-white text-sm self-center">
                ₦{(p.amt / 1000).toFixed(0)}k
              </span>
              <span className="self-center">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
                  style={{ background: s?.bg, color: s?.text }}
                >
                  <Icon size={10} />
                  {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Audit note */}
      <p className="text-xs text-gray-600 mt-4 text-center">
        All transactions are immutably logged. Contact Interswitch for disbursement queries.
      </p>
    </div>
  );
}