"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { fetcher } from "@/lib/fetcher";
import {
  Layers,
  Eye,
  Gift,
  MessageCircle,
  FileImage,
  Plus,
  ArrowRight,
  TrendingUp,
  Heart,
} from "lucide-react";
import Link from "next/link";
import * as anim from "@/lib/animations";
import StatusBadge from "@/components/StatusBadge";
import { GreetingStatus } from "@/lib/constants";

interface Stats {
  activeGreetings: number;
  totalViews: number;
  totalWishes: number;
  totalDonations: number;
}

interface RecentWish {
  id: string;
  name: string | null;
  comment: string | null;
  createdAt: string;
  greeting: { id: string; title: string | null; slug: string };
  donation: { id: string; amount: number; status: string } | null;
}

const AVATAR_GRADIENTS = [
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-violet-500",
  "from-red-400 to-rose-500",
];

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function AnimatedCounter({
  value,
  prefix = "",
}: {
  value: number;
  prefix?: string;
}) {
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
  const { data: greetings = [], isLoading: loading } = useSWR<
    {
      id: string;
      title: string;
      slug: string;
      status: string;
      createdAt: string;
      viewCount?: number;
      _count?: {
        publicSubmissions?: number;
        donationPayments?: number;
      };
    }[]
  >("/api/greetings", fetcher);

  const { data: wishesData } = useSWR<{ wishes: RecentWish[]; total: number }>(
    "/api/wishes?limit=5",
    fetcher,
  );
  const recentWishes = wishesData?.wishes || [];

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const published = greetings.filter((g) => g.status === GreetingStatus.PUBLISHED);
  const stats: Stats = {
    activeGreetings: published.length,
    totalViews: greetings.reduce((acc, g) => acc + (g.viewCount || 0), 0),
    totalWishes: greetings.reduce(
      (acc, g) => acc + (g._count?.publicSubmissions || 0),
      0,
    ),
    totalDonations: greetings.reduce(
      (acc, g) => acc + (g._count?.donationPayments || 0),
      0,
    ),
  };
  const recentGreetings = greetings;

  const statCards: Array<{
    label: string;
    value: number;
    icon: typeof Layers;
    color: string;
    bg: string;
    href?: string;
    prefix?: string;
  }> = [
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
      label: "Total Wishes",
      value: stats.totalWishes,
      icon: MessageCircle,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      href: "/app/wishes",
    },
    {
      label: "Donations Received",
      value: stats.totalDonations,
      icon: Gift,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      href: "/app/wishes?tab=donations",
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
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        variants={anim.staggerContainer}
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          const isClickable = !!card.href;
          const inner = (
            <motion.div
              key={card.label}
              variants={anim.staggerItem}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`glass-card p-4 sm:p-6 rounded-xl group ${isClickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold mt-2">
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
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon size={22} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-gray-400">
                <TrendingUp size={12} className="mr-1" />
                {isClickable ? "Tap to view all" : "Updated just now"}
              </div>
            </motion.div>
          );
          return isClickable ? (
            <Link key={card.label} href={card.href!}>
              {inner}
            </Link>
          ) : (
            <div key={card.label}>{inner}</div>
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

      {/* Recent Wishes */}
      <motion.div variants={anim.fadeInUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Wishes</h2>
          <Link
            href="/app/wishes"
            className="text-sm link-theme flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {recentWishes.length === 0 ? (
          <div className="glass-card rounded-xl p-8 flex flex-col items-center text-center">
            <Heart
              size={32}
              className="text-gray-300 dark:text-gray-600 mb-2"
            />
            <p className="text-sm text-gray-500">No wishes yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Wishes will appear here when people send them to your greetings.
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-xl divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
            {recentWishes.map((wish, i) => {
              const name = wish.name || "Anonymous";
              const initial = name.charAt(0).toUpperCase();
              const gradientIdx =
                hashCode(wish.id) % AVATAR_GRADIENTS.length;
              return (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 px-5 py-3.5"
                >
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[gradientIdx]} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <span className="text-white text-sm font-bold">
                      {initial}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{name}</p>
                      {wish.donation && wish.donation.amount > 0 && (
                        <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium shrink-0">
                          {formatCurrency(wish.donation.amount)}
                        </span>
                      )}
                    </div>
                    {wish.comment && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {wish.comment}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {wish.greeting.title || "Untitled"} &middot;{" "}
                      {new Date(wish.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Recent Greetings */}
      {recentGreetings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
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
            {recentGreetings
              .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
              .map((g, i) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="font-medium text-sm truncate">
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

          {Math.ceil(recentGreetings.length / PAGE_SIZE) > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              <span className="text-xs text-gray-500">
                {page} / {Math.ceil(recentGreetings.length / PAGE_SIZE)}
              </span>
              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(
                      Math.ceil(recentGreetings.length / PAGE_SIZE),
                      p + 1,
                    ),
                  )
                }
                disabled={
                  page === Math.ceil(recentGreetings.length / PAGE_SIZE)
                }
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
