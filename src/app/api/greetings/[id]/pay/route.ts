import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAndCompletePayment, extendGreeting } from "@/lib/payment-service";
import { GreetingStatus, PaymentStatus, PaymentType } from "@/lib/constants";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
    const url = new URL(req.url);
    const isExtend = url.searchParams.get("extend") === "true";

    const greeting = await db.greeting.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
      include: { template: true, payments: true },
    });

    if (!greeting) {
      return new NextResponse("Greeting not found", { status: 404 });
    }

    // --- Extension flow ---
    if (isExtend) {
      if (greeting.isTrial) {
        return NextResponse.json(
          { error: "Trial greetings cannot be extended. Upgrade first." },
          { status: 400 },
        );
      }

      const result = await extendGreeting(
        session.user.id,
        greeting.id,
        greeting.template.extensionPrice,
        greeting.template.extensionMonths,
      );

      return NextResponse.json({
        success: true,
        isExtend: true,
        extensionMonths: greeting.template.extensionMonths,
        payment: { id: result.paymentId },
        greeting: result.greeting,
      });
    }

    // --- Purchase / Upgrade flow ---
    const purchasePayment = greeting.payments.find(
      (p) => (p.type === PaymentType.PURCHASE || p.type === PaymentType.UPGRADE) && p.status === PaymentStatus.PAID,
    );

    // Guard: already fully paid (published + not trial + has paid purchase)
    if (
      greeting.status === GreetingStatus.PUBLISHED &&
      !greeting.isTrial &&
      purchasePayment
    ) {
      return NextResponse.json(
        { error: "Greeting is already paid and published" },
        { status: 400 },
      );
    }

    // Determine amount: use premiumPrice for trial upgrades, otherwise template price
    const isUpgrade = greeting.isTrial;
    const amount = isUpgrade
      ? (greeting.template.premiumPrice ?? greeting.template.price)
      : greeting.template.price;

    // TODO: When integrating Xendit, this will create an invoice and return
    // a checkout URL instead of directly completing the payment.
    // The user would be redirected to the checkout URL, and the webhook
    // would call `completePayment` after successful payment.
    const result = await createAndCompletePayment(
      session.user.id,
      greeting.id,
      amount,
    );

    return NextResponse.json({
      success: true,
      isUpgrade,
      payment: { id: result.paymentId },
      greeting: result.greeting,
    });
  } catch (error) {
    console.error("[PAYMENT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
