"use client";

import { useState } from "react";
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
} from "lucide-react";
import QRCode from "react-qr-code";

// Lucide doesn't have a specific WhatsApp icon in some versions, but we can use MessageCircle or just a custom SVG if needed.
// Or we can assume it's available or use a generic one. Let's use MessageCircle for WA if Phone/WhatsApp isn't there,
// OR just text. Actually, Lucide v0.460+ has MessageCircle.
// For better UX, I'll use a simple SVG for WhatsApp if Lucide doesn't have it, or just generic 'MessageCircle'.
import { MessageCircle } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  url,
  title,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Sharing URLs
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle, // Use MessageCircle as proxy for WA or import specific if available
      color: "bg-green-500",
      action: () =>
        window.open(
          `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
          "_blank",
        ),
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600",
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          "_blank",
        ),
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700",
      action: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          "_blank",
        ),
    },
    {
      name: "Instagram",
      icon: Instagram,
      color: "bg-pink-600",
      // Instagram doesn't have a direct web share link for posts. We'll copy link and notify.
      action: () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        // In a real app, maybe show a toast "Link copied! Open Instagram to paste."
      },
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
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
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110 ${link.color}`}
                    >
                      <link.icon size={22} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {link.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* QR Code Toggle */}
              <button
                onClick={() => setShowQr(!showQr)}
                className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 transition-colors ${showQr ? "bg-theme-soft border-theme-primary text-theme-primary" : "border-gray-200 hover:bg-gray-50 text-gray-700 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"}`}
              >
                <QrCode size={18} />
                {showQr ? "Hide QR Code" : "Show QR Code"}
              </button>

              {/* QR Code Display */}
              <AnimatePresence>
                {showQr && (
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
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 text-gray-400">
                  <LinkIcon size={18} />
                </div>
                <input
                  readOnly
                  value={url}
                  className="bg-transparent border-none outline-none text-sm text-gray-600 dark:text-gray-300 w-full truncate"
                />
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
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
