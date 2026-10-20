import db from "@/lib/db";
import { GreetingStatus } from "@/lib/constants";
import DemoClient from "./DemoClient";

export const revalidate = 0;

const DEMO_GREETING_ID = "demo-greeting";

async function ensureDemoGreeting() {
  const include = {
    publicSubmissions: {
      orderBy: { createdAt: "desc" as const },
      take: 50,
    },
  };

  const existing = await db.greeting.findUnique({
    where: { id: DEMO_GREETING_ID },
    include,
  });

  if (existing) return existing;

  // Ensure demo user exists
  const user = await db.user.upsert({
    where: { email: "demo@company.com" },
    update: {},
    create: {
      email: "demo@company.com",
      companyName: "E-Card Creator",
    },
  });

  // Get first active template
  let template = await db.template.findFirst({
    where: { isActive: true },
  });

  if (!template) {
    template = await db.template.create({
      data: { name: "Demo", configJson: "{}", event: "cny" },
    });
  }

  return db.greeting.create({
    data: {
      id: DEMO_GREETING_ID,
      userId: user.id,
      templateId: template.id,
      slug: "ecard-demo",
      title: "Happy Chinese New Year",
      senderNameDefault: "E-Card Creator",
      messageDefault: "",
      submissionsEnabled: true,
      donationEnabled: false,
      status: GreetingStatus.PUBLISHED,
    },
    include,
  });
}

export default async function DemoPage() {
  let greetingId = "";
  let wishes: Array<{
    id: string;
    name: string | null;
    comment: string | null;
    createdAt: string;
    donationAmount: number | null;
  }> = [];

  try {
    const greeting = await ensureDemoGreeting();
    greetingId = greeting.id;
    wishes = greeting.publicSubmissions.map((sub) => ({
      id: sub.id,
      name: sub.name,
      comment: sub.comment,
      createdAt: sub.createdAt.toISOString(),
      donationAmount: null as number | null,
    }));
  } catch (error) {
    console.error("[DEMO_PAGE]", error);
  }

  return <DemoClient greetingId={greetingId} initialWishes={wishes} />;
}
