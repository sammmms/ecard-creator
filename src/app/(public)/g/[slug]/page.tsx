import { notFound } from "next/navigation";
import db from "@/lib/db";
import GreetingRenderer from "@/components/GreetingRenderer";

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

  return (
    <GreetingRenderer
      greeting={greeting as any}
      wishes={wishes}
      paymentMethods={paymentMethods}
      donationMode={greeting.donationMode}
    />
  );
}
