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

interface SettingsDropdownProps {
  dropDirection?: "up" | "down";
  renderTrigger?: (props: { onClick: () => void }) => React.ReactNode;
}

export default function SettingsDropdown({
  dropDirection = "up",
  renderTrigger,
}: SettingsDropdownProps = {}) {
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
    <div className={`relative ${renderTrigger ? "" : "w-full"}`} ref={dropdownRef}>
      {renderTrigger ? (
        renderTrigger({ onClick: () => setOpen(!open) })
      ) : (
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 md:gap-2.5 px-2.5 md:px-3 py-1 md:py-1.5 w-full text-[10px] md:text-[11px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Settings size={12} className="md:hidden" />
          <Settings size={14} className="hidden md:block" />
          Preferences
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${dropDirection === "down" ? "top-full right-0 mt-2" : "bottom-full left-0 mb-2"} w-52 md:w-60 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 max-h-[60vh] md:max-h-[70vh] overflow-y-auto`}
          >
            {/* Dark Mode Section */}
            <div className="p-2.5 md:p-3 border-b border-gray-100 dark:border-gray-800">
              <p className="text-[9px] md:text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2 md:mb-2.5 px-0.5">
                Appearance
              </p>
              <div className="flex gap-1 md:gap-1.5">
                {darkModeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = darkMode === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setDarkMode(opt.value)}
                      className={`flex-1 flex flex-col items-center gap-1 md:gap-1.5 py-1.5 md:py-2 px-1 md:px-1.5 rounded-lg text-[9px] md:text-[10px] transition-colors ${
                        isActive
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                          : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <Icon size={12} className="md:hidden" />
                      <Icon size={14} className="hidden md:block" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Color Section */}
            <div className="p-2.5 md:p-3">
              <p className="text-[9px] md:text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2 md:mb-2.5 px-0.5 flex items-center gap-1">
                <Palette size={9} className="md:hidden" />
                <Palette size={10} className="hidden md:block" />
                Theme Color
              </p>
              <div className="space-y-0.5 md:space-y-1">
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
                      className={`w-full flex items-center gap-2 md:gap-2.5 px-2 md:px-2.5 py-1.5 md:py-2 rounded-lg text-[10px] md:text-[11px] transition-colors ${
                        isActive
                          ? "bg-gray-100 dark:bg-gray-800"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      {isAuto ? (
                        <Sparkles size={11} className="text-theme-accent shrink-0" />
                      ) : (
                        <div
                          className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-gradient-to-br shrink-0 ${displayGradient}`}
                        />
                      )}
                      <span className="flex-1 text-left truncate">
                        {theme.name}
                        {isAuto && isActive && (
                          <span className="text-[8px] md:text-[9px] text-gray-400 ml-1">
                            ({THEMES[effectiveThemeName].name})
                          </span>
                        )}
                      </span>
                      {isActive && (
                        <Check size={11} className="text-green-500 shrink-0" />
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
