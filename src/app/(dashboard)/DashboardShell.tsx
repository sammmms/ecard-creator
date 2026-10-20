"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileImage,
  Layers,
  Heart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Button from "@/components/Button";
import SettingsDropdown from "@/components/SettingsDropdown";
import { useTheme } from "@/components/providers/ThemeProvider";

const navItems = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/templates", label: "Templates", icon: FileImage },
  { href: "/app/greetings", label: "My Greetings", icon: Layers },
  { href: "/app/wishes", label: "Wishes", icon: Heart },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/app/notifications", label: "Notifications", icon: Bell },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { logoIcon, logoText, logoTextDark, isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch notification unread count (refreshes on navigation)
  const { data: notifData } = useSWR<{ unreadCount: number }>(
    "/api/notifications?countOnly=true",
    fetcher,
    { dedupingInterval: 5000, revalidateOnFocus: false },
  );
  const unreadCount = notifData?.unreadCount ?? 0;

  /* ── Swipe to open/close sidebar on mobile ── */
  const handleTouchEvents = useCallback(() => {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      // Only track from left edge (40px) when sidebar is closed
      // Or anywhere when sidebar is open
      tracking = startX < 40 || sidebarOpen;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = Math.abs(touch.clientY - startY);

      // Only trigger if horizontal swipe is dominant (not scrolling vertically)
      if (deltaY > Math.abs(deltaX)) return;

      if (deltaX > 80 && !sidebarOpen) {
        setSidebarOpen(true);
      } else if (deltaX < -80 && sidebarOpen) {
        setSidebarOpen(false);
      }
      tracking = false;
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    // Only add swipe on mobile-sized screens
    const mq = window.matchMedia("(max-width: 768px)");
    if (!mq.matches) return;
    return handleTouchEvents();
  }, [handleTouchEvents]);

  /* ── Shared sidebar inner content ── */
  const sidebarContent = (
    <>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/app" && pathname.startsWith(item.href));
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
            >
              <Link
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative",
                  isActive
                    ? "bg-theme-soft text-theme-primary"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-theme-primary rounded-r-full"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
                <Icon size={18} />
                {item.label}
                {item.label === "Notifications" && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <motion.div
        className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* User Profile Label */}
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-medium text-gray-900 dark:text-gray-200 truncate">
            {session?.user?.name || "Company Portal"}
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
            {session?.user?.email || "user@example.com"}
          </p>
        </div>

        <SettingsDropdown />
        <button
          onClick={() =>
            signOut({ callbackUrl: "/login" })
          }
          className="flex items-center gap-2 md:gap-2.5 px-2.5 md:px-3 py-1 md:py-1.5 w-full text-[10px] md:text-[11px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut size={12} className="md:hidden" />
          <LogOut size={14} className="hidden md:block" />
          Sign Out
        </button>
      </motion.div>
    </>
  );

  return (
    <div className="min-h-screen flex overflow-x-hidden bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      {/* ── Mobile top bar ── */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-14 flex items-center justify-between px-4 md:hidden">
        <div className="flex items-center gap-2">
          <Image
            src={logoIcon}
            alt="E-Card Creator"
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
            priority
          />
          <span className="font-bold tracking-tight text-sm text-gray-900 dark:text-white">
            E-Card Creator
          </span>
        </div>
        <Button
          variant="icon"
          size="md"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sliding sidebar */}
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-950 shadow-xl md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
            >
              {/* Close button + logo */}
              <div className="p-6 flex items-center justify-between">
                <Link href="/" onClick={() => setSidebarOpen(false)}>
                  <motion.div
                    className="flex items-center gap-2"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={logoIcon}
                      alt="E-Card Creator"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                      priority
                    />
                    <span className="font-bold tracking-tight text-base text-gray-900 dark:text-white">
                      E-Card Creator
                    </span>
                  </motion.div>
                </Link>
                <Button
                  variant="icon"
                  size="md"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </Button>
              </div>

              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ── */}
      <aside className="w-64 glass-card border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col fixed h-full z-10">
        <motion.div
          className="p-6"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Image
                src={logoIcon}
                alt="E-Card Creator"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
                priority
              />
              <span className="font-bold tracking-tight text-lg text-gray-900 dark:text-white">
                E-Card Creator
              </span>
            </motion.div>
          </Link>
        </motion.div>

        {sidebarContent}
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 ml-0 md:ml-64 p-4 md:p-8 pt-18 md:pt-8">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
