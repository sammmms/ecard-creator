"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface Wish {
  id: string;
  name: string | null;
  comment: string | null;
  createdAt: string;
  donationAmount: number | null;
}

// Stable hash from string → deterministic animation params per wish
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seeded(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// Warm accent colors for avatar circles
const AVATAR_GRADIENTS = [
  "from-red-400 to-rose-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
  "from-red-500 to-amber-500",
  "from-orange-400 to-red-500",
  "from-rose-400 to-pink-500",
];

export default function FloatingWishes({ wishes }: { wishes: Wish[] }) {
  if (!wishes || wishes.length === 0) return null;

  const visibleWishes = wishes.slice(0, 15);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {visibleWishes.map((wish) => {
        const hasContent = wish.name || wish.comment;
        if (!hasContent) return null;

        // All params derived from wish.id → stable across re-renders
        const hash = hashCode(wish.id);
        const fromRight = hash % 2 === 1;
        const yPosition = 10 + seeded(hash) * 75; // 10%–85%
        const duration = 16 + seeded(hash + 1) * 10; // 16–26s
        const delay = seeded(hash + 2) * 25; // 0–25s stagger
        const repeatDelay = 20 + seeded(hash + 3) * 15; // 20–35s gap
        const gradient = AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
        const initial = wish.name?.[0]?.toUpperCase() || null;

        return (
          <motion.div
            key={wish.id}
            className="absolute"
            style={{ top: `${yPosition}%` }}
            initial={{
              x: fromRight ? "100vw" : "-100%",
              opacity: 0,
            }}
            animate={{
              x: fromRight ? "-100%" : "100vw",
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              repeatDelay,
              ease: "linear",
              opacity: {
                duration,
                delay,
                repeat: Infinity,
                repeatDelay,
                times: [0, 0.08, 0.88, 1],
              },
            }}
          >
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full pl-1.5 pr-4 py-1.5 shadow-lg shadow-black/[0.08] border border-white/70 max-w-[320px]">
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm`}
              >
                {initial ? (
                  <span className="text-[11px] font-bold text-white leading-none">
                    {initial}
                  </span>
                ) : (
                  <Heart
                    size={12}
                    className="text-white"
                    fill="currentColor"
                  />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 overflow-hidden">
                {wish.name && (
                  <p className="text-[11px] font-semibold text-gray-800 truncate leading-tight">
                    {wish.name}
                  </p>
                )}
                {wish.comment && (
                  <p className="text-[11px] text-gray-500 truncate leading-tight">
                    {wish.comment}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
