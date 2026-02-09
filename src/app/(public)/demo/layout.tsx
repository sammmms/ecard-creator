import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo — Happy Chinese New Year",
  description:
    "Experience a live animated Chinese New Year greeting card demo. See fireworks, lanterns, and festive decorations come to life.",
  openGraph: {
    title: "Happy Chinese New Year — Live Demo",
    description:
      "Experience a live animated Chinese New Year greeting card. Fireworks, lanterns, and festive decorations come to life.",
    type: "website",
    images: ["/demo/2.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Chinese New Year — Live Demo",
    description:
      "Experience a live animated Chinese New Year greeting card demo.",
    images: ["/demo/2.png"],
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
