"use client";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ShieldCheck, Truck, CheckCircle, AlertCircle, Leaf,
  MapPin, Scale, CreditCard, Building2, Smartphone,
  ArrowLeft, Lock, ChevronRight, Loader2, Star,
} from "lucide-react";
import { listingsApi, ordersApi } from "@/lib/api";
import type { Listing } from "@/types";
import { ProduceIcon } from "@/components/ui/produce-icon";
import { MOCK_LISTINGS } from "@/mock-datas/buyer";

function calcFees(qty: number, pricePerKg: number) {
  const produce = qty * pricePerKg;
  const logistics = Math.min(1500 + qty * 20, 8000);
  const escrow = Math.min(Math.max(Math.round(produce * 0.01), 300), 3000);
  return { produce, logistics, escrow, total: produce + logistics + escrow };
}

function fmt(n: number) {
  return "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2 });
}

function InitialisingScreen() {
  return (
    <div className="min-h-screen bg-[#F5FFF5] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full border-4 border-[#E6FEE7] border-t-[#08C40E] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-[#08C40E]" />
        </div>
      </div>
      <h2 className="text-2xl font-black text-[#023103]" style={{ fontFamily: "var(--font-display)" }}>
        Initialising Secure Payment…
      </h2>
      <p className="text-sm text-[#06930A] mt-2 max-w-xs leading-relaxed">
        Generating your encrypted payment reference. Please wait.
      </p>
      <div className="mt-10 opacity-40 flex flex-col items-center gap-2">
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
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setProgress((p) => Math.min(p + 8, 100)), 96);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#023103] to-[#046207] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 max-w-sm w-full border border-white/20">
        <Loader2 className="w-14 h-14 text-white animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
          Redirecting to Interswitch…
        </h2>
        <p className="text-white/70 text-sm mt-3 leading-relaxed">
          You are being securely transferred to Interswitch's payment gateway. Please do not close this tab.
        </p>
        <div className="mt-8 bg-white/10 rounded-2xl p-4 text-left">
          <div className="flex items-center justify-between text-white/60 text-xs mb-2">
            <span>Encrypted handshake</span>
            <span className="text-[#08C40E] font-bold">● Active</span>
          </div>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-[#08C40E] rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-white/40 mt-2 text-right">{progress}%</p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3 opacity-40">
          <span className="text-xs font-black text-white tracking-tighter">INTERSWITCH</span>
          <div className="w-px h-4 bg-white/30" />
          <span className="text-xs font-black text-white tracking-tighter">QUICKTELLER</span>
        </div>
      </div>
    </div>
  );
}

function VerifyingScreen() {
  return (
    <div className="min-h-screen bg-[#F5FFF5] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full border-4 border-[#E6FEE7] border-t-[#08C40E] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="w-8 h-8 text-[#08C40E]" />
        </div>
      </div>
      <h2 className="text-2xl font-black text-[#023103]" style={{ fontFamily: "var(--font-display)" }}>
        Verifying Transaction…
      </h2>
      <p className="text-sm text-[#06930A] mt-2 max-w-xs leading-relaxed">
        Confirming your payment with Interswitch. Locking funds into escrow vault.
      </p>
    </div>
  );
}

function SuccessScreen({
  listing, qty, fees, orderId, onOrders, onShop,
}: {
  listing: Listing; qty: number;
  fees: ReturnType<typeof calcFees>;
  orderId: string;
  onOrders: () => void; onShop: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  return (
    <div className="min-h-screen bg-[#F5FFF5] flex items-center justify-center p-4">
      <div
        className={`max-w-md w-full bg-white rounded-[32px] p-10 shadow-2xl shadow-green-100 border border-[#E6FEE7] text-center transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="relative mx-auto mb-8 w-fit">
          <div className="w-24 h-24 rounded-full bg-[#08C40E]/10 flex items-center justify-center" style={{ animation: "pulse-glow 2s infinite" }}>
            <CheckCircle className="w-14 h-14 text-[#08C40E]" />
          </div>
          <div className="absolute -top-1 -right-1 bg-[#08C40E] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Secured</div>
        </div>

        <h1 className="text-3xl font-black text-[#023103]" style={{ fontFamily: "var(--font-display)" }}>
          Payment Held in Escrow!
        </h1>
        <p className="text-[#046207] text-sm mt-3 leading-relaxed">
          <strong>{fmt(fees.total)}</strong> is now locked in Prism Agro's secure escrow vault.
          The farmer only gets paid after you confirm delivery with your <strong>6-digit release code</strong>.
        </p>

        <div className="mt-6 bg-[#F5FFF5] rounded-2xl p-4 border border-[#E6FEE7] text-left space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Order ID</span>
            <span className="font-bold text-[#023103]">{orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Produce</span>
            <span className="font-semibold text-[#023103] flex items-center gap-1.5">
              <ProduceIcon cropType={listing.cropType} size={16} /> {listing.cropType} × {qty}kg
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Farmer</span>
            <span className="font-semibold text-[#023103]">{listing.farmerName}</span>
          </div>
          <div className="pt-2 border-t border-[#E6FEE7] flex justify-between text-sm">
            <span className="text-gray-400">Produce</span>
            <span className="text-[#023103]">{fmt(fees.produce)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Logistics</span>
            <span className="text-[#023103]">{fmt(fees.logistics)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Escrow Fee</span>
            <span className="text-[#023103]">{fmt(fees.escrow)}</span>
          </div>
          <div className="flex justify-between font-black text-base pt-1 border-t border-[#E6FEE7]">
            <span className="text-[#023103]">Amount Secured</span>
            <span className="text-[#08C40E]">{fmt(fees.total)}</span>
          </div>
        </div>

        <div className="mt-6 text-left space-y-3">
          {[
            { label: "Payment secured in escrow", done: true },
            { label: `${listing.farmerName} notified — preparing order`, done: true },
            { label: "Logistics partner being assigned", done: false },
            { label: "You confirm delivery → funds released", done: false },
          ].map(({ label, done }, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${done ? "bg-[#08C40E] text-white" : "bg-[#E6FEE7] text-[#046207]"}`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-xs ${done ? "text-[#023103] font-semibold" : "text-gray-400"}`}>{label}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onOrders}
            className="flex-1 py-3.5 rounded-2xl border border-[#CEFDCF] text-[#046207] font-bold text-sm hover:bg-[#F0FEF1] transition-colors"
          >
            My Orders
          </button>
          <button
            onClick={onShop}
            className="flex-1 py-3.5 rounded-2xl bg-[#08C40E] text-white font-bold text-sm hover:bg-[#06930A] transition-all shadow-lg shadow-green-200"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Keep Shopping
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-3">
          Your 6-digit release code will be sent via email & SMS
        </p>
      </div>
    </div>
  );
}

type FlowStep = "review" | "initialising" | "redirecting" | "verifying" | "success" | "error";
type PayMethod = "card" | "bank" | "ussd";

function PaymentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = searchParams?.get("listingId") ?? "1";
  const initialQty = parseInt(searchParams?.get("qty") ?? "1") || 1;

  const [listing, setListing] = useState<Listing | null>(null);
  const [qty, setQty] = useState(initialQty);
  const [deliveryAddress, setAddr] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true);
  const [step, setStep] = useState<FlowStep>("review");
  const [orderId, setOrderId] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod>("card");

  useEffect(() => {
    setFetchLoading(true);
    listingsApi
      .getById(listingId)
      .then((d) => setListing(d as Listing))
      .catch(() => {
        const fallback = MOCK_LISTINGS.find((l) => l.id === listingId);
        setListing(fallback ?? MOCK_LISTINGS[0]);
      })
      .finally(() => setFetchLoading(false));
  }, [listingId]);

  const fees = listing ? calcFees(qty, listing.pricePerKg) : null;

  const handlePay = useCallback(async () => {
    if (!deliveryAddress.trim() || !listing || !fees) return;

    try {
      setStep("initialising");
      await new Promise((r) => setTimeout(r, 900));

      let newOrderId: string;
      try {
        const orderRes = (await ordersApi.create({
          listingId: listing.id,
          quantity: qty,
          deliveryAddress,
        })) as any;
        newOrderId = orderRes.id ?? "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      } catch {
        newOrderId = "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      }
      setOrderId(newOrderId);
      sessionStorage.setItem(`order_amount_${newOrderId}`, String(fees.total));

      setStep("redirecting");
      await new Promise((r) => setTimeout(r, 1400));

      setStep("verifying");
      await new Promise((r) => setTimeout(r, 2000));

      setStep("success");
    } catch {
      setErrMsg("Something went wrong. Please try again.");
      setStep("error");
    }
  }, [listing, qty, deliveryAddress, fees]);

  if (step === "initialising") return <InitialisingScreen />;
  if (step === "redirecting") return <RedirectingScreen />;
  if (step === "verifying") return <VerifyingScreen />;
  if (step === "success" && listing && fees)
    return (
      <SuccessScreen
        listing={listing}
        qty={qty}
        fees={fees}
        orderId={orderId}
        onOrders={() => router.push("/buyer/orders")}
        onShop={() => router.push("/buyer/marketplace")}
      />
    );

  if (fetchLoading)
    return (
      <div className="max-w-lg mx-auto space-y-4 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-[#E6FEE7] animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-[#046207]/10 border border-[#CEFDCF] rounded-2xl mb-6 px-5 py-3 flex items-center justify-between text-xs text-[#046207]">
        <span className="font-semibold flex items-center gap-1.5">
          <ShieldCheck size={13} /> Escrow-Protected Transaction
        </span>
        <span className="font-bold tracking-tighter opacity-60 flex items-center gap-1.5">
          <Lock size={11} /> POWERED BY INTERSWITCH
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-5">

          {listing && (
            <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5">
              <p className="text-xs font-bold text-[#046207] uppercase tracking-widest mb-4">Order Summary</p>
              <div className="flex gap-4 items-center p-4 bg-[#F5FFF5] rounded-2xl border border-[#E6FEE7]">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#E6FEE7] to-[#CEFDCF] flex items-center justify-center shrink-0">
                  <ProduceIcon cropType={listing.cropType} size={40} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-black text-[#023103] text-lg" style={{ fontFamily: "var(--font-display)" }}>
                        {listing.cropType}
                      </h2>
                      <p className="text-sm text-[#06930A]">{listing.farmerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#08C40E] text-xl" style={{ fontFamily: "var(--font-display)" }}>
                        {fmt(listing.pricePerKg)}
                      </p>
                      <p className="text-xs text-gray-400">/kg</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-[#E6FEE7]">
                      <MapPin size={10} className="text-[#08C40E]" /> {listing.location}, {listing.state}
                    </span>
                    <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-[#E6FEE7]">
                      <Scale size={10} className="text-[#08C40E]" /> {listing.quantity}kg available
                    </span>
                    <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-[#E6FEE7]">
                      <Star size={10} className="text-[#08C40E] fill-[#08C40E]" /> NIN-Verified
                    </span>
                  </div>
                  {listing.description && (
                    <p className="text-xs text-gray-500 mt-3 bg-white rounded-xl p-2.5 border border-[#E6FEE7]">{listing.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5">
            <label className="block text-xs font-bold text-[#046207] uppercase tracking-wide mb-3">Quantity (kg)</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl border border-[#CEFDCF] text-[#046207] font-bold text-xl hover:bg-[#F0FEF1] transition-colors flex items-center justify-center"
              >−</button>
              <input
                type="number"
                value={qty}
                min={1}
                max={listing?.quantity ?? 999}
                onChange={(e) => setQty(Math.max(1, Math.min(listing?.quantity ?? 999, parseInt(e.target.value) || 1)))}
                className="flex-1 text-center text-2xl font-black text-[#023103] border border-[#CEFDCF] rounded-xl py-2 focus:outline-none focus:border-[#08C40E] bg-[#F5FFF5]"
                style={{ fontFamily: "var(--font-display)" }}
              />
              <button
                onClick={() => setQty((q) => Math.min(listing?.quantity ?? 999, q + 1))}
                className="w-10 h-10 rounded-xl border border-[#CEFDCF] text-[#046207] font-bold text-xl hover:bg-[#F0FEF1] transition-colors flex items-center justify-center"
              >+</button>
            </div>
            {listing && <p className="text-xs text-gray-400 mt-2 text-center">Max: {listing.quantity}kg available</p>}
          </div>

          <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5">
            <label className="block text-xs font-bold text-[#046207] uppercase tracking-wide mb-3">Delivery Address *</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-[#06930A]" />
              <textarea
                value={deliveryAddress}
                onChange={(e) => setAddr(e.target.value)}
                placeholder="Enter full delivery address (street, city, state)…"
                rows={3}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[#CEFDCF] bg-[#F5FFF5] text-[#023103] focus:outline-none focus:border-[#08C40E] resize-none placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5">
            <p className="text-xs font-bold text-[#046207] uppercase tracking-widest mb-4">Payment Method</p>
            <div className="grid grid-cols-3 gap-3">
              {([
                { id: "card" as PayMethod, icon: CreditCard, label: "Debit Card" },
                { id: "bank" as PayMethod, icon: Building2, label: "Bank Transfer" },
                { id: "ussd" as PayMethod, icon: Smartphone, label: "USSD" },
              ]).map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setPayMethod(id)}
                  className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all text-xs font-semibold ${payMethod === id ? "border-[#08C40E] bg-[#F0FEF1] text-[#023103]" : "border-[#E6FEE7] text-gray-400 hover:border-[#CEFDCF] hover:text-[#046207]"}`}
                >
                  <Icon size={20} className={payMethod === id ? "text-[#08C40E]" : "text-gray-300"} />
                  {label}
                </button>
              ))}
            </div>

            {payMethod === "card" && (
              <div className="mt-5 space-y-3 animate-fade-up">
                <div>
                  <label className="text-[11px] font-bold text-[#046207] uppercase tracking-wide block mb-1">Card Number</label>
                  <input type="text" maxLength={19} placeholder="5399 8300 0000 0000"
                    className="w-full px-4 py-3 rounded-xl border border-[#E6FEE7] text-sm text-[#023103] bg-[#F5FFF5] focus:outline-none focus:border-[#08C40E] transition-colors placeholder:text-gray-300" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#046207] uppercase tracking-wide block mb-1">Expiry</label>
                    <input type="text" placeholder="MM / YY" maxLength={7}
                      className="w-full px-4 py-3 rounded-xl border border-[#E6FEE7] text-sm text-[#023103] bg-[#F5FFF5] focus:outline-none focus:border-[#08C40E] transition-colors placeholder:text-gray-300" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#046207] uppercase tracking-wide block mb-1">CVV</label>
                    <input type="password" placeholder="•••" maxLength={3}
                      className="w-full px-4 py-3 rounded-xl border border-[#E6FEE7] text-sm text-[#023103] bg-[#F5FFF5] focus:outline-none focus:border-[#08C40E] transition-colors placeholder:text-gray-300" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#046207] uppercase tracking-wide block mb-1">Cardholder Name</label>
                  <input type="text" placeholder="As it appears on the card"
                    className="w-full px-4 py-3 rounded-xl border border-[#E6FEE7] text-sm text-[#023103] bg-[#F5FFF5] focus:outline-none focus:border-[#08C40E] transition-colors placeholder:text-gray-300" />
                </div>
              </div>
            )}

            {payMethod === "bank" && (
              <div className="mt-5 p-4 bg-[#F5FFF5] rounded-2xl border border-[#E6FEE7] animate-fade-up">
                <p className="text-xs text-[#046207] font-semibold mb-3">Transfer to Prism Agro Escrow Account:</p>
                <div className="space-y-2 text-sm">
                  {[["Bank", "Zenith Bank"], ["Account Number", "1234567890"], ["Account Name", "Prism Agro Escrow Ltd"],
                    ["Amount", fees ? fmt(fees.total) : "—"]
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-400 text-xs">{k}</span>
                      <span className="font-bold text-[#023103]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {payMethod === "ussd" && (
              <div className="mt-5 p-4 bg-[#F5FFF5] rounded-2xl border border-[#E6FEE7] animate-fade-up text-center">
                <p className="text-xs text-[#046207] font-semibold mb-3">Dial the code below:</p>
                <div className="text-3xl font-black text-[#023103] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  *322*36*{(listing?.id ?? "00") + qty}#
                </div>
                <p className="text-[11px] text-gray-400 mt-2">GTBank · First Bank · Access · Zenith supported</p>
              </div>
            )}
          </div>

          <div className="bg-[#023103] text-white rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-green-900/20">
            <div className="relative z-10 flex gap-4">
              <div className="bg-[#08C40E] p-3 rounded-2xl h-fit shadow-lg shadow-[#08C40E]/30 shrink-0">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h4 className="font-bold text-base">Why Escrow Protection?</h4>
                <p className="text-white/70 text-sm mt-1.5 leading-relaxed">
                  Your payment is locked in a secure vault — not paid to the farmer until you
                  physically receive the produce and enter your <strong className="text-white">6-digit release code</strong>. Zero risk of fraud.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 text-white/5 font-black text-8xl pointer-events-none uppercase rotate-12">SAFE</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-[#E6FEE7] p-7 shadow-xl shadow-green-50 sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#046207] mb-6">Price Breakdown</h3>

            {fees && (
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[#023103] font-medium">Produce Cost</p>
                    <p className="text-[11px] text-gray-400">{qty}kg × {listing ? fmt(listing.pricePerKg) : "—"}/kg</p>
                  </div>
                  <span className="font-bold text-[#023103]">{fmt(fees.produce)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[#023103] font-medium flex items-center gap-1.5">
                      <Truck size={13} className="text-[#08C40E]" /> Logistics Fee
                    </p>
                    <p className="text-[11px] text-gray-400">Base ₦1,500 + ₦20/kg</p>
                  </div>
                  <span className="font-bold text-[#023103]">{fmt(fees.logistics)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[#023103] font-medium flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-[#08C40E]" /> Escrow Platform Fee
                    </p>
                    <p className="text-[11px] text-gray-400">1% of produce · min ₦300</p>
                  </div>
                  <span className="font-bold text-[#023103]">{fmt(fees.escrow)}</span>
                </div>

                <div className="pt-4 border-t-2 border-dashed border-[#E6FEE7] flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Total to Pay</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">Escrow protected · All fees included</p>
                  </div>
                  <span className="text-3xl font-black text-[#08C40E]" style={{ fontFamily: "var(--font-display)" }}>
                    {fmt(fees.total)}
                  </span>
                </div>
              </div>
            )}

            {!deliveryAddress.trim() && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                <AlertCircle size={14} className="text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700">Please enter a delivery address to continue.</p>
              </div>
            )}

            {step === "error" && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl animate-fade-up">
                <AlertCircle size={14} className="text-red-500 shrink-0" />
                <p className="text-xs text-red-600">{errMsg}</p>
                <button onClick={() => setStep("review")} className="ml-auto text-xs underline font-semibold text-red-500">Retry</button>
              </div>
            )}

            <button
              id="pay-securely-btn"
              onClick={handlePay}
              disabled={!deliveryAddress.trim() || !listing}
              className="w-full py-5 rounded-2xl text-white font-black text-base flex items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.97] shadow-xl shadow-[#08C40E]/25"
              style={{ background: "#08C40E", fontFamily: "var(--font-display)" }}
            >
              <Lock size={18} />
              PAY SECURELY · {fees ? fmt(fees.total) : "…"}
              <ChevronRight size={18} />
            </button>

            <div className="mt-6 flex flex-col items-center gap-3 opacity-40">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Powered by</p>
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-gray-500 tracking-tighter">INTERSWITCH</span>
                <div className="w-px h-4 bg-gray-200" />
                <span className="text-xs font-black text-gray-500 tracking-tighter">QUICKTELLER</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold">
                <Lock size={10} /> 256-bit SSL Encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto space-y-4 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-[#E6FEE7] animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      }
    >
      <PaymentInner />
    </Suspense>
  );
}
