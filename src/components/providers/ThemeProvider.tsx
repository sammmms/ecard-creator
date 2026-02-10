"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

// Seasonal color themes
export const THEMES = {
  seasonal: {
    name: "Auto (Seasonal)",
    primary: { light: "#dc2626", dark: "#ef4444" }, // Will be overridden dynamically
    accent: { light: "#f59e0b", dark: "#fbbf24" },
    gradient: "from-red-600 to-amber-500",
    auto: true, // Flag for auto-detection
  },
  winter: {
    name: "Winter",
    primary: { light: "#0ea5e9", dark: "#38bdf8" }, // sky-500, sky-400
    accent: { light: "#e0f2fe", dark: "#bae6fd" }, // sky-100, sky-200
    gradient: "from-sky-500 to-cyan-300",
    logo: "blue",
  },
  cny: {
    name: "Chinese New Year",
    primary: { light: "#dc2626", dark: "#ef4444" }, // red-600, red-500
    accent: { light: "#f59e0b", dark: "#fbbf24" }, // amber-500, amber-400
    gradient: "from-red-600 to-amber-500",
    logo: "gold",
  },
  eid: {
    name: "Eid Mubarak",
    primary: { light: "#059669", dark: "#10b981" }, // emerald-600, emerald-500
    accent: { light: "#eab308", dark: "#facc15" }, // yellow-500, yellow-400
    gradient: "from-emerald-600 to-yellow-500",
    logo: "green",
  },
  valentine: {
    name: "Valentine",
    primary: { light: "#e11d48", dark: "#fb7185" },
    accent: { light: "#ec4899", dark: "#f9a8d4" },
    gradient: "from-rose-600 to-pink-400",
    logo: "pink",
  },
  halloween: {
    name: "Halloween",
    primary: { light: "#ea580c", dark: "#f97316" }, // orange-600, orange-500
    accent: { light: "#7c3aed", dark: "#a855f7" }, // violet-600, purple-500
    gradient: "from-orange-600 to-purple-500",
    logo: "purple",
  },
  diwali: {
    name: "Diwali",
    primary: { light: "#dc2626", dark: "#ef4444" }, // red-600, red-500
    accent: { light: "#eab308", dark: "#fbbf24" }, // yellow-500, amber-400
    gradient: "from-red-600 to-yellow-500",
    logo: "orange",
  },
  indonesia: {
    name: "Indonesia Independence",
    primary: { light: "#dc2626", dark: "#ef4444" }, // red-600, red-500
    accent: { light: "#f8fafc", dark: "#e2e8f0" }, // slate-50, slate-200
    gradient: "from-red-600 to-white",
    logo: "gold",
  },
} as const;

export type ThemeName = keyof typeof THEMES;
export type DarkMode = "light" | "dark" | "system";

// Determine the current seasonal theme based on date
function getSeasonalTheme(): Exclude<ThemeName, "seasonal"> {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const day = now.getDate();

  // Indonesian Independence Day (Aug 17 ± 1 week)
  if (month === 7 && day >= 10 && day <= 24) return "indonesia";

  // Halloween (Oct 15 - Nov 1)
  if ((month === 9 && day >= 15) || (month === 10 && day <= 1))
    return "halloween";

  // Diwali (roughly Oct-Nov, varies each year - using late Oct to mid Nov)
  if ((month === 9 && day >= 20) || (month === 10 && day <= 15))
    return "diwali";

  // Valentine's Day (Feb 1-14)
  if (month === 1 && day >= 1 && day <= 14) return "valentine";

  // CNY (Jan 15 - Feb 28, covers most CNY dates)
  if ((month === 0 && day >= 15) || (month === 1 && day >= 15)) return "cny";

  // Eid (varies each year by lunar calendar - using rough window Apr-May and Jun-Jul)
  if (month === 3 || month === 4 || month === 5 || month === 6) return "eid";

  // Winter (Dec 1 - Jan 14)
  if (month === 11 || (month === 0 && day <= 14)) return "winter";

  // Default fallback
  return "cny";
}

interface ThemeContextType {
  darkMode: DarkMode;
  setDarkMode: (mode: DarkMode) => void;
  isDark: boolean;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  theme: (typeof THEMES)[ThemeName];
  effectiveThemeName: Exclude<ThemeName, "seasonal">;
  logoIcon: string;
  logoSquare: string;
  logoText: string;
  logoTextDark: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [darkMode, setDarkModeState] = useState<DarkMode>("system");
  const [themeName, setThemeNameState] = useState<ThemeName>("seasonal");
  const [isDark, setIsDark] = useState(false);
  const mountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  const isLoggedIn = !!session?.user;

  // Pages that always use seasonal theme + light mode (greeting cards, demo)
  const isFixedThemePage = pathname === "/demo" || pathname?.startsWith("/g/");

  // Public pages use seasonal theme + light mode only when NOT logged in
  // When logged in, user preferences apply everywhere except greeting/demo pages
  const isPublicPage =
    isFixedThemePage ||
    (!isLoggedIn &&
      (pathname === "/" || pathname === "/login" || pathname === "/register"));

  // Get the effective theme (resolve "seasonal" to actual theme)
  // For public pages, always use seasonal theme regardless of user preference
  const effectiveThemeName: Exclude<ThemeName, "seasonal"> =
    isPublicPage || themeName === "seasonal" ? getSeasonalTheme() : themeName;
  const effectiveTheme = THEMES[effectiveThemeName];

  // Generate logo paths based on theme
  const logoColor = effectiveTheme.logo;
  const logoIcon = `/logo/${logoColor}-logo.png`;
  const logoSquare = `/logo/${logoColor}-square.png`;
  const logoText = `/logo/${logoColor}.png`;
  const logoTextDark = `/logo/white.png`; // Always white for dark backgrounds

  // Hydrate state from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration: read localStorage after mount
      setMounted(true);

      const storedDarkMode = localStorage.getItem("darkMode") as DarkMode;
      if (storedDarkMode) {
        setDarkModeState(storedDarkMode);
      }
      const storedThemeName = localStorage.getItem(
        "themeName",
      ) as ThemeName | null;
      if (storedThemeName && THEMES[storedThemeName]) {
        setThemeNameState(storedThemeName);
      }
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (!mounted) return;

    const applyDarkMode = (prefersDark: boolean) => {
      // Public pages always force light mode
      const shouldBeDark =
        !isPublicPage &&
        (darkMode === "dark" || (darkMode === "system" && prefersDark));

      setIsDark(shouldBeDark);

      if (shouldBeDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    applyDarkMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => applyDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [darkMode, mounted, isPublicPage]);

  // Apply theme CSS variables
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Set primary and accent colors based on dark mode
    const primary = isDark
      ? effectiveTheme.primary.dark
      : effectiveTheme.primary.light;
    const accent = isDark
      ? effectiveTheme.accent.dark
      : effectiveTheme.accent.light;

    // Derive hover colors (slightly darker for light mode, lighter for dark mode)
    const primaryHover = effectiveTheme.primary.light;
    const accentHover = effectiveTheme.accent.light;

    root.style.setProperty("--theme-primary", primary);
    root.style.setProperty("--theme-primary-hover", primaryHover);
    root.style.setProperty("--theme-accent", accent);
    root.style.setProperty("--theme-accent-hover", accentHover);
  }, [
    effectiveThemeName,
    isDark,
    mounted,
    effectiveTheme.primary.dark,
    effectiveTheme.primary.light,
    effectiveTheme.accent.dark,
    effectiveTheme.accent.light,
  ]);

  const setDarkMode = (mode: DarkMode) => {
    setDarkModeState(mode);
    localStorage.setItem("darkMode", mode);
  };

  const setThemeName = (name: ThemeName) => {
    setThemeNameState(name);
    localStorage.setItem("themeName", name);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        isDark,
        themeName,
        setThemeName,
        theme: effectiveTheme,
        effectiveThemeName,
        logoIcon,
        logoSquare,
        logoText,
        logoTextDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
