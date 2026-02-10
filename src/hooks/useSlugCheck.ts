"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SlugCheckResult {
  isChecking: boolean;
  isAvailable: boolean | null;
  error: string | null;
  availableAt: string | null;
}

export function useSlugCheck(
  greetingId: string,
  slug: string,
  currentSlug: string,
) {
  const [result, setResult] = useState<SlugCheckResult>({
    isChecking: false,
    isAvailable: null,
    error: null,
    availableAt: null,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const checkSlug = useCallback(
    async (value: string) => {
      if (abortRef.current) abortRef.current.abort();

      if (!value || value === currentSlug) {
        setResult({ isChecking: false, isAvailable: null, error: null, availableAt: null });
        return;
      }

      // Basic format check client-side
      if (!/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(value)) {
        setResult({
          isChecking: false,
          isAvailable: false,
          error: "3-50 chars, lowercase letters, numbers, hyphens only",
          availableAt: null,
        });
        return;
      }

      setResult((r) => ({ ...r, isChecking: true }));

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `/api/greetings/${greetingId}/slug?slug=${encodeURIComponent(value)}`,
          { signal: controller.signal },
        );
        const data = await res.json();

        if (!controller.signal.aborted) {
          setResult({
            isChecking: false,
            isAvailable: data.available ?? false,
            error: data.error || null,
            availableAt: data.availableAt || null,
          });
        }
      } catch {
        if (!controller.signal.aborted) {
          setResult({ isChecking: false, isAvailable: null, error: null, availableAt: null });
        }
      }
    },
    [greetingId, currentSlug],
  );

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!slug || slug === currentSlug) {
      setResult({ isChecking: false, isAvailable: null, error: null, availableAt: null });
      return;
    }

    timerRef.current = setTimeout(() => checkSlug(slug), 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [slug, checkSlug, currentSlug]);

  return result;
}
