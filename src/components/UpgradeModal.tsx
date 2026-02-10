"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, X, Sparkles, CreditCard } from "lucide-react";
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
}

const FEATURES = [
  "Custom company logo & branding",
  "Shareable links without watermark",
  "Digital Wishes (donation) feature",
  "Access to all premium templates",
  "WhatsApp & QR sharing",
];

export default function UpgradeModal({
  isOpen,
  onClose,
  greetingId,
  templatePrice,
}: UpgradeModalProps) {
  const router = useRouter();

  const handleEscape = useCallback(() => onClose(), [onClose]);
  useEscapeKey(handleEscape, isOpen);

  const handleUpgrade = () => {
    onClose();
    router.push("/app/templates");
  };

  const handleUnlockTemplate = () => {
    if (greetingId) {
      onClose();
      router.push(`/app/greetings/${greetingId}/pay?upgrade=true`);
    }
  };

  return (
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
            {/* Decorative top gradient */}
            <div className="absolute top-0 left-0 right-0 h-44 bg-theme-gradient opacity-90" />
            <div className="absolute top-36 left-0 right-0 h-8 bg-gradient-to-b from-[var(--theme-accent)] to-transparent opacity-30" />

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
            <div className="relative pt-8 pb-6 px-6 text-center">
              {/* Lock icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="mx-auto mb-4 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Lock size={28} className="text-white" />
              </motion.div>

              <h2 className="text-xl font-bold text-white mb-1">
                Unlock Full Greeting Power
              </h2>
              <p className="text-white/80 text-sm mb-6">
                Your trial greeting is a preview. Upgrade to unlock:
              </p>

              {/* Features list */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left space-y-3 mb-6">
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

              {/* Primary CTA: Unlock This Template (when greetingId + templatePrice available) */}
              {greetingId && templatePrice ? (
                <>
                  <motion.button
                    onClick={handleUnlockTemplate}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 rounded-xl btn-theme text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-theme"
                  >
                    <CreditCard size={16} />
                    Unlock This Template &mdash;{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(templatePrice)}
                  </motion.button>

                  <button
                    onClick={handleUpgrade}
                    className="mt-3 w-full px-5 py-2.5 text-sm text-gray-500 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles size={14} />
                    Or choose a different template
                  </button>
                </>
              ) : (
                <motion.button
                  onClick={handleUpgrade}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl btn-theme text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-theme"
                >
                  <Sparkles size={16} />
                  Choose a Template & Pay
                </motion.button>
              )}

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
}
