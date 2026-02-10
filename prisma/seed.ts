import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash("BAtester123", 10);
  await prisma.user.upsert({
    where: { email: "test@bizapps.id" },
    update: {},
    create: {
      email: "test@bizapps.id",
      companyName: "BizApps Tester",
      passwordHash: hashedPassword,
    },
  });

  // Create Templates — only those with actual component implementations
  const templates = [
    // === CNY Templates ===
    {
      id: "template-cny-gold",
      name: "Gold & Shiny",
      price: 25000,
      previewImageUrl: null,
      configJson: "{}",
      componentSlug: "gold-n-shiny",
      event: "cny",
      isActive: true,
      category: "cny",
      description: "Luxurious gold shimmer with animated sparkle effects.",
      premiumPrice: null,
      extensionMonths: 6,
      extensionPrice: 15000,
    },
    {
      id: "template-cny-crimson",
      name: "Crimson Bloom",
      price: 25000,
      previewImageUrl: null,
      configJson: "{}",
      componentSlug: "crimson-bloom",
      event: "cny",
      isActive: true,
      category: "cny",
      description: "Deep crimson tones with falling cherry blossom petals.",
      premiumPrice: null,
      extensionMonths: 6,
      extensionPrice: 15000,
    },
    {
      id: "template-cny-jade",
      name: "Jade Prosperity",
      price: 25000,
      previewImageUrl: null,
      configJson: "{}",
      componentSlug: "jade-prosperity",
      event: "cny",
      isActive: true,
      category: "cny",
      description: "Jade green elegance with golden prosperity accents.",
      premiumPrice: null,
      extensionMonths: 6,
      extensionPrice: 15000,
    },

    // === Valentine Templates ===
    {
      id: "template-val-sweet",
      name: "Valentine Sweet",
      price: 25000,
      previewImageUrl: null,
      configJson: "{}",
      componentSlug: "valentine-sweet",
      event: "valentine",
      isActive: true,
      category: "valentine",
      description:
        "Soft pink elegance with floating hearts and gentle sparkles.",
      premiumPrice: null,
      extensionMonths: 6,
      extensionPrice: 15000,
    },
    {
      id: "template-val-01",
      name: "Valentine Rose",
      price: 30000,
      previewImageUrl: null,
      configJson: "{}",
      componentSlug: "valentine-rose",
      event: "valentine",
      isActive: true,
      category: "valentine",
      description:
        "Romantic roses with floating hearts and elegant color schemes.",
      premiumPrice: null,
      extensionMonths: 6,
      extensionPrice: 15000,
    },
    {
      id: "template-val-bloom",
      name: "Valentine Bloom",
      price: 30000,
      previewImageUrl: null,
      configJson: "{}",
      componentSlug: "valentine-bloom",
      event: "valentine",
      isActive: true,
      category: "valentine",
      description:
        "Luxurious deep rose with rose petals, cupid arrows, and glowing hearts.",
      premiumPrice: null,
      extensionMonths: 6,
      extensionPrice: 15000,
    },
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { id: t.id },
      update: {
        category: t.category,
        description: t.description,
        premiumPrice: t.premiumPrice,
        extensionMonths: t.extensionMonths,
        extensionPrice: t.extensionPrice,
      },
      create: t,
    });
  }

  console.log(`Seeded ${templates.length} templates.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
