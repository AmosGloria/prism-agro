import { Eye, Leaf, MapPin, Scale, ShoppingCart } from "lucide-react";
import { FreshnessBar } from "./freshnessBar";
import { CROP_EMOJI } from "@/mock-datas/farmer";
import { useRouter } from "next/navigation";
import { useFreshness, useTimeAgo } from "@/hooks";
import { type Listing } from "@/types";

export function ListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  const freshness = useFreshness(listing.harvestTime, listing.currentFreshness);
  const timeAgo = useTimeAgo(listing.harvestTime);

  return (
    <div
      className="bg-white rounded-2xl border border-[#E6FEE7] overflow-hidden card-hover animate-fade-up"
      style={{ boxShadow: '0 2px 12px rgba(2,49,3,0.06)' }}
    >
      {/* Produce image / emoji placeholder */}
      <div className="relative h-36 bg-linear-to-br from-[#E6FEE7] to-[#CEFDCF] flex items-center justify-center">
        <span className="text-5xl">{CROP_EMOJI[listing.cropType] ?? '🌱'}</span>
        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-white/80 text-[#023103] backdrop-blur-sm">
            {listing.state}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-[#046207] bg-white/80 px-2 py-1 rounded-lg backdrop-blur-sm">
          <Leaf size={11} />
          <span>Harvested {timeAgo}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-[#023103] text-base" style={{ fontFamily: 'var(--font-display)' }}>
            {listing.cropType}
          </h3>
          <span className="text-lg font-black text-[#08C40E]" style={{ fontFamily: 'var(--font-display)' }}>
            ₦{listing.pricePerKg.toLocaleString()}<span className="text-xs font-normal text-gray-400">/kg</span>
          </span>
        </div>

        <p className="text-xs text-[#06930A] mb-1">{listing.farmerName}</p>

        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
          <MapPin size={11} />
          <span>{listing.location}</span>
          <span className="mx-1">·</span>
          <Scale size={11} />
          <span>{listing.quantity}kg available</span>
        </div>

        {/* Freshness bar */}
        <div className="mb-4">
          <FreshnessBar value={freshness} />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/buyer/marketplace/${listing.id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#CEFDCF] text-[#046207] text-xs font-semibold hover:bg-[#F0FEF1] transition-colors"
          >
            <Eye size={14} />
            View Details
          </button>
          <button
            onClick={() => router.push(`/buyer/payment`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#08C40E] text-white text-xs font-semibold hover:bg-[#06930A] transition-all shadow-md shadow-green-200 hover:-translate-y-0.5"
          >
            <ShoppingCart size={14} />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}