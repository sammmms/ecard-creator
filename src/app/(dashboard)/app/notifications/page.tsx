"use client";

import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Info,
  AlertTriangle,
  Eye,
  Megaphone,
} from "lucide-react";
import * as anim from "@/lib/animations";
import { fetcher } from "@/lib/fetcher";
import Shimmer from "@/components/Shimmer";

interface Notification {
  id: string;
  message: string;
  redirectLink: string | null;
  type: string;
  isRead: boolean;
  createdAt: string;
}

function getIcon(type: string) {
  switch (type) {
    case "warning":
      return <AlertTriangle size={18} className="text-amber-500" />;
    case "view_limit_reached":
      return <Eye size={18} className="text-red-500" />;
    case "system":
      return <Megaphone size={18} className="text-blue-500" />;
    default:
      return <Info size={18} className="text-gray-400" />;
  }
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function NotificationsPage() {
  const router = useRouter();
  const [markingAll, setMarkingAll] = useState(false);

  const { data, isLoading, mutate } = useSWR<{
    notifications: Notification[];
    unreadCount: number;
  }>("/api/notifications", fetcher);

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    await mutate();
    setMarkingAll(false);
  };

  const handleClick = async (notif: Notification) => {
    if (!notif.isRead) {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [notif.id] }),
      });
      mutate();
    }
    if (notif.redirectLink) {
      router.push(notif.redirectLink);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <Shimmer className="h-8 w-48" />
          <Shimmer className="h-4 w-64" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Shimmer key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-6"
      initial="hidden"
      animate="visible"
      variants={anim.staggerContainer}
    >
      <motion.div
        variants={anim.fadeInDown}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCheck size={16} />
            Mark all read
          </motion.button>
        )}
      </motion.div>

      {notifications.length === 0 ? (
        <motion.div
          variants={anim.fadeInUp}
          className="text-center py-16 glass-card rounded-xl"
        >
          <Bell size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            No notifications yet
          </p>
          <p className="text-gray-400 text-sm mt-1">
            We&apos;ll notify you about important events here.
          </p>
        </motion.div>
      ) : (
        <motion.div variants={anim.fadeInUp} className="space-y-2">
          <AnimatePresence>
            {notifications.map((notif) => (
              <motion.button
                key={notif.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                onClick={() => handleClick(notif)}
                className={`w-full text-left glass-card rounded-xl p-4 flex items-start gap-3 transition-colors ${
                  notif.redirectLink ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50" : "cursor-default"
                } ${!notif.isRead ? "border-l-4 border-l-theme-primary" : ""}`}
              >
                <div className="shrink-0 mt-0.5">{getIcon(notif.type)}</div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-relaxed ${
                      notif.isRead
                        ? "text-gray-500 dark:text-gray-400"
                        : "text-gray-900 dark:text-gray-100 font-medium"
                    }`}
                  >
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {timeAgo(notif.createdAt)}
                  </p>
                </div>
                {!notif.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-theme-primary shrink-0 mt-1.5" />
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
