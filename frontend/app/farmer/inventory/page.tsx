'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, MapPin, Scale, Clock } from 'lucide-react';
import { useFreshness, useTimeAgo } from '@/hooks';
import { listingsApi } from '@/lib/api';
import type { Listing } from '@/types';
import { StatusBadge } from '@/components/ui/getStatusBadge';
import { FreshnessBar } from '@/components/ui/freshnessBar';
import { ConfirmModal } from '@/components/ui/modal';
import { EmptyState } from '@/components/ui/empty-state';

const MOCK_LISTINGS: Listing[] = [
  { id: '1', farmerId: 'f1', farmerName: 'Emeka Farms', cropType: 'Tomato', quantity: 50, pricePerKg: 800, location: 'Kano', state: 'Kano', harvestTime: new Date(Date.now() - 3_600_000 * 5).toISOString(), currentFreshness: 90, status: 'AVAILABLE', createdAt: new Date().toISOString() },
  { id: '2', farmerId: 'f1', farmerName: 'Emeka Farms', cropType: 'Pepper', quantity: 30, pricePerKg: 1200, location: 'Kano', state: 'Kano', harvestTime: new Date(Date.now() - 3_600_000 * 38).toISOString(), currentFreshness: 34, status: 'AVAILABLE', createdAt: new Date().toISOString() },
  { id: '3', farmerId: 'f1', farmerName: 'Emeka Farms', cropType: 'Maize', quantity: 200, pricePerKg: 180, location: 'Kano', state: 'Kano', harvestTime: new Date(Date.now() - 3_600_000 * 2).toISOString(), currentFreshness: 96, status: 'AVAILABLE', createdAt: new Date().toISOString() },
];

const CROP_EMOJI: Record<string, string> = { Tomato: '🍅', Yam: '🥔', Cassava: '🌿', Maize: '🌽', Rice: '🍚', Pepper: '🌶️', Onion: '🧅', Plantain: '🍌', Carrot: '🥕', Cabbage: '🥬' };

function InventoryCard({
  listing,
  onDelete,
}: {
  listing: Listing;
  onDelete: (id: string) => void;
}) {
  const freshness = useFreshness(listing.harvestTime, listing.currentFreshness);
  const timeAgo = useTimeAgo(listing.harvestTime);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await listingsApi.delete(listing.id);
      onDelete(listing.id);
    } catch {
      onDelete(listing.id); // optimistic in dev
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E6FEE7] p-4 card-hover animate-fade-up" style={{ boxShadow: '0 2px 10px rgba(2,49,3,0.05)' }}>
        <div className="flex items-start gap-3 mb-3">
          {/* Emoji + crop */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E6FEE7] to-[#CEFDCF] flex items-center justify-center text-2xl shrink-0">
            {CROP_EMOJI[listing.cropType] ?? '🌱'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[#023103] text-base" style={{ fontFamily: 'var(--font-display)' }}>
                {listing.cropType}
              </h3>
              <StatusBadge status={listing.status} size="sm" />
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Scale size={11} /> {listing.quantity}kg
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin size={11} /> {listing.location}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={11} /> {timeAgo}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-black text-[#08C40E]" style={{ fontFamily: 'var(--font-display)' }}>
              ₦{listing.pricePerKg.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400">/kg</p>
          </div>
        </div>

        {/* Freshness */}
        <div className="mb-4">
          <FreshnessBar value={freshness} />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/farmer/inventory/${listing.id}/edit`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#CEFDCF] text-[#046207] text-xs font-semibold hover:bg-[#F0FEF1] transition-colors"
          >
            <Edit2 size={13} /> Edit
          </Link>
          <button
            onClick={() => setConfirmOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-100 text-red-500 text-xs font-semibold hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete this listing?"
        description={`Are you sure you want to remove your ${listing.cropType} listing (${listing.quantity}kg)? This cannot be undone.`}
        confirmLabel="Yes, Delete"
        danger
        loading={deleting}
      />
    </>
  );
}

export default function FarmerInventoryPage() {
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);

  const handleDelete = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>
            My Produce
          </h1>
          <p className="text-sm text-[#06930A] mt-1">
            {listings.length} active listing{listings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/farmer/add"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#08C40E] text-white text-sm font-semibold hover:bg-[#06930A] transition-all shadow-md shadow-green-200"
        >
          <Plus size={16} /> Add New
        </Link>
      </div>

      {listings.length === 0 ? (
        <EmptyState
          title="You haven't listed anything yet."
          description="Your harvest deserves buyers. Add your first listing to start selling fresh produce directly to buyers across Nigeria."
          action={{ label: '🌱 Tap here to sell your first harvest!', href: '/farmer/add' }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing, i) => (
            <div key={listing.id} style={{ animationDelay: `${i * 60}ms` }}>
              <InventoryCard listing={listing} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}