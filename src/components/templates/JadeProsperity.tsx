"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Heart } from "lucide-react";
import Image from "next/image";
import type { TemplateProps } from "@/types/template";
import FloatingWishes from "@/components/FloatingWishes";
import SendWishModal from "@/components/SendWishModal";
import ShareModal from "@/components/ShareModal";

// ---------- Floating jade decorative elements ----------
const JADE_SHAPES = Array.from({ length: 12 }, (_, i) => {
  const isCircle = i % 3 !== 0;
  const colors = ["#6ee7b7", "#34d399", "#fbbf24", "#d4af37"];
  return {
    id: i,
    color: colors[i % colors.length],
    isCircle,
    size: 6 + (i % 5) * 3, // 6-18px
    left: 5 + ((i * 8.3) % 90),
    delay: i * 1.6,
    duration: 10 + (i % 4) * 3,
  };
});

function FloatingJadeElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {JADE_SHAPES.map((s) => (
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
            opacity: [0, 0.5, 0],
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

// ---------- Main template ----------
export default function JadeProsperity({
  greeting,
  wishes: initialWishes,
  paymentMethods,
  donationMode,
  isPreview = false,
}: TemplateProps) {
  const [showDonation, setShowDonation] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [wishes, setWishes] = useState(initialWishes);

  const isTrial = greeting.isTrial === true;
  const effectiveDonationMode = donationMode || greeting.donationMode || "none";
  const showSendWish =
    (greeting.submissionsEnabled || greeting.donationEnabled) && !isTrial;

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-center flex flex-col items-center justify-center font-sans">
      {/* ========== Background: animated emerald gradient ========== */}
      <div className="absolute inset-0 -z-30">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #064e3b 0%, #059669 40%, #047857 70%, #064e3b 100%)",
            backgroundSize: "400% 400%",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Jade noise texture overlay (radial gradient spots) */}
      <div
        className="absolute inset-0 -z-20 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 1px, transparent 1px), " +
            "radial-gradient(circle at 60% 70%, rgba(255,255,255,0.6) 1px, transparent 1px), " +
            "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.7) 1.5px, transparent 1.5px), " +
            "radial-gradient(circle at 40% 80%, rgba(255,255,255,0.5) 1px, transparent 1px), " +
            "radial-gradient(circle at 10% 60%, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "80px 80px, 60px 60px, 100px 100px, 70px 70px, 90px 90px",
        }}
      />

      {/* Radial emerald glow */}
      <motion.div
        className="absolute inset-0 -z-15"
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(16,185,129,0.18) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 70% 80%, rgba(212,175,55,0.08) 0%, transparent 50%)",
        }}
      />

      {/* Floating jade elements */}
      <FloatingJadeElements />

      {/* ========== Trial banner ========== */}
      {isTrial && !isPreview && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 bg-amber-500/95 backdrop-blur-sm text-white text-center py-2.5 text-sm z-50 font-medium shadow-lg"
        >
          This is a trial greeting.{" "}
          <a
            href="/app/templates"
            className="underline underline-offset-2 font-bold hover:text-amber-100 transition-colors"
          >
            Upgrade to unlock all features &rarr;
          </a>
        </motion.div>
      )}

      {/* ========== Preview overlay ========== */}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm text-white text-center py-3 text-sm z-50 font-medium">
          Preview Mode &mdash; This is how your greeting will look
        </div>
      )}

      {/* ========== Floating wishes ========== */}
      {!isPreview && wishes.length > 0 && <FloatingWishes wishes={wishes} />}

      {/* ========== Main card ========== */}
      <motion.div
        className="relative z-10 max-w-lg w-[90%] mx-auto rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Card glass background */}
        <div className="absolute inset-0 bg-emerald-950/50 backdrop-blur-xl" />
        <div className="absolute inset-0 border border-emerald-400/20 rounded-2xl" />

        {/* Thin emerald accent line at top */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        />

        {/* Corner jade ornaments */}
        <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-emerald-400/40" />
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400/40" />
        <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-emerald-400/40" />
        <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-emerald-400/40" />

        {/* Card content */}
        <div className="relative p-8 md:p-10 space-y-6">
          {/* Company logo */}
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

          {/* Trial watermark instead of logo */}
          {isTrial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-emerald-400/50 font-medium tracking-wider uppercase"
            >
              Powered by E-Card Greeting
            </motion.div>
          )}

          {/* Gold horizontal divider */}
          <div className="w-full h-px bg-emerald-400/30" />

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {isPreview
              ? greeting.title || "[Your Greeting Title]"
              : greeting.title}
          </motion.h1>

          {/* Message */}
          <motion.p
            className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-emerald-100"
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

          {/* Gold horizontal divider */}
          <div className="w-full h-px bg-emerald-400/30" />

          {/* Sender */}
          <motion.div
            className="pt-2 font-semibold text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-emerald-400/60 text-sm">With Love,</span>
            <br />
            <span className="text-2xl tracking-wider bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
              {isPreview
                ? greeting.senderNameDefault || "[Company Name]"
                : greeting.senderNameDefault || "Our Family"}
            </span>
          </motion.div>

          {/* Action buttons */}
          {!isPreview && (
            <motion.div
              className="flex justify-center gap-4 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {/* Share button */}
              <motion.button
                onClick={() => setShowShare(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 px-5 py-2.5 rounded-full text-sm font-medium transition shadow-lg backdrop-blur-sm border border-white/50"
              >
                <Share2 size={16} /> Share
              </motion.button>

              {/* Send Wish button */}
              {showSendWish && (
                <motion.button
                  onClick={() => setShowDonation(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition shadow-lg shadow-emerald-600/25"
                >
                  <Heart size={16} /> Send Wish
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ========== Trial watermark at bottom ========== */}
      {isTrial && !isPreview && (
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

      {/* ========== Modals ========== */}
      <SendWishModal
        isOpen={showDonation}
        onClose={() => setShowDonation(false)}
        greetingId={greeting.id}
        donationEnabled={greeting.donationEnabled}
        donationMode={effectiveDonationMode}
        paymentMethods={paymentMethods || null}
        onWishSent={(wish) => setWishes((prev) => [wish, ...prev])}
      />

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        url={typeof window !== "undefined" ? window.location.href : ""}
        title={greeting.title}
        isTrial={greeting.isTrial === true}
        greetingId={greeting.id}
      />
    </div>
  );
}
