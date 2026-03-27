"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type PaymentStatus =
  | "idle"
  | "initializing"
  | "redirecting"
  | "verifying"
  | "success"
  | "error";

export interface CheckoutPricing {
  produceSubtotal: number;
  logisticsFee: number;
  escrowFee: number;
  total: number;
}

/** Compute fees deterministically from produce subtotal */
export function computeCheckoutPricing(qty: number, pricePerKg: number): CheckoutPricing {
  const produceSubtotal = qty * pricePerKg;
  // Logistics: flat ₦1,500 base + ₦20/kg, capped at ₦8,000
  const logisticsFee = Math.min(1500 + qty * 20, 8000);
  // Escrow platform fee: 1% of produce, minimum ₦300, max ₦3,000
  const escrowFee = Math.min(Math.max(Math.round(produceSubtotal * 0.01), 300), 3000);
  const total = produceSubtotal + logisticsFee + escrowFee;
  return { produceSubtotal, logisticsFee, escrowFee, total };
}

export const usePaymentFlow = (listingId: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [txnRef, setTxnRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle Interswitch callback (txn_ref in URL after redirect)
  useEffect(() => {
    const ref = searchParams?.get("txn_ref");
    if (ref && status === "idle") {
      setTxnRef(ref);
      verify(ref);
    }
  }, [searchParams]);

  const verify = useCallback(async (ref: string) => {
    setStatus("verifying");
    // Simulate Interswitch verification delay (~2s)
    await new Promise(r => setTimeout(r, 2200));
    setStatus("success");
  }, []);

  /** Call this when buyer clicks "Pay Securely" */
  const initialize = useCallback(async (pricing: CheckoutPricing) => {
    try {
      setStatus("initializing");
      // Step 1: Simulate generating a payment reference (500ms backend call)
      await new Promise(r => setTimeout(r, 600));

      setStatus("redirecting");
      // Step 2: Simulate redirect to Interswitch Quickteller (1.2s)
      await new Promise(r => setTimeout(r, 1200));

      // Step 3: Auto-come back with a fake txn_ref (simulated callback)
      const fakeRef = `ISW-${Date.now()}-${listingId}`;
      setTxnRef(fakeRef);
      await verify(fakeRef);
    } catch {
      setStatus("error");
      setErrorMsg("Payment failed. Please try again.");
    }
  }, [listingId, verify]);

  const reset = useCallback(() => {
    setStatus("idle");
    setTxnRef(null);
    setErrorMsg(null);
  }, []);

  return { status, txnRef, errorMsg, initialize, reset, router };
};