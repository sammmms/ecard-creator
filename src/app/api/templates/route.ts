import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  // Allow public access to templates? Or protected?
  // Plan implies public access via "/api/templates?event=cny" might be used, but mostly for dashboard.
  // Actually, public greeting generation requires templates too? No, usually company browses templates.

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const event = searchParams.get("event") || "cny";

  const templates = await db.template.findMany({
    where: {
      event,
      isActive: true,
    },
  });

  return NextResponse.json(templates);
}
