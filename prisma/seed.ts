import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash("BAtester123", 10);
  const user = await prisma.user.upsert({
    where: { email: "test@bizapps.id" },
    update: {},
    create: {
      email: "test@bizapps.id",
      companyName: "BizApps Tester",
      passwordHash: hashedPassword,
    },
  });

  // Create Templates
  const templates = [
    // === CNY Templates ===
    {
      id: "template-cny-trial",
      name: "CNY Trial — Lantern Glow",
      price: 0,
      isTrial: true,
      previewImageUrl: "/templates/cny/previews/trial.jpg",
      configJson: JSON.stringify({
        background: "/templates/cny/backgrounds/red-silk.jpg",
        fireworks: true,
        assets: [
          { type: "lantern", x: 8, y: 8, scale: 1, animation: "sway" },
          { type: "lantern", x: 85, y: 12, scale: 0.8, animation: "sway" },
          { type: "blossom", x: 5, y: 75, scale: 0.6, animation: "float" },
          { type: "blossom", x: 90, y: 80, scale: 0.5, animation: "float" },
        ],
        allowedVariants: ["A"],
        typography: { font: "Inter", color: "#FFD700" },
      }),
      event: "cny",
      isActive: true,
      category: "cny",
      description:
        "A warm lantern-lit design — perfect for a quick CNY greeting.",
      premiumPrice: 45000,
    },
    {
      id: "template-cny-01",
      name: "Classic Red & Gold",
      price: 50000,
      isTrial: false,
      previewImageUrl: "/templates/cny/previews/classic.jpg",
      configJson: JSON.stringify({
        background: "/templates/cny/backgrounds/red-silk.jpg",
        fireworks: true,
        assets: [
          { type: "lantern", x: 10, y: 10, scale: 1, animation: "sway" },
          { type: "lantern", x: 80, y: 15, scale: 0.8, animation: "sway" },
          { type: "fu-badge", x: 50, y: 50, scale: 1, animation: "pulse" },
        ],
        allowedVariants: ["A", "B"],
        typography: { font: "Inter", color: "#FFD700" },
      }),
      event: "cny",
      isActive: true,
      category: "cny",
      description: "Timeless red & gold palette with lanterns and fireworks.",
      premiumPrice: null,
    },
    {
      id: "template-cny-02",
      name: "Modern Fireworks",
      price: 75000,
      isTrial: false,
      previewImageUrl: "/templates/cny/previews/modern.jpg",
      configJson: JSON.stringify({
        background: "/templates/cny/backgrounds/night-glow.jpg",
        fireworks: true,
        assets: [
          { type: "fireworks", x: 50, y: 30, scale: 1, animation: "fireworks" },
          { type: "lion-dance", x: 10, y: 80, scale: 1, animation: "bounce" },
        ],
        allowedVariants: ["A"],
        typography: { font: "Outfit", color: "#FFF" },
      }),
      event: "cny",
      isActive: true,
      category: "cny",
      description: "Vibrant night-sky fireworks with a modern twist.",
      premiumPrice: null,
    },
    {
      id: "template-cny-03",
      name: "Paper Cut Art",
      price: 60000,
      isTrial: false,
      previewImageUrl: "/templates/cny/previews/papercut.jpg",
      configJson: JSON.stringify({
        background: "/templates/cny/backgrounds/paper-cut.jpg",
        fireworks: false,
        assets: [
          { type: "blossom", x: 0, y: 0, scale: 1.2, animation: "fade" },
          { type: "knot", x: 90, y: 10, scale: 0.5, animation: "sway" },
        ],
        allowedVariants: ["A", "B", "C"],
        typography: { font: "Roboto", color: "#E6E6FA" },
      }),
      event: "cny",
      isActive: true,
      category: "cny",
      description:
        "Elegant paper-cut style with blossoms and traditional knots.",
      premiumPrice: null,
    },
    {
      id: "template-cny-gold",
      name: "Gold & Shiny",
      price: 75000,
      isTrial: false,
      previewImageUrl: null,
      configJson: "{}",
      componentSlug: "gold-n-shiny",
      event: "cny",
      isActive: true,
      category: "cny",
      description: "Luxurious gold shimmer with animated sparkle effects.",
      premiumPrice: null,
    },
    {
      id: "template-cny-crimson",
      name: "Crimson Bloom",
      price: 65000,
      isTrial: false,
      previewImageUrl: null,
      configJson: "{}",
      componentSlug: "crimson-bloom",
      event: "cny",
      isActive: true,
      category: "cny",
      description: "Deep crimson tones with falling cherry blossom petals.",
      premiumPrice: null,
    },
    {
      id: "template-cny-jade",
      name: "Jade Prosperity",
      price: 70000,
      isTrial: false,
      previewImageUrl: null,
      configJson: "{}",
      componentSlug: "jade-prosperity",
      event: "cny",
      isActive: true,
      category: "cny",
      description: "Jade green elegance with golden prosperity accents.",
      premiumPrice: null,
    },

    // === Valentine Templates ===
    {
      id: "template-val-trial",
      name: "Valentine Trial — Rose Whisper",
      price: 0,
      isTrial: true,
      previewImageUrl: null,
      configJson: "{}",
      componentSlug: "valentine-rose",
      event: "valentine",
      isActive: true,
      category: "valentine",
      description:
        "A romantic rose-themed card to try for free. Upgrade to unlock full features.",
      premiumPrice: 45000,
    },
    {
      id: "template-val-01",
      name: "Valentine Rose",
      price: 65000,
      isTrial: false,
      previewImageUrl: null,
      configJson: "{}",
      componentSlug: "valentine-rose",
      event: "valentine",
      isActive: true,
      category: "valentine",
      description:
        "Romantic roses with floating hearts and elegant color schemes.",
      premiumPrice: null,
    },
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { id: t.id },
      update: {
        category: t.category,
        description: t.description,
        premiumPrice: t.premiumPrice,
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
