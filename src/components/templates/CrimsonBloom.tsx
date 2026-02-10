"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TemplateProps } from "@/types/template";
import { useGreetingPage } from "@/components/GreetingPageWrapper";
import InlineEditable from "@/components/InlineEditable";

const PETAL_COLORS = ["#FFB7C5", "#FFC0CB", "#FF69B4", "#ffffff"];

const petals = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: Math.random() > 0.5 ? 12 : 16,
  color: PETAL_COLORS[i % PETAL_COLORS.length],
  delay: Math.random() * 8,
  duration: 8 + Math.random() * 7,
  swayAmount: 40 + Math.random() * 60,
  rotation: Math.random() * 360,
}));

function CherryBlossomOverlay() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-1">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute rounded-full"
          style={{
            left: `${petal.x}%`,
            top: -20,
            width: petal.size,
            height: petal.size,
            backgroundColor: petal.color,
            opacity: 0.7,
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [
              0,
              petal.swayAmount,
              -petal.swayAmount,
              petal.swayAmount / 2,
              0,
            ],
            rotate: [petal.rotation, petal.rotation + 360],
            opacity: [0, 0.8, 0.8, 0.6, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
            x: {
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: petal.duration * 1.5,
              delay: petal.delay,
              repeat: Infinity,
              ease: "linear",
            },
            opacity: {
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              times: [0, 0.1, 0.7, 0.9, 1],
            },
          }}
        />
      ))}
    </div>
  );
}

function PaperCutDivider() {
  return (
    <div className="flex items-center justify-center gap-0 w-full py-2">
      <div className="flex-1 h-px bg-linear-to-r from-transparent to-red-400/50" />
      <div className="relative mx-3 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60 shadow-sm" />
        <div className="absolute w-4 h-4 border border-red-400/30 rotate-45" />
      </div>
      <div className="flex-1 h-px bg-linear-to-l from-transparent to-red-400/50" />
    </div>
  );
}

export default function CrimsonBloom({
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
      {/* Animated deep red gradient background */}
      <div className="absolute inset-0 -z-30">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #8B0000 0%, #DC143C 33%, #B22222 66%, #8B0000 100%)",
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

      {/* Subtle repeating vertical stripe pattern overlay */}
      <div
        className="absolute inset-0 -z-25 opacity-[0.06]"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(255,255,255,0.5) 18px, rgba(255,255,255,0.5) 19px)",
        }}
      />

      {/* Cherry blossom petals */}
      {isPlaying && <CherryBlossomOverlay />}

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

      {/* Soft red glow behind card */}
      <div
        className="absolute z-4 w-[500px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(220,20,60,0.25) 0%, transparent 70%)",
        }}
      />

      {/* Main Card */}
      <motion.div
        className="relative z-10 max-w-lg w-[90%] mx-auto rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl" />
        <div className="absolute inset-0 border border-white/30 rounded-2xl" />

        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-red-500 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        />

        <div className="relative p-8 space-y-6">
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
                <div className="w-16 h-16 mx-auto border-2 border-dashed border-red-400/40 rounded-lg flex flex-col items-center justify-center hover:border-red-400/70 transition-colors">
                  <span className="text-red-400/60 text-lg leading-none">+</span>
                  <span className="text-red-400/50 text-[9px] mt-0.5">Logo</span>
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

          <PaperCutDivider />

          <motion.h1
            className={`text-4xl md:text-5xl font-bold drop-shadow-sm ${isEditing ? "text-red-300" : "bg-linear-to-r from-red-700 via-rose-600 to-red-800 bg-clip-text text-transparent"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {isEditing ? (
              <InlineEditable
                value={greeting.title}
                onChange={(v) => onFieldChange?.("title", v)}
                placeholder="Add your greeting title"
                className="text-4xl md:text-5xl font-bold bg-linear-to-r from-red-700 via-rose-600 to-red-800 bg-clip-text text-transparent"
              />
            ) : isPreview ? (
              greeting.title || "Add your greeting title"
            ) : (
              greeting.title
            )}
          </motion.h1>

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
              "Wishing you abundance and prosperity in the coming year!"
            )}
          </motion.p>

          <PaperCutDivider />

          <motion.div
            className="pt-4 font-semibold text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-red-700/60 text-sm">With Love,</span>
            <br />
            <span className={`text-2xl ${isEditing ? "text-red-300" : "bg-linear-to-r from-red-700 to-red-900 bg-clip-text text-transparent"}`}>
              {isEditing ? (
                <InlineEditable
                  value={greeting.senderNameDefault}
                  onChange={(v) => onFieldChange?.("senderNameDefault", v)}
                  placeholder="Your company name"
                  className="text-2xl bg-linear-to-r from-red-700 to-red-900 bg-clip-text text-transparent"
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
