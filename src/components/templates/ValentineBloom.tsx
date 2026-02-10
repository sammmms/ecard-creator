"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { TemplateProps } from "@/types/template";
import { useGreetingPage } from "@/components/GreetingPageWrapper";
import InlineEditable from "@/components/InlineEditable";

// --- Heart particles (rich, varied sizes) ---
function HeartParticleOverlay() {
  const COLORS = ["#e11d48", "#f43f5e", "#fb7185", "#fda4af", "#ffffff"];

  const [hearts] = useState(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 10 + Math.random() * 16,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 7,
      swayAmount: 30 + Math.random() * 50,
      rotation: Math.random() * 40 - 20,
    })),
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-1">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.x}%`,
            top: -30,
            width: h.size,
            height: h.size,
            color: h.color,
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, h.swayAmount, -h.swayAmount, h.swayAmount / 2, 0],
            rotate: [h.rotation, h.rotation + 20, h.rotation - 20, h.rotation],
            opacity: [0, 0.7, 0.7, 0.4, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "linear",
            x: { duration: h.duration, delay: h.delay, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: h.duration, delay: h.delay, repeat: Infinity, times: [0, 0.1, 0.7, 0.9, 1] },
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

// --- Rose petal shower ---
function RosePetalShower() {
  const PETAL_COLORS = ["#fda4af", "#fb7185", "#f43f5e", "#fecdd3"];

  const [petals] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 6 + Math.random() * 8,
      color: PETAL_COLORS[i % PETAL_COLORS.length],
      delay: Math.random() * 12,
      duration: 10 + Math.random() * 8,
      swayAmount: (Math.random() - 0.5) * 80,
      rotation: Math.random() * 360,
    })),
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -15,
            width: p.size,
            height: p.size * 1.3,
            backgroundColor: p.color,
            borderRadius: "50% 0 50% 50%",
            opacity: 0,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.swayAmount, -p.swayAmount / 2, 0],
            opacity: [0, 0.5, 0.4, 0],
            rotate: [p.rotation, p.rotation + 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            x: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: p.duration, delay: p.delay, repeat: Infinity, times: [0, 0.1, 0.7, 1] },
          }}
        />
      ))}
    </div>
  );
}

// --- Floating glow bubbles ---
function FloatingBubbles() {
  const [bubbles] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      size: 50 + Math.random() * 90,
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 8,
    })),
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            bottom: -b.size,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 30% 30%, rgba(225,29,72,0.08), rgba(225,29,72,0.03))`,
            border: "1px solid rgba(225,29,72,0.06)",
          }}
          animate={{
            y: [0, -(typeof window !== "undefined" ? window.innerHeight : 900) - b.size * 2],
            x: [0, 15, -15, 8, 0],
            opacity: [0, 0.5, 0.5, 0.2, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
            opacity: { duration: b.duration, delay: b.delay, repeat: Infinity, times: [0, 0.15, 0.7, 0.9, 1] },
          }}
        />
      ))}
    </div>
  );
}

// --- Sparkle dots ---
function RedSparkles() {
  const [sparkles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      delay: Math.random() * 6,
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
            background: "radial-gradient(circle, #fda4af 0%, #fb7185 60%, transparent 100%)",
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.3, 0.5],
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

// --- Heart divider with diamond ---
function HeartDivider() {
  return (
    <div className="flex items-center justify-center gap-0 w-full py-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-rose-400/40" />
      <div className="relative mx-3 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="#e11d48" width="14" height="14" className="opacity-50">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <div className="absolute w-5 h-5 border border-rose-400/30 rotate-45 rounded-sm" />
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-rose-400/40" />
    </div>
  );
}

// --- Cupid arrow accent ---
function CupidArrow() {
  return (
    <svg viewBox="0 0 120 24" fill="none" className="w-24 mx-auto opacity-25">
      <line x1="10" y1="12" x2="95" y2="12" stroke="#e11d48" strokeWidth="1.5" />
      <polygon points="95,6 110,12 95,18" fill="#e11d48" />
      <circle cx="10" cy="12" r="3" fill="#e11d48" />
      <path d="M7 12c0-2 2-5 3-5s3 3 3 5" stroke="#e11d48" strokeWidth="1" fill="none" />
    </svg>
  );
}

export default function ValentineBloom({
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
      {/* Deep rose gradient background */}
      <div className="absolute inset-0 -z-30">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #4c0519 0%, #9f1239 30%, #881337 60%, #4c0519 100%)",
            backgroundSize: "400% 400%",
          }}
          animate={
            isPlaying
              ? { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }
              : {}
          }
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Heart pattern texture */}
      <div
        className="absolute inset-0 -z-25 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Corner rose ornaments */}
      {[
        { pos: "top-4 left-4", scale: "" },
        { pos: "top-4 right-4", scale: "scale-x-[-1]" },
        { pos: "bottom-4 left-4", scale: "scale-y-[-1]" },
        { pos: "bottom-4 right-4", scale: "scale-[-1]" },
      ].map((c, i) => (
        <div key={i} className={`absolute ${c.pos} -z-20 opacity-20 pointer-events-none ${c.scale}`}>
          <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
            <circle cx="20" cy="20" r="12" fill="#e11d48" opacity="0.4" />
            <circle cx="35" cy="10" r="8" fill="#e11d48" opacity="0.3" />
            <circle cx="10" cy="35" r="8" fill="#e11d48" opacity="0.3" />
            <circle cx="22" cy="22" r="4" fill="#e11d48" opacity="0.6" />
          </svg>
        </div>
      ))}

      {/* Glitter glow spots */}
      {[
        { x: "15%", y: "20%", s: 110 },
        { x: "85%", y: "15%", s: 90 },
        { x: "75%", y: "80%", s: 130 },
        { x: "20%", y: "85%", s: 100 },
      ].map((spot, i) => (
        <div
          key={i}
          className="absolute -z-20 pointer-events-none"
          style={{
            left: spot.x,
            top: spot.y,
            width: spot.s,
            height: spot.s,
            background: "radial-gradient(circle, rgba(225,29,72,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      ))}

      {/* Particles */}
      {isPlaying && <HeartParticleOverlay />}
      {isPlaying && <RosePetalShower />}
      {isPlaying && <FloatingBubbles />}
      {isPlaying && <RedSparkles />}

      {/* Top swoosh */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-5 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="w-full h-8 opacity-20">
          <path d="M0,40 Q100,0 200,20 Q300,40 400,10 L400,0 L0,0 Z" fill="#e11d48" />
        </svg>
      </motion.div>

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

      {/* Glow behind card */}
      <div
        className="absolute z-4 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(225,29,72,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Main Card */}
      <motion.div
        className="relative z-10 max-w-lg w-[90%] mx-auto rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-white/92 backdrop-blur-xl" />
        <div className="absolute inset-0 rounded-2xl" style={{ border: "1px solid rgba(225,29,72,0.15)" }} />

        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent"
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
              className="text-xs text-gray-400 font-medium tracking-wider uppercase"
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
                <div className="w-16 h-16 mx-auto border-2 border-dashed border-gray-400/40 rounded-lg flex flex-col items-center justify-center hover:border-gray-400/70 transition-colors">
                  <span className="text-gray-400/60 text-lg leading-none">+</span>
                  <span className="text-gray-400/50 text-[9px] mt-0.5">Logo</span>
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
            className={`text-4xl md:text-5xl font-bold drop-shadow-sm ${isEditing ? "text-rose-400/50" : "bg-gradient-to-r from-rose-700 via-red-500 to-rose-700 bg-clip-text text-transparent"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {isEditing ? (
              <InlineEditable
                value={greeting.title}
                onChange={(v) => onFieldChange?.("title", v)}
                placeholder="Add your greeting title"
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-700 via-red-500 to-rose-700 bg-clip-text text-transparent"
              />
            ) : isPreview ? (
              greeting.title || "Add your greeting title"
            ) : (
              greeting.title
            )}
          </motion.h1>

          {/* Cupid arrow */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <CupidArrow />
          </motion.div>

          <motion.p
            className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {isEditing ? (
              <InlineEditable
                value={greeting.messageDefault}
                onChange={(v) => onFieldChange?.("messageDefault", v)}
                placeholder="Write your greeting message here..."
                className="text-lg md:text-xl leading-relaxed text-gray-700"
                multiline
              />
            ) : isPreview ? (
              greeting.messageDefault ||
              "Write your greeting message here..."
            ) : (
              greeting.messageDefault ||
              "Every love story is beautiful, but ours is my favorite. Happy Valentine's Day!"
            )}
          </motion.p>

          <HeartDivider />

          <motion.div
            className="pt-2 font-semibold text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-rose-500/50 text-sm">With Love,</span>
            <br />
            <span className={`text-2xl ${isEditing ? "text-rose-400/50" : "bg-gradient-to-r from-rose-700 to-rose-900 bg-clip-text text-transparent"}`}>
              {isEditing ? (
                <InlineEditable
                  value={greeting.senderNameDefault}
                  onChange={(v) => onFieldChange?.("senderNameDefault", v)}
                  placeholder="Your company name"
                  className="text-2xl bg-gradient-to-r from-rose-700 to-rose-900 bg-clip-text text-transparent"
                />
              ) : isPreview ? (
                greeting.senderNameDefault || "Your company name"
              ) : (
                greeting.senderNameDefault || "Forever Yours"
              )}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom swoosh */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-5 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="w-full h-8 opacity-15 rotate-180">
          <path d="M0,40 Q100,0 200,20 Q300,40 400,10 L400,0 L0,0 Z" fill="#e11d48" />
        </svg>
      </motion.div>

      {/* Trial watermark */}
      {isTrial && !isPreview && !isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-4 left-0 right-0 text-center z-10"
        >
          <span className="text-white/50 text-xs font-medium tracking-wider">
            TRIAL GREETING &mdash; E-Card Greeting Platform
          </span>
        </motion.div>
      )}
    </div>
  );
}
