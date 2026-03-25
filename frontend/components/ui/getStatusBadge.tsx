import React from "react";
import type { OrderStatus } from "@/types";

const STATUS_MAP: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  PAYMENT_HELD: {
    label: "Payment Held",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  IN_TRANSIT: {
    label: "In Transit",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  SHIPPED: {
    label: "Shipped",
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-500",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  DISPUTED: {
    label: "Disputed",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-gray-50",
    text: "text-gray-600",
    dot: "bg-gray-400",
  },
  AVAILABLE: {
    label: "Available",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  SOLD: {
    label: "Sold",
    bg: "bg-gray-50",
    text: "text-gray-600",
    dot: "bg-gray-400",
  },
  EXPIRED: {
    label: "Expired",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-400",
  },
};

interface Props {
  status: string;
  pulse?: boolean;
  size?: "sm" | "md";
}

export function StatusBadge({ status, pulse = false, size = "md" }: Props) {
  const config = STATUS_MAP[status] ?? {
    label: status,
    bg: "bg-gray-50",
    text: "text-gray-600",
    dot: "bg-gray-400",
  };
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClass}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dot} ${pulse && status === "IN_TRANSIT" ? "animate-pulse" : ""}`}
      />
      {config.label}
    </span>
  );
}
