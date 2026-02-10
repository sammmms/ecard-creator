"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { TemplateProps } from "@/types/template";
import { useGreetingPage } from "@/components/GreetingPageWrapper";

function GoldSparkleOverlay() {
  const [sparkles] = useState(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 3,
    })),
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-yellow-300/60"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
            y: [0, -30, 0],
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

function GoldParticleShower() {
  const GOLD_COLORS = ["#FFD700", "#DAA520", "#B8860B"];

  const [particles] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 4 + 4,
      color: GOLD_COLORS[i % GOLD_COLORS.length],
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 6,
      swayAmount: (Math.random() - 0.5) * 60,
    })),
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-2">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: -10,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.swayAmount, 0],
            opacity: [0, 0.8, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            x: {
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
            opacity: {
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              times: [0, 0.1, 0.7, 1],
            },
          }}
        />
      ))}
    </div>
  );
}

function DecorativeCorners() {
  const cornerStyle = "absolute w-6 h-6 pointer-events-none";
  const borderColor = "border-yellow-500/50";

  return (
    <>
      <div
        className={`${cornerStyle} top-3 left-3 border-t-2 border-l-2 ${borderColor} rounded-tl-sm`}
      />
      <div
        className={`${cornerStyle} top-3 right-3 border-t-2 border-r-2 ${borderColor} rounded-tr-sm`}
      />
      <div
        className={`${cornerStyle} bottom-3 left-3 border-b-2 border-l-2 ${borderColor} rounded-bl-sm`}
      />
      <div
        className={`${cornerStyle} bottom-3 right-3 border-b-2 border-r-2 ${borderColor} rounded-br-sm`}
      />
    </>
  );
}

export default function GoldNShiny({
  greeting,
  isPreview = false,
}: TemplateProps) {
  const { isPlaying, openUpgradeModal } = useGreetingPage();
  const isTrial = greeting.isTrial === true;

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-center flex flex-col items-center justify-center font-sans">
      {/* Animated dark gradient background */}
      <div className="absolute inset-0 -z-30">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 40%, #0a0a0a 70%, #1a1a2e 100%)",
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

      {/* Subtle gold radial glow pulses */}
      <motion.div
        className="absolute inset-0 -z-25"
        animate={isPlaying ? { opacity: [0.2, 0.4, 0.2] } : {}}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(255,215,0,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(218,165,32,0.05) 0%, transparent 50%)",
        }}
      />

      {/* Gold sparkle particles */}
      {isPlaying && <GoldSparkleOverlay />}

      {/* Gold particle shower */}
      {isPlaying && <GoldParticleShower />}

      {/* Trial banner */}
      {isTrial && !isPreview && (
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

      {/* Main Card */}
      <motion.div
        className="relative z-10 max-w-lg w-[90%] mx-auto rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
        <div className="absolute inset-0 border border-yellow-600/20 rounded-2xl" />

        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-yellow-400 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        />

        <DecorativeCorners />

        <div className="relative p-8 space-y-6">
          {greeting.companyLogoUrl && !isTrial && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Image
                src={greeting.companyLogoUrl!}
                alt="Company Logo"
                width={64}
                height={64}
                className="w-16 h-16 mx-auto object-contain rounded-lg"
                unoptimized
              />
            </motion.div>
          )}

          {isTrial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-yellow-600/50 font-medium tracking-wider uppercase"
            >
              Powered by E-Card Greeting
            </motion.div>
          )}

          <motion.h1
            className="text-4xl md:text-5xl font-bold bg-linear-to-r from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {isPreview
              ? greeting.title || "[Your Greeting Title]"
              : greeting.title}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {isPreview
              ? greeting.messageDefault ||
                "[Your greeting message will appear here. Write something warm and heartfelt!]"
              : greeting.messageDefault ||
                "Wishing you abundance and prosperity in the coming year!"}
          </motion.p>

          <motion.div
            className="pt-6 font-semibold text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-yellow-600/60 text-sm">With Love,</span>
            <br />
            <span className="text-2xl bg-linear-to-r from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent">
              {isPreview
                ? greeting.senderNameDefault || "[Company Name]"
                : greeting.senderNameDefault || "Our Family"}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Trial watermark badge at bottom */}
      {isTrial && !isPreview && (
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
