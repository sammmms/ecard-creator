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
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      template: true,
      payment: true,
    },
  });

  if (!greeting) {
    return new NextResponse("Greeting not found", { status: 404 });
  }

  return NextResponse.json(greeting);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    // Validate donation rules
    if (body.donationEnabled) {
      const mode = body.donationMode;
      // Fetch receiver config for this mode
      const receiver = await db.receiverConfig.findFirst({
        where: {
          userId: session.user.id,
          mode: mode,
          status: "active",
        },
      });

      if (!receiver) {
        return new NextResponse(
          `Cannot enable donations: No active receiver config for mode ${mode}`,
          { status: 400 },
        );
      }
    }

    const greeting = await db.greeting.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        title: body.title,
        senderNameDefault: body.senderNameDefault,
        messageDefault: body.messageDefault,
        companyLogoUrl: body.companyLogoUrl,
        layoutVariant: body.layoutVariant,
        submissionsEnabled: body.submissionsEnabled,
        donationEnabled: body.donationEnabled,
        donationMode: body.donationMode,
      },
    });

    return NextResponse.json(greeting);
  } catch (error) {
    console.error("[GREETING_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
