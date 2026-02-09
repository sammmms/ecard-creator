import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { nanoid } from "nanoid";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const greetings = await db.greeting.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      template: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(greetings);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { templateId } = await req.json();

    if (!templateId) {
      return new NextResponse("Template ID required", { status: 400 });
    }

    const template = await db.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return new NextResponse("Template not found", { status: 404 });
    }

    // If trial template, enforce max 1 trial greeting per user
    if (template.isTrial) {
      const existingTrial = await db.greeting.findFirst({
        where: { userId: session.user.id, isTrial: true },
      });
      if (existingTrial) {
        return NextResponse.json(
          { error: "You already have a trial greeting", existingId: existingTrial.id },
          { status: 400 }
        );
      }
    }

    // Generate a unique slug
    const slug = nanoid(10);

    const isTrial = template.isTrial;

    const greeting = await db.greeting.create({
      data: {
        userId: session.user.id,
        templateId,
        slug,
        title: `CNY Greeting - ${template.name}`,
        isTrial,
        trialExpiresAt: isTrial ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined,
        status: isTrial ? "published" : "draft",
      },
    });

    return NextResponse.json(greeting);
  } catch (error) {
    console.error("[GREETINGS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
