import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const configs = await db.receiverConfig.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json(configs);
  } catch (error) {
    console.error("[RECEIVER_CONFIGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();

    if (!["manual", "platform"].includes(body.mode)) {
      return new NextResponse("Invalid mode", { status: 400 });
    }

    const existing = await db.receiverConfig.findFirst({
      where: { userId: session.user.id, mode: body.mode },
    });

    const data = {
      status: body.status || "inactive",
      displayName: body.displayName || null,
      qrisImageUrl: body.qrisImageUrl || null,
      instructionsText: body.instructionsText || null,
      ewalletType: body.ewalletType || null,
      ewalletNumber: body.ewalletNumber || null,
      noticeText: body.noticeText || null,
    };

    let config;
    if (existing) {
      config = await db.receiverConfig.update({
        where: { id: existing.id },
        data,
      });
    } else {
      config = await db.receiverConfig.create({
        data: {
          userId: session.user.id,
          mode: body.mode,
          ...data,
        },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("[RECEIVER_CONFIGS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
