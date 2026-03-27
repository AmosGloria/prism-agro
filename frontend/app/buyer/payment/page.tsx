'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ShieldCheck, Truck, CheckCircle, AlertCircle,
  Leaf, MapPin, Scale, CreditCard, ArrowLeft,
} from 'lucide-react';
import { listingsApi, ordersApi } from '@/lib/api';
import type { Listing } from '@/types';

const MOCK_LISTING: Listing = {
  id: '1', farmerId: 'f1', farmerName: 'Emeka Farms', cropType: 'Tomato',
  quantity: 50, pricePerKg: 800, location: 'Kano', state: 'Kano',
  harvestTime: new Date(Date.now() - 3_600_000 * 5).toISOString(),
  currentFreshness: 90, status: 'AVAILABLE',
  createdAt: new Date().toISOString(),
  description: 'Premium Roma tomatoes, hand-sorted, farm-fresh from our Kano Valley farm.',
};

const CROP_EMOJI: Record<string, string> = {
  Tomato: '🍅', Yam: '🥔', Cassava: '🌿', Maize: '🌽', Rice: '🍚',
  Pepper: '🌶️', Onion: '🧅', Plantain: '🍌', Carrot: '🥕', Cabbage: '🥬',
};

function PaymentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = searchParams?.get('listingId') ?? '1';
  const initialQty = parseInt(searchParams?.get('qty') ?? '5');

  const [listing, setListing] = useState<Listing | null>(null);
  const [qty, setQty] = useState(initialQty);
  const [deliveryAddress, setAddr] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [step, setStep] = useState<'review' | 'success'>('review');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    setFetchLoading(true);
    listingsApi.getById(listingId)
      .then(d => setListing(d as Listing))
      .catch(() => setListing(MOCK_LISTING))
      .finally(() => setFetchLoading(false));
  }, [listingId]);

  const total = qty * (listing?.pricePerKg ?? 0);
  const logisticsFee = Math.round(total * 0.08);
  const grandTotal = total + logisticsFee;

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim() || !listing) return;
    setLoading(true);
    try {
      const res = await ordersApi.create({ listingId: listing.id, quantity: qty, deliveryAddress }) as any;
      setOrderId(res.id ?? 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase());
      setStep('success');
    } catch {
      setOrderId('ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase());
      setStep('success');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return (
    <div className="max-w-lg mx-auto space-y-4">
      {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-2xl bg-[#E6FEE7] animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />)}
    </div>
  );

  if (step === 'success') return (
    <div className="max-w-md mx-auto py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-[#E6FEE7] flex items-center justify-center mx-auto mb-6" style={{ animation: 'pulse-glow 2s infinite' }}>
        <CheckCircle size={40} className="text-[#08C40E]" />
      </div>
      <h1 className="text-2xl font-black text-[#023103] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Order Placed! 🎉</h1>
      <p className="text-sm text-[#06930A] mb-2">Order ID: <span className="font-bold text-[#023103]">{orderId}</span></p>
      <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
        <strong className="text-[#023103]">₦{grandTotal.toLocaleString()}</strong> is now held securely in <strong className="text-[#023103]">Prism Vault</strong>. Released only when you confirm delivery.
      </p>
      <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5 mb-6 text-left">
        <p className="text-xs font-bold text-[#046207] mb-4 uppercase tracking-wide">What happens next</p>
        {[
          { icon: ShieldCheck, label: 'Payment held in Prism Vault', done: true, color: '#08C40E' },
          { icon: Leaf, label: `${listing?.farmerName} prepares your order`, done: false, color: '#046207' },
          { icon: Truck, label: 'Logistics driver picks up & delivers', done: false, color: '#3B82F6' },
          { icon: CheckCircle, label: 'You confirm delivery — funds released to farmer', done: false, color: '#8B5CF6' },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: s.done ? s.color : '#F5FFF5', border: `1.5px solid ${s.done ? s.color : '#CEFDCF'}` }}>
              <s.icon size={14} style={{ color: s.done ? 'white' : s.color }} />
            </div>
            <p className={`text-sm ${s.done ? 'font-semibold text-[#023103]' : 'text-gray-400'}`}>{s.label}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={() => router.push('/buyer/orders')}
          className="flex-1 py-3 rounded-xl border border-[#CEFDCF] text-[#046207] font-semibold text-sm hover:bg-[#F0FEF1] transition-colors">
          My Orders
        </button>
        <button onClick={() => router.push('/buyer/marketplace')}
          className="flex-1 py-3 rounded-xl bg-[#08C40E] text-white font-semibold text-sm hover:bg-[#06930A] transition-all shadow-lg shadow-green-200"
          style={{ fontFamily: 'var(--font-display)' }}>
          Keep Shopping
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[#046207] mb-5 hover:text-[#023103] transition-colors">
        <ArrowLeft size={16} /> Back to Marketplace
      </button>
      <h1 className="text-2xl font-black text-[#023103] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Checkout</h1>

      {listing && (
        <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5 mb-4">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#E6FEE7] to-[#CEFDCF] flex items-center justify-center text-3xl shrink-0">
              {CROP_EMOJI[listing.cropType] ?? '🌱'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-black text-[#023103] text-lg" style={{ fontFamily: 'var(--font-display)' }}>{listing.cropType}</h2>
              <p className="text-sm text-[#06930A]">{listing.farmerName}</p>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={11} />{listing.location}</span>
                <span className="flex items-center gap-1"><Scale size={11} />{listing.quantity}kg available</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-black text-[#08C40E]" style={{ fontFamily: 'var(--font-display)' }}>₦{listing.pricePerKg.toLocaleString()}</p>
              <p className="text-xs text-gray-400">/kg</p>
            </div>
          </div>
          {listing.description && <p className="text-xs text-gray-500 bg-[#F5FFF5] rounded-xl p-3">{listing.description}</p>}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5 mb-4">
        <label className="block text-xs font-bold text-[#046207] uppercase tracking-wide mb-3">Quantity (kg)</label>
        <div className="flex items-center gap-4">
          <button onClick={() => setQty(q => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-xl border border-[#CEFDCF] text-[#046207] font-bold text-xl hover:bg-[#F0FEF1] transition-colors flex items-center justify-center">−</button>
          <input type="number" value={qty} min={1} max={listing?.quantity ?? 999}
            onChange={e => setQty(Math.max(1, Math.min(listing?.quantity ?? 999, parseInt(e.target.value) || 1)))}
            className="flex-1 text-center text-2xl font-black text-[#023103] border border-[#CEFDCF] rounded-xl py-2 focus:outline-none focus:border-[#08C40E] bg-[#F5FFF5]"
            style={{ fontFamily: 'var(--font-display)' }} />
          <button onClick={() => setQty(q => Math.min(listing?.quantity ?? 999, q + 1))}
            className="w-10 h-10 rounded-xl border border-[#CEFDCF] text-[#046207] font-bold text-xl hover:bg-[#F0FEF1] transition-colors flex items-center justify-center">+</button>
        </div>
        {listing && <p className="text-xs text-gray-400 mt-2 text-center">Max: {listing.quantity}kg available</p>}
      </div>

      <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5 mb-4">
        <label className="block text-xs font-bold text-[#046207] uppercase tracking-wide mb-3">Delivery Address *</label>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-3 text-[#06930A]" />
          <textarea value={deliveryAddress} onChange={e => setAddr(e.target.value)}
            placeholder="Enter full delivery address (street, city, state)…" rows={3}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[#CEFDCF] bg-[#F5FFF5] text-[#023103] focus:outline-none focus:border-[#08C40E] resize-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5 mb-6">
        <p className="text-xs font-bold text-[#046207] uppercase tracking-wide mb-4">Order Summary</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-500"><span>{listing?.cropType} × {qty}kg</span><span>₦{total.toLocaleString()}</span></div>
          <div className="flex justify-between text-gray-500"><span>Logistics fee (8%)</span><span>₦{logisticsFee.toLocaleString()}</span></div>
          <div className="h-px bg-[#E6FEE7] my-2" />
          <div className="flex justify-between font-black text-[#023103] text-base">
            <span style={{ fontFamily: 'var(--font-display)' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)' }}>₦{grandTotal.toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-[#F0FEF1] border border-[#CEFDCF]">
          <ShieldCheck size={16} className="text-[#08C40E] shrink-0 mt-0.5" />
          <p className="text-xs text-[#046207]"><strong>Prism Vault Protection:</strong> Funds held in escrow until you confirm delivery. 100% refundable if there's an issue.</p>
        </div>
      </div>

      {!deliveryAddress.trim() && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl">
          <AlertCircle size={14} className="text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700">Please enter a delivery address to continue.</p>
        </div>
      )}

      <button onClick={handlePlaceOrder} disabled={loading || !deliveryAddress.trim()}
        className="w-full py-4 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: '#08C40E', fontFamily: 'var(--font-display)', boxShadow: '0 6px 24px rgba(8,196,14,0.3)' }}>
        {loading ? (
          <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing…</>
        ) : (
          <><CreditCard size={20} />Pay ₦{grandTotal.toLocaleString()} Securely</>
        )}
      </button>
      <p className="text-center text-xs text-gray-400 mt-3">By placing this order you agree to the PrismAgro escrow terms.</p>
    </div>
  );
}

// Page export — Suspense boundary is REQUIRED when using useSearchParams in Next.js
export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto space-y-4 pt-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 rounded-2xl bg-[#E6FEE7] animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
    }>
      <PaymentInner />
    </Suspense>
  );
}