"use client";

import React from "react";
import {
  ShieldCheck, ArrowRightLeft, Lock, Key,
  CheckCircle2, AlertTriangle, Info, Loader2,
  Wallet, Truck, UserCheck
} from "lucide-react";
import { useEscrowSystem, EscrowRole } from "../../hooks/useEscrowSystem";

export default function Escrow({ orderId, role }: { orderId: string, role: EscrowRole }) {
  const { status, releaseCode, setReleaseCode, handleRelease, isProcessing } = useEscrowSystem(orderId, role);

  const isReleased = status === "RELEASED";

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        <header className="bg-[#0B390C] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 opacity-70 text-xs font-bold uppercase tracking-widest">
                <Lock size={14} /> Prism Vault ID: {orderId}
              </div>
              <h1 className="text-3xl font-black">
                {isReleased ? "Funds Released" : "Escrow Active"}
              </h1>
            </div>

            <div className={`px-6 py-3 rounded-2xl font-black text-sm uppercase flex items-center gap-2 shadow-lg 
              ${isReleased ? "bg-[#39AA44] text-white" : "bg-white text-[#0B390C]"}`}>
              {isReleased ? <CheckCircle2 size={18} /> : <Loader2 className="animate-spin" size={18} />}
              Status: {status}
            </div>
          </div>

          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <ShieldCheck size={300} />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <main className="lg:col-span-7 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">

            {role === "BUYER" && !isReleased && (
              <div className="space-y-6 text-center py-6">
                <div className="bg-[#F5F5F5] inline-flex p-5 rounded-full mb-2">
                  <Key size={48} className="text-[#39AA44]" />
                </div>
                <h2 className="text-2xl font-black text-[#0B390C]">Your Release Code</h2>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Only give this code to the driver <span className="text-[#0B390C] font-bold">after</span> you have inspected and accepted the produce.
                </p>
                <div className="text-5xl font-black tracking-[0.5em] text-[#39AA44] bg-[#F5F5F5] py-6 rounded-2xl border-2 border-dashed border-slate-200">
                  882 104
                </div>
              </div>
            )}

            {role === "DRIVER" && !isReleased && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#0B390C] mb-4">
                  <UserCheck className="text-[#39AA44]" />
                  <h2 className="text-xl font-bold">Complete Handshake</h2>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Enter the 6-digit code provided by the buyer to verify delivery and release payments instantly.
                </p>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={releaseCode}
                  onChange={(e) => setReleaseCode(e.target.value)}
                  className="w-full text-center text-4xl font-black py-6 rounded-2xl bg-[#F5F5F5] border-2 border-slate-200 focus:border-[#39AA44] focus:outline-none transition-all placeholder:opacity-20"
                />
                <button
                  onClick={handleRelease}
                  disabled={releaseCode.length < 6 || isProcessing}
                  className="w-full bg-[#39AA44] text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:brightness-110 disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-[#39AA44]/20"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : <ArrowRightLeft size={20} />}
                  VERIFY & RELEASE FUNDS
                </button>
              </div>
            )}

            {role === "FARMER" && (
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <Wallet className="text-[#39AA44]" />
                  <h2 className="text-xl font-bold text-[#0B390C]">Payment Breakdown</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between p-4 rounded-xl bg-[#F5F5F5]">
                    <span className="text-slate-500">Produce Value</span>
                    <span className="font-bold text-[#0B390C]">₦45,000.00</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl border border-slate-100">
                    <span className="text-slate-500">Escrow Status</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isReleased ? 'bg-green-100 text-[#39AA44]' : 'bg-amber-100 text-amber-700'}`}>
                      {isReleased ? "Available for Withdrawal" : "Pending Handshake"}
                    </span>
                  </div>
                </div>

                {isReleased && (
                  <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex gap-3 items-center">
                    <CheckCircle2 className="text-[#39AA44]" />
                    <p className="text-xs text-[#0B390C] font-medium">Funds have been successfully moved to your main wallet.</p>
                  </div>
                )}
              </div>
            )}

            {isReleased && role !== "FARMER" && (
              <div className="text-center py-12 space-y-4">
                <div className="bg-green-100 inline-flex p-6 rounded-full text-[#39AA44] mb-4 scale-125">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black text-[#0B390C]">Transaction Complete</h2>
                <p className="text-slate-500">The escrow has been successfully settled.</p>
              </div>
            )}
          </main>

          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Tracking</h3>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#39AA44]" />
                  <div className="w-1 h-12 bg-slate-100" />
                  <div className={`w-3 h-3 rounded-full ${isReleased ? "bg-[#39AA44]" : "bg-slate-200"}`} />
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-[#0B390C]">Picked Up from Farm</p>
                    <p className="text-[10px] text-slate-400 uppercase">Kano Central • 08:30 AM</p>
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isReleased ? "text-[#0B390C]" : "text-slate-300"}`}>Arrived at Buyer</p>
                    <p className="text-[10px] text-slate-400 uppercase">Pending Verification</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-[32px] bg-white border border-slate-100 flex items-start gap-4 shadow-sm">
              <Info className="text-[#39AA44] flex-shrink-0" />
              <p className="text-[11px] leading-relaxed text-slate-500">
                Prism Escrow prevents payment defaults and supply fraud. Money is secured at the point of order and released only upon physical validation of quality.
              </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}