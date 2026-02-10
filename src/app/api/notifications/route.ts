import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const countOnly = searchParams.get("countOnly") === "true";

  if (countOnly) {
    const unreadCount = await db.notification.count({
      where: { userId: session.user.id, isRead: false },
    });
    return NextResponse.json({ unreadCount });
  }

  const [notifications, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.notification.count({
      where: { userId: session.user.id, isRead: false },
    }),
  ]);

  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();

    if (body.markAllRead) {
      await db.notification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ ok: true });
    }

    if (Array.isArray(body.ids) && body.ids.length > 0) {
      await db.notification.updateMany({
        where: {
          id: { in: body.ids },
          userId: session.user.id,
        },
        data: { isRead: true },
      });
      return NextResponse.json({ ok: true });
    }

    return new NextResponse("Invalid request body", { status: 400 });
  } catch {
    return new NextResponse("Invalid request", { status: 400 });
  }
}
