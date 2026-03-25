"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type PaymentStatus = "idle" | "initializing" | "verifying" | "success" | "error";

export const usePaymentFlow = (orderId: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>("idle");

  useEffect(() => {
    const txnRef = searchParams.get("txn_ref");
    if (txnRef && status === "idle") {
      verify(txnRef);
    }
  }, [searchParams]);

  const verify = async (ref: string) => {
    setStatus("verifying");
    setTimeout(() => setStatus("success"), 2000); 
  };

  const initialize = async () => {
    setStatus("initializing");
    console.log("Initializing payment for:", orderId);
  };

  return { status, initialize, router };
};