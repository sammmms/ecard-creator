import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAndCompletePayment } from "@/lib/payment-service";
import { PaymentStatus, PaymentType } from "@/lib/constants";

/**
 * Upgrade a trial greeting to a paid greeting.
 *
 * TODO: When integrating Xendit, this should create a Xendit invoice
 * and return a checkoutUrl for the user to complete payment externally.
 * Currently it uses mock payment (directly marks as paid).
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const greeting = await db.greeting.findUnique({
    where: { id, userId: session.user.id },
    include: { template: true, payments: true },
  });

  if (!greeting) {
    return new NextResponse("Greeting not found", { status: 404 });
  }

  if (!greeting.isTrial) {
    return new NextResponse("Greeting is not a trial", { status: 400 });
  }

  // Guard: already paid
  const paidUpgrade = greeting.payments.find(
    (p) => (p.type === PaymentType.PURCHASE || p.type === PaymentType.UPGRADE) && p.status === PaymentStatus.PAID,
  );
  if (paidUpgrade) {
    return NextResponse.json(
      { error: "Greeting upgrade payment already completed" },
      { status: 400 },
    );
  }

  const amount = greeting.template.premiumPrice ?? greeting.template.price;

  const result = await createAndCompletePayment(
    session.user.id,
    greeting.id,
    amount,
  );

  return NextResponse.json({
    success: true,
    paymentId: result.paymentId,
    greeting: result.greeting,
  });
}
