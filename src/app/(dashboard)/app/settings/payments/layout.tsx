import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Settings",
};

export default function PaymentSettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
