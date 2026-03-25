"use client";
import { useState } from "react";

export type EscrowRole = "BUYER" | "FARMER" | "DRIVER";
export type EscrowStatus = "HOLD" | "SHIPPED" | "DISPUTED" | "RELEASED";

export const useEscrowSystem = (orderId: string, role: EscrowRole) => {
  const [status, setStatus] = useState<EscrowStatus>("SHIPPED");
  const [releaseCode, setReleaseCode] = useState(""); // Only for Driver input
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRelease = async () => {
    setIsProcessing(true);
    // Logic for POST /api/v1/escrow/release goes here
    console.log(`Releasing funds for ${orderId} with code ${releaseCode}`);
    setTimeout(() => {
      setStatus("RELEASED");
      setIsProcessing(false);
    }, 2000);
  };

  return { status, releaseCode, setReleaseCode, handleRelease, isProcessing, role };
};