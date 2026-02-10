import { NextResponse } from "next/server";
import { completePayment } from "@/lib/payment-service";
import db from "@/lib/db";

/**
 * Webhook handler for payment provider callbacks.
 *
 * TODO: When integrating Xendit:
 *   - Verify the X-CALLBACK-TOKEN header against your Xendit callback token
 *   - Parse the Xendit webhook payload (external_id, status, etc.)
 *   - Match by externalRef instead of paymentId
 *   - Only process "PAID" or "SETTLED" statuses
 *   - Return 200 immediately to avoid Xendit retries
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // TODO: Replace with Xendit webhook signature verification
    // const callbackToken = req.headers.get("x-callback-token");
    // if (callbackToken !== process.env.XENDIT_CALLBACK_TOKEN) {
    //   return new NextResponse("Invalid signature", { status: 401 });
    // }

    let paymentId: string | undefined;

    if (body.paymentId) {
      paymentId = body.paymentId;
    } else if (body.externalRef) {
      // TODO: This will be the primary lookup method with Xendit
      const payment = await db.payment.findFirst({
        where: { externalRef: body.externalRef },
      });
      paymentId = payment?.id;
    }

    if (!paymentId) {
      return new NextResponse("Payment not found", { status: 404 });
    }

    const result = await completePayment(paymentId);
    return NextResponse.json({ success: result.success });
  } catch (error) {
    console.error("[PAYMENT_WEBHOOK]", error);
    const message = error instanceof Error ? error.message : "Internal Error";
    return new NextResponse(message, { status: 500 });
  }
}

/**
 * GET handler for manual/mock testing.
 * TODO: Remove this endpoint when real payment provider is integrated.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("paymentId");
  if (!paymentId) return new NextResponse("Missing paymentId", { status: 400 });

  try {
    const result = await completePayment(paymentId);
    return NextResponse.json({ success: result.success });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    return new NextResponse(message, { status: 500 });
  }
}
