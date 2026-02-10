"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import * as anim from "@/lib/animations";

interface UnsavedChangesGuardProps {
  hasUnsavedChanges: boolean;
  children: ReactNode;
}

export default function UnsavedChangesGuard({
  hasUnsavedChanges,
  children,
}: UnsavedChangesGuardProps) {
  const [showModal, setShowModal] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Browser tab close / refresh
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);

  // Intercept in-app link clicks
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#")) return;

      // Intercept internal navigation
      e.preventDefault();
      e.stopPropagation();
      setPendingHref(href);
      setShowModal(true);
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [hasUnsavedChanges]);

  const handleStay = useCallback(() => {
    setShowModal(false);
    setPendingHref(null);
  }, []);

  const handleLeave = useCallback(() => {
    setShowModal(false);
    if (pendingHref) {
      window.location.href = pendingHref;
    }
  }, [pendingHref]);

  useEscapeKey(handleStay, showModal);

  return (
    <>
      {children}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={handleStay}
          >
            <motion.div
              variants={anim.springModal}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 shadow-2xl p-6 text-center space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold">Leave without saving?</h3>
              <p className="text-sm text-gray-500">
                You have unsaved changes. They will be lost if you leave this
                page.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleStay}
                  className="flex-1 py-2.5 rounded-xl btn-theme text-white font-bold text-sm"
                >
                  Stay
                </button>
                <button
                  onClick={handleLeave}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Leave
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
