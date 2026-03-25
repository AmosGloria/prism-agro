import Link from "next/link";
import { FreshnessBar } from "../ui/freshnessBar";
import { CROP_EMOJI } from "@/mock-datas/farmer";
import { useFreshness, useTimeAgo } from "@/hooks";
import { Listing } from "@/types";

export function FreshnessAlertCard({ listing }: { listing: Listing }) {
  const freshness = useFreshness(listing.harvestTime, listing.currentFreshness);
  const timeAgo = useTimeAgo(listing.harvestTime);

  if (freshness > 50) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
      <span className="text-2xl">{CROP_EMOJI[listing.cropType] ?? '🌱'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-900 truncate">{listing.cropType} — {listing.quantity}kg</p>
        <p className="text-xs text-amber-600">Harvested {timeAgo}</p>
        <div className="mt-1">
          <FreshnessBar value={freshness} height="sm" />
        </div>
      </div>
      <Link href={`/farmer/inventory/${listing.id}/edit`} className="text-xs font-semibold text-amber-700 hover:text-amber-900 shrink-0">
        Update →
      </Link>
    </div>
  );
}