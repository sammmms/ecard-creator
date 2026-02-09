"use client";

import { motion } from "framer-motion";

interface AnimationToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export default function AnimationToggle({
  isPlaying,
  onToggle,
}: AnimationToggleProps) {
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
    >
      <button
        onClick={onToggle}
        className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white font-medium hover:bg-white/30 transition-all border border-white/30 shadow-xl"
      >
        {isPlaying ? "\u23F8 Pause" : "\u25B6 Play"} Animation
      </button>
    </motion.div>
  );
}
