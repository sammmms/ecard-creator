import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bizapps - Happy Chinese New Year",
  description:
    "Celebrate the Lunar New Year with Bizapps. Experience our interactive Chinese New Year greeting.",
  openGraph: {
    title: "Happy Chinese New Year — Bizapps",
    description:
      "Celebrate the Lunar New Year with Bizapps. Experience our interactive Chinese New Year greeting.",
    type: "website",
    images: [
      {
        url: "/demo/og.png",
        width: 1200,
        height: 630,
        alt: "Happy Chinese New Year — Bizapps",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Chinese New Year — Bizapps",
    description:
      "Celebrate the Lunar New Year with Bizapps. Experience our interactive Chinese New Year greeting.",
    images: [
      {
        url: "/demo/og.png",
        width: 1200,
        height: 630,
        alt: "Happy Chinese New Year — Bizapps",
      },
    ],
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
