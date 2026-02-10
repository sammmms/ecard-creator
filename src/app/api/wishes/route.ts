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
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  const [wishes, total] = await Promise.all([
    db.publicSubmission.findMany({
      where: { greeting: { userId: session.user.id } },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        greeting: { select: { id: true, title: true, slug: true } },
        donationPayment: { select: { id: true, amount: true, status: true } },
      },
    }),
    db.publicSubmission.count({
      where: { greeting: { userId: session.user.id } },
    }),
  ]);

  return NextResponse.json({
    wishes: wishes.map((w) => ({
      id: w.id,
      name: w.name,
      comment: w.comment,
      imageUrl: w.imageUrl,
      createdAt: w.createdAt.toISOString(),
      greeting: w.greeting,
      donation: w.donationPayment,
    })),
    total,
  });
}
