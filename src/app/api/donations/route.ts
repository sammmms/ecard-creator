import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {
    greeting: { userId: session.user.id },
  };
  if (status) {
    where.status = status;
  }

  const donations = await db.donationPayment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      greeting: { select: { id: true, title: true, slug: true } },
    },
  });

  return NextResponse.json(
    donations.map((d) => ({
      id: d.id,
      amount: d.amount,
      currency: d.currency,
      status: d.status,
      donorName: d.donorName,
      donorMessage: d.donorMessage,
      createdAt: d.createdAt.toISOString(),
      greeting: d.greeting,
    })),
  );
}
