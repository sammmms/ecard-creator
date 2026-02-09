import { notFound } from "next/navigation";
import type { Metadata } from "next";
import db from "@/lib/db";
import GreetingRenderer from "@/components/GreetingRenderer";
import { getTemplateComponent } from "@/components/templates";

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
  const description = (greeting.messageDefault || "A greeting card made with love").slice(0, 160);

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

  // Fetch receiver configs for the greeting owner (for donation payment methods)
  let paymentMethods: {
    qrisImages: Array<{ label: string; url: string }>;
    ewalletType: string | null;
    ewalletNumber: string | null;
    instructionsText: string | null;
    displayName: string | null;
  } | null = null;

  if (greeting.donationEnabled && greeting.donationMode !== "none") {
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
  const wishes = greeting.publicSubmissions.map((sub) => {
    // Try to match a donation by donor name + message
    const matchingDonation = greeting.donationPayments.find(
      (d) =>
        d.donorName === sub.name &&
        d.donorMessage === sub.comment,
    );

    return {
      id: sub.id,
      name: sub.name,
      comment: sub.comment,
      createdAt: sub.createdAt.toISOString(),
      donationAmount: matchingDonation?.amount || null,
    };
  });

  // Check if the template has a static component
  const StaticTemplate = getTemplateComponent(greeting.template.componentSlug);

  const templateProps = {
    greeting: {
      id: greeting.id,
      title: greeting.title || "",
      senderNameDefault: greeting.senderNameDefault || "",
      messageDefault: greeting.messageDefault || "",
      companyLogoUrl: greeting.companyLogoUrl || undefined,
      isTrial: greeting.isTrial,
      submissionsEnabled: greeting.submissionsEnabled,
      donationEnabled: greeting.donationEnabled,
      donationMode: greeting.donationMode,
      slug: greeting.slug,
    },
    wishes,
    paymentMethods,
    donationMode: greeting.donationMode,
  };

  if (StaticTemplate) {
    return <StaticTemplate {...templateProps} />;
  }

  // Fallback to existing GreetingRenderer
  return (
    <GreetingRenderer
      greeting={greeting as any}
      wishes={wishes}
      paymentMethods={paymentMethods}
      donationMode={greeting.donationMode}
    />
  );
}
