/**
 *
 * Verifies a completed Interswitch payment.
 * Called from the callback page after Interswitch redirects the buyer back.
 *
 * Request body: { txnRef, amount }
 * Response:     { success, responseCode, responseDescription, amount }
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/interswitch";

export async function POST(req: NextRequest) {
  try {
    const { txnRef, amount } = await req.json();

    if (!txnRef || !amount) {
      return NextResponse.json(
        { error: "txnRef and amount are required" },
        { status: 400 },
      );
    }

    const result = await verifyPayment(txnRef, amount);

    const success = result.responseCode === "00";

    if (success) {
      // Update order status to PAYMENT_HELD in DB
      // await db.orders.update({ where: { txnRef }, data: { status: 'PAYMENT_HELD' } });
    }

    return NextResponse.json({
      success,
      responseCode: result.responseCode,
      responseDescription: result.responseDescription,
      amount: result.amount,
      txnRef: result.txnRef,
    });
  } catch (err: any) {
    console.error("[ISW] verifyPayment error:", err);
    return NextResponse.json(
      { error: err.message ?? "Verification failed" },
      { status: 500 },
    );
  }
}
