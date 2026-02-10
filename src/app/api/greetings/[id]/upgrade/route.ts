import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    include: { template: true },
  });

  if (!greeting) {
    return new NextResponse("Greeting not found", { status: 404 });
  }

  if (!greeting.isTrial) {
    return new NextResponse("Greeting is not a trial", { status: 400 });
  }

  const premiumPrice = greeting.template.premiumPrice;
  if (!premiumPrice) {
    return new NextResponse("Template has no upgrade price", { status: 400 });
  }

  // Create a payment record for the upgrade
  const payment = await db.payment.create({
    data: {
      userId: session.user.id,
      greetingId: greeting.id,
      amount: premiumPrice,
      currency: "IDR",
      provider: "xendit",
      status: "pending",
    },
  });

  return NextResponse.json({
    paymentId: payment.id,
    amount: premiumPrice,
  });
}
