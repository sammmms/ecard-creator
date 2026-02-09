"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  QrCode,
  Link as LinkIcon,
  Facebook,
  Linkedin,
  Instagram,
  Lock,
} from "lucide-react";
import QRCode from "react-qr-code";
import { MessageCircle } from "lucide-react";
import UpgradeModal from "@/components/UpgradeModal";
import { trackEvent } from "@/components/EventTracker";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  isTrial?: boolean;
  greetingId?: string;
}

// Generate confetti pieces once (positions/colors are random but stable per mount)
const CONFETTI_COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#FF6FB5",
  "#C490E4",
  "#FF9F45",
  "#00D2FF",
];

function ConfettiBurst({ onComplete }: { onComplete: () => void }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 15 + (Math.random() - 0.5) * 0.5;
        const distance = 40 + Math.random() * 60;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 20, // bias upward
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          size: 5 + Math.random() * 4,
          isCircle: Math.random() > 0.5,
          rotation: Math.random() * 360,
        };
      }),
    [],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-10">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? "50%" : "2px",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: 0.5,
            rotate: p.rotation,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onAnimationComplete={p.id === 0 ? onComplete : undefined}
        />
      ))}
    </div>
  );
}

export default function ShareModal({
  isOpen,
  onClose,
  url,
  title,
  isTrial = false,
  greetingId,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [igCopied, setIgCopied] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Sharing URLs
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500",
      locked: isTrial,
      action: () => {
        if (isTrial) {
          setShowUpgrade(true);
          return;
        }
        if (greetingId) trackEvent(greetingId, "share_whatsapp");
        window.open(
          `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
          "_blank",
        );
      },
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600",
      locked: false,
      action: () => {
        if (greetingId) trackEvent(greetingId, "share_facebook");
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          "_blank",
        );
      },
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700",
      locked: false,
      action: () => {
        if (greetingId) trackEvent(greetingId, "share_linkedin");
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          "_blank",
        );
      },
    },
    {
      name: "Instagram",
      icon: Instagram,
      color: "bg-pink-600",
      locked: false,
      action: () => {
        if (greetingId) trackEvent(greetingId, "share_instagram");
        navigator.clipboard.writeText(url);
        setIgCopied(true);
        setTimeout(() => setIgCopied(false), 3000);
      },
    },
  ];

  const handleCopy = () => {
    if (greetingId) trackEvent(greetingId, "share_copy_link");
    navigator.clipboard.writeText(url);
    setCopied(true);
    setShowConfetti(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Share Greeting
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Social Grid */}
                <div className="grid grid-cols-4 gap-4">
                  {shareLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={link.action}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110 ${link.locked ? "bg-gray-300 dark:bg-gray-600" : link.color}`}
                      >
                        <link.icon
                          size={22}
                          strokeWidth={1.5}
                          className={link.locked ? "opacity-50" : ""}
                        />
                        {link.locked && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Lock size={14} className="text-white drop-shadow" />
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-xs ${link.locked ? "text-gray-400" : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {link.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Instagram copy feedback */}
                <AnimatePresence>
                  {igCopied && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="bg-pink-50 text-pink-700 text-xs text-center px-3 py-2 rounded-lg border border-pink-200"
                    >
                      Link copied! Paste it in your Instagram Story or bio.
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* QR Code Toggle */}
                <button
                  onClick={() => {
                    if (isTrial) {
                      setShowUpgrade(true);
                      return;
                    }
                    setShowQr(!showQr);
                  }}
                  className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 transition-colors ${
                    isTrial
                      ? "border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                      : showQr
                        ? "bg-theme-soft border-theme-primary text-theme-primary"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {isTrial ? (
                    <Lock size={16} />
                  ) : (
                    <QrCode size={18} />
                  )}
                  {showQr && !isTrial ? "Hide QR Code" : "Show QR Code"}
                </button>

                {/* QR Code Display */}
                <AnimatePresence>
                  {showQr && !isTrial && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex justify-center pb-2"
                    >
                      <div className="p-4 bg-white rounded-xl shadow-inner border border-gray-200">
                        <QRCode value={url} size={160} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Copy Link Input */}
                <div className="relative flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="p-2 text-gray-400">
                    <LinkIcon size={18} />
                  </div>
                  <input
                    readOnly
                    value={url}
                    className="bg-transparent border-none outline-none text-sm text-gray-600 dark:text-gray-300 w-full truncate"
                  />
                  <div className="relative">
                    <button
                      onClick={handleCopy}
                      className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200"
                    >
                      {copied ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                    {showConfetti && (
                      <ConfettiBurst
                        onComplete={() => setShowConfetti(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        trigger="share-modal"
      />
    </>
  );
}
