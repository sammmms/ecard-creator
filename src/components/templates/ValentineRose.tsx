"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TemplateProps } from "@/types/template";
import { useGreetingPage } from "@/components/GreetingPageWrapper";
import InlineEditable from "@/components/InlineEditable";

// --- Color Schemes ---
const COLOR_SCHEMES = {
  red: {
    bg: "linear-gradient(135deg, #7f1d1d 0%, #dc2626 33%, #991b1b 66%, #7f1d1d 100%)",
    cardBg: "rgba(255,255,255,0.92)",
    cardBorder: "rgba(220,38,38,0.2)",
    titleGradient: "from-red-700 via-rose-600 to-red-800",
    senderGradient: "from-red-700 to-red-900",
    textColor: "text-gray-700",
    subtitleColor: "text-red-700/60",
    particleColors: ["#ff6b6b", "#ee5a5a", "#ff8787", "#ffffff"],
    glow: "rgba(220,38,38,0.25)",
    accent: "#dc2626",
    dividerFrom: "from-transparent to-red-400/50",
    dividerTo: "from-transparent to-red-400/50",
    dividerDot: "bg-red-500/60",
    dividerBorder: "border-red-400/30",
    topLine: "via-red-500",
  },
  pink: {
    bg: "linear-gradient(135deg, #831843 0%, #ec4899 33%, #be185d 66%, #831843 100%)",
    cardBg: "rgba(255,255,255,0.92)",
    cardBorder: "rgba(236,72,153,0.2)",
    titleGradient: "from-pink-600 via-rose-500 to-pink-700",
    senderGradient: "from-pink-600 to-pink-800",
    textColor: "text-gray-700",
    subtitleColor: "text-pink-600/60",
    particleColors: ["#f472b6", "#ec4899", "#f9a8d4", "#ffffff"],
    glow: "rgba(236,72,153,0.25)",
    accent: "#ec4899",
    dividerFrom: "from-transparent to-pink-400/50",
    dividerTo: "from-transparent to-pink-400/50",
    dividerDot: "bg-pink-500/60",
    dividerBorder: "border-pink-400/30",
    topLine: "via-pink-500",
  },
  maroon: {
    bg: "linear-gradient(135deg, #4a0e1e 0%, #881337 33%, #6b1233 66%, #4a0e1e 100%)",
    cardBg: "rgba(255,255,255,0.90)",
    cardBorder: "rgba(136,19,55,0.25)",
    titleGradient: "from-rose-900 via-rose-700 to-rose-900",
    senderGradient: "from-rose-800 to-rose-950",
    textColor: "text-gray-700",
    subtitleColor: "text-rose-800/60",
    particleColors: ["#be123c", "#9f1239", "#e11d48", "#fda4af"],
    glow: "rgba(136,19,55,0.25)",
    accent: "#881337",
    dividerFrom: "from-transparent to-rose-400/50",
    dividerTo: "from-transparent to-rose-400/50",
    dividerDot: "bg-rose-700/60",
    dividerBorder: "border-rose-500/30",
    topLine: "via-rose-600",
  },
} as const;

type SchemeKey = keyof typeof COLOR_SCHEMES;

// --- Heart particles ---
const hearts = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: 10 + Math.random() * 14,
  delay: Math.random() * 10,
  duration: 8 + Math.random() * 7,
  swayAmount: 30 + Math.random() * 50,
  rotation: Math.random() * 40 - 20,
}));

function HeartParticleOverlay({ colors }: { colors: readonly string[] }) {
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
            color: colors[h.id % colors.length],
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, h.swayAmount, -h.swayAmount, h.swayAmount / 2, 0],
            rotate: [h.rotation, h.rotation + 20, h.rotation - 20, h.rotation],
            opacity: [0, 0.8, 0.8, 0.5, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "linear",
            x: {
              duration: h.duration,
              delay: h.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
            opacity: {
              duration: h.duration,
              delay: h.delay,
              repeat: Infinity,
              times: [0, 0.1, 0.7, 0.9, 1],
            },
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

// --- Rose particle shower ---
const roseParticles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: 4 + Math.random() * 6,
  delay: Math.random() * 12,
  duration: 10 + Math.random() * 8,
}));

function RoseParticleShower({ colors }: { colors: readonly string[] }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {roseParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: -10,
            width: p.size,
            height: p.size,
            backgroundColor: colors[p.id % colors.length],
            opacity: 0.5,
          }}
          animate={{
            y: ["0vh", "105vh"],
            opacity: [0, 0.6, 0.6, 0.3, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            opacity: {
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              times: [0, 0.1, 0.7, 0.9, 1],
            },
          }}
        />
      ))}
    </div>
  );
}

// --- Floating bubbles ---
const bubbles = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  x: 10 + Math.random() * 80,
  size: 60 + Math.random() * 80,
  delay: Math.random() * 8,
  duration: 12 + Math.random() * 8,
}));

function FloatingBubbles({ accent }: { accent: string }) {
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
            background: `radial-gradient(circle at 30% 30%, ${accent}15, ${accent}08)`,
            border: `1px solid ${accent}12`,
          }}
          animate={{
            y: [0, -(window?.innerHeight || 900) - b.size * 2],
            x: [0, 20, -20, 10, 0],
            opacity: [0, 0.6, 0.6, 0.3, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
            opacity: {
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              times: [0, 0.15, 0.7, 0.9, 1],
            },
          }}
        />
      ))}
    </div>
  );
}

// --- Heart divider ---
function HeartDivider({ scheme }: { scheme: (typeof COLOR_SCHEMES)[SchemeKey] }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full py-2">
      <div className={`flex-1 h-px bg-linear-to-r ${scheme.dividerFrom}`} />
      <div className="relative mx-3 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill={scheme.accent} width="14" height="14" className="opacity-60">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <div className={`absolute w-5 h-5 border ${scheme.dividerBorder} rotate-45 rounded-sm`} />
      </div>
      <div className={`flex-1 h-px bg-linear-to-l ${scheme.dividerTo}`} />
    </div>
  );
}

// --- Cupid arrow accent SVG ---
function CupidArrowAccent({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      className="w-24 mx-auto opacity-30"
    >
      <line x1="10" y1="12" x2="95" y2="12" stroke={color} strokeWidth="1.5" />
      <polygon points="95,6 110,12 95,18" fill={color} />
      <circle cx="10" cy="12" r="3" fill={color} />
      <path d="M7 12c0-2 2-5 3-5s3 3 3 5" stroke={color} strokeWidth="1" fill="none" />
    </svg>
  );
}

// --- Main component ---
export default function ValentineRose({
  greeting,
  isPreview = false,
  isEditing = false,
  onFieldChange,
  onLogoClick,
}: TemplateProps) {
  const { isPlaying, openUpgradeModal } = useGreetingPage();
  const isTrial = greeting.isTrial === true;

  const variant = (greeting.layoutVariant || "red") as SchemeKey;
  const scheme = COLOR_SCHEMES[variant] || COLOR_SCHEMES.red;

  return (
    <div className={`relative w-full overflow-hidden text-center flex flex-col items-center justify-center font-sans ${isEditing ? "min-h-full" : "min-h-screen"}`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-30">
        <motion.div
          className="absolute inset-0"
          style={{
            background: scheme.bg,
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

      {/* Subtle heart pattern texture overlay */}
      <div
        className="absolute inset-0 -z-25 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Corner rose ornaments */}
      <div className="absolute top-4 left-4 -z-20 opacity-20 pointer-events-none">
        <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
          <circle cx="20" cy="20" r="12" fill={scheme.accent} opacity="0.4" />
          <circle cx="35" cy="10" r="8" fill={scheme.accent} opacity="0.3" />
          <circle cx="10" cy="35" r="8" fill={scheme.accent} opacity="0.3" />
          <circle cx="22" cy="22" r="4" fill={scheme.accent} opacity="0.6" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 -z-20 opacity-20 pointer-events-none scale-x-[-1]">
        <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
          <circle cx="20" cy="20" r="12" fill={scheme.accent} opacity="0.4" />
          <circle cx="35" cy="10" r="8" fill={scheme.accent} opacity="0.3" />
          <circle cx="10" cy="35" r="8" fill={scheme.accent} opacity="0.3" />
          <circle cx="22" cy="22" r="4" fill={scheme.accent} opacity="0.6" />
        </svg>
      </div>
      <div className="absolute bottom-4 left-4 -z-20 opacity-20 pointer-events-none scale-y-[-1]">
        <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
          <circle cx="20" cy="20" r="12" fill={scheme.accent} opacity="0.4" />
          <circle cx="35" cy="10" r="8" fill={scheme.accent} opacity="0.3" />
          <circle cx="10" cy="35" r="8" fill={scheme.accent} opacity="0.3" />
          <circle cx="22" cy="22" r="4" fill={scheme.accent} opacity="0.6" />
        </svg>
      </div>
      <div className="absolute bottom-4 right-4 -z-20 opacity-20 pointer-events-none scale-[-1]">
        <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
          <circle cx="20" cy="20" r="12" fill={scheme.accent} opacity="0.4" />
          <circle cx="35" cy="10" r="8" fill={scheme.accent} opacity="0.3" />
          <circle cx="10" cy="35" r="8" fill={scheme.accent} opacity="0.3" />
          <circle cx="22" cy="22" r="4" fill={scheme.accent} opacity="0.6" />
        </svg>
      </div>

      {/* Rose gold glitter spots */}
      {[
        { x: "15%", y: "20%", s: 100 },
        { x: "80%", y: "15%", s: 80 },
        { x: "70%", y: "75%", s: 120 },
        { x: "25%", y: "80%", s: 90 },
      ].map((spot, i) => (
        <div
          key={i}
          className="absolute -z-20 pointer-events-none"
          style={{
            left: spot.x,
            top: spot.y,
            width: spot.s,
            height: spot.s,
            background: `radial-gradient(circle, ${scheme.accent}18 0%, transparent 70%)`,
            borderRadius: "50%",
          }}
        />
      ))}

      {/* Falling hearts */}
      {isPlaying && <HeartParticleOverlay colors={scheme.particleColors} />}

      {/* Rose particle shower */}
      {isPlaying && <RoseParticleShower colors={scheme.particleColors} />}

      {/* Floating bubbles */}
      {isPlaying && <FloatingBubbles accent={scheme.accent} />}

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

      {/* Soft glow behind card */}
      <div
        className="absolute z-4 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${scheme.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Top ornamental swoosh */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-5 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="w-full h-8 opacity-20">
          <path
            d="M0,40 Q100,0 200,20 Q300,40 400,10 L400,0 L0,0 Z"
            fill={scheme.accent}
          />
        </svg>
      </motion.div>

      {/* Main Card */}
      <motion.div
        className="relative z-10 max-w-lg w-[90%] mx-auto rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div
          className="absolute inset-0 backdrop-blur-xl"
          style={{ backgroundColor: scheme.cardBg }}
        />
        <div
          className="absolute inset-0 rounded-2xl"
          style={{ border: `1px solid ${scheme.cardBorder}` }}
        />

        <motion.div
          className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent ${scheme.topLine} to-transparent`}
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

          <HeartDivider scheme={scheme} />

          <motion.h1
            className={`text-4xl md:text-5xl font-bold drop-shadow-sm ${isEditing ? scheme.subtitleColor : `bg-linear-to-r ${scheme.titleGradient} bg-clip-text text-transparent`}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {isEditing ? (
              <InlineEditable
                value={greeting.title}
                onChange={(v) => onFieldChange?.("title", v)}
                placeholder="Add your greeting title"
                className={`text-4xl md:text-5xl font-bold bg-linear-to-r ${scheme.titleGradient} bg-clip-text text-transparent`}
              />
            ) : isPreview ? (
              greeting.title || "Add your greeting title"
            ) : (
              greeting.title
            )}
          </motion.h1>

          {/* Cupid arrow accent */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <CupidArrowAccent color={scheme.accent} />
          </motion.div>

          <motion.p
            className={`text-lg md:text-xl leading-relaxed whitespace-pre-wrap ${scheme.textColor}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {isEditing ? (
              <InlineEditable
                value={greeting.messageDefault}
                onChange={(v) => onFieldChange?.("messageDefault", v)}
                placeholder="Write your greeting message here..."
                className={`text-lg md:text-xl leading-relaxed ${scheme.textColor}`}
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

          <HeartDivider scheme={scheme} />

          <motion.div
            className="pt-4 font-semibold text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className={`${scheme.subtitleColor} text-sm`}>
              With Love,
            </span>
            <br />
            <span
              className={`text-2xl ${isEditing ? scheme.subtitleColor : `bg-linear-to-r ${scheme.senderGradient} bg-clip-text text-transparent`}`}
            >
              {isEditing ? (
                <InlineEditable
                  value={greeting.senderNameDefault}
                  onChange={(v) => onFieldChange?.("senderNameDefault", v)}
                  placeholder="Your company name"
                  className={`text-2xl bg-linear-to-r ${scheme.senderGradient} bg-clip-text text-transparent`}
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

      {/* Footer ribbon/swoosh ornament */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-5 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="w-full h-8 opacity-15 rotate-180">
          <path
            d="M0,40 Q100,0 200,20 Q300,40 400,10 L400,0 L0,0 Z"
            fill={scheme.accent}
          />
        </svg>
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
