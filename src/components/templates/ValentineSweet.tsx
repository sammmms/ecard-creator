"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { TemplateProps } from "@/types/template";
import { useGreetingPage } from "@/components/GreetingPageWrapper";
import InlineEditable from "@/components/InlineEditable";

// --- Floating heart particles (simple, fewer than Rose) ---
function HeartParticles() {
  const COLORS = ["#f9a8d4", "#f472b6", "#fda4af", "#fecdd3"];

  const [hearts] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 8 + Math.random() * 10,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 10,
      duration: 9 + Math.random() * 6,
      swayAmount: 20 + Math.random() * 30,
    })),
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.x}%`,
            top: -25,
            width: h.size,
            height: h.size,
            color: h.color,
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, h.swayAmount, -h.swayAmount, 0],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "linear",
            x: { duration: h.duration, delay: h.delay, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: h.duration, delay: h.delay, repeat: Infinity, times: [0, 0.1, 0.8, 1] },
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// --- Sparkle dots ---
function PinkSparkles() {
  const [sparkles] = useState(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2.5,
    })),
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-2">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: "radial-gradient(circle, #f9a8d4 0%, #f472b6 60%, transparent 100%)",
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// --- Heart divider (simple) ---
function HeartDivider() {
  return (
    <div className="flex items-center justify-center gap-0 w-full py-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-pink-300/40" />
      <svg viewBox="0 0 24 24" fill="#ec4899" width="14" height="14" className="mx-3 opacity-50">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-pink-300/40" />
    </div>
  );
}

export default function ValentineSweet({
  greeting,
  isPreview = false,
  isEditing = false,
  onFieldChange,
  onLogoClick,
}: TemplateProps) {
  const { isPlaying, openUpgradeModal } = useGreetingPage();
  const isTrial = greeting.isTrial === true;

  return (
    <div className={`relative w-full overflow-hidden text-center flex flex-col items-center justify-center font-sans ${isEditing ? "min-h-full" : "min-h-screen"}`}>
      {/* Soft pink gradient background */}
      <div className="absolute inset-0 -z-30">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 30%, #fff1f2 60%, #fdf2f8 100%)",
            backgroundSize: "400% 400%",
          }}
          animate={
            isPlaying
              ? { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }
              : {}
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Subtle heart pattern texture */}
      <div
        className="absolute inset-0 -z-25 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 24 24' fill='%23ec4899'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Glow */}
      <motion.div
        className="absolute inset-0 -z-20"
        animate={isPlaying ? { opacity: [0.3, 0.5, 0.3] } : {}}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse at 30% 30%, rgba(244,114,182,0.08) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 70% 70%, rgba(251,113,133,0.06) 0%, transparent 50%)",
        }}
      />

      {/* Heart particles */}
      {isPlaying && <HeartParticles />}

      {/* Sparkles */}
      {isPlaying && <PinkSparkles />}

      {/* Trial banner */}
      {isTrial && !isPreview && !isEditing && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 bg-amber-500/95 backdrop-blur-sm text-white text-center py-2.5 text-sm z-50 font-medium shadow-lg"
        >
          This is a trial greeting.{" "}
          <button
            onClick={openUpgradeModal}
            className="underline underline-offset-2 font-bold hover:text-amber-100 transition-colors"
          >
            Upgrade to unlock all features &rarr;
          </button>
        </motion.div>
      )}

      {/* Preview overlay */}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm text-white text-center py-3 text-sm z-50 font-medium">
          Preview Mode &mdash; This is how your greeting will look
        </div>
      )}

      {/* Main Card */}
      <motion.div
        className="relative z-10 max-w-lg w-[90%] mx-auto rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ boxShadow: "0 20px 60px rgba(236,72,153,0.1), 0 4px 20px rgba(0,0,0,0.05)" }}
      >
        <div className="absolute inset-0 bg-white/92 backdrop-blur-xl" />
        <div className="absolute inset-0 border border-pink-200/40 rounded-2xl" />

        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        />

        <div className="relative p-8 space-y-5">
          {isTrial ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-pink-400/50 font-medium tracking-wider uppercase"
            >
              Powered by E-Card Greeting
            </motion.div>
          ) : isEditing ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              onClick={onLogoClick}
              className="cursor-pointer group"
            >
              {greeting.companyLogoUrl ? (
                <div className="relative w-16 h-16 mx-auto">
                  <Image
                    src={greeting.companyLogoUrl}
                    alt="Company Logo"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain rounded-lg"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-[10px] font-medium">Change</span>
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 mx-auto border-2 border-dashed border-pink-300/40 rounded-lg flex flex-col items-center justify-center hover:border-pink-300/70 transition-colors">
                  <span className="text-pink-400/60 text-lg leading-none">+</span>
                  <span className="text-pink-400/50 text-[9px] mt-0.5">Logo</span>
                </div>
              )}
            </motion.div>
          ) : greeting.companyLogoUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Image
                src={greeting.companyLogoUrl}
                alt="Company Logo"
                width={64}
                height={64}
                className="w-16 h-16 mx-auto object-contain rounded-lg"
                unoptimized
              />
            </motion.div>
          ) : null}

          <HeartDivider />

          <motion.h1
            className={`text-4xl md:text-5xl font-bold drop-shadow-sm ${isEditing ? "text-pink-400/50" : "bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 bg-clip-text text-transparent"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {isEditing ? (
              <InlineEditable
                value={greeting.title}
                onChange={(v) => onFieldChange?.("title", v)}
                placeholder="Add your greeting title"
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 bg-clip-text text-transparent"
              />
            ) : isPreview ? (
              greeting.title || "Add your greeting title"
            ) : (
              greeting.title
            )}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {isEditing ? (
              <InlineEditable
                value={greeting.messageDefault}
                onChange={(v) => onFieldChange?.("messageDefault", v)}
                placeholder="Write your greeting message here..."
                className="text-lg md:text-xl leading-relaxed text-gray-600"
                multiline
              />
            ) : isPreview ? (
              greeting.messageDefault ||
              "Write your greeting message here..."
            ) : (
              greeting.messageDefault ||
              "You are the reason my heart smiles. Happy Valentine's Day!"
            )}
          </motion.p>

          <HeartDivider />

          <motion.div
            className="pt-2 font-semibold text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-pink-400/60 text-sm">With Love,</span>
            <br />
            <span className={`text-2xl ${isEditing ? "text-pink-400/50" : "bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"}`}>
              {isEditing ? (
                <InlineEditable
                  value={greeting.senderNameDefault}
                  onChange={(v) => onFieldChange?.("senderNameDefault", v)}
                  placeholder="Your company name"
                  className="text-2xl bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"
                />
              ) : isPreview ? (
                greeting.senderNameDefault || "Your company name"
              ) : (
                greeting.senderNameDefault || "With All My Heart"
              )}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Trial watermark */}
      {isTrial && !isPreview && !isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-4 left-0 right-0 text-center z-10"
        >
          <span className="text-pink-400/40 text-xs font-medium tracking-wider">
            TRIAL GREETING &mdash; E-Card Greeting Platform
          </span>
        </motion.div>
      )}
    </div>
  );
}
