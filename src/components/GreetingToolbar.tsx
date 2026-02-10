"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Share2, Heart, Pause, Play } from "lucide-react";
import ShareModal from "@/components/ShareModal";
import SendWishModal from "@/components/SendWishModal";
import FloatingWishes from "@/components/FloatingWishes";

interface WishData {
  id: string;
  name: string | null;
  comment: string | null;
  createdAt: string;
  donationAmount: number | null;
}

interface GreetingToolbarProps {
  greeting: {
    id: string;
    title: string;
    isTrial?: boolean;
    submissionsEnabled?: boolean;
    donationEnabled: boolean;
    donationMode: string;
  };
  paymentMethods?: {
    qrisImages: Array<{ label: string; url: string }>;
    ewalletType: string | null;
    ewalletNumber: string | null;
    instructionsText: string | null;
    displayName: string | null;
  } | null;
  donationMode?: string;
  initialWishes?: WishData[];
  isPreview?: boolean;
  isPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  extraButtons?: React.ReactNode;
}

export default function GreetingToolbar({
  greeting,
  paymentMethods = null,
  donationMode,
  initialWishes = [],
  isPreview = false,
  isPlaying: externalIsPlaying,
  onPlayingChange,
  extraButtons,
}: GreetingToolbarProps) {
  const [showShare, setShowShare] = useState(false);
  const [showSendWish, setShowSendWish] = useState(false);
  const [wishes, setWishes] = useState(initialWishes);
  const [shareUrl, setShareUrl] = useState("");
  const [internalIsPlaying, setInternalIsPlaying] = useState(true);

  const isPlaying = externalIsPlaying ?? internalIsPlaying;
  const setIsPlaying = onPlayingChange ?? setInternalIsPlaying;

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const isTrial = greeting.isTrial === true;
  const effectiveDonationMode = donationMode || greeting.donationMode || "none";
  const canSendWish =
    (greeting.submissionsEnabled || greeting.donationEnabled) && !isTrial;

  const handleWishSent = useCallback((wish: WishData) => {
    setWishes((prev) => [wish, ...prev]);
  }, []);

  if (isPreview) return null;

  return (
    <>
      {/* Floating Wishes */}
      {wishes.length > 0 && <FloatingWishes wishes={wishes} />}

      {/* Floating Toolbar */}
      <motion.div
        className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="flex items-center gap-0.5 sm:gap-1 p-1 sm:p-1.5 bg-black/25 backdrop-blur-xl rounded-full border border-white/15 shadow-2xl">
          {/* Extra buttons (e.g. music toggle) */}
          {extraButtons && (
            <>
              {extraButtons}
              <div className="w-px h-4 sm:h-5 bg-white/15" />
            </>
          )}

          {/* Share (hidden for trials) */}
          {!isTrial && (
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
            >
              <Share2 size={16} className="shrink-0" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}

          {/* Send Wish */}
          {canSendWish && (
            <>
              {!isTrial && <div className="w-px h-4 sm:h-5 bg-white/15" />}
              <button
                onClick={() => setShowSendWish(true)}
                className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-linear-to-r from-amber-500/70 to-red-500/70 text-white hover:from-amber-500/90 hover:to-red-500/90 transition-all text-xs font-medium shadow-lg shadow-red-900/20"
              >
                <Heart size={14} className="shrink-0" />
                <span className="hidden sm:inline">Send Wish</span>
              </button>
            </>
          )}

          {(!isTrial || canSendWish) && (
            <div className="w-px h-4 sm:h-5 bg-white/15" />
          )}

          {/* Pause/Play */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
          >
            {isPlaying ? (
              <Pause size={16} className="shrink-0" />
            ) : (
              <Play size={16} className="shrink-0" />
            )}
            <span className="hidden sm:inline">
              {isPlaying ? "Pause" : "Play"}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Share Modal (not available for trials) */}
      {!isTrial && (
        <ShareModal
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          url={shareUrl}
          title={greeting.title}
          isTrial={false}
          greetingId={greeting.id}
        />
      )}

      {/* Send Wish Modal */}
      {canSendWish && (
        <SendWishModal
          isOpen={showSendWish}
          onClose={() => setShowSendWish(false)}
          greetingId={greeting.id}
          donationEnabled={greeting.donationEnabled}
          donationMode={effectiveDonationMode}
          paymentMethods={paymentMethods || null}
          onWishSent={handleWishSent}
        />
      )}
    </>
  );
}
