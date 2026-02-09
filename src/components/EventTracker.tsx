"use client";

import { useEffect } from "react";

export function trackEvent(greetingId: string, type: string, metadata?: Record<string, any>) {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ greetingId, type, metadata }),
  }).catch(() => {}); // Fire and forget
}

export function ViewTracker({ greetingId }: { greetingId: string }) {
  useEffect(() => {
    trackEvent(greetingId, "view");
  }, [greetingId]);
  return null;
}
