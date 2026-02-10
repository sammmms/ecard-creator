import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
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
    include: {
      publicSubmissions: {
        orderBy: { createdAt: "desc" },
      },
      donationPayments: true,
    },
  });

  if (!greeting) {
    return new NextResponse("Greeting not found", { status: 404 });
  }

  const wishes = greeting.publicSubmissions.map((sub) => {
    const matchingDonation = greeting.donationPayments.find(
      (d) => d.donorName === sub.name && d.donorMessage === sub.comment,
    );
    return {
      id: sub.id,
      name: sub.name,
      comment: sub.comment,
      imageUrl: sub.imageUrl || null,
      createdAt: sub.createdAt.toISOString(),
      donationAmount: matchingDonation?.amount || null,
    };
  });

  return NextResponse.json(wishes);
}
