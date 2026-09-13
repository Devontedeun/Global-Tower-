import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "midnight";
export type ColorPalette = "gold" | "emerald" | "purple" | "sunrise" | "sapphire" | "ruby";

export interface ColorPaletteConfig {
  id: ColorPalette;
  name: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  accentClass: string;
  previewGradient: string;
  bannerGradient: string;
}

export const COLOR_PALETTES: ColorPaletteConfig[] = [
  {
    id: "gold",
    name: "Royal Kingdom & Gold",
    subtitle: "Sacred gold & warm amber tapestry",
    primaryColor: "#C5A059",
    secondaryColor: "#E5B869",
    accentClass: "text-[#C5A059] bg-[#C5A059]",
    previewGradient: "from-amber-400 to-yellow-600",
    bannerGradient: "from-amber-500/10 via-[#FAF6EE] to-amber-500/5"
  },
  {
    id: "emerald",
    name: "Living Waters & Emerald",
    subtitle: "Restorative jade, mint & olive green",
    primaryColor: "#059669",
    secondaryColor: "#10B981",
    accentClass: "text-emerald-600 bg-emerald-600",
    previewGradient: "from-emerald-400 to-teal-600",
    bannerGradient: "from-emerald-500/10 via-[#F2FBF7] to-teal-500/5"
  },
  {
    id: "purple",
    name: "Sharon's Rose & Amethyst",
    subtitle: "Regal violet, royal purple & ruby",
    primaryColor: "#7C3AED",
    secondaryColor: "#8B5CF6",
    accentClass: "text-purple-600 bg-purple-600",
    previewGradient: "from-purple-500 to-pink-600",
    bannerGradient: "from-purple-500/10 via-[#FBF5FF] to-violet-500/5"
  },
  {
    id: "sunrise",
    name: "Mount Zion Sunrise",
    subtitle: "Radiant dawn coral, bronze & amber",
    primaryColor: "#EA580C",
    secondaryColor: "#F97316",
    accentClass: "text-orange-600 bg-orange-600",
    previewGradient: "from-orange-500 to-amber-500",
    bannerGradient: "from-orange-500/10 via-[#FFF8F3] to-amber-500/5"
  },
  {
    id: "sapphire",
    name: "Celestial Sapphire",
    subtitle: "Deep oceanic blue, starlight & azure",
    primaryColor: "#2563EB",
    secondaryColor: "#3B82F6",
    accentClass: "text-blue-600 bg-blue-600",
    previewGradient: "from-blue-500 to-cyan-500",
    bannerGradient: "from-blue-500/10 via-[#F3F8FF] to-indigo-500/5"
  },
  {
    id: "ruby",
    name: "Crimson Covenant",
    subtitle: "Covenant crimson, ruby & rose",
    primaryColor: "#DC2626",
    secondaryColor: "#E11D48",
    accentClass: "text-rose-600 bg-rose-600",
    previewGradient: "from-rose-500 to-red-600",
    bannerGradient: "from-rose-500/10 via-[#FFF4F6] to-red-500/5"
  }
];

export interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  palette: ColorPalette;
  paletteConfig: ColorPaletteConfig;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setPalette: (palette: ColorPalette) => void;
}

const THEME_STORAGE_KEY = "gtc_theme_mode";
const PALETTE_STORAGE_KEY = "gtc_color_palette";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "midnight" || saved === "dark") return "midnight";
      if (saved === "light") return "light";
      
      // Fallback: check system preference if user hasn't explicitly set one
      if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "midnight";
      }
    } catch {
      // Ignore storage errors in private mode
    }
    return "light";
  });

  const [palette, setPaletteState] = useState<ColorPalette>(() => {
    try {
      const saved = localStorage.getItem(PALETTE_STORAGE_KEY) as ColorPalette;
      if (saved && COLOR_PALETTES.some((p) => p.id === saved)) {
        return saved;
      }
    } catch {}
    return "gold";
  });

  const isDark = theme === "midnight";
  const paletteConfig = COLOR_PALETTES.find((p) => p.id === palette) || COLOR_PALETTES[0];

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (isDark) {
      root.classList.add("dark");
      root.setAttribute("data-theme", "midnight");
      body.classList.add("dark");
      body.setAttribute("data-theme", "midnight");

      // Update mobile/PWA status bar theme color
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute("content", "#0B111E");
      }
    } else {
      root.classList.remove("dark");
      root.removeAttribute("data-theme");
      body.classList.remove("dark");
      body.removeAttribute("data-theme");

      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute("content", paletteConfig.primaryColor);
      }
    }

    // Set Palette attributes & CSS variables
    root.setAttribute("data-palette", palette);
    body.setAttribute("data-palette", palette);
    root.style.setProperty("--color-primary-accent", paletteConfig.primaryColor);
    root.style.setProperty("--color-secondary-accent", paletteConfig.secondaryColor);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.setItem(PALETTE_STORAGE_KEY, palette);
    } catch {
      // Storage unavailable
    }

    // Broadcast theme change event for any non-React listeners
    window.dispatchEvent(
      new CustomEvent("gtc_theme_changed", {
        detail: { theme, isDark, palette }
      })
    );
  }, [theme, isDark, palette, paletteConfig]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "midnight" ? "light" : "midnight"));
  };

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
  };

  const setPalette = (nextPalette: ColorPalette) => {
    setPaletteState(nextPalette);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        palette,
        paletteConfig,
        toggleTheme,
        setTheme,
        setPalette
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
