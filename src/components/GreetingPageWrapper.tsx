"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import GreetingToolbar from "@/components/GreetingToolbar";
import UpgradeModal from "@/components/UpgradeModal";

interface GreetingPageContextValue {
  isPlaying: boolean;
  openUpgradeModal: () => void;
}

const GreetingPageContext = createContext<GreetingPageContextValue>({
  isPlaying: true,
  openUpgradeModal: () => {},
});

export function useGreetingPage() {
  return useContext(GreetingPageContext);
}

interface WishData {
  id: string;
  name: string | null;
  comment: string | null;
  createdAt: string;
  donationAmount: number | null;
}

interface GreetingPageWrapperProps {
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
  musicSrc?: string;
  isPreview?: boolean;
  children: ReactNode;
}

export default function GreetingPageWrapper({
  greeting,
  paymentMethods = null,
  donationMode,
  initialWishes = [],
  musicSrc,
  isPreview = false,
  children,
}: GreetingPageWrapperProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const openUpgradeModal = useCallback(() => setUpgradeModalOpen(true), []);

  // Auto-play music on mount
  useEffect(() => {
    if (!musicSrc || !audioRef.current) return;
    audioRef.current
      .play()
      .then(() => setIsMusicPlaying(true))
      .catch(() => {});
  }, [musicSrc]);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMusicPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsMusicPlaying(!isMusicPlaying);
  }, [isMusicPlaying]);

  const musicButton = musicSrc ? (
    <button
      onClick={toggleMusic}
      className="relative flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
    >
      {isMusicPlaying ? (
        <Volume2 size={16} className="shrink-0" />
      ) : (
        <VolumeX size={16} className="shrink-0" />
      )}
      <span className="hidden sm:inline">Music</span>
      {isMusicPlaying && (
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </button>
  ) : null;

  return (
    <GreetingPageContext.Provider value={{ isPlaying, openUpgradeModal }}>
      {musicSrc && (
        <audio ref={audioRef} src={musicSrc} loop preload="auto" />
      )}

      {children}

      <GreetingToolbar
        greeting={greeting}
        paymentMethods={paymentMethods}
        donationMode={donationMode}
        initialWishes={initialWishes}
        isPreview={isPreview}
        isPlaying={isPlaying}
        onPlayingChange={setIsPlaying}
        extraButtons={musicButton}
      />

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        trigger="trial_banner"
      />
    </GreetingPageContext.Provider>
  );
}
