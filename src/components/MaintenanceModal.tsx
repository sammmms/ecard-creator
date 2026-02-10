"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, X } from "lucide-react";
import { useEscapeKey } from "@/hooks/useEscapeKey";

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MaintenanceModal({
  isOpen,
  onClose,
}: MaintenanceModalProps) {
  const handleEscape = useCallback(() => onClose(), [onClose]);
  useEscapeKey(handleEscape, isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="glass-card w-full max-w-sm rounded-2xl p-8 text-center space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Wrench
                size={24}
                className="text-amber-600 dark:text-amber-400"
              />
            </div>

            <h2 className="text-xl font-bold">Under Maintenance</h2>

            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Xendit payment integration is currently under maintenance. Please
              use <strong>Manual (QRIS)</strong> donation mode in the meantime.
            </p>

            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 rounded-xl btn-theme text-white font-semibold text-sm"
            >
              Got it
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
