"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { TemplateProps } from "@/types/template";
import { useGreetingPage } from "@/components/GreetingPageWrapper";
import InlineEditable from "@/components/InlineEditable";

// --- Gold sparkle dots ---
function GoldSparkleOverlay() {
  const [sparkles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      delay: Math.random() * 6,
      duration: Math.random() * 3 + 3,
    })),
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: "radial-gradient(circle, #DAA520 0%, #FFD700 60%, transparent 100%)",
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

// --- Floating gold leaf particles ---
function GoldLeafShower() {
  const GOLD_COLORS = ["#FFD700", "#DAA520", "#F5DEB3", "#FAEBD7"];

  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 5 + 4,
      color: GOLD_COLORS[i % GOLD_COLORS.length],
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 8,
      swayAmount: (Math.random() - 0.5) * 80,
      rotation: Math.random() * 360,
    })),
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-2">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -15,
            width: p.size,
            height: p.size * 1.4,
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

// --- Ornamental gold corners (filigree style) ---
function OrnamentalCorners() {
  return (
    <>
      {/* Top left */}
      <svg className="absolute top-3 left-3 w-10 h-10 pointer-events-none opacity-40" viewBox="0 0 40 40" fill="none">
        <path d="M2 20 Q2 2 20 2" stroke="#B8860B" strokeWidth="1.5" fill="none" />
        <path d="M6 20 Q6 6 20 6" stroke="#DAA520" strokeWidth="1" fill="none" />
        <circle cx="4" cy="4" r="2" fill="#DAA520" opacity="0.6" />
        <circle cx="20" cy="2" r="1.5" fill="#DAA520" opacity="0.5" />
        <circle cx="2" cy="20" r="1.5" fill="#DAA520" opacity="0.5" />
      </svg>
      {/* Top right */}
      <svg className="absolute top-3 right-3 w-10 h-10 pointer-events-none opacity-40 scale-x-[-1]" viewBox="0 0 40 40" fill="none">
        <path d="M2 20 Q2 2 20 2" stroke="#B8860B" strokeWidth="1.5" fill="none" />
        <path d="M6 20 Q6 6 20 6" stroke="#DAA520" strokeWidth="1" fill="none" />
        <circle cx="4" cy="4" r="2" fill="#DAA520" opacity="0.6" />
        <circle cx="20" cy="2" r="1.5" fill="#DAA520" opacity="0.5" />
        <circle cx="2" cy="20" r="1.5" fill="#DAA520" opacity="0.5" />
      </svg>
      {/* Bottom left */}
      <svg className="absolute bottom-3 left-3 w-10 h-10 pointer-events-none opacity-40 scale-y-[-1]" viewBox="0 0 40 40" fill="none">
        <path d="M2 20 Q2 2 20 2" stroke="#B8860B" strokeWidth="1.5" fill="none" />
        <path d="M6 20 Q6 6 20 6" stroke="#DAA520" strokeWidth="1" fill="none" />
        <circle cx="4" cy="4" r="2" fill="#DAA520" opacity="0.6" />
        <circle cx="20" cy="2" r="1.5" fill="#DAA520" opacity="0.5" />
        <circle cx="2" cy="20" r="1.5" fill="#DAA520" opacity="0.5" />
      </svg>
      {/* Bottom right */}
      <svg className="absolute bottom-3 right-3 w-10 h-10 pointer-events-none opacity-40 scale-[-1]" viewBox="0 0 40 40" fill="none">
        <path d="M2 20 Q2 2 20 2" stroke="#B8860B" strokeWidth="1.5" fill="none" />
        <path d="M6 20 Q6 6 20 6" stroke="#DAA520" strokeWidth="1" fill="none" />
        <circle cx="4" cy="4" r="2" fill="#DAA520" opacity="0.6" />
        <circle cx="20" cy="2" r="1.5" fill="#DAA520" opacity="0.5" />
        <circle cx="2" cy="20" r="1.5" fill="#DAA520" opacity="0.5" />
      </svg>
    </>
  );
}

// --- Gold flourish divider ---
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-0 w-full py-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-400/40" />
      <svg viewBox="0 0 40 16" className="w-10 mx-2 opacity-50" fill="none">
        <path d="M2 8 Q10 2 20 8 Q30 14 38 8" stroke="#B8860B" strokeWidth="1.2" fill="none" />
        <circle cx="20" cy="8" r="2.5" fill="#DAA520" opacity="0.6" />
      </svg>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-400/40" />
    </div>
  );
}

// --- Background radial glow spots ---
function PastelGlowSpots() {
  return (
    <>
      {[
        { x: "10%", y: "15%", color: "rgba(255,215,0,0.08)", s: 200 },
        { x: "85%", y: "10%", color: "rgba(218,165,32,0.06)", s: 180 },
        { x: "75%", y: "80%", color: "rgba(255,223,186,0.08)", s: 220 },
        { x: "15%", y: "85%", color: "rgba(255,215,0,0.05)", s: 160 },
        { x: "50%", y: "50%", color: "rgba(245,222,179,0.06)", s: 250 },
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
    </>
  );
}

export default function GoldNShiny({
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
      {/* Elegant cream/white gradient background */}
      <div className="absolute inset-0 -z-30">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #FFFDF7 0%, #FFF8E7 25%, #FFFEF9 50%, #FFF5E1 75%, #FFFDF7 100%)",
            backgroundSize: "400% 400%",
          }}
          animate={
            isPlaying
              ? { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }
              : {}
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Subtle damask-like pattern overlay */}
      <div
        className="absolute inset-0 -z-25 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #B8860B 1px, transparent 1px), " +
            "radial-gradient(circle at 75% 75%, #B8860B 1px, transparent 1px), " +
            "radial-gradient(circle at 50% 50%, #DAA520 0.5px, transparent 0.5px)",
          backgroundSize: "40px 40px, 40px 40px, 20px 20px",
        }}
      />

      {/* Pastel glow spots */}
      <PastelGlowSpots />

      {/* Gold radial glow pulses */}
      <motion.div
        className="absolute inset-0 -z-20"
        animate={isPlaying ? { opacity: [0.3, 0.6, 0.3] } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(255,215,0,0.06) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 70% 80%, rgba(218,165,32,0.04) 0%, transparent 50%)",
        }}
      />

      {/* Gold sparkles */}
      {isPlaying && <GoldSparkleOverlay />}

      {/* Gold leaf particles */}
      {isPlaying && <GoldLeafShower />}

      {/* Top ornamental swoosh */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-5 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <svg viewBox="0 0 400 30" preserveAspectRatio="none" className="w-full h-6 opacity-15">
          <path d="M0,30 Q100,0 200,15 Q300,30 400,5 L400,0 L0,0 Z" fill="#B8860B" />
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

      {/* Preview mode overlay */}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm text-white text-center py-3 text-sm z-50 font-medium">
          Preview Mode &mdash; This is how your greeting will look
        </div>
      )}

      {/* Soft gold glow behind card */}
      <div
        className="absolute z-4 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(218,165,32,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Main Card */}
      <motion.div
        className="relative z-10 max-w-lg w-[90%] mx-auto rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ boxShadow: "0 20px 60px rgba(184,134,11,0.12), 0 4px 20px rgba(0,0,0,0.06)" }}
      >
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl" />
        <div className="absolute inset-0 border border-amber-300/30 rounded-2xl" />

        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        />

        <OrnamentalCorners />

        <div className="relative p-8 md:p-10 space-y-5">
          {isTrial ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-amber-600/50 font-medium tracking-wider uppercase"
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
                <div className="w-16 h-16 mx-auto border-2 border-dashed border-amber-400/40 rounded-lg flex flex-col items-center justify-center hover:border-amber-400/70 transition-colors">
                  <span className="text-amber-500/60 text-lg leading-none">+</span>
                  <span className="text-amber-500/50 text-[9px] mt-0.5">Logo</span>
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

          <GoldDivider />

          <motion.h1
            className={`text-4xl md:text-5xl font-bold drop-shadow-sm ${isEditing ? "text-amber-600/50" : "bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-transparent"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {isEditing ? (
              <InlineEditable
                value={greeting.title}
                onChange={(v) => onFieldChange?.("title", v)}
                placeholder="Add your greeting title"
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-transparent"
              />
            ) : isPreview ? (
              greeting.title || "Add your greeting title"
            ) : (
              greeting.title
            )}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-amber-900/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {isEditing ? (
              <InlineEditable
                value={greeting.messageDefault}
                onChange={(v) => onFieldChange?.("messageDefault", v)}
                placeholder="Write your greeting message here..."
                className="text-lg md:text-xl leading-relaxed text-amber-900/70"
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

          <GoldDivider />

          <motion.div
            className="pt-2 font-semibold text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-amber-600/50 text-sm">With Love,</span>
            <br />
            <span className={`text-2xl ${isEditing ? "text-amber-600/50" : "bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-transparent"}`}>
              {isEditing ? (
                <InlineEditable
                  value={greeting.senderNameDefault}
                  onChange={(v) => onFieldChange?.("senderNameDefault", v)}
                  placeholder="Your company name"
                  className="text-2xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-transparent"
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
          <path d="M0,30 Q100,0 200,15 Q300,30 400,5 L400,0 L0,0 Z" fill="#B8860B" />
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
          <span className="text-amber-700/40 text-xs font-medium tracking-wider">
            TRIAL GREETING &mdash; E-Card Greeting Platform
          </span>
        </motion.div>
      )}
    </div>
  );
}
