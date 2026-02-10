import { nanoid } from "nanoid";
import db from "@/lib/db";
import { createNotification } from "@/lib/notifications";

const DEFAULT_DURATION_DAYS = 180;
const SLUG_RECLAIM_DAYS = 365;

export function isGreetingExpired(greeting: {
  expiresAt: Date | null;
  isTrial: boolean;
}): boolean {
  if (greeting.isTrial) return false;
  if (!greeting.expiresAt) return false;
  return new Date() > greeting.expiresAt;
}

export function getExpiryDate(
  fromDate: Date,
  durationDays = DEFAULT_DURATION_DAYS,
): Date {
  const d = new Date(fromDate);
  d.setDate(d.getDate() + durationDays);
  return d;
}

export function isSlugReclaimable(expiresAt: Date): boolean {
  const reclaimDate = new Date(expiresAt);
  reclaimDate.setDate(reclaimDate.getDate() + SLUG_RECLAIM_DAYS);
  return new Date() > reclaimDate;
}

export function getSlugReclaimDate(expiresAt: Date): Date {
  const d = new Date(expiresAt);
  d.setDate(d.getDate() + SLUG_RECLAIM_DAYS);
  return d;
}

export async function handleSlugReclaim(
  oldGreetingId: string,
): Promise<void> {
  const oldGreeting = await db.greeting.findUnique({
    where: { id: oldGreetingId },
    select: { id: true, userId: true, slug: true, title: true },
  });
  if (!oldGreeting) return;

  const oldSlug = oldGreeting.slug;
  const newRandomSlug = nanoid(10);

  // Reassign old greeting to a new random slug
  await db.greeting.update({
    where: { id: oldGreetingId },
    data: { slug: newRandomSlug },
  });

  // Notify old owner
  await createNotification({
    userId: oldGreeting.userId,
    message: `Your greeting URL "/g/${oldSlug}" has been claimed by another user. Your greeting is now available at "/g/${newRandomSlug}".`,
    redirectLink: `/app/greetings/${oldGreetingId}/edit`,
    type: "slug_reclaimed",
  });
}
