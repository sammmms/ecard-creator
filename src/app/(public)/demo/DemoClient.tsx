"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GreetingPageWrapper from "@/components/GreetingPageWrapper";
import { useGreetingPage } from "@/components/GreetingPageWrapper";
import { useTheme } from "@/components/providers/ThemeProvider";

interface WishData {
  id: string;
  name: string | null;
  comment: string | null;
  createdAt: string;
  donationAmount: number | null;
}

// 14 Chinese New Year greetings for scrolling background
const CNY_MESSAGES = [
  "恭喜发财",
  "新年快乐",
  "万事如意",
  "身体健康",
  "大吉大利",
  "年年有余",
  "心想事成",
  "步步高升",
  "财源广进",
  "吉祥如意",
  "福星高照",
  "花开富贵",
  "金玉满堂",
  "龙马精神",
];

interface Particle {
  left: number;
  top: number;
  yEnd: number;
  xDrift: number;
  duration: number;
  delay: number;
}

interface DemoClientProps {
  greetingId: string;
  initialWishes: WishData[];
}

export default function DemoClient({
  greetingId,
  initialWishes,
}: DemoClientProps) {
  const allWishes = initialWishes;

  return (
    <GreetingPageWrapper
      greeting={{
        id: greetingId,
        title: "Happy Chinese New Year — Bizapps",
        submissionsEnabled: true,
        donationEnabled: false,
        donationMode: "none",
      }}
      initialWishes={allWishes}
      musicSrc="/demo/background_music.mp3"
    >
      <DemoVisual />
    </GreetingPageWrapper>
  );
}

function DemoVisual() {
  const { isPlaying } = useGreetingPage();
  const { logoIcon, logoTextDark } = useTheme();

  const [particles] = useState<Particle[]>(() =>
    [...Array(15)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      yEnd: -100 - Math.random() * 100,
      xDrift: (Math.random() - 0.5) * 50,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 3,
    })),
  );

  return (
    <div className="relative min-h-dvh overflow-hidden bg-linear-to-b from-[#8B1538] via-[#A01B43] to-[#8B1538]">
      {/* CSS Keyframes for scrolling text */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes demoScrollUp {
              from { transform: translateY(0); }
              to { transform: translateY(-50%); }
            }
          `,
        }}
      />

      {/* Scrolling Chinese Text Background */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        <div className="flex justify-around items-start h-full opacity-[0.06]">
          {Array.from({ length: 8 }).map((_, col) => (
            <div
              key={col}
              className="shrink-0 flex flex-col items-center gap-4"
              style={{
                animation: `demoScrollUp ${28 + col * 3}s linear infinite`,
                animationDelay: `${-col * 3.5}s`,
              }}
            >
              {[...CNY_MESSAGES, ...CNY_MESSAGES].map((msg, i) => (
                <span
                  key={i}
                  className="text-yellow-200 text-lg font-bold py-2 whitespace-nowrap"
                  style={{ writingMode: "vertical-rl" }}
                >
                  {msg}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Curtain/Stripe Pattern Background */}
      <div
        className="absolute inset-0 z-2 opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 20px,
            rgba(139, 21, 56, 0.5) 20px,
            rgba(139, 21, 56, 0.5) 40px
          )`,
        }}
      />

      {/* Wave Pattern Top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-16 sm:h-24 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Image
          src="/demo/10.png"
          alt="Wave pattern"
          fill
          className="object-cover object-top opacity-60"
        />
      </motion.div>

      {/* Top Left Lanterns */}
      <motion.div
        className="absolute top-0 left-0 w-[160px] sm:w-[300px] md:w-[400px] lg:w-[450px] h-[180px] sm:h-[300px] md:h-[400px] lg:h-[450px] z-20"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <motion.div
          animate={isPlaying ? { rotate: [0, 2, -2, 0], y: [0, -5, 0] } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="relative w-full h-full"
        >
          <Image
            src="/demo/5.png"
            alt="Lanterns"
            fill
            className="object-contain object-top"
          />
        </motion.div>
      </motion.div>

      {/* Top Right Lanterns with Fans */}
      <motion.div
        className="absolute top-0 right-0 w-[140px] sm:w-[300px] md:w-[400px] lg:w-[450px] h-[160px] sm:h-[300px] md:h-[400px] lg:h-[450px] z-20"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      >
        <motion.div
          animate={isPlaying ? { rotate: [-1, 1, -1], y: [0, -3, 0] } : {}}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="relative w-full h-full"
        >
          <Image
            src="/demo/8.png"
            alt="Decorations"
            fill
            className="object-contain object-top-right"
          />
        </motion.div>
      </motion.div>

      {/* Golden Glow Effect — object-cover to fill viewport on mobile */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={isPlaying ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/demo/3.png"
            alt="Glow"
            fill
            className="object-cover opacity-70"
          />
        </motion.div>
      </motion.div>

      {/* Fireworks 1 */}
      <motion.div
        className="absolute top-[15%] left-[30%] w-[30%] h-[30%] z-40 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={
            isPlaying ? { opacity: [0, 1, 0], scale: [0.5, 1, 1.2] } : {}
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeOut",
          }}
        >
          <Image
            src="/demo/4.png"
            alt="Fireworks"
            fill
            className="object-contain"
          />
        </motion.div>
      </motion.div>

      {/* Fireworks 2 */}
      <motion.div
        className="absolute top-[10%] right-[25%] w-[25%] h-[25%] z-40 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={
            isPlaying ? { opacity: [0, 1, 0], scale: [0.5, 1, 1.1] } : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1.5,
            delay: 0.5,
            ease: "easeOut",
          }}
        >
          <Image
            src="/demo/4.png"
            alt="Fireworks"
            fill
            className="object-contain"
          />
        </motion.div>
      </motion.div>

      {/* Center Content - Title */}
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <motion.div
          className="relative text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <motion.div
            className="relative w-[85vw] max-w-[700px] h-[35vh] sm:h-[40vh] max-h-[350px] mx-auto"
            animate={isPlaying ? { scale: [1, 1.02, 1] } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/demo/2.png"
              alt="Happy Chinese New Year"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Left - Family Scene */}
      <motion.div
        className="absolute bottom-0 left-0 w-[180px] sm:w-[300px] md:w-[400px] lg:w-[500px] h-[220px] sm:h-[350px] md:h-[450px] lg:h-[550px] z-60"
        initial={{ opacity: 0, x: -50, y: 50 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, delay: 0.6 }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={isPlaying ? { y: [0, -5, 0] } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <Image
            src="/demo/9.png"
            alt="Family gathering"
            fill
            className="object-contain object-bottom-left"
          />
        </motion.div>
      </motion.div>

      {/* Bottom Right - Horse Scene */}
      <motion.div
        className="absolute bottom-0 right-0 w-[200px] sm:w-[320px] md:w-[450px] lg:w-[550px] h-[240px] sm:h-[380px] md:h-[500px] lg:h-[600px] z-60"
        initial={{ opacity: 0, x: 50, y: 50 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, delay: 0.8 }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={isPlaying ? { y: [0, -8, 0] } : {}}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <Image
            src="/demo/7.png"
            alt="Horse decoration"
            fill
            className="object-contain object-bottom-right"
          />
        </motion.div>
      </motion.div>

      {/* Bottom Border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[15%] sm:h-[20%] z-55"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <Image
          src="/demo/6.png"
          alt="Bottom border"
          fill
          className="object-cover object-bottom"
        />
      </motion.div>

      {/* Back Button */}
      <motion.div
        className="absolute top-4 left-4 z-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <Link
          href="/"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-black/30 transition-all text-xs font-medium"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Back</span>
        </Link>
      </motion.div>

      {/* Bizapps Logo — small screens: icon only at top-center; large screens: icon+text at bottom-right */}
      <motion.div
        className="absolute z-70 top-4 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
          <Image
            src={logoIcon}
            alt="Bizapps"
            width={20}
            height={20}
            className="w-5 h-5 object-contain brightness-0 invert opacity-80"
          />
          <Image
            src={logoTextDark}
            alt="Bizapps.id"
            width={72}
            height={16}
            className="h-3.5 w-auto object-contain opacity-80"
          />
        </div>
      </motion.div>

      {/* Floating Particles */}
      {isPlaying && (
        <div className="absolute inset-0 z-35 pointer-events-none overflow-hidden">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 sm:w-2 h-1.5 sm:h-2 bg-yellow-400/60 rounded-full"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
              }}
              animate={{
                y: [-20, p.yEnd],
                x: [0, p.xDrift],
                opacity: [0, 1, 0],
                scale: [0, 1, 0.5],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
