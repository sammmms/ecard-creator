"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, X, Sparkles } from "lucide-react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import * as anim from "@/lib/animations";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: string;
}

const FEATURES = [
  "Custom company logo & branding",
  "Shareable links without watermark",
  "Digital Angpao (donation) feature",
  "Access to all premium templates",
  "WhatsApp & QR sharing",
];

export default function UpgradeModal({
  isOpen,
  onClose,
}: UpgradeModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onClose();
    router.push("/app/templates");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
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
            <div className="absolute top-0 left-0 right-0 h-32 bg-theme-gradient opacity-90" />

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

              {/* CTA */}
              <motion.button
                onClick={handleUpgrade}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl btn-theme text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-theme"
              >
                <Sparkles size={16} />
                Choose a Template & Pay
              </motion.button>

              <button
                onClick={onClose}
                className="mt-3 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
