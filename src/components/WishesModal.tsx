"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Loader2, Heart } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import Button from "@/components/Button";
import * as anim from "@/lib/animations";

interface WishData {
  id: string;
  name: string | null;
  comment: string | null;
  createdAt: string;
  donationAmount: number | null;
}

interface WishesModalProps {
  isOpen: boolean;
  onClose: () => void;
  greetingId: string;
  greetingTitle: string;
}

const AVATAR_GRADIENTS = [
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-violet-500",
  "from-red-400 to-rose-500",
];

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function WishesModal({
  isOpen,
  onClose,
  greetingId,
  greetingTitle,
}: WishesModalProps) {
  const { data: wishes = [], isLoading: loading } = useSWR<WishData[]>(
    isOpen && greetingId ? `/api/greetings/${greetingId}/wishes` : null,
    fetcher,
  );

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
            className="relative w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <MessageCircle size={18} className="text-theme-primary shrink-0" />
                <h3 className="font-semibold text-base truncate">
                  Wishes &mdash; {greetingTitle}
                </h3>
              </div>
              <Button
                variant="icon"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0"
              >
                <X size={18} />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1">
              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={28} className="animate-spin text-gray-400" />
                </div>
              )}

              {/* Empty */}
              {!loading && wishes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <Heart size={36} className="text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    No wishes yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Wishes will appear here when people send them.
                  </p>
                </div>
              )}

              {/* Wish list */}
              {!loading && wishes.length > 0 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={anim.staggerContainer}
                >
                  {wishes.map((wish) => {
                    const name = wish.name || "Anonymous";
                    const initial = name.charAt(0).toUpperCase();
                    const gradientIdx = hashCode(wish.id) % AVATAR_GRADIENTS.length;

                    return (
                      <motion.div
                        key={wish.id}
                        variants={anim.staggerItem}
                        className="flex items-start gap-3 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                      >
                        {/* Avatar */}
                        <div
                          className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[gradientIdx]} flex items-center justify-center shrink-0`}
                        >
                          <span className="text-white text-sm font-bold">
                            {initial}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-sm truncate">
                              {name}
                            </p>
                            {wish.donationAmount && wish.donationAmount > 0 && (
                              <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium shrink-0">
                                {formatCurrency(wish.donationAmount)}
                              </span>
                            )}
                          </div>
                          {wish.comment && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                              {wish.comment}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {new Date(wish.createdAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Footer with count */}
            {!loading && wishes.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500 text-center shrink-0">
                {wishes.length} wish{wishes.length !== 1 ? "es" : ""} total
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
