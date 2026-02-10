"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Star,
  Heart,
  Zap,
  LayoutDashboard,
  LogOut,
  Settings,
  Palette,
  MousePointerClick,
  Share2,
  LogIn,
  UserPlus,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/components/providers/ThemeProvider";
import SettingsDropdown from "@/components/SettingsDropdown";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

const steps = [
  {
    number: "01",
    icon: Palette,
    title: "Choose a Template",
    desc: "Browse our collection of premium, animated greeting templates designed for every occasion.",
    gradient: "from-red-500 to-amber-500",
  },
  {
    number: "02",
    icon: MousePointerClick,
    title: "Customize",
    desc: "Add your brand, write a heartfelt message, and optionally set up digital wishes for donations.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    number: "03",
    icon: Share2,
    title: "Share Instantly",
    desc: "Send via WhatsApp, share a QR code, or copy the link. Reach everyone in seconds.",
    gradient: "from-orange-500 to-red-500",
  },
];

const features = [
  {
    icon: Star,
    title: "Premium Templates",
    desc: "Curated animated designs with stunning visual effects for every celebration.",
  },
  {
    icon: Zap,
    title: "Instant Sharing",
    desc: "Share via WhatsApp, Facebook, LinkedIn, or QR code in just seconds.",
  },
  {
    icon: Heart,
    title: "Digital Wishes",
    desc: "Integrated wish collection with optional donation flows for gifting.",
  },
];

export default function Home() {
  const { logoIcon, logoText, logoTextDark } = useTheme();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={logoIcon}
              alt="Bizapps.id"
              width={32}
              height={32}
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
              priority
            />
            <Image
              src={logoText}
              alt="Bizapps.id"
              width={120}
              height={24}
              className="h-5 sm:h-6 object-contain dark:hidden"
              priority
            />
            <Image
              src={logoTextDark}
              alt="Bizapps.id"
              width={120}
              height={24}
              className="h-5 sm:h-6 object-contain hidden dark:block"
              priority
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {isLoggedIn ? (
              <>
                <SettingsDropdown
                  dropDirection="down"
                  renderTrigger={({ onClick }) => (
                    <button
                      onClick={onClick}
                      className="p-2.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition flex items-center gap-1.5"
                      aria-label="Preferences"
                    >
                      <Settings size={18} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Preferences</span>
                    </button>
                  )}
                />
                <Link
                  href="/app"
                  className="p-2.5 sm:px-5 sm:py-2.5 rounded-full btn-theme text-white text-sm font-medium transition shadow-theme flex items-center gap-1.5"
                >
                  <LayoutDashboard size={18} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <button
                  onClick={() =>
                    signOut({ callbackUrl: "/login" })
                  }
                  className="p-2.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition flex items-center gap-1.5 text-gray-600 dark:text-gray-400"
                  aria-label="Sign out"
                >
                  <LogOut size={18} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="p-2.5 sm:px-5 sm:py-2.5 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition flex items-center gap-1.5"
                >
                  <LogIn size={18} className="sm:hidden" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link
                  href="/register"
                  className="p-2.5 sm:px-5 sm:py-2.5 rounded-full btn-theme text-white text-sm font-medium transition shadow-theme flex items-center gap-1.5"
                >
                  <UserPlus size={18} className="sm:hidden" />
                  <span className="hidden sm:inline">Get Started</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible">
            <motion.div
              variants={fadeUp}
              custom={0}
              className="badge-theme inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-theme-primary" />
              </span>
              CNY 2026 Collection Available
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-5xl md:text-7xl lg:text-8xl font-bold font-outfit tracking-tight leading-[1.1] mb-8"
            >
              Send Prosperity <br />
              <span className="text-theme-gradient">Instantly.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Create elegant, animated digital greetings for your clients and
              loved ones. Share the joy of the season with just a link.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href={isLoggedIn ? "/app" : "/register"}
                className="w-full sm:w-auto px-8 py-4 rounded-full btn-theme text-white font-bold text-lg transition shadow-theme flex items-center justify-center gap-2 group"
              >
                {isLoggedIn ? "Dashboard" : "Create Greeting"}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-medium text-lg hover:bg-gray-200 dark:hover:bg-white/20 transition flex items-center justify-center"
              >
                View Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl -z-10" />

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-24 left-[10%] w-3 h-3 rounded-full bg-theme-primary/30 hidden sm:block"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-[15%] w-2 h-2 rounded-full bg-theme-accent/40 hidden sm:block"
          animate={{ y: [0, -15, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-[20%] w-4 h-4 rounded-full bg-theme-accent/20 hidden sm:block"
          animate={{ y: [0, -25, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute top-60 right-[8%] w-2 h-2 rounded-full bg-theme-primary/25 hidden sm:block"
          animate={{ y: [0, -18, 0], rotate: [0, 180, 360] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </section>

      {/* ── Step by Step ── */}
      <section className="py-20 sm:py-28 border-t border-gray-100 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-theme-primary text-sm font-semibold tracking-wider uppercase mb-3 block">
              Simple &amp; Easy
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-outfit">
              Three steps to spread joy
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="relative group"
                >
                  {/* Connector arrow (desktop only, not on last) */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-3 top-16 z-10 text-gray-300 dark:text-gray-700">
                      <ChevronRight size={20} />
                    </div>
                  )}

                  <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-white/10 rounded-2xl p-8 hover:border-theme-primary/30 hover:shadow-lg transition-all duration-300 h-full">
                    {/* Step number */}
                    <span
                      className={`text-5xl font-bold font-outfit bg-linear-to-br ${step.gradient} bg-clip-text text-transparent opacity-20 group-hover:opacity-40 transition-opacity`}
                    >
                      {step.number}
                    </span>

                    {/* Icon */}
                    <motion.div
                      className={`w-14 h-14 rounded-xl bg-linear-to-br ${step.gradient} flex items-center justify-center text-white mt-4 mb-5`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon size={24} />
                    </motion.div>

                    <h3 className="text-xl font-bold font-outfit mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section
        id="features"
        className="py-20 sm:py-28 bg-gray-50 dark:bg-white/2"
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-theme-primary text-sm font-semibold tracking-wider uppercase mb-3 block">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-outfit">
              Everything you need
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-black p-8 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-theme-primary/50 transition-all duration-300 group hover:shadow-lg"
              >
                <motion.div
                  className="w-12 h-12 bg-theme-soft rounded-xl flex items-center justify-center text-theme-primary mb-6"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <feature.icon size={24} />
                </motion.div>
                <h3 className="text-xl font-bold font-outfit mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 text-theme-primary mb-6"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles size={20} />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold font-outfit mb-4">
              Ready to spread joy?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Create your first digital greeting in under 5 minutes. No design
              skills needed.
            </p>
            <Link
              href={isLoggedIn ? "/app" : "/register"}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full btn-theme text-white font-bold text-lg transition shadow-theme group"
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started — It's Free"}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-gray-100 dark:border-white/10 text-center text-gray-500 text-sm">
        <p>&copy; 2026 Bizapps. All rights reserved.</p>
      </footer>
    </div>
  );
}
