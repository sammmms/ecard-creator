import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  isGreetingExpired,
  isSlugReclaimable,
  getSlugReclaimDate,
  handleSlugReclaim,
} from "@/lib/expiry";

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;

// GET: Check slug availability
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const slug = req.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "slug parameter required" }, { status: 400 });
  }

  if (!SLUG_REGEX.test(slug)) {
    return NextResponse.json({ available: false, error: "Invalid slug format" });
  }

  const existing = await db.greeting.findUnique({
    where: { slug },
    select: { id: true, expiresAt: true, isTrial: true, isExpired: true },
  });

  if (!existing || existing.id === id) {
    return NextResponse.json({ available: true });
  }

  // Check if slug is reclaimable (expired > 1 year)
  if (
    existing.expiresAt &&
    isGreetingExpired(existing) &&
    isSlugReclaimable(existing.expiresAt)
  ) {
    return NextResponse.json({ available: true, reclaimable: true });
  }

  // Reserved but not yet reclaimable
  if (existing.expiresAt && isGreetingExpired(existing)) {
    return NextResponse.json({
      available: false,
      error: "This URL is reserved",
      availableAt: getSlugReclaimDate(existing.expiresAt).toISOString(),
    });
  }

  return NextResponse.json({ available: false });
}

// POST: Set custom slug
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const { slug } = await req.json();

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  if (!SLUG_REGEX.test(slug)) {
    return NextResponse.json(
      { error: "Slug must be 3-50 characters, lowercase letters, numbers, and hyphens only" },
      { status: 400 },
    );
  }

  // Verify ownership and trial status
  const greeting = await db.greeting.findUnique({
    where: { id, userId: session.user.id },
    select: { id: true, slug: true, isTrial: true },
  });

  if (!greeting) {
    return new NextResponse("Greeting not found", { status: 404 });
  }

  if (greeting.isTrial) {
    return NextResponse.json(
      { error: "Trial greetings cannot have custom slugs. Upgrade to customize your URL." },
      { status: 403 },
    );
  }

  // Already this slug
  if (greeting.slug === slug) {
    return NextResponse.json({ ok: true, slug });
  }

  // Check uniqueness
  const existing = await db.greeting.findUnique({
    where: { slug },
    select: { id: true, expiresAt: true, isTrial: true, isExpired: true },
  });

  if (existing) {
    // Check if reclaimable
    if (
      existing.expiresAt &&
      isGreetingExpired(existing) &&
      isSlugReclaimable(existing.expiresAt)
    ) {
      await handleSlugReclaim(existing.id);
      // Now assign to this greeting
      await db.greeting.update({ where: { id }, data: { slug } });
      return NextResponse.json({ ok: true, slug, reclaimed: true });
    }

    // Reserved but not reclaimable
    if (existing.expiresAt && isGreetingExpired(existing)) {
      return NextResponse.json(
        {
          error: "This URL is reserved. It will become available on the date shown.",
          availableAt: getSlugReclaimDate(existing.expiresAt).toISOString(),
        },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "This URL is already taken" }, { status: 409 });
  }

  // Assign slug
  await db.greeting.update({ where: { id }, data: { slug } });
  return NextResponse.json({ ok: true, slug });
}
