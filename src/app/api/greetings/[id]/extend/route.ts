import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getExpiryDate } from "@/lib/expiry";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const greeting = await db.greeting.findUnique({
    where: { id, userId: session.user.id },
    select: { id: true, isTrial: true, expiresAt: true },
  });

  if (!greeting) {
    return new NextResponse("Greeting not found", { status: 404 });
  }

  if (greeting.isTrial) {
    return new NextResponse("Trial greetings do not expire", { status: 400 });
  }

  // Extend from the later of expiresAt or now
  const baseDate =
    greeting.expiresAt && greeting.expiresAt > new Date()
      ? greeting.expiresAt
      : new Date();

  const updated = await db.greeting.update({
    where: { id },
    data: {
      expiresAt: getExpiryDate(baseDate),
      isExpired: false,
    },
  });

  return NextResponse.json({
    ok: true,
    expiresAt: updated.expiresAt,
  });
}
