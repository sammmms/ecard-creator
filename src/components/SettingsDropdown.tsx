"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  Palette,
  Check,
  Sparkles,
} from "lucide-react";
import {
  useTheme,
  THEMES,
  ThemeName,
  DarkMode,
} from "@/components/providers/ThemeProvider";

const darkModeOptions: { value: DarkMode; label: string; icon: typeof Sun }[] =
  [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

export default function SettingsDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { darkMode, setDarkMode, themeName, setThemeName, effectiveThemeName } =
    useTheme();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Settings size={18} />
        Preferences
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
          >
            {/* Dark Mode Section */}
            <div className="p-3 border-b border-gray-100 dark:border-gray-800">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Appearance
              </p>
              <div className="flex gap-1">
                {darkModeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = darkMode === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setDarkMode(opt.value)}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg text-xs transition-colors ${
                        isActive
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                          : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <Icon size={16} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Color Section */}
            <div className="p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Palette size={12} /> Theme Color
              </p>
              <div className="space-y-1">
                {(Object.keys(THEMES) as ThemeName[]).map((key) => {
                  const theme = THEMES[key];
                  const isActive = themeName === key;
                  const isAuto = "auto" in theme && theme.auto;
                  // Use effective theme gradient for seasonal
                  const displayGradient = isAuto
                    ? THEMES[effectiveThemeName].gradient
                    : theme.gradient;

                  return (
                    <button
                      key={key}
                      onClick={() => setThemeName(key)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-gray-100 dark:bg-gray-800"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      {isAuto ? (
                        <Sparkles size={18} className="text-theme-accent" />
                      ) : (
                        <div
                          className={`w-5 h-5 rounded-full bg-gradient-to-br ${displayGradient}`}
                        />
                      )}
                      <span className="flex-1 text-left">
                        {theme.name}
                        {isAuto && isActive && (
                          <span className="text-xs text-gray-400 ml-1">
                            ({THEMES[effectiveThemeName].name})
                          </span>
                        )}
                      </span>
                      {isActive && (
                        <Check size={14} className="text-green-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
