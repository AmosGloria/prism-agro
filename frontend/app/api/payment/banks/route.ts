/**
 *
 * Returns the list of Nigerian banks from Interswitch.
 * Used in the farmer settings page to populate the bank selector
 * and validate account numbers before saving payout details.
 */
import { NextResponse } from "next/server";
import { getBankList } from "@/lib/interswitch";

export async function GET() {
  try {
    const banks = await getBankList();
    return NextResponse.json({ banks });
  } catch (err: any) {
    console.error("[ISW] getBankList error:", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to fetch banks" },
      { status: 500 },
    );
  }
}
