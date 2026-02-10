import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DonationStatus } from "@/lib/constants";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!status || ![DonationStatus.PAID, DonationStatus.FAILED].includes(status)) {
    return new NextResponse("Invalid status. Must be 'paid' or 'failed'.", {
      status: 400,
    });
  }

  // Verify donation belongs to user's greeting
  const donation = await db.donationPayment.findUnique({
    where: { id },
    include: { greeting: { select: { userId: true } } },
  });

  if (!donation) {
    return new NextResponse("Donation not found", { status: 404 });
  }

  if (donation.greeting.userId !== session.user.id) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const updated = await db.donationPayment.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({
    id: updated.id,
    status: updated.status,
    amount: updated.amount,
  });
}
