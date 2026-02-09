"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Layers,
  Eye,
  Gift,
  FileImage,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import * as anim from "@/lib/animations";
import StatusBadge from "@/components/StatusBadge";

interface Stats {
  activeGreetings: number;
  totalViews: number;
  totalDonations: number;
}

function AnimatedCounter({ value, prefix = "" }: { value: number; prefix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${Math.round(v)}`);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    activeGreetings: 0,
    totalViews: 0,
    totalDonations: 0,
  });
  const [recentGreetings, setRecentGreetings] = useState<
    { id: string; title: string; slug: string; status: string; createdAt: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/greetings").then((r) => r.json()),
    ])
      .then(([greetings]) => {
        const published = greetings.filter(
          (g: { status: string }) => g.status === "published"
        );
        setStats({
          activeGreetings: published.length,
          totalViews: greetings.reduce(
            (acc: number, g: { _count?: { events?: number } }) => acc + (g._count?.events || 0),
            0
          ),
          totalDonations: 0,
        });
        setRecentGreetings(greetings.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Active Greetings",
      value: stats.activeGreetings,
      icon: Layers,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Donations Received",
      value: stats.totalDonations,
      icon: Gift,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      prefix: "Rp ",
    },
  ];

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={anim.staggerContainer}
    >
      <motion.div variants={anim.fadeInDown}>
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with your greetings.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={anim.staggerContainer}
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              variants={anim.staggerItem}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card p-6 rounded-xl group cursor-default"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {loading ? (
                      <span className="inline-block w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ) : (
                      <AnimatedCounter
                        value={card.value}
                        prefix={card.prefix}
                      />
                    )}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon size={22} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-gray-400">
                <TrendingUp size={12} className="mr-1" />
                Updated just now
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={anim.fadeInUp}>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/app/templates">
            <motion.div
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 glass-card rounded-xl cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-theme-soft flex items-center justify-center text-theme-primary group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">New Greeting</p>
                <p className="text-xs text-gray-500">
                  Pick a template and start
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all"
              />
            </motion.div>
          </Link>

          <Link href="/app/templates">
            <motion.div
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 glass-card rounded-xl cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <FileImage size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Browse Templates</p>
                <p className="text-xs text-gray-500">
                  Explore CNY 2026 designs
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all"
              />
            </motion.div>
          </Link>

          <Link href="/app/greetings">
            <motion.div
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 glass-card rounded-xl cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Layers size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">My Greetings</p>
                <p className="text-xs text-gray-500">
                  Manage your greeting cards
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
              />
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Recent Greetings */}
      {recentGreetings.length > 0 && (
        <motion.div variants={anim.fadeInUp}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Greetings</h2>
            <Link
              href="/app/greetings"
              className="text-sm link-theme flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="glass-card rounded-xl divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
            {recentGreetings.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">
                    {g.title || "Untitled Greeting"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(g.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={g.status} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
