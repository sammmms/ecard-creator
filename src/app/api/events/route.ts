import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { greetingId, type, metadata } = body;

    if (!greetingId || !type) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const event = await db.event.create({
      data: {
        greetingId,
        type,
        metadataJson: metadata ? JSON.stringify(metadata) : undefined,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
