'use client';
import React, { useState } from 'react';
import { Search, Users, ShieldCheck, Clock, X } from 'lucide-react';

const MOCK_USERS = [
  { id: 'b1', name: 'Chukwuemeka Obi', email: 'buyer@farm.ng', role: 'Buyer', nin: true, status: 'Active', joined: 'Jan 12, 2026', orders: 5 },
  { id: 'b2', name: 'Fatima Aliyu', email: 'fatima@email.com', role: 'Buyer', nin: true, status: 'Active', joined: 'Feb 3, 2026', orders: 2 },
  { id: 'b3', name: 'Tunde Bello', email: 'tunde@email.com', role: 'Buyer', nin: false, status: 'Pending', joined: 'Mar 1, 2026', orders: 0 },
  { id: 'f1', name: 'Emeka Farms', email: 'farmer@farm.ng', role: 'Farmer', nin: true, status: 'Active', joined: 'Dec 15, 2025', orders: 12 },
  { id: 'f2', name: 'Bello Agro', email: 'bello@farm.com', role: 'Farmer', nin: true, status: 'Active', joined: 'Jan 5, 2026', orders: 7 },
  { id: 'f3', name: 'Ada Fresh', email: 'ada@fresh.ng', role: 'Farmer', nin: false, status: 'Pending', joined: 'Mar 10, 2026', orders: 0 },
  { id: 'l1', name: 'Yemi FastTrack', email: 'logistics@farm.ng', role: 'Logistics', nin: true, status: 'Active', joined: 'Nov 20, 2025', orders: 18 },
  { id: 'l2', name: 'SwiftMove NG', email: 'swift@move.ng', role: 'Logistics', nin: true, status: 'Active', joined: 'Feb 14, 2026', orders: 9 },
];

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  Buyer: { bg: '#EFF6FF', text: '#1E40AF' },
  Farmer: { bg: '#F0FEF1', text: '#046207' },
  Logistics: { bg: '#F5F3FF', text: '#5B21B6' },
  Admin: { bg: '#FEF2F2', text: '#991B1B' },
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [ninFilter, setNinFilter] = useState('All');
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = MOCK_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const matchNin = ninFilter === 'All' ||
      (ninFilter === 'Verified' && u.nin) ||
      (ninFilter === 'Pending' && !u.nin);
    return matchSearch && matchRole && matchNin;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>User Directory</h1>
        <p className="text-sm text-gray-400 mt-1">Monitor NIN-verified status across all roles.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Users', value: MOCK_USERS.length },
          { label: 'NIN Verified', value: MOCK_USERS.filter(u => u.nin).length },
          { label: 'Pending NIN', value: MOCK_USERS.filter(u => !u.nin).length },
          { label: 'Active Today', value: 5 },
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
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users…"
            className="w-full pl-8 pr-4 py-2 text-sm rounded-xl bg-[#111827] border border-gray-700 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={14} /></button>}
        </div>
        {['All', 'Buyer', 'Farmer', 'Logistics'].map(r => (
          <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${roleFilter === r ? 'bg-blue-600 text-white' : 'bg-[#111827] border border-gray-700 text-gray-400 hover:border-gray-600'}`}>
            {r}
          </button>
        ))}
        {['All', 'Verified', 'Pending'].map(n => (
          <button key={n} onClick={() => { setNinFilter(n); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${ninFilter === n ? 'bg-green-700 text-white' : 'bg-[#111827] border border-gray-700 text-gray-400 hover:border-gray-600'}`}>
            NIN: {n}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-0 px-5 py-3 border-b border-gray-800 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
          <span>Name</span><span>Role</span><span>NIN</span><span>Orders</span><span>Status</span>
        </div>
        {paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">No users match your filters.</div>
        ) : (
          paginated.map((u, i) => (
            <div key={u.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-0 px-5 py-4 border-b border-gray-800/50 last:border-0 hover:bg-white/5 transition-colors"
              style={{ animation: `fadeInUp .3s ease ${i * 40}ms both` }}
            >
              <div>
                <p className="text-sm font-semibold text-white">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <span>
                <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: ROLE_COLORS[u.role]?.bg, color: ROLE_COLORS[u.role]?.text }}>
                  {u.role}
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-xs">
                {u.nin
                  ? <><ShieldCheck size={13} className="text-[#08C40E]" /><span className="text-[#08C40E] font-semibold">Verified</span></>
                  : <><Clock size={13} className="text-amber-400" /><span className="text-amber-400 font-semibold">Pending</span></>
                }
              </span>
              <span className="text-sm text-gray-300 font-medium">{u.orders}</span>
              <span className={`text-xs font-semibold ${u.status === 'Active' ? 'text-[#08C40E]' : 'text-amber-400'}`}>{u.status}</span>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500">{filtered.length} users · Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg bg-[#111827] border border-gray-700 text-gray-400 text-xs disabled:opacity-30 hover:border-gray-500 transition-colors">← Prev</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg bg-[#111827] border border-gray-700 text-gray-400 text-xs disabled:opacity-30 hover:border-gray-500 transition-colors">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}