'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, MapPin, Scale, ShoppingCart, Eye, Leaf } from 'lucide-react';
import { useFreshness, useTimeAgo } from '@/hooks';
import { listingsApi } from '@/lib/api';
import type { Listing, CropType } from '@/types';
import { MOCK_LISTINGS } from '@/mock-datas/buyer';
import { CROP_EMOJI, CROP_TYPES } from '@/mock-datas/market-place';
import { EmptyState } from '@/components/ui/empty-state';
import { ListingCard } from '@/components/ui/listing-card';


function MarketplaceInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [cropFilter, setCropFilter] = useState(searchParams?.get('cropType') || '');
  const [locationFilter, setLocFilter] = useState(searchParams?.get('location') || '');

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (cropFilter) params.cropType = cropFilter;
    if (locationFilter) params.location = locationFilter;
    listingsApi.getAll(params)
      .then(d => setListings((d as any).listings ?? d as Listing[]))
      .catch(() => setListings(MOCK_LISTINGS))
      .finally(() => setLoading(false));
  }, [cropFilter, locationFilter]);

  const handleCropFilter = (crop: string) => {
    setCropFilter(crop);
    const sp = new URLSearchParams(window.location.search);
    if (crop) sp.set('cropType', crop); else sp.delete('cropType');
    router.push(`/buyer/marketplace?${sp.toString()}`, { scroll: false });
  };

  const filtered = listings.filter(l => {
    if (cropFilter && l.cropType !== cropFilter) return false;
    if (locationFilter && !l.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>Marketplace</h1>
        <p className="text-sm text-[#06930A] mt-1">Fresh produce from verified Nigerian farmers — direct to you.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-2xl border border-[#E6FEE7]">
        <div className="flex items-center gap-2 text-sm text-[#046207] font-medium">
          <Filter size={16} />Filter:
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleCropFilter('')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${!cropFilter ? 'bg-[#023103] text-white' : 'bg-[#F0FEF1] text-[#046207] hover:bg-[#E6FEE7]'}`}>
            All Crops
          </button>
          {CROP_TYPES.map(crop => (
            <button key={crop} onClick={() => handleCropFilter(crop === cropFilter ? '' : crop)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${cropFilter === crop ? 'bg-[#08C40E] text-white' : 'bg-[#F0FEF1] text-[#046207] hover:bg-[#E6FEE7]'}`}>
              {CROP_EMOJI[crop]} {crop}
            </button>
          ))}
        </div>
        <input type="text" placeholder="Filter by location…" value={locationFilter}
          onChange={e => {
            setLocFilter(e.target.value);
            const sp = new URLSearchParams(window.location.search);
            if (e.target.value) sp.set('location', e.target.value); else sp.delete('location');
            router.push(`/buyer/marketplace?${sp.toString()}`, { scroll: false });
          }}
          className="ml-auto px-3 py-1.5 rounded-full text-xs border border-[#CEFDCF] bg-[#F5FFF5] text-[#023103] focus:outline-none focus:border-[#08C40E] w-40" />
      </div>

      <div className="flex gap-4 mb-6 text-sm">
        <span className="text-[#046207]"><span className="font-bold text-[#023103]">{filtered.length}</span> listings found</span>
        {cropFilter && <span className="text-[#046207]">Showing: <span className="font-semibold">{CROP_EMOJI[cropFilter]} {cropFilter}</span></span>}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-72 bg-white rounded-2xl border border-[#E6FEE7] animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No produce found" description="Try adjusting your filters or check back later for fresh listings."
          action={{ label: 'Clear Filters', onClick: () => { handleCropFilter(''); setLocFilter(''); } }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((listing, i) => (
            <div key={listing.id} style={{ animationDelay: `${i * 60}ms` }}>
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Page export — Suspense required for useSearchParams
export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-72 bg-white rounded-2xl border border-[#E6FEE7] animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
    }>
      <MarketplaceInner />
    </Suspense>
  );
}