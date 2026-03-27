/**
 *
 * Initializes an Interswitch Web Checkout payment session.
 * Runs server-side — credentials never exposed to the browser.
 *
 * Request body:
 *   { orderId, amount, customerEmail, customerName, description }
 *
 * Response:
 *   { paymentUrl, txnRef } — frontend redirects buyer to paymentUrl
 */
import { NextRequest, NextResponse } from "next/server";
import { initializePayment, generateTxnRef } from "@/lib/interswitch";

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, customerEmail, customerName, description } =
      await req.json();

    if (!amount || !customerEmail) {
      return NextResponse.json(
        { error: "amount and customerEmail are required" },
        { status: 400 },
      );
    }

    const txnRef = generateTxnRef("PA-PAY");

    const result = await initializePayment({
      amount,
      txnRef,
      customerEmail,
      customerName: customerName ?? customerEmail,
      description: description ?? `PrismAgro order ${orderId}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/buyer/payment/callback?orderId=${orderId}&txnRef=${txnRef}`,
    });

    console.log("ISW RESULT:", result);

    // Store txnRef → orderId mapping in DB here
    // await db.payments.create({ txnRef, orderId, amount, status: 'PENDING' });

    return NextResponse.json({
      paymentUrl: result.paymentUrl,
      txnRef: result.txnRef,
    });
  } catch (err: any) {
    console.error("[ISW] initializePayment error:", err);
    return NextResponse.json(
      { error: err.message ?? "Payment initialization failed" },
      { status: 500 },
    );
  }
}
