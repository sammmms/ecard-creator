"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileImage,
  Layers,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
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

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 glass-card border-r border-gray-200 dark:border-gray-800 flex flex-col fixed h-full z-10">
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
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {session?.user?.name || "Company Portal"}
          </p>
        </motion.div>

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
          <SettingsDropdown />
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </motion.div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
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
