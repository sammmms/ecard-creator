"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileImage,
  Layers,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import SettingsDropdown from "@/components/SettingsDropdown";
import { useTheme } from "@/components/providers/ThemeProvider";

const navItems = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/templates", label: "Templates", icon: FileImage },
  { href: "/app/greetings", label: "My Greetings", icon: Layers },
  { href: "/app/settings/payments", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { logoIcon, logoText, logoTextDark, isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          onClick={() => signOut({ callbackUrl: "/login" })}
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
    <div className="min-h-screen flex bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      {/* ── Mobile top bar ── */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-14 flex items-center px-4 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2 ml-3">
          <img
            src={logoIcon}
            alt="Bizapps.id"
            className="w-7 h-7 object-contain"
          />
          <img
            src={isDark ? logoTextDark : logoText}
            alt="Bizapps.id"
            className="h-4 object-contain"
          />
        </div>
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
                <div className="flex items-center gap-2">
                  <img
                    src={logoIcon}
                    alt="Bizapps.id"
                    className="w-8 h-8 object-contain"
                  />
                  <img
                    src={isDark ? logoTextDark : logoText}
                    alt="Bizapps.id"
                    className="h-5 object-contain"
                  />
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
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
          <div className="flex items-center gap-2">
            <img
              src={logoIcon}
              alt="Bizapps.id"
              className="w-8 h-8 object-contain"
            />
            <img
              src={isDark ? logoTextDark : logoText}
              alt="Bizapps.id"
              className="h-5 object-contain"
            />
          </div>
        </motion.div>

        {sidebarContent}
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-18 md:pt-8">
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
