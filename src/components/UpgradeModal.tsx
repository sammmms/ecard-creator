"use client";

import { useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Check, X, CreditCard } from "lucide-react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import * as anim from "@/lib/animations";
import { useEscapeKey } from "@/hooks/useEscapeKey";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: string;
  greetingId?: string;
  templatePrice?: number | null;
  viewCount?: number;
  maxFreeViews?: number;
}

const FEATURES = [
  "Unlimited public views (no cap)",
  "Custom company logo & branding",
  "Shareable link without limits",
  "Digital Wishes (donation) feature",
  "Custom URL & extended expiry",
];

export default function UpgradeModal({
  isOpen,
  onClose,
  greetingId,
  templatePrice,
  viewCount,
  maxFreeViews,
}: UpgradeModalProps) {
  const router = useRouter();

  const handleEscape = useCallback(() => onClose(), [onClose]);
  useEscapeKey(handleEscape, isOpen);

  const handleUpgrade = () => {
    if (greetingId) {
      onClose();
      router.push(`/app/greetings/${greetingId}/pay?upgrade=true`);
    } else {
      onClose();
      router.push("/app/templates");
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            variants={anim.springModal}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative top — solid theme colors for consistent dark/light mode */}
            <div className="bg-theme-gradient h-40" />

            {/* Close button */}
            <Button
              variant="icon"
              size="sm"
              onClick={onClose}
              className="absolute top-3 right-3 z-10 text-white/80 hover:text-white"
            >
              <X size={18} />
            </Button>

            {/* Content */}
            <div className="relative -mt-12 px-6 pb-6 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="mx-auto mb-4 w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center"
              >
                <Zap size={28} className="text-amber-500" />
              </motion.div>

              <h2 className="text-xl font-bold mb-1">
                Upgrade This Greeting
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                Remove trial limits and unlock all features for this card
                {viewCount !== undefined && maxFreeViews !== undefined && (
                  <span className="block mt-1 text-amber-600 dark:text-amber-400 font-medium">
                    {viewCount}/{maxFreeViews} free views used
                  </span>
                )}
              </p>

              {/* Features list */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left space-y-3 mb-5">
                {FEATURES.map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Primary CTA */}
              <motion.button
                onClick={handleUpgrade}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl btn-theme text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-theme"
              >
                <CreditCard size={16} />
                {greetingId && templatePrice ? (
                  <>
                    Upgrade &mdash;{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(templatePrice)}
                  </>
                ) : (
                  "Choose a Template & Pay"
                )}
              </motion.button>

              <button
                onClick={onClose}
                className="mt-3 px-5 py-2 text-sm text-gray-400 rounded-lg border border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Use portal to render outside any parent transform/contain context
  if (typeof window === "undefined") return modalContent;
  return createPortal(modalContent, document.body);
}
