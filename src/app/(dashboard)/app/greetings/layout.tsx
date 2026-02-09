import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Greetings",
};

export default function GreetingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
