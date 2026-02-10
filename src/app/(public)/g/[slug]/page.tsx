import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import GreetingRenderer from "@/components/GreetingRenderer";
import { TemplateRenderer } from "@/components/templates";
import { ViewTracker } from "@/components/EventTracker";
import GreetingPageWrapper from "@/components/GreetingPageWrapper";
import { getTrackById } from "@/lib/music";
import { PublicSubmission } from "@prisma/client/wasm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const greeting = await db.greeting.findUnique({
    where: { slug },
    select: {
      title: true,
      senderNameDefault: true,
      messageDefault: true,
    },
  });

  if (!greeting) {
    return { title: "Greeting Not Found" };
  }

  const title = `${greeting.title || "Happy New Year"} — from ${greeting.senderNameDefault || "Someone Special"}`;
  const description = (
    greeting.messageDefault || "A greeting card made with love"
  ).slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [`/g/${slug}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/g/${slug}/opengraph-image`],
    },
  };
}

export default async function PublicGreetingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const greeting = await db.greeting.findUnique({
    where: { slug },
    include: {
      template: true,
      publicSubmissions: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      donationPayments: {
        select: {
          id: true,
          donorName: true,
          donorMessage: true,
          amount: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (!greeting) return notFound();

  // Determine if current viewer is the owner
  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.id === greeting.userId;

  // Trial greetings: check view limit
  if (greeting.isTrial && !isOwner) {
    if (greeting.viewCount >= greeting.maxFreeViews) {
      return (
        <div className="min-h-dvh flex items-center justify-center bg-linear-to-b from-gray-950 via-gray-900 to-gray-950 p-4">
          <div className="max-w-sm w-full rounded-2xl bg-gray-900/80 border border-gray-800 p-8 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-full bg-gray-800 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">
              This greeting has reached its free view limit
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              This trial greeting has been viewed by {greeting.maxFreeViews}{" "}
              unique visitors. The creator can upgrade to unlock unlimited
              views.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 mt-2 w-full px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors"
            >
              Create your own greeting
            </Link>
          </div>
        </div>
      );
    }
  }

  // Track unique view by IP for all non-owner visits
  if (!isOwner) {
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip =
      forwarded?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";

    try {
      await db.greetingView.create({
        data: { greetingId: greeting.id, ipAddress: ip },
      });
      // New unique visitor — increment count
      const updated = await db.greeting.update({
        where: { id: greeting.id },
        data: { viewCount: { increment: 1 } },
      });
      // Trial: check if limit just reached — notify owner
      if (greeting.isTrial && updated.viewCount >= updated.maxFreeViews) {
        await createNotification({
          userId: greeting.userId,
          message: `Your greeting "${greeting.title || "Untitled"}" has reached its free view limit of ${updated.maxFreeViews} unique visitors. Upgrade to unlock unlimited views!`,
          redirectLink: `/app/greetings/${greeting.id}/edit`,
          type: "view_limit_reached",
        });
      }
    } catch (e: unknown) {
      // Unique constraint violation (P2002) = already counted, skip
      const prismaError = e as { code?: string };
      if (prismaError.code !== "P2002") throw e;
    }
  }

  // Fetch receiver configs for the greeting owner (for donation payment methods)
  let paymentMethods: {
    qrisImages: Array<{ label: string; url: string }>;
    ewalletType: string | null;
    ewalletNumber: string | null;
    instructionsText: string | null;
    displayName: string | null;
  } | null = null;

  // Disable donations for platform mode (Xendit under maintenance)
  const effectiveDonationEnabled =
    greeting.donationEnabled && greeting.donationMode !== "platform";

  if (effectiveDonationEnabled && greeting.donationMode !== "none") {
    const receiverConfig = await db.receiverConfig.findFirst({
      where: {
        userId: greeting.userId,
        mode: greeting.donationMode,
        status: "active",
      },
    });

    if (receiverConfig && greeting.donationMode === "manual") {
      let qrisImages: Array<{ label: string; url: string }> = [];
      try {
        const parsed = JSON.parse(receiverConfig.qrisImageUrl || "[]");
        qrisImages = Array.isArray(parsed) ? parsed : [];
      } catch {
        if (receiverConfig.qrisImageUrl) {
          qrisImages = [{ label: "QRIS", url: receiverConfig.qrisImageUrl }];
        }
      }
      paymentMethods = {
        qrisImages,
        ewalletType: receiverConfig.ewalletType,
        ewalletNumber: receiverConfig.ewalletNumber,
        instructionsText: receiverConfig.instructionsText,
        displayName: receiverConfig.displayName,
      };
    }
  }

  // Build wishes from public submissions, enriched with donation amounts
  const wishes = greeting.publicSubmissions.map((sub: PublicSubmission) => {
    const matchingDonation = greeting.donationPayments.find(
      (d: { donorName: string | null; donorMessage: string | null }) =>
        d.donorName === sub.name && d.donorMessage === sub.comment,
    );

    return {
      id: sub.id,
      name: sub.name,
      comment: sub.comment,
      imageUrl: sub.imageUrl || null,
      createdAt: sub.createdAt.toISOString(),
      donationAmount: matchingDonation?.amount || null,
    };
  });

  const greetingData = {
    id: greeting.id,
    title: greeting.title || "",
    senderNameDefault: greeting.senderNameDefault || "",
    messageDefault: greeting.messageDefault || "",
    companyLogoUrl: greeting.companyLogoUrl || undefined,
    isTrial: greeting.isTrial,
    submissionsEnabled: greeting.submissionsEnabled,
    donationEnabled: effectiveDonationEnabled,
    donationMode:
      greeting.donationMode === "platform" ? "none" : greeting.donationMode,
    slug: greeting.slug,
    layoutVariant: greeting.layoutVariant || undefined,
  };

  return (
    <>
      <ViewTracker greetingId={greeting.id} />
      <GreetingPageWrapper
        greeting={greetingData}
        paymentMethods={paymentMethods}
        donationMode={greeting.donationMode}
        initialWishes={wishes}
        musicSrc={getTrackById(greeting.musicTrackId)?.src || undefined}
      >
        {greeting.template.componentSlug ? (
          <TemplateRenderer
            componentSlug={greeting.template.componentSlug}
            greeting={greetingData}
          />
        ) : (
          <GreetingRenderer
            greeting={{
              ...greetingData,
              template: { configJson: greeting.template.configJson },
            }}
          />
        )}
      </GreetingPageWrapper>
    </>
  );
}
