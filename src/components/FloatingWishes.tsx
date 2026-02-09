"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface Wish {
  id: string;
  name: string | null;
  comment: string | null;
  createdAt: string;
  donationAmount: number | null;
}

function formatAmount(amount: number): string {
  if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `Rp ${(amount / 1000).toFixed(0)}K`;
  return `Rp ${amount}`;
}

export default function FloatingWishes({ wishes }: { wishes: Wish[] }) {
  if (!wishes || wishes.length === 0) return null;

  const visibleWishes = wishes.slice(0, 10);

  return (
    <div
      className="absolute left-0 right-0 pointer-events-none z-20"
      style={{ top: "33%" }}
    >
      <div className="max-w-lg mx-auto px-4 overflow-y-auto max-h-[35vh] space-y-2 scrollbar-hide">
        <AnimatePresence>
          {visibleWishes.map((wish, index) => (
            <motion.div
              key={wish.id}
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -30 : 30,
                y: 10,
              }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                delay: index * 0.4 + 1.5,
                duration: 0.5,
                ease: "easeOut",
              }}
              className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"} pointer-events-auto`}
            >
              <div className="bg-white/85 backdrop-blur-sm rounded-2xl px-3.5 py-2 shadow-lg border border-white/50 max-w-[260px]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {wish.name && (
                    <span className="text-xs font-semibold text-gray-800 truncate">
                      {wish.name}
                    </span>
                  )}
                  {wish.donationAmount && wish.donationAmount > 0 && (
                    <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5 shrink-0">
                      <Heart size={8} fill="currentColor" />
                      {formatAmount(wish.donationAmount)}
                    </span>
                  )}
                </div>
                {wish.comment && (
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {wish.comment}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
