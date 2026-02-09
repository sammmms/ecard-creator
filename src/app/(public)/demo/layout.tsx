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
    images: ["/demo/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Chinese New Year — Bizapps",
    description:
      "Celebrate the Lunar New Year with Bizapps. Experience our interactive Chinese New Year greeting.",
    images: ["/demo/og.png"],
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
