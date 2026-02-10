import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const event = searchParams.get("event");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const pricing = searchParams.get("pricing"); // "free" | "paid"
  const sort = searchParams.get("sort"); // "price_asc" | "price_desc" | "name"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = { isActive: true };
  if (event) where.event = event;
  if (category && category !== "all") where.category = category;

  // Pricing filter
  if (pricing === "free") where.price = 0;
  else if (pricing === "paid") where.price = { gt: 0 };

  // Search via Prisma contains
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  // Sort
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { name: "asc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  else if (sort === "price_desc") orderBy = { price: "desc" };
  else if (sort === "name") orderBy = { name: "asc" };

  const templates = await db.template.findMany({ where, orderBy });

  return NextResponse.json(templates);
}
