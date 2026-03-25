'use client';
import React, { useState } from 'react';
import { MapPin, Scale, Package, Navigation, CheckCircle } from 'lucide-react';
import { useFreshness, useTimeAgo } from '@/hooks';
import { deliveryApi } from '@/lib/api';
import type { Listing } from '@/types';
import { FreshnessBar } from '@/components/ui/freshnessBar';
import { EmptyState } from '@/components/ui/empty-state';
import { MOCK_LOADS } from '@/mock-datas/logistics';
import { CROP_EMOJI } from '@/mock-datas/farmer';


function LoadCard({ load, onClaim }: { load: typeof MOCK_LOADS[0]; onClaim: (id: string, orderId: string) => void }) {
  const freshness = useFreshness(load.harvestTime, load.currentFreshness);
  const timeAgo = useTimeAgo(load.harvestTime);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await deliveryApi.claimLoad(load.orderId);
      setClaimed(true);
      onClaim(load.id, load.orderId);
    } catch {
      setClaimed(true); // optimistic in dev
      onClaim(load.id, load.orderId);
    } finally {
      setClaiming(false);
    }
  };

  const logisticsEarning = Math.round(load.quantity * load.pricePerKg * 0.08); // 8% logistics fee

  if (claimed) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5 card-hover animate-fade-up" style={{ boxShadow: '0 2px 10px rgba(2,49,3,0.05)' }}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E6FEE7] to-[#CEFDCF] flex items-center justify-center text-2xl shrink-0">
          {CROP_EMOJI[load.cropType] ?? '🌱'}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-[#023103] text-base" style={{ fontFamily: 'var(--font-display)' }}>
            {load.cropType} — {load.quantity}kg
          </h3>
          <p className="text-xs text-gray-400">{load.farmerName} · Harvested {timeAgo}</p>
        </div>
        <div className="text-right">
          <p className="text-base font-black text-[#08C40E]" style={{ fontFamily: 'var(--font-display)' }}>
            ₦{logisticsEarning.toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-400">your earnings</p>
        </div>
      </div>

      {/* Route */}
      <div className="mb-4 p-3 bg-[#F5FFF5] rounded-xl space-y-2">
        <div className="flex items-start gap-2 text-xs">
          <div className="w-4 h-4 rounded-full bg-[#08C40E] flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-white text-[8px] font-bold">A</span>
          </div>
          <div>
            <p className="font-semibold text-[#023103]">Pickup</p>
            <p className="text-gray-500">{load.pickupAddress}</p>
          </div>
        </div>
        <div className="ml-2 h-4 border-l-2 border-dashed border-[#CEFDCF]" />
        <div className="flex items-start gap-2 text-xs">
          <div className="w-4 h-4 rounded-full bg-[#046207] flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-white text-[8px] font-bold">B</span>
          </div>
          <div>
            <p className="font-semibold text-[#023103]">Delivery</p>
            <p className="text-gray-500">{load.deliveryAddress}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#046207] font-medium mt-1">
          <MapPin size={11} />
          <span>{load.distance} route</span>
        </div>
      </div>

      <div className="mb-4">
        <FreshnessBar value={freshness} />
      </div>

      <div className="flex gap-2">
        <a
          href={`https://www.google.com/maps/dir/${encodeURIComponent(load.pickupAddress)}/${encodeURIComponent(load.deliveryAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#CEFDCF] text-[#046207] text-xs font-semibold hover:bg-[#F0FEF1] transition-colors"
        >
          <Navigation size={14} /> View Route
        </a>
        <button
          onClick={handleClaim}
          disabled={claiming}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#08C40E] text-white text-xs font-semibold hover:bg-[#06930A] transition-all shadow-md shadow-green-200 disabled:opacity-50"
        >
          <Package size={14} />
          {claiming ? 'Claiming…' : 'Claim Load'}
        </button>
      </div>
    </div>
  );
}

export default function AvailableLoadsPage() {
  const [loads, setLoads] = useState(MOCK_LOADS);

  const handleClaim = (id: string) => {
    setLoads(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>
          Available Loads
        </h1>
        <p className="text-sm text-[#06930A] mt-1">
          {loads.length} load{loads.length !== 1 ? 's' : ''} available near you — claim to start delivery.
        </p>
      </div>

      {loads.length === 0 ? (
        <EmptyState
          title="No loads available"
          description="All current loads have been claimed. Check back soon for new deliveries."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loads.map((load, i) => (
            <div key={load.id} style={{ animationDelay: `${i * 80}ms` }}>
              <LoadCard load={load} onClaim={handleClaim} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}