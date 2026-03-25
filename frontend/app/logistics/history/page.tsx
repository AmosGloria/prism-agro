'use client';
import React, { useState } from 'react';
import { Route, MapPin, Clock, Star, Download } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

const MOCK_ROUTES = [
  { id: 'ORD-015', emoji: '🍅', crop: 'Tomato', from: 'Kano', to: 'Lagos', dist: '1,114km', earned: '₦3,200', rating: 5, date: 'Mar 20, 2026', duration: '14h 32m' },
  { id: 'ORD-014', emoji: '🥔', crop: 'Yam', from: 'Jos', to: 'Abuja', dist: '186km', earned: '₦1,960', rating: 5, date: 'Mar 18, 2026', duration: '2h 45m' },
  { id: 'ORD-013', emoji: '🌶', crop: 'Pepper', from: 'Enugu', to: 'Lagos', dist: '642km', earned: '₦2,880', rating: 4, date: 'Mar 15, 2026', duration: '7h 10m' },
  { id: 'ORD-012', emoji: '🌽', crop: 'Maize', from: 'Kaduna', to: 'Kano', dist: '185km', earned: '₦1,440', rating: 5, date: 'Mar 12, 2026', duration: '2h 20m' },
];

export default function RouteHistoryPage() {
  const [routes] = useState(MOCK_ROUTES);
  const totalEarned = routes.reduce((acc, r) => acc + parseInt(r.earned.replace(/[₦,]/g, '')), 0);
  const avgRating = (routes.reduce((acc, r) => acc + r.rating, 0) / routes.length).toFixed(1);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>Route History</h1>
        <p className="text-sm text-[#06930A] mt-1">Your completed delivery performance log.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Deliveries', value: routes.length, icon: Route },
          { label: 'Total Earned', value: `₦${totalEarned.toLocaleString()}`, icon: Download },
          { label: 'Avg Rating', value: `${avgRating}★`, icon: Star },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E6FEE7] p-4">
            <div className="w-8 h-8 rounded-xl bg-[#E6FEE7] flex items-center justify-center mb-2">
              <s.icon size={16} className="text-[#08C40E]" />
            </div>
            <p className="text-lg font-black text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
            <p className="text-[10px] text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {routes.length === 0 ? (
        <EmptyState title="No completed routes" description="Complete your first delivery to see your route history here." />
      ) : (
        <div className="space-y-3">
          {routes.map((r, i) => (
            <div key={r.id} className="bg-white rounded-2xl border border-[#E6FEE7] p-4 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{r.emoji}</span>
                  <div>
                    <p className="font-bold text-[#023103] text-sm" style={{ fontFamily: 'var(--font-display)' }}>{r.id}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} /> {r.date} · {r.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-[#08C40E]" style={{ fontFamily: 'var(--font-display)' }}>{r.earned}</p>
                  <div className="flex items-center gap-0.5 justify-end">
                    {[...Array(5)].map((_, j) => <Star key={j} size={10} className={j < r.rating ? 'text-amber-400' : 'text-gray-200'} fill={j < r.rating ? '#FBBF24' : 'transparent'} />)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#F5FFF5] rounded-xl p-2.5">
                <span className="font-medium text-[#023103]">{r.from}</span>
                <div className="flex-1 h-px border-t border-dashed border-[#9DFBA0]" />
                <span className="text-[10px] text-[#08C40E] font-semibold">{r.dist}</span>
                <div className="flex-1 h-px border-t border-dashed border-[#9DFBA0]" />
                <span className="font-medium text-[#023103]">{r.to}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}