"use client";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sprout,
  Truck,
  Banknote,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/getStatusBadge";
import { CROP_EMOJI, MOCK_LISTINGS, MOCK_ORDERS } from "@/mock-datas/farmer";
import { FreshnessAlertCard } from "@/components/dashboard/frshness-alert-card";

export default function FarmerDashboardPage() {
  const totalRevenue = MOCK_ORDERS.filter(
    (o) => o.status === "PAYMENT_HELD" || o.status === "COMPLETED",
  ).reduce((acc, o) => acc + o.totalAmount, 0);
  const heldFunds = MOCK_ORDERS.filter(
    (o) => o.status === "PAYMENT_HELD",
  ).reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-[#023103]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Farm Dashboard
          </h1>
          <p className="text-sm text-[#06930A] mt-1">
            {new Date().toLocaleDateString("en-NG", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <Link
          href="/farmer/add"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#08C40E] text-white text-sm font-semibold hover:bg-[#06930A] transition-all shadow-md shadow-green-200"
        >
          <Sprout size={16} />
          Add Listing
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Active Listings",
            value: MOCK_LISTINGS.filter((l) => l.status === "AVAILABLE").length,
            icon: Package,
            color: "#08C40E",
            bg: "#E6FEE7",
          },
          {
            label: "Orders Pending",
            value: MOCK_ORDERS.length,
            icon: Truck,
            color: "#3B82F6",
            bg: "#EFF6FF",
          },
          {
            label: "Funds in Escrow",
            value: `₦${heldFunds.toLocaleString()}`,
            icon: Banknote,
            color: "#F59E0B",
            bg: "#FFFBEB",
          },
          {
            label: "Total Revenue",
            value: `₦${totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: "#8B5CF6",
            bg: "#F5F3FF",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-[#E6FEE7] p-4"
            style={{ boxShadow: "0 2px 8px rgba(2,49,3,0.05)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: stat.bg }}
              >
                <stat.icon
                  size={18}
                  style={{ color: stat.color }}
                />
              </div>
            </div>
            <p
              className="text-xl font-black text-[#023103]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {stat.value}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Freshness Alerts */}
        <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-sm font-bold text-[#023103] flex items-center gap-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <AlertTriangle
                size={16}
                className="text-amber-500"
              />
              Freshness Alerts
            </h2>
            <Link
              href="/farmer/inventory"
              className="text-xs text-[#08C40E] font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {MOCK_LISTINGS.map((l) => (
              <FreshnessAlertCard
                key={l.id}
                listing={l}
              />
            ))}
            {MOCK_LISTINGS.every((l) => l.currentFreshness > 50) && (
              <div className="flex items-center gap-2 text-sm text-[#046207] py-4 justify-center">
                <CheckCircle
                  size={16}
                  className="text-[#08C40E]"
                />
                All produce is fresh — no alerts!
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-sm font-bold text-[#023103] flex items-center gap-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <Package
                size={16}
                className="text-[#08C40E]"
              />
              Recent Orders
            </h2>
            <Link
              href="/farmer/orders"
              className="text-xs text-[#08C40E] font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {MOCK_ORDERS.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5FFF5] transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E6FEE7] flex items-center justify-center text-lg">
                  {CROP_EMOJI[order.cropType] ?? "🌱"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#023103] truncate">
                    {order.id}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.buyerName} · {order.quantity}kg
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[#023103]">
                    ₦{order.totalAmount.toLocaleString()}
                  </p>
                  <StatusBadge
                    status={order.status}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
