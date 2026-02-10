import { signOut } from "next-auth/react";

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (res.status === 401) {
    // Session invalid or user deleted — sign out and redirect to login
    signOut({ callbackUrl: "/login?reason=session_expired" });
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const error = new Error("Fetch error");
    throw error;
  }

  return res.json();
};
