'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, ShieldCheck, Truck, Leaf, Lock,
  ChevronRight, Loader2, CheckCircle2, AlertCircle,
  CreditCard, Building2, Smartphone, Star, MapPin
} from 'lucide-react';
import { listingsApi } from '@/lib/api';
import type { Listing } from '@/types';
import { MOCK_LISTINGS } from '@/mock-datas/buyer';
import { CROP_EMOJI } from '@/mock-datas/market-place';
import { usePaymentFlow, computeCheckoutPricing } from '@/hooks/usePaymentFlow';

function fmt(n: number) {
  return '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function SpinnerScreen({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="min-h-screen bg-[#F5FFF5] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full border-4 border-[#E6FEE7] border-t-[#08C40E] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-[#08C40E]" />
        </div>
      </div>
      <h2 className="text-2xl font-black text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h2>
      <p className="text-sm text-[#06930A] mt-2 max-w-xs leading-relaxed">{subtitle}</p>

      <div className="mt-10 flex flex-col items-center gap-2 opacity-50">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secured by</p>
        <div className="flex items-center gap-4">
          <span className="text-xs font-black text-gray-400 tracking-tighter">INTERSWITCH</span>
          <div className="w-px h-4 bg-gray-300" />
          <span className="text-xs font-black text-gray-400 tracking-tighter">QUICKTELLER</span>
        </div>
      </div>
    </div>
  );
}

function RedirectingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#023103] to-[#046207] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 max-w-sm w-full border border-white/20">
        <Loader2 className="w-14 h-14 text-white animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Redirecting to Interswitch…
        </h2>
        <p className="text-white/70 text-sm mt-3 leading-relaxed">
          You are being securely transferred to Interswitch's payment gateway.
          Please do not close this tab.
        </p>
        <div className="mt-8 bg-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-white/60 text-xs mb-1">
            <span>Encrypted handshake</span>
            <span className="text-[#08C40E] font-bold">● Active</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-[#08C40E] rounded-full animate-[progress_1.2s_ease-in-out_forwards]" style={{ width: '100%', animation: 'none', transform: 'translateX(-100%)', animationName: 'slideRight', animationDuration: '1.2s', animationFillMode: 'forwards' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ listing, qty, total, onGoToOrders }: {
  listing: Listing; qty: number; total: number; onGoToOrders: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div className="min-h-screen bg-[#F5FFF5] flex items-center justify-center p-4">
      <div
        className={`max-w-md w-full bg-white rounded-[32px] p-10 shadow-2xl shadow-green-100 border border-[#E6FEE7] text-center transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        <div className="relative mx-auto mb-8 w-fit">
          <div className="w-24 h-24 rounded-full bg-[#08C40E]/10 flex items-center justify-center animate-pulse-glow">
            <CheckCircle2 className="w-14 h-14 text-[#08C40E]" />
          </div>
          <div className="absolute -top-1 -right-1 bg-[#08C40E] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            Secured
          </div>
        </div>

        <h1 className="text-3xl font-black text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>
          Payment Held in Escrow!
        </h1>
        <p className="text-[#046207] text-sm mt-3 leading-relaxed">
          <strong>{fmt(total)}</strong> is now locked in Prism Agro's secure escrow vault.
          The farmer will only be paid after you confirm delivery with your <strong>6-digit release code</strong>.
        </p>

        {/* Receipt strip */}
        <div className="mt-6 bg-[#F5FFF5] rounded-2xl p-4 border border-[#E6FEE7] text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Produce</span>
            <span className="font-semibold text-[#023103]">
              {CROP_EMOJI[listing.cropType] ?? '🌱'} {listing.cropType} ({qty}kg)
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Farmer</span>
            <span className="font-semibold text-[#023103]">{listing.farmerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Amount Secured</span>
            <span className="font-black text-[#08C40E]">{fmt(total)}</span>
          </div>
        </div>

        {/* Escrow steps */}
        <div className="mt-6 text-left space-y-3">
          {[
            { step: '1', label: 'Payment secured in escrow', done: true },
            { step: '2', label: 'Farmer notified — preparing order', done: true },
            { step: '3', label: 'Logistics partner assigned', done: false },
            { step: '4', label: 'You confirm delivery → funds released', done: false },
          ].map(({ step, label, done }) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${done ? 'bg-[#08C40E] text-white' : 'bg-[#E6FEE7] text-[#046207]'}`}>
                {done ? '✓' : step}
              </div>
              <span className={`text-xs ${done ? 'text-[#023103] font-semibold' : 'text-gray-400'}`}>{label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onGoToOrders}
          className="w-full mt-8 bg-[#08C40E] text-white py-4 rounded-2xl font-black text-sm hover:bg-[#06930A] transition-all active:scale-95 shadow-lg shadow-green-200"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Track My Order →
        </button>
        <p className="text-[10px] text-gray-400 mt-3">
          You'll receive your 6-digit release code via email & SMS
        </p>
      </div>
    </div>
  );
}

/* ─── Main checkout UI ─────────────────────────────────────── */
function CheckoutContent({ listing, qty }: { listing: Listing; qty: number }) {
  const { status, errorMsg, initialize, reset, router } = usePaymentFlow(listing.id);
  const pricing = computeCheckoutPricing(qty, listing.pricePerKg);

  const [payMethod, setPayMethod] = useState<'card' | 'bank' | 'ussd'>('card');

  if (status === 'initializing') return (
    <SpinnerScreen
      title="Initialising Secure Payment…"
      subtitle="Generating your encrypted payment reference. Please wait."
    />
  );
  if (status === 'redirecting') return <RedirectingScreen />;
  if (status === 'verifying') return (
    <SpinnerScreen
      title="Verifying Transaction…"
      subtitle="Confirming your payment with Interswitch. Locking funds in escrow."
    />
  );
  if (status === 'success') return (
    <SuccessScreen
      listing={listing}
      qty={qty}
      total={pricing.total}
      onGoToOrders={() => router.push('/buyer/orders')}
    />
  );

  return (
    <div className="min-h-screen bg-[#F5FFF5]">

      {/* ── Navbar ── */}
      <nav className="bg-[#023103] text-white py-4 px-5 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span className="font-black text-lg tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Prism <span className="text-[#08C40E]">Agro</span> · Checkout
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50">
            <Lock size={11} /> SSL Secure
          </div>
        </div>
      </nav>

      {/* ── Interswitch trust bar ── */}
      <div className="bg-[#046207]/10 border-b border-[#CEFDCF]">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between text-xs text-[#046207]">
          <span className="font-semibold flex items-center gap-1.5">
            <ShieldCheck size={12} /> Escrow-Protected Transaction
          </span>
          <span className="font-bold tracking-tighter opacity-60">
            POWERED BY INTERSWITCH
          </span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Product card */}
          <section className="bg-white rounded-3xl border border-[#E6FEE7] p-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#046207] mb-4">Order Summary</h2>
            <div className="flex gap-5 items-center p-4 bg-[#F5FFF5] rounded-2xl border border-[#E6FEE7]">
              {/* Produce icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-[#E6FEE7] to-[#CEFDCF] rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 shadow-inner">
                {CROP_EMOJI[listing.cropType] ?? '🌱'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>
                      {listing.cropType}
                    </h3>
                    <p className="text-xs text-[#06930A] mt-0.5">{listing.farmerName}</p>
                  </div>
                  <span className="text-lg font-black text-[#08C40E] whitespace-nowrap" style={{ fontFamily: 'var(--font-display)' }}>
                    {fmt(pricing.produceSubtotal)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-[#E6FEE7]">
                    <MapPin size={10} className="text-[#08C40E]" /> {listing.location}, {listing.state}
                  </span>
                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-[#E6FEE7]">
                    <Leaf size={10} className="text-[#08C40E]" /> {qty}kg ordered
                  </span>
                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-[#E6FEE7]">
                    <Star size={10} className="text-[#08C40E] fill-[#08C40E]" /> NIN-Verified
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Payment method selector */}
          <section className="bg-white rounded-3xl border border-[#E6FEE7] p-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#046207] mb-4">Payment Method</h2>
            <div className="grid grid-cols-3 gap-3">
              {([
                { id: 'card', icon: CreditCard, label: 'Debit Card' },
                { id: 'bank', icon: Building2, label: 'Bank Transfer' },
                { id: 'ussd', icon: Smartphone, label: 'USSD' },
              ] as const).map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setPayMethod(id)}
                  className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all text-xs font-semibold ${payMethod === id
                    ? 'border-[#08C40E] bg-[#F0FEF1] text-[#023103]'
                    : 'border-[#E6FEE7] text-gray-400 hover:border-[#CEFDCF] hover:text-[#046207]'
                    }`}
                >
                  <Icon size={22} className={payMethod === id ? 'text-[#08C40E]' : 'text-gray-300'} />
                  {label}
                </button>
              ))}
            </div>

            {/* Mock card form */}
            {payMethod === 'card' && (
              <div className="mt-5 space-y-3 animate-fade-up">
                <div>
                  <label className="text-[11px] font-bold text-[#046207] uppercase tracking-wide block mb-1">Card Number</label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="5399 8300 0000 0000"
                    className="w-full px-4 py-3 rounded-xl border border-[#E6FEE7] text-sm text-[#023103] bg-[#F5FFF5] focus:outline-none focus:border-[#08C40E] transition-colors placeholder:text-gray-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#046207] uppercase tracking-wide block mb-1">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      maxLength={7}
                      className="w-full px-4 py-3 rounded-xl border border-[#E6FEE7] text-sm text-[#023103] bg-[#F5FFF5] focus:outline-none focus:border-[#08C40E] transition-colors placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#046207] uppercase tracking-wide block mb-1">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={3}
                      className="w-full px-4 py-3 rounded-xl border border-[#E6FEE7] text-sm text-[#023103] bg-[#F5FFF5] focus:outline-none focus:border-[#08C40E] transition-colors placeholder:text-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#046207] uppercase tracking-wide block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="As it appears on the card"
                    className="w-full px-4 py-3 rounded-xl border border-[#E6FEE7] text-sm text-[#023103] bg-[#F5FFF5] focus:outline-none focus:border-[#08C40E] transition-colors placeholder:text-gray-300"
                  />
                </div>
              </div>
            )}

            {payMethod === 'bank' && (
              <div className="mt-5 p-4 bg-[#F5FFF5] rounded-2xl border border-[#E6FEE7] animate-fade-up">
                <p className="text-xs text-[#046207] font-semibold mb-1">Transfer to Prism Agro Escrow Account:</p>
                <div className="space-y-2 mt-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Bank</span>
                    <span className="font-bold text-[#023103]">Zenith Bank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Account Number</span>
                    <span className="font-bold text-[#023103]">1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Account Name</span>
                    <span className="font-bold text-[#023103]">Prism Agro Escrow Ltd</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Amount</span>
                    <span className="font-black text-[#08C40E]">{fmt(pricing.total)}</span>
                  </div>
                </div>
              </div>
            )}

            {payMethod === 'ussd' && (
              <div className="mt-5 p-4 bg-[#F5FFF5] rounded-2xl border border-[#E6FEE7] animate-fade-up text-center">
                <p className="text-xs text-[#046207] font-semibold mb-3">Dial the code below on your phone:</p>
                <div className="text-3xl font-black text-[#023103] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  *322*36*{Math.floor(Math.random() * 90000 + 10000)}#
                </div>
                <p className="text-[11px] text-gray-400 mt-2">GTBank · First Bank · Access · Zenith supported</p>
              </div>
            )}
          </section>

          {/* Escrow explanation */}
          <div className="bg-[#023103] text-white rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-green-900/20">
            <div className="relative z-10 flex gap-4">
              <div className="bg-[#08C40E] p-3 rounded-2xl h-fit shadow-lg shadow-[#08C40E]/30 flex-shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="font-bold text-base">Why Escrow Protection?</h4>
                <p className="text-white/70 text-sm mt-1.5 leading-relaxed">
                  Your {fmt(pricing.total)} is locked in a secure vault — not paid to the farmer until you
                  physically receive the produce and enter your <strong className="text-white">6-digit release code</strong>.
                  Zero risk of fraud.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 text-white/5 font-black text-8xl pointer-events-none uppercase rotate-12">
              SAFE
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN — Price breakdown + CTA ── */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-[#E6FEE7] p-7 shadow-xl shadow-green-50 sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#046207] mb-6">Price Breakdown</h3>

            <div className="space-y-4 mb-6">
              {/* Produce subtotal */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-[#023103] font-medium">Produce Cost</p>
                  <p className="text-[11px] text-gray-400">{qty}kg × {fmt(listing.pricePerKg)}/kg</p>
                </div>
                <span className="font-bold text-[#023103]">{fmt(pricing.produceSubtotal)}</span>
              </div>

              {/* Logistics fee */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-sm text-[#023103] font-medium flex items-center gap-1.5">
                      <Truck size={13} className="text-[#08C40E]" /> Logistics Fee
                    </p>
                    <p className="text-[11px] text-gray-400">Base ₦1,500 + ₦20/kg</p>
                  </div>
                </div>
                <span className="font-bold text-[#023103]">{fmt(pricing.logisticsFee)}</span>
              </div>

              {/* Escrow fee */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-[#023103] font-medium flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-[#08C40E]" /> Escrow Platform Fee
                  </p>
                  <p className="text-[11px] text-gray-400">1% of produce · min ₦300</p>
                </div>
                <span className="font-bold text-[#023103]">{fmt(pricing.escrowFee)}</span>
              </div>

              {/* Divider */}
              <div className="pt-4 border-t-2 border-dashed border-[#E6FEE7] flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Total to Pay</p>
                  <p className="text-[10px] text-gray-300 mt-0.5">All fees inclusive · Escrow protected</p>
                </div>
                <span className="text-3xl font-black text-[#08C40E]" style={{ fontFamily: 'var(--font-display)' }}>
                  {fmt(pricing.total)}
                </span>
              </div>
            </div>

            {/* Error state */}
            {status === 'error' && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-fade-up">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{errorMsg ?? 'Payment failed. Please try again.'}</span>
                <button onClick={reset} className="ml-auto text-xs underline font-semibold">Retry</button>
              </div>
            )}

            {/* CTA */}
            <button
              id="pay-securely-btn"
              onClick={() => initialize(pricing)}
              disabled={status !== 'idle' && status !== 'error'}
              className="w-full bg-[#08C40E] text-white py-5 rounded-2xl font-black text-base flex items-center justify-center gap-3 hover:bg-[#06930A] hover:scale-[1.02] active:scale-[0.97] transition-all shadow-xl shadow-[#08C40E]/25 disabled:opacity-50 disabled:pointer-events-none"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Lock size={18} />
              PAY SECURELY · {fmt(pricing.total)}
              <ChevronRight size={18} />
            </button>

            {/* Trust badges */}
            <div className="mt-6 flex flex-col items-center gap-3 opacity-50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Powered by</p>
              <div className="flex items-center gap-5">
                <span className="text-xs font-black text-gray-500 tracking-tighter">INTERSWITCH</span>
                <div className="w-px h-4 bg-gray-200" />
                <span className="text-xs font-black text-gray-500 tracking-tighter">QUICKTELLER</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold">
                <Lock size={10} /> 256-bit SSL Encrypted
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Data loader ──────────────────────────────────────────── */
function CheckoutLoader() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const qty = parseInt(searchParams?.get('qty') ?? '1', 10) || 1;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    listingsApi.getById(id)
      .then(d => setListing(d as Listing))
      .catch(() => {
        // Fallback to mock data
        const mock = MOCK_LISTINGS.find(l => l.id === id);
        if (mock) setListing(mock);
        else setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#F5FFF5] flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-[#08C40E] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound || !listing) return (
    <div className="min-h-screen bg-[#F5FFF5] flex flex-col items-center justify-center gap-4 text-center p-6">
      <AlertCircle className="w-16 h-16 text-red-400" />
      <h2 className="text-2xl font-black text-[#023103]">Listing Not Found</h2>
      <p className="text-sm text-gray-400">This product may no longer be available.</p>
      <a href="/buyer/marketplace" className="mt-2 px-6 py-3 bg-[#08C40E] text-white rounded-xl font-bold text-sm hover:bg-[#06930A] transition-colors">
        Back to Marketplace
      </a>
    </div>
  );

  return <CheckoutContent listing={listing} qty={Math.min(qty, listing.quantity)} />;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5FFF5] flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-[#08C40E] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutLoader />
    </Suspense>
  );
}
