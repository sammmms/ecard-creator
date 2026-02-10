import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { greetingId, name, comment, donationAmount, imageUrl } = body;

    if (!greetingId) {
      return new NextResponse("greetingId is required", { status: 400 });
    }

    const greeting = await db.greeting.findUnique({
      where: { id: greetingId },
    });

    if (!greeting) {
      return new NextResponse("Greeting not found", { status: 404 });
    }

    if (!greeting.submissionsEnabled && !greeting.donationEnabled) {
      return new NextResponse("Submissions are not enabled", { status: 403 });
    }

    // Validate imageUrl if provided
    const validImageUrl =
      imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("/api/uploads/")
        ? imageUrl
        : null;

    // Create the public submission (wish)
    const submission = await db.publicSubmission.create({
      data: {
        greetingId,
        name: name?.trim() || null,
        comment: comment?.trim() || null,
        imageUrl: validImageUrl,
      },
    });

    // Optionally create a donation payment record
    let donationPayment = null;
    if (donationAmount && donationAmount > 0 && greeting.donationEnabled) {
      donationPayment = await db.donationPayment.create({
        data: {
          greetingId,
          amount: Math.round(donationAmount),
          currency: "IDR",
          status: "pending",
          provider: greeting.donationMode === "manual" ? "manual" : "xendit",
          donorName: name?.trim() || null,
          donorMessage: comment?.trim() || null,
        },
      });
    }

    return NextResponse.json({
      submission: {
        id: submission.id,
        name: submission.name,
        comment: submission.comment,
        imageUrl: submission.imageUrl,
        createdAt: submission.createdAt.toISOString(),
      },
      donationPayment: donationPayment
        ? {
            id: donationPayment.id,
            amount: donationPayment.amount,
          }
        : null,
    });
  } catch (error) {
    console.error("[PUBLIC_WISHES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
