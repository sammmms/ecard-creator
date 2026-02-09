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

  try {
    const { id } = await params;

    const greeting = await db.greeting.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
      include: { template: true },
    });

    if (!greeting) {
      return new NextResponse("Greeting not found", { status: 404 });
    }

    if (greeting.status === "published") {
      return new NextResponse("Greeting already published", { status: 400 });
    }

    // Create payment record
    // Mock Xendit Invoice creation
    const externalRef = `INV-${crypto.randomUUID()}`;
    const amount = greeting.template.price;
    const checkoutUrl = `https://checkout.xendit.co/web/${externalRef}`; // Mock URL

    const payment = await db.payment.create({
      data: {
        userId: session.user.id,
        greetingId: greeting.id,
        amount,
        externalRef,
        checkoutUrl,
        status: "pending",
      },
    });

    // Update greeting status
    await db.greeting.update({
      where: { id: greeting.id },
      data: { status: "pending_payment" },
    });

    return NextResponse.json({ payment, checkoutUrl });
  } catch (error) {
    console.error("[PAYMENT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
