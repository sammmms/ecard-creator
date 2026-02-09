"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import AnimationToggle from "@/components/AnimationToggle";

interface Particle {
  left: number;
  top: number;
  yEnd: number;
  xDrift: number;
  duration: number;
  delay: number;
}

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(true);
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#8B1538] via-[#A01B43] to-[#8B1538]">
      {/* Curtain/Stripe Pattern Background */}
      <div
        className="absolute inset-0 opacity-30"
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
        className="absolute top-0 left-0 right-0 h-24 z-10"
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
        className="absolute top-0 left-0 w-[300px] sm:w-[350px] md:w-[400px] lg:w-[450px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] z-20"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <motion.div
          animate={
            isPlaying
              ? {
                  rotate: [0, 2, -2, 0],
                  y: [0, -5, 0],
                }
              : {}
          }
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
        className="absolute top-0 right-0 w-[280px] sm:w-[350px] md:w-[400px] lg:w-[450px] h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px] z-20"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      >
        <motion.div
          animate={
            isPlaying
              ? {
                  rotate: [-1, 1, -1],
                  y: [0, -3, 0],
                }
              : {}
          }
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
            className="object-contain object-right-top"
          />
        </motion.div>
      </motion.div>

      {/* Golden Glow Effect */}
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
            className="object-contain opacity-70"
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
            isPlaying
              ? {
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 1.2],
                }
              : {}
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
            isPlaying
              ? {
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 1.1],
                }
              : {}
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
          {/* Title Image */}
          <motion.div
            className="relative w-[80vw] max-w-[700px] h-[40vh] max-h-[350px] mx-auto"
            animate={
              isPlaying
                ? {
                    scale: [1, 1.02, 1],
                  }
                : {}
            }
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/demo/2.png"
              alt="Happy Chinese New Year"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Chinese Characters
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <motion.p
              className="text-5xl md:text-6xl font-bold"
              style={{
                background: "linear-gradient(to bottom, #FFD700, #DAA520)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 30px rgba(255, 215, 0, 0.5)",
              }}
              animate={
                isPlaying
                  ? {
                      textShadow: [
                        "0 0 30px rgba(255, 215, 0, 0.3)",
                        "0 0 60px rgba(255, 215, 0, 0.6)",
                        "0 0 30px rgba(255, 215, 0, 0.3)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              新年快樂
            </motion.p>
          </motion.div> */}
        </motion.div>
      </div>

      {/* Bottom Left - Family Scene */}
      <motion.div
        className="absolute bottom-0 left-0 w-[280px] sm:w-[350px] md:w-[400px] lg:w-[500px] h-[320px] sm:h-[400px] md:h-[450px] lg:h-[550px] z-60"
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
            className="object-contain object-left-bottom"
          />
        </motion.div>
      </motion.div>

      {/* Bottom Right - Horse Scene */}
      <motion.div
        className="absolute bottom-0 right-0 w-[300px] sm:w-[380px] md:w-[450px] lg:w-[550px] h-[350px] sm:h-[420px] md:h-[500px] lg:h-[600px] z-60"
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
            className="object-contain object-right-bottom"
          />
        </motion.div>
      </motion.div>

      {/* Bottom Border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[20%] z-55"
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

      {/* Interactive Controls */}
      <AnimationToggle
        isPlaying={isPlaying}
        onToggle={() => setIsPlaying(!isPlaying)}
      />

      {/* Floating Particles */}
      {isPlaying && (
        <div className="absolute inset-0 z-35 pointer-events-none overflow-hidden">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400/60 rounded-full"
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
