import { NextResponse } from "next/server";
import db from "@/lib/db";

// This is a MOCK webhook handler. In real app, it verifies Xendit signature.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { externalRef, status } = body;
    // Xendit usually sends "status": "PAID" or "SETTLED" keys etc.
    // For our mock: { paymentId: string } or { externalRef: string }

    let payment;
    if (body.paymentId) {
      payment = await db.payment.findUnique({ where: { id: body.paymentId } });
    } else if (externalRef) {
      payment = await db.payment.findFirst({ where: { externalRef } });
    }

    if (!payment) {
      return new NextResponse("Payment not found", { status: 404 });
    }

    // Mark payment as paid
    const updatedPayment = await db.payment.update({
      where: { id: payment.id },
      data: { status: "paid" },
    });

    // Mark greeting as published
    await db.greeting.update({
      where: { id: payment.greetingId },
      data: { status: "published" },
    });

    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error("[PAYMENT_WEBHOOK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Helper GET for manual testing: /api/payments/webhook?paymentId=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("paymentId");
  if (!paymentId) return new NextResponse("Missing paymentId", { status: 400 });

  try {
    const payment = await db.payment.findUnique({ where: { id: paymentId } });
    if (!payment) return new NextResponse("Not found", { status: 404 });

    await db.payment.update({
      where: { id: paymentId },
      data: { status: "paid" },
    });
    await db.greeting.update({
      where: { id: payment.greetingId },
      data: { status: "published" },
    });

    return NextResponse.json({ success: true, status: "paid" });
  } catch (e) {
    return new NextResponse("Error", { status: 500 });
  }
}
