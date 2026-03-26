'use client';
import React, { useState } from 'react';
import { Banknote, TrendingUp, Clock, CheckCircle, Lock } from 'lucide-react';

const MOCK_EARNINGS = [
  { id: 'ORD-020', crop: 'Tomato', amt: 3200, status: 'HELD', date: 'Mar 24, 2026' },
  { id: 'ORD-021', crop: 'Yam', amt: 5600, status: 'HELD', date: 'Mar 23, 2026' },
  { id: 'ORD-015', crop: 'Tomato', amt: 3200, status: 'RELEASED', date: 'Mar 20, 2026' },
  { id: 'ORD-014', crop: 'Yam', amt: 1960, status: 'RELEASED', date: 'Mar 18, 2026' },
  { id: 'ORD-013', crop: 'Pepper', amt: 2880, status: 'RELEASED', date: 'Mar 15, 2026' },
];

const CROP_EMOJI: Record<string, string> = { Tomato: '🍅', Yam: '🥔', Cassava: '🌿', Maize: '🌽', Rice: '🍚', Pepper: '🌶️', Onion: '🧅', Plantain: '🍌', Carrot: '🥕', Cabbage: '🥬' };

export default function LogisticsEarningsPage() {
  const held = MOCK_EARNINGS.filter(e => e.status === 'HELD').reduce((a, e) => a + e.amt, 0);
  const released = MOCK_EARNINGS.filter(e => e.status === 'RELEASED').reduce((a, e) => a + e.amt, 0);
  const total = held + released;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>Earnings</h1>
        <p className="text-sm text-[#06930A] mt-1">Logistics fees tracked through Prism Vault escrow.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Earned', value: `₦${total.toLocaleString()}`, icon: TrendingUp, color: '#08C40E', bg: '#E6FEE7' },
          { label: 'In Escrow', value: `₦${held.toLocaleString()}`, icon: Lock, color: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Released', value: `₦${released.toLocaleString()}`, icon: CheckCircle, color: '#3B82F6', bg: '#EFF6FF' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E6FEE7] p-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: s.bg }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <p className="text-lg font-black text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
            <p className="text-[10px] text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* In-escrow notice */}
      {held > 0 && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
          <Lock size={18} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-900">₦{held.toLocaleString()} in Prism Vault</p>
            <p className="text-xs text-amber-700 mt-0.5">These funds release automatically when buyers confirm delivery of your active shipments.</p>
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-[#E6FEE7] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#E6FEE7]">
          <p className="text-xs font-bold text-[#046207] uppercase tracking-wide">Transaction History</p>
        </div>
        <div className="divide-y divide-[#F0FEF1]">
          {MOCK_EARNINGS.map((e, i) => (
            <div key={e.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F5FFF5] transition-colors">
              <span className="text-xl">{CROP_EMOJI[e.crop] ?? '🌱'}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#023103]">{e.id}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} />{e.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>₦{e.amt.toLocaleString()}</p>
                <span className={`text-[10px] font-semibold ${e.status === 'RELEASED' ? 'text-[#08C40E]' : 'text-amber-600'}`}>
                  {e.status === 'RELEASED' ? '✓ Released' : '⏳ In Escrow'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}