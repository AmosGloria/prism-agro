'use client';
import React, { useState } from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import type { OrderStatus } from '@/types';

const MOCK_ORDERS = [
  { id: 'ORD-001', buyer: 'Chukwuemeka Obi', farmer: 'Emeka Farms', crop: 'Tomato', qty: 20, amt: 16000, status: 'SHIPPED' as OrderStatus, date: 'Mar 22' },
  { id: 'ORD-002', buyer: 'Chukwuemeka Obi', farmer: 'Bello Agro', crop: 'Yam', qty: 50, amt: 17500, status: 'IN_TRANSIT' as OrderStatus, date: 'Mar 23' },
  { id: 'ORD-003', buyer: 'Chukwuemeka Obi', farmer: 'Ada Fresh', crop: 'Pepper', qty: 10, amt: 12000, status: 'COMPLETED' as OrderStatus, date: 'Mar 18' },
  { id: 'ORD-004', buyer: 'Chukwuemeka Obi', farmer: 'Tunde Harvest', crop: 'Maize', qty: 100, amt: 18000, status: 'PAYMENT_HELD' as OrderStatus, date: 'Mar 24' },
  { id: 'ORD-005', buyer: 'Chukwuemeka Obi', farmer: 'Ngozi Greens', crop: 'Cabbage', qty: 30, amt: 12000, status: 'DISPUTED' as OrderStatus, date: 'Mar 17' },
  { id: 'ORD-010', buyer: 'Musa Garba', farmer: 'Emeka Farms', crop: 'Tomato', qty: 50, amt: 40000, status: 'PAYMENT_HELD' as OrderStatus, date: 'Mar 24' },
  { id: 'ORD-011', buyer: 'Ngozi Okonkwo', farmer: 'Bello Agro', crop: 'Yam', qty: 200, amt: 70000, status: 'IN_TRANSIT' as OrderStatus, date: 'Mar 23' },
  { id: 'ORD-009', buyer: 'Tunde Bello', farmer: 'Emeka Farms', crop: 'Maize', qty: 80, amt: 14400, status: 'COMPLETED' as OrderStatus, date: 'Mar 19' },
  { id: 'ORD-008', buyer: 'Fatima Aliyu', farmer: 'Kola Roots', crop: 'Cassava', qty: 70, amt: 8400, status: 'DISPUTED' as OrderStatus, date: 'Mar 16' },
  { id: 'ORD-007', buyer: 'Musa Garba', farmer: 'Ada Fresh', crop: 'Pepper', qty: 25, amt: 30000, status: 'COMPLETED' as OrderStatus, date: 'Mar 14' },
];

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  PAYMENT_HELD: { bg: '#292524', text: '#FCD34D', label: 'Held' },
  IN_TRANSIT: { bg: '#1E3A5F', text: '#93C5FD', label: 'In Transit' },
  SHIPPED: { bg: '#1E3A5F', text: '#60A5FA', label: 'Shipped' },
  COMPLETED: { bg: '#14342A', text: '#4ADE80', label: 'Completed' },
  DISPUTED: { bg: '#3B1515', text: '#FCA5A5', label: 'Disputed' },
  CANCELLED: { bg: '#1F2937', text: '#9CA3AF', label: 'Cancelled' },
};
const CROP_EMOJI: Record<string, string> = { Tomato: '🍅', Yam: '🥔', Cassava: '🌿', Maize: '🌽', Rice: '🍚', Pepper: '🌶️', Onion: '🧅', Plantain: '🍌', Carrot: '🥕', Cabbage: '🥬' };

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = MOCK_ORDERS.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.toLowerCase().includes(search.toLowerCase()) ||
      o.farmer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const totalValue = MOCK_ORDERS.reduce((a, o) => a + o.amt, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Order Ledger</h1>
        <p className="text-sm text-gray-400 mt-1">Real-time tracking of every transaction in the system.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Orders', value: MOCK_ORDERS.length },
          { label: 'Total Value', value: `₦${(totalValue / 1000).toFixed(0)}k` },
          { label: 'Disputed', value: MOCK_ORDERS.filter(o => o.status === 'DISPUTED').length },
          { label: 'Completed', value: MOCK_ORDERS.filter(o => o.status === 'COMPLETED').length },
        ].map(s => (
          <div key={s.label} className="bg-[#111827] border border-gray-800 rounded-xl p-3">
            <p className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
            <p className="text-[10px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search orders…"
            className="w-full pl-8 pr-4 py-2 text-sm rounded-xl bg-[#111827] border border-gray-700 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={14} /></button>}
        </div>
        {['All', 'PAYMENT_HELD', 'IN_TRANSIT', 'COMPLETED', 'DISPUTED'].map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-[#111827] border border-gray-700 text-gray-400 hover:border-gray-600'}`}>
            {s === 'All' ? 'All' : STATUS_STYLE[s]?.label ?? s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr_1fr] gap-0 px-4 py-3 border-b border-gray-800 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
          <span>Order ID</span><span>Buyer</span><span>Farmer</span><span>Produce</span><span>Amount</span><span>Status</span>
        </div>
        {paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">No orders match your filters.</div>
        ) : (
          paginated.map((o, i) => {
            const s = STATUS_STYLE[o.status];
            return (
              <div key={o.id}
                className="grid grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr_1fr] gap-0 px-4 py-3.5 border-b border-gray-800/50 last:border-0 hover:bg-white/5 transition-colors text-sm"
                style={{ animation: `fadeInUp .3s ease ${i * 40}ms both` }}
              >
                <div>
                  <p className="font-bold text-white">{o.id}</p>
                  <p className="text-[10px] text-gray-500">{o.date}</p>
                </div>
                <span className="text-gray-300 text-xs">{o.buyer.split(' ')[0]}</span>
                <span className="text-gray-300 text-xs">{o.farmer.split(' ')[0]}</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-300">
                  <span>{CROP_EMOJI[o.crop]}</span>{o.crop} ·{o.qty}kg
                </span>
                <span className="font-bold text-white text-sm">₦{(o.amt / 1000).toFixed(0)}k</span>
                <span>
                  <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: s?.bg, color: s?.text }}>
                    {s?.label}
                  </span>
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500">{filtered.length} orders · Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg bg-[#111827] border border-gray-700 text-gray-400 text-xs disabled:opacity-30 hover:border-gray-500">← Prev</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg bg-[#111827] border border-gray-700 text-gray-400 text-xs disabled:opacity-30 hover:border-gray-500">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}