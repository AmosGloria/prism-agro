"use client";

import React from "react";
import { 
  ShieldCheck, Truck, Leaf, ChevronRight, 
  Loader2, CheckCircle2, Lock, ArrowLeft 
} from "lucide-react";
import { usePaymentFlow, PaymentStatus } from "../hooks/usePaymentFlow";

export default function Checkout({ orderId }: { orderId: string }) {
  const { status, initialize, router } = usePaymentFlow(orderId);

  if (status === "verifying" || status === "initializing") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] p-6 text-center">
        <Loader2 className="w-16 h-16 text-[#39AA44] animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-[#0B390C]">
          {status === "verifying" ? "Securing your transaction..." : "Connecting to Interswitch..."}
        </h2>
        <p className="text-slate-500 mt-2 max-w-xs">Our secure vault is processing your request. Please do not refresh.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-2xl shadow-slate-200 text-center border border-slate-100">
          <div className="bg-[#39AA44]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-14 h-14 text-[#39AA44]" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B390C]">Payment Secured</h1>
          <p className="text-slate-600 mt-4 leading-relaxed">
            Funds are now held in <strong>Escrow</strong>. They will only be released to the farmer after you confirm the delivery.
          </p>
          <button 
            onClick={() => router.push("/buyer/orders")}
            className="w-full mt-10 bg-[#39AA44] text-white py-4 rounded-2xl font-bold hover:brightness-110 transition-all active:scale-95"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <nav className="bg-[#0B390C] text-white py-5 px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity">
            <ArrowLeft size={18} /> Back to Market
          </button>
          <span className="font-black tracking-tighter text-xl uppercase">
            Prism <span className="text-[#39AA44]">Agro</span>
          </span>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
            <Lock size={12} /> Secure 256-bit SSL
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-white rounded-[28px] p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-[#0B390C] mb-8">Order Summary</h2>
            
            <div className="flex flex-col sm:flex-row gap-8 p-6 rounded-[20px] bg-[#F5F5F5]/50 border border-slate-100">
              <div className="w-full sm:w-32 h-32 bg-slate-200 rounded-2xl overflow-hidden shadow-inner">
                <img src="/api/placeholder/150/150" alt="Produce" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-[#0B390C]">Fresh Hybrid Tomatoes</h3>
                  <span className="text-xl font-black text-[#39AA44]">₦45,000</span>
                </div>
                <p className="text-slate-500 text-sm">Quantity: 25kg Basket • Grade A</p>
                <div className="flex items-center gap-2 pt-2">
                  <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                    <Leaf size={14} className="text-[#39AA44]" />
                    <span className="text-[10px] font-black text-[#0B390C] uppercase">Kano Central Farm</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-[#0B390C] text-white rounded-[28px] p-8 relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex gap-5">
              <div className="bg-[#39AA44] p-3 rounded-2xl h-fit shadow-lg shadow-[#39AA44]/20">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h4 className="text-lg font-bold">Why Escrow?</h4>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed opacity-90">
                  Your payment is stored in a non-interest bearing vault. The farmer only gets paid when you enter the 6-digit release code at the point of physical delivery.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 text-white opacity-5 transform rotate-12 font-black text-8xl pointer-events-none uppercase">
              Secure
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-slate-200 border border-slate-100 sticky top-28">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Price Breakdown</h3>
            
            <div className="space-y-5 mb-10">
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-sm">Produce Subtotal</span>
                <span className="font-bold text-[#0B390C]">₦45,000.00</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Logistics & Delivery</span>
                  <Truck size={14} className="text-slate-400" />
                </div>
                <span className="font-bold text-[#0B390C]">₦2,500.00</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-sm">Escrow Platform Fee</span>
                <span className="font-bold text-[#0B390C]">₦500.00</span>
              </div>
              <div className="pt-5 border-t border-slate-100 flex justify-between items-end">
                <span className="text-sm font-bold text-[#0B390C]">Total to Pay</span>
                <span className="text-3xl font-black text-[#39AA44]">₦48,000.00</span>
              </div>
            </div>

            <button 
              onClick={initialize}
              className="w-full bg-[#39AA44] text-white py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#39AA44]/20"
            >
              PAY SECURELY <ChevronRight size={20} />
            </button>

            <div className="mt-8 flex flex-col items-center opacity-40">
              <p className="text-[10px] font-bold uppercase tracking-tighter mb-2">Powering secure trade by</p>
              <div className="flex items-center gap-4 grayscale">
                <img src="/api/placeholder/100/30" alt="Quickteller" className="h-4" />
                <div className="w-px h-4 bg-slate-300" />
                <img src="/api/placeholder/100/30" alt="Interswitch" className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}