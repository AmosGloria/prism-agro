"use client";
import React, { useState } from "react";
import { X, AlertTriangle, ShieldCheck } from "lucide-react";

// Generic confirm modal
interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  danger = false,
  loading = false,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${danger ? "bg-red-50" : "bg-green-50"}`}
        >
          <AlertTriangle
            size={24}
            className={danger ? "text-red-500" : "text-amber-500"}
          />
        </div>
        <h3
          className="text-lg font-semibold text-gray-900 mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-6">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#08C40E] hover:bg-[#06930A]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Processing…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Release Code Modal ────────────────────────────────────────────────────────
interface ReleaseCodeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (code: string) => void | Promise<void>;
  code?: string; // For buyer: show the code
  mode: "show" | "enter"; // buyer shows, logistics enters
  loading?: boolean;
}

export function ReleaseCodeModal({
  open,
  onClose,
  onConfirm,
  code,
  mode,
  loading,
}: ReleaseCodeModalProps) {
  const [input, setInput] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-up text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck
            size={28}
            className="text-[#08C40E]"
          />
        </div>

        {mode === "show" ? (
          <>
            <h3
              className="text-lg font-bold mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your Release Code
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Share this code with the logistics driver only after you receive
              your goods.
            </p>
            <div className="bg-[#F0FEF1] border border-[#9DFBA0] rounded-2xl p-6 mb-6">
              <span
                className="text-4xl font-black tracking-[0.4em] text-[#046207]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {code}
              </span>
            </div>
            <button
              onClick={() => onConfirm(code || "")}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#08C40E] text-white font-semibold hover:bg-[#06930A] transition-colors disabled:opacity-50"
            >
              {loading ? "Confirming…" : "Confirm Delivery"}
            </button>
          </>
        ) : (
          <>
            <h3
              className="text-lg font-bold mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Enter Release Code
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Ask the buyer for their 6-digit code to confirm delivery and
              release payment.
            </p>
            <input
              type="text"
              maxLength={6}
              value={input}
              onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full text-center text-3xl font-black tracking-[0.5em] border-2 border-[#9DFBA0] rounded-2xl py-4 mb-6 focus:border-[#08C40E] focus:outline-none text-[#046207]"
              style={{ fontFamily: "var(--font-display)" }}
            />
            <button
              onClick={() => onConfirm(input)}
              disabled={input.length !== 6 || loading}
              className="w-full py-3 rounded-xl bg-[#08C40E] text-white font-semibold hover:bg-[#06930A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying…" : "Confirm & Release Funds"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
