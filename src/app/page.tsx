"use client";

import Link from "next/link";
import { ArrowRight, Star, Heart, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function Home() {
  const { logoIcon, logoText, logoTextDark } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans overflow-x-hidden">
      {/* Navbar (Minimal) */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={logoIcon}
              alt="Bizapps.id"
              className="w-8 h-8 object-contain"
            />
            <img
              src={logoText}
              alt="Bizapps.id"
              className="h-6 object-contain dark:hidden"
            />
            <img
              src={logoTextDark}
              alt="Bizapps.id"
              className="h-6 object-contain hidden dark:block"
            />
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-full btn-theme text-white text-sm font-medium transition shadow-theme"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="badge-theme inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-theme-primary"></span>
              </span>
              CNY 2026 Collection Available
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-outfit tracking-tight leading-[1.1] mb-8">
              Send Prosperity <br />
              <span className="text-theme-gradient">Instantly.</span>
            </h1>

            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Create elegant, animated digital greetings for your clients and
              loved ones. Share the joy of the season with just a link.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full btn-theme text-white font-bold text-lg transition shadow-theme flex items-center justify-center gap-2 group"
              >
                Create Greeting
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-medium text-lg hover:bg-gray-200 dark:hover:bg-white/20 transition flex items-center justify-center"
              >
                View Demo
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold font-outfit mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="w-16 h-16 bg-theme-soft rounded-full flex items-center justify-center text-theme-primary text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Choose Template</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Select from our premium animated designs.
                </p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-theme-soft rounded-full flex items-center justify-center text-theme-primary text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Customize</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Personalize your message and sender details.
                </p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-theme-soft rounded-full flex items-center justify-center text-theme-primary text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Share Instantly</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Send via WhatsApp or QR Code to everyone.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: "Premium Templates",
                desc: "Curated CNY designs with stunning animations.",
              },
              {
                icon: Zap,
                title: "Instant Sharing",
                desc: "Share via WhatsApp or QR code in seconds.",
              },
              {
                icon: Heart,
                title: "Digital Angpao",
                desc: "Integrated donation flows for gifting.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-black p-8 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-theme-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 bg-theme-soft rounded-xl flex items-center justify-center text-theme-primary mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} />
                </div>
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

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 dark:border-white/10 text-center text-gray-500 text-sm">
        <p>© 2026 Bizapps. All rights reserved.</p>
      </footer>
    </div>
  );
}
