'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Scale, Clock, ShoppingCart, Star, Leaf } from 'lucide-react';
import { useFreshness, useTimeAgo } from '@/hooks';
import { listingsApi } from '@/lib/api';
import type { Listing } from '@/types';
import { FreshnessBar } from '@/components/ui/freshnessBar';
import { CROP_EMOJI } from '@/mock-datas/market-place';

const MOCK: Listing = {
  id: '1', farmerId: 'f1', farmerName: 'Emeka Farms', cropType: 'Tomato',
  quantity: 50, pricePerKg: 800, location: 'Kano', state: 'Kano',
  harvestTime: new Date(Date.now() - 3_600_000 * 5).toISOString(),
  currentFreshness: 90, status: 'AVAILABLE', createdAt: new Date().toISOString(),
  description: 'Premium Roma tomatoes — hand-sorted, grown without pesticides on our 3-acre Kano Valley farm. Perfect for restaurants, markets, and bulk buyers.',
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()!;
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    listingsApi.getById(id).then(d => setListing(d as Listing)).catch(() => setListing(MOCK));
  }, [id]);

  if (!listing) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#08C40E] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return <ListingDetail listing={listing} />;
}

function ListingDetail({ listing }: { listing: Listing }) {
  const router = useRouter();
  const freshness = useFreshness(listing.harvestTime, listing.currentFreshness);
  const timeAgo = useTimeAgo(listing.harvestTime);
  const [qty, setQty] = useState(5);
  const total = qty * listing.pricePerKg;

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-[#046207] mb-5 hover:text-[#023103] transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Hero */}
      <div className="relative h-48 bg-linear-to-br from-[#E6FEE7] to-[#CEFDCF] rounded-2xl flex items-center justify-center mb-5 overflow-hidden">
        <span className="text-7xl">{CROP_EMOJI[listing.cropType] ?? '🌱'}</span>
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-xl">
          <span className="text-xs font-bold text-[#08C40E]">● AVAILABLE</span>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl">
          <Leaf size={12} className="text-[#08C40E]" />
          <span className="text-xs font-semibold text-[#023103]">Harvested {timeAgo}</span>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-2xl font-black text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>
              {listing.cropType}
            </h1>
            <p className="text-sm text-[#06930A] mt-0.5">{listing.farmerName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-[#08C40E]" style={{ fontFamily: 'var(--font-display)' }}>
              ₦{listing.pricePerKg.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">/kg</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1"><MapPin size={12} className="text-[#08C40E]" />{listing.location}, {listing.state}</span>
          <span className="flex items-center gap-1"><Scale size={12} className="text-[#08C40E]" />{listing.quantity}kg available</span>
          <span className="flex items-center gap-1"><Clock size={12} className="text-[#08C40E]" />Harvested {timeAgo}</span>
        </div>

        <FreshnessBar value={freshness} />

        {listing.description && (
          <p className="text-sm text-gray-500 mt-4 leading-relaxed">{listing.description}</p>
        )}

        {/* NIN verified badge */}
        <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-[#F0FEF1] rounded-xl">
          <Star size={14} className="text-[#08C40E]" fill="#08C40E" />
          <span className="text-xs text-[#046207] font-medium">NIN-Verified Farmer · Escrow Protected</span>
        </div>
      </div>

      {/* Quantity + Buy */}
      <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5">
        <p className="text-xs font-bold text-[#046207] uppercase tracking-wide mb-3">Select Quantity</p>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-xl border border-[#CEFDCF] text-[#046207] font-bold text-xl hover:bg-[#F0FEF1] transition-colors">−</button>
          <span className="flex-1 text-center text-2xl font-black text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>{qty}kg</span>
          <button onClick={() => setQty(q => Math.min(listing.quantity, q + 1))} className="w-10 h-10 rounded-xl border border-[#CEFDCF] text-[#046207] font-bold text-xl hover:bg-[#F0FEF1] transition-colors">+</button>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>Subtotal ({qty}kg)</span>
          <span className="font-black text-[#023103] text-base" style={{ fontFamily: 'var(--font-display)' }}>₦{total.toLocaleString()}</span>
        </div>
        <button
          onClick={() => router.push(`/buyer/payment?listingId=${listing.id}&qty=${qty}`)}
          className="w-full py-3.5 rounded-xl bg-[#08C40E] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#06930A] transition-all shadow-lg shadow-green-200"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <ShoppingCart size={18} /> Buy Now · ₦{total.toLocaleString()}
        </button>
      </div>
    </div>
  );
}