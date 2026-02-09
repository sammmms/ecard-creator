"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Heart } from "lucide-react";
import * as anim from "@/lib/animations";
import ShareModal from "@/components/ShareModal";
import Fireworks from "@/components/Fireworks";
import SendWishModal from "@/components/SendWishModal";
import FloatingWishes from "@/components/FloatingWishes";

interface GreetingData {
  id: string;
  title: string;
  senderNameDefault: string;
  messageDefault: string;
  companyLogoUrl?: string;
  isTrial?: boolean;
  submissionsEnabled?: boolean;
  template: {
    configJson: string;
  };
  donationEnabled: boolean;
  donationMode: string;
}

interface WishData {
  id: string;
  name: string | null;
  comment: string | null;
  createdAt: string;
  donationAmount: number | null;
}

interface PaymentMethodsData {
  qrisImages: Array<{ label: string; url: string }>;
  ewalletType: string | null;
  ewalletNumber: string | null;
  instructionsText: string | null;
  displayName: string | null;
}

// Floating sparkle particles
function SparkleOverlay() {
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
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

export default function GreetingRenderer({
  greeting,
  isPreview = false,
  wishes: initialWishes = [],
  paymentMethods = null,
  donationMode,
}: {
  greeting: GreetingData;
  isPreview?: boolean;
  wishes?: WishData[];
  paymentMethods?: PaymentMethodsData | null;
  donationMode?: string;
}) {
  const [config, setConfig] = useState<any>(null);
  const [showDonation, setShowDonation] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [wishes, setWishes] = useState<WishData[]>(initialWishes);

  useEffect(() => {
    if (greeting.template?.configJson) {
      try {
        setConfig(JSON.parse(greeting.template.configJson));
      } catch (e) {
        console.error("Invalid config JSON", e);
      }
    }
  }, [greeting]);

  if (!config) return null;

  const isTrial = greeting.isTrial === true;
  const showFireworks = config.fireworks !== false;
  const effectiveDonationMode = donationMode || greeting.donationMode || "none";
  const showSendWish =
    (greeting.submissionsEnabled || greeting.donationEnabled) && !isTrial;

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-center flex flex-col items-center justify-center font-sans">
      {/* Animated red gradient background */}
      <div className="absolute inset-0 -z-30">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #8B0000 0%, #DC143C 25%, #B22222 50%, #FF4500 75%, #8B0000 100%)",
            backgroundSize: "400% 400%",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Radial glow pulses */}
      <motion.div
        className="absolute inset-0 -z-25"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(255,215,0,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,69,0,0.1) 0%, transparent 50%)",
        }}
      />

      {/* Background image if provided */}
      {config.background && (
        <div
          className="absolute inset-0 bg-cover bg-center -z-20 opacity-30 mix-blend-overlay"
          style={{ backgroundImage: `url(${config.background})` }}
        />
      )}

      {/* Dark vignette overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Sparkle particles */}
      <SparkleOverlay />

      {/* Fireworks canvas */}
      {showFireworks && (
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <Fireworks />
        </div>
      )}

      {/* Assets Layer */}
      <AnimatePresence>
        {config.assets?.map((asset: any, i: number) => {
          let variants = {};
          if (asset.animation === "float") variants = anim.float;
          if (asset.animation === "sway") variants = anim.sway;
          if (asset.animation === "pulse") variants = anim.pulse;
          if (asset.animation === "fireworks") variants = anim.fireworks;

          return (
            <motion.div
              key={i}
              className="absolute z-[3]"
              style={{
                left: `${asset.x}%`,
                top: `${asset.y}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={asset.animation ? "animate" : "visible"}
              variants={{
                ...variants,
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ delay: i * 0.3, duration: 0.6 }}
            >
              <div
                className={`text-5xl drop-shadow-lg ${
                  asset.type === "fireworks"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
                style={{
                  filter: "drop-shadow(0 0 8px rgba(255,200,50,0.5))",
                }}
              >
                {asset.type === "lantern" && "\ud83c\udfee"}
                {asset.type === "fireworks" && "\ud83d\udca5"}
                {asset.type === "lion-dance" && "\ud83e\udd81"}
                {asset.type === "knot" && "\ud83e\udde7"}
                {asset.type === "blossom" && "\ud83c\udf38"}
                {asset.type === "fu-badge" && "\ud83c\udde8\ud83c\uddf3"}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Trial banner */}
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
            Upgrade to unlock all features →
          </a>
        </motion.div>
      )}

      {/* Preview mode overlay */}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm text-white text-center py-3 text-sm z-50 font-medium">
          Preview Mode — This is how your greeting will look
        </div>
      )}

      {/* Floating Wishes */}
      {!isPreview && wishes.length > 0 && (
        <FloatingWishes wishes={wishes} />
      )}

      {/* Main Card */}
      <motion.div
        className="relative z-10 max-w-lg w-[90%] mx-auto rounded-2xl shadow-2xl overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={anim.fadeInUp}
      >
        {/* Card background with glass effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90 backdrop-blur-xl" />
        <div className="absolute inset-0 border border-white/30 rounded-2xl" />

        {/* Gold accent line at top */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        />

        <div className="relative p-8 space-y-6">
          {/* Company logo */}
          {greeting.companyLogoUrl && !isTrial && (
            <motion.img
              src={greeting.companyLogoUrl}
              alt="Company Logo"
              className="w-16 h-16 mx-auto object-contain rounded-lg"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            />
          )}

          {/* Trial watermark instead of logo */}
          {isTrial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-gray-400 font-medium tracking-wider uppercase"
            >
              Powered by E-Card Greeting
            </motion.div>
          )}

          <motion.h1
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm"
            style={{ fontFamily: config.typography?.font }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {isPreview
              ? greeting.title || "[Your Greeting Title]"
              : greeting.title}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-gray-700"
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
            <span className="text-red-700/60 text-sm">
              With Love,
            </span>
            <br />
            <span className="text-2xl bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              {isPreview
                ? greeting.senderNameDefault || "[Company Name]"
                : greeting.senderNameDefault || "Our Family"}
            </span>
          </motion.div>

          {/* Action Buttons */}
          {!isPreview && (
            <motion.div
              className="flex justify-center gap-4 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.button
                onClick={() => setShowShare(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 px-5 py-2.5 rounded-full text-sm font-medium transition shadow-lg backdrop-blur-sm border border-white/50"
              >
                <Share2 size={16} /> Share
              </motion.button>

              {showSendWish && (
                <motion.button
                  onClick={() => setShowDonation(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition shadow-lg shadow-red-600/25"
                >
                  <Heart size={16} /> Send Wish
                </motion.button>
              )}
            </motion.div>
          )}
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
            TRIAL GREETING — E-Card Greeting Platform
          </span>
        </motion.div>
      )}

      {/* Send Wish Modal */}
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
      />
    </div>
  );
}
