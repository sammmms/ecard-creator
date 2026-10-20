import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ToastProvider from "@/components/providers/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "E-Card Creator — Digital Greeting Cards for Chinese New Year, Valentine & More",
    template: "%s | E-Card Creator",
  },
  description:
    "Create elegant, animated digital greeting cards for Chinese New Year, Valentine, and special occasions. Share prosperity instantly via WhatsApp or QR code. Premium templates with integrated digital wishes.",
  keywords: [
    "Chinese New Year greeting card",
    "Valentine greeting card",
    "digital greeting card",
    "CNY e-card",
    "animated greeting",
    "digital angpao",
    "lunar new year card",
    "e-card generator",
    "E-Card Creator",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://ecard-creator.vercel.app",
  ),
  openGraph: {
    title: "E-Card Creator — Digital Greeting Cards",
    description:
      "Create elegant, animated digital greeting cards for every special occasion. Share wishes instantly via WhatsApp or QR code.",
    type: "website",
    siteName: "E-Card Creator",
    images: ["/logo/gold-square.png"],
  },
  twitter: {
    card: "summary",
    title: "E-Card Creator — Digital Greeting Cards",
    description:
      "Create elegant, animated digital greeting cards for every special occasion.",
    images: ["/logo/gold-square.png"],
  },
  icons: {
    icon: "/logo/gold-square.png",
    apple: "/logo/gold-square.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
