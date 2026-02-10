"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { TemplateProps } from "@/types/template";
import { useGreetingPage } from "@/components/GreetingPageWrapper";
import InlineEditable from "@/components/InlineEditable";

// --- Floating jade & gold shapes ---
function FloatingJadeElements() {
  const JADE_COLORS = ["#5B8C5A", "#3B7A57", "#4F7942", "#D4AF37", "#C0C0C0"];

  const [shapes] = useState(() =>
    Array.from({ length: 16 }, (_, i) => {
      const isCircle = i % 3 !== 0;
      return {
        id: i,
        color: JADE_COLORS[i % JADE_COLORS.length],
        isCircle,
        size: 5 + (i % 5) * 3,
        left: 3 + ((i * 6.5) % 94),
        delay: i * 1.4,
        duration: 10 + (i % 4) * 3,
      };
    }),
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {shapes.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{
            left: `${s.left}%`,
            bottom: "-5%",
            width: s.size,
            height: s.isCircle ? s.size : s.size * 1.4,
            borderRadius: s.isCircle ? "50%" : "6px",
            backgroundColor: s.color,
            opacity: 0,
          }}
          animate={{
            y: [0, -800, -1200],
            opacity: [0, 0.45, 0],
            rotate: [0, s.isCircle ? 180 : 45, s.isCircle ? 360 : 90],
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

// --- Gold sparkle dots on jade bg ---
function JadeGoldSparkles() {
  const [sparkles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1.5,
      delay: Math.random() * 6,
      duration: Math.random() * 3 + 3,
      isGold: i % 3 !== 2,
    })),
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: s.isGold
              ? "radial-gradient(circle, #FFD700 0%, #DAA520 60%, transparent 100%)"
              : "radial-gradient(circle, #E8E8E8 0%, #C0C0C0 60%, transparent 100%)",
          }}
          animate={{
            opacity: [0, 0.9, 0],
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

// --- Jade ornamental corners ---
function JadeCorners() {
  return (
    <>
      {/* Top left */}
      <svg className="absolute top-3 left-3 w-10 h-10 pointer-events-none opacity-50" viewBox="0 0 40 40" fill="none">
        <path d="M2 20 Q2 2 20 2" stroke="#3B7A57" strokeWidth="1.5" fill="none" />
        <path d="M6 20 Q6 6 20 6" stroke="#D4AF37" strokeWidth="1" fill="none" />
        <circle cx="4" cy="4" r="2" fill="#D4AF37" opacity="0.7" />
        <circle cx="20" cy="2" r="1.5" fill="#3B7A57" opacity="0.5" />
        <circle cx="2" cy="20" r="1.5" fill="#3B7A57" opacity="0.5" />
      </svg>
      {/* Top right */}
      <svg className="absolute top-3 right-3 w-10 h-10 pointer-events-none opacity-50 scale-x-[-1]" viewBox="0 0 40 40" fill="none">
        <path d="M2 20 Q2 2 20 2" stroke="#3B7A57" strokeWidth="1.5" fill="none" />
        <path d="M6 20 Q6 6 20 6" stroke="#D4AF37" strokeWidth="1" fill="none" />
        <circle cx="4" cy="4" r="2" fill="#D4AF37" opacity="0.7" />
        <circle cx="20" cy="2" r="1.5" fill="#3B7A57" opacity="0.5" />
        <circle cx="2" cy="20" r="1.5" fill="#3B7A57" opacity="0.5" />
      </svg>
      {/* Bottom left */}
      <svg className="absolute bottom-3 left-3 w-10 h-10 pointer-events-none opacity-50 scale-y-[-1]" viewBox="0 0 40 40" fill="none">
        <path d="M2 20 Q2 2 20 2" stroke="#3B7A57" strokeWidth="1.5" fill="none" />
        <path d="M6 20 Q6 6 20 6" stroke="#D4AF37" strokeWidth="1" fill="none" />
        <circle cx="4" cy="4" r="2" fill="#D4AF37" opacity="0.7" />
        <circle cx="20" cy="2" r="1.5" fill="#3B7A57" opacity="0.5" />
        <circle cx="2" cy="20" r="1.5" fill="#3B7A57" opacity="0.5" />
      </svg>
      {/* Bottom right */}
      <svg className="absolute bottom-3 right-3 w-10 h-10 pointer-events-none opacity-50 scale-[-1]" viewBox="0 0 40 40" fill="none">
        <path d="M2 20 Q2 2 20 2" stroke="#3B7A57" strokeWidth="1.5" fill="none" />
        <path d="M6 20 Q6 6 20 6" stroke="#D4AF37" strokeWidth="1" fill="none" />
        <circle cx="4" cy="4" r="2" fill="#D4AF37" opacity="0.7" />
        <circle cx="20" cy="2" r="1.5" fill="#3B7A57" opacity="0.5" />
        <circle cx="2" cy="20" r="1.5" fill="#3B7A57" opacity="0.5" />
      </svg>
    </>
  );
}

// --- Jade/gold divider ---
function JadeDivider() {
  return (
    <div className="flex items-center justify-center gap-0 w-full py-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-emerald-400/40" />
      <svg viewBox="0 0 40 16" className="w-10 mx-2 opacity-50" fill="none">
        <path d="M2 8 Q10 2 20 8 Q30 14 38 8" stroke="#3B7A57" strokeWidth="1.2" fill="none" />
        <circle cx="20" cy="8" r="2.5" fill="#D4AF37" opacity="0.7" />
      </svg>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-emerald-400/40" />
    </div>
  );
}

// --- Main template ---
export default function JadeProsperity({
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
      {/* Background: deep jade gradient */}
      <div className="absolute inset-0 -z-30">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #1a3c34 0%, #2d5a47 30%, #1a4732 60%, #1a3c34 100%)",
            backgroundSize: "400% 400%",
          }}
          animate={
            isPlaying
              ? { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }
              : {}
          }
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Jade texture pattern */}
      <div
        className="absolute inset-0 -z-25 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 1px, transparent 1px), " +
            "radial-gradient(circle at 60% 70%, rgba(212,175,55,0.6) 1px, transparent 1px), " +
            "radial-gradient(circle at 80% 20%, rgba(192,192,192,0.7) 1.5px, transparent 1.5px), " +
            "radial-gradient(circle at 40% 80%, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px, 60px 60px, 100px 100px, 70px 70px",
        }}
      />

      {/* Radial jade/gold glow */}
      <motion.div
        className="absolute inset-0 -z-20"
        animate={isPlaying ? { opacity: [0.2, 0.45, 0.2] } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(59,122,87,0.2) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 70% 80%, rgba(212,175,55,0.1) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 50% 50%, rgba(192,192,192,0.05) 0%, transparent 40%)",
        }}
      />

      {/* Corner jade glow spots */}
      {[
        { x: "10%", y: "10%", color: "rgba(59,122,87,0.12)", s: 160 },
        { x: "90%", y: "10%", color: "rgba(212,175,55,0.08)", s: 140 },
        { x: "85%", y: "85%", color: "rgba(59,122,87,0.1)", s: 180 },
        { x: "10%", y: "90%", color: "rgba(212,175,55,0.06)", s: 150 },
      ].map((spot, i) => (
        <div
          key={i}
          className="absolute -z-15 pointer-events-none"
          style={{
            left: spot.x,
            top: spot.y,
            width: spot.s,
            height: spot.s,
            background: `radial-gradient(circle, ${spot.color} 0%, transparent 70%)`,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Floating jade elements */}
      {isPlaying && <FloatingJadeElements />}

      {/* Gold/silver sparkles */}
      {isPlaying && <JadeGoldSparkles />}

      {/* Top ornamental swoosh */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-5 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <svg viewBox="0 0 400 30" preserveAspectRatio="none" className="w-full h-6 opacity-15">
          <path d="M0,30 Q100,0 200,15 Q300,30 400,5 L400,0 L0,0 Z" fill="#3B7A57" />
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

      {/* Soft glow behind card */}
      <div
        className="absolute z-4 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(59,122,87,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Main card */}
      <motion.div
        className="relative z-10 max-w-lg w-[90%] mx-auto rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ boxShadow: "0 20px 60px rgba(26,60,52,0.3), 0 4px 20px rgba(0,0,0,0.15)" }}
      >
        {/* Card glass background */}
        <div className="absolute inset-0 bg-emerald-950/55 backdrop-blur-xl" />
        <div className="absolute inset-0 border border-emerald-400/20 rounded-2xl" />

        {/* Gold accent line at top */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        />

        <JadeCorners />

        {/* Card content */}
        <div className="relative p-8 md:p-10 space-y-5">
          {/* Company logo */}
          {isTrial ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-emerald-400/50 font-medium tracking-wider uppercase"
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
                <div className="w-16 h-16 mx-auto border-2 border-dashed border-emerald-400/40 rounded-lg flex flex-col items-center justify-center hover:border-emerald-400/70 transition-colors">
                  <span className="text-emerald-400/60 text-lg leading-none">+</span>
                  <span className="text-emerald-400/50 text-[9px] mt-0.5">Logo</span>
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

          <JadeDivider />

          {/* Title */}
          <motion.h1
            className={`text-4xl md:text-5xl font-bold ${isEditing ? "text-emerald-400/50" : "bg-gradient-to-r from-emerald-300 via-amber-300 to-emerald-300 bg-clip-text text-transparent"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {isEditing ? (
              <InlineEditable
                value={greeting.title}
                onChange={(v) => onFieldChange?.("title", v)}
                placeholder="Add your greeting title"
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-300 via-amber-300 to-emerald-300 bg-clip-text text-transparent"
              />
            ) : isPreview ? (
              greeting.title || "Add your greeting title"
            ) : (
              greeting.title
            )}
          </motion.h1>

          {/* Message */}
          <motion.p
            className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-emerald-100/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {isEditing ? (
              <InlineEditable
                value={greeting.messageDefault}
                onChange={(v) => onFieldChange?.("messageDefault", v)}
                placeholder="Write your greeting message here..."
                className="text-lg md:text-xl leading-relaxed text-emerald-100/90"
                multiline
              />
            ) : isPreview ? (
              greeting.messageDefault ||
              "Write your greeting message here..."
            ) : (
              greeting.messageDefault ||
              "Wishing you abundance and prosperity in the coming year!"
            )}
          </motion.p>

          <JadeDivider />

          {/* Sender */}
          <motion.div
            className="pt-2 font-semibold text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-emerald-400/60 text-sm">With Love,</span>
            <br />
            <span className={`text-2xl tracking-wider ${isEditing ? "text-emerald-400/50" : "bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent"}`}>
              {isEditing ? (
                <InlineEditable
                  value={greeting.senderNameDefault}
                  onChange={(v) => onFieldChange?.("senderNameDefault", v)}
                  placeholder="Your company name"
                  className="text-2xl bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent"
                />
              ) : isPreview ? (
                greeting.senderNameDefault || "Your company name"
              ) : (
                greeting.senderNameDefault || "Our Family"
              )}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom ornamental swoosh */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-5 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <svg viewBox="0 0 400 30" preserveAspectRatio="none" className="w-full h-6 opacity-12 rotate-180">
          <path d="M0,30 Q100,0 200,15 Q300,30 400,5 L400,0 L0,0 Z" fill="#3B7A57" />
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
          <span className="text-emerald-300/40 text-xs font-medium tracking-wider">
            TRIAL GREETING &mdash; E-Card Greeting Platform
          </span>
        </motion.div>
      )}
    </div>
  );
}
