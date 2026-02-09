import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Greeting",
};

export default function EditLayout({ children }: { children: React.ReactNode }) {
  return children;
}
