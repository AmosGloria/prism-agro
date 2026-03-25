'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AddListingPage from '@/app/farmer/add/page';
import { listingsApi } from '@/lib/api';
import type { Listing } from '@/types';

const MOCK: Listing = {
  id: '2', farmerId: 'f1', farmerName: 'Emeka Farms', cropType: 'Pepper',
  quantity: 30, pricePerKg: 1200, location: 'Kano Farm Hub', state: 'Kano',
  harvestTime: new Date(Date.now() - 3_600_000 * 38).toISOString(),
  currentFreshness: 34, status: 'AVAILABLE',
  description: 'Fresh Scotch Bonnet peppers from our farm.',
  createdAt: new Date().toISOString(),
};

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>()!;
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    listingsApi.getById(id).then(d => setListing(d as Listing)).catch(() => setListing(MOCK));
  }, [id]);

  if (!listing) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#08C40E] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <AddListingPage
      mode="edit"
      initialData={{
        id: listing.id,
        cropType: listing.cropType,
        variety: listing.variety ?? '',
        quantity: String(listing.quantity),
        pricePerKg: String(listing.pricePerKg),
        location: listing.location,
        state: listing.state,
        harvestTime: listing.harvestTime,
        description: listing.description ?? '',
      }}
    />
  );
}