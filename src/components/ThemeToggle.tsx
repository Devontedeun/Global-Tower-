import React, { useState } from "react";
import { Moon, Sun, Sparkles, Check, Palette } from "lucide-react";
import { useTheme, ThemeMode, ColorPalette, COLOR_PALETTES } from "../lib/ThemeContext";

interface ThemeToggleProps {
  variant?: "compact" | "pill" | "switch" | "cards" | "palette";
  className?: string;
  showLabel?: boolean;
}

export const SanctuaryColorPicker: React.FC<{ className?: string; compact?: boolean }> = ({
  className = "",
  compact = false
}) => {
  const { palette, setPalette, paletteConfig } = useTheme();

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {COLOR_PALETTES.map((p) => {
          const isSelected = palette === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPalette(p.id)}
              title={`${p.name} - ${p.subtitle}`}
              className={`w-6 h-6 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                isSelected ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110 shadow-xs" : "hover:scale-105 opacity-80 hover:opacity-100"
              }`}
              style={{
                backgroundColor: p.primaryColor,
                outlineColor: p.primaryColor
              }}
            >
              {isSelected && <Check className="w-3 h-3 text-white drop-shadow-xs" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#C5A059]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A7468] dark:text-slate-400">
            Sanctuary Atmosphere Palette
          </h4>
        </div>
        <span className="text-xs font-semibold text-[#2D2D2D] dark:text-white">
          {paletteConfig.name}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {COLOR_PALETTES.map((p) => {
          const isSelected = palette === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPalette(p.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                isSelected
                  ? "bg-white dark:bg-slate-800 border-2 shadow-md"
                  : "bg-[#FDFCF9] dark:bg-slate-900/40 border-[#E5E0D5] dark:border-slate-800 hover:border-[#C5A059]"
              }`}
              style={{
                borderColor: isSelected ? p.primaryColor : undefined
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-xl shadow-xs flex items-center justify-center shrink-0 text-white"
                  style={{ backgroundColor: p.primaryColor }}
                >
                  {isSelected && <Check className="w-4 h-4 drop-shadow-xs" />}
                </div>
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: p.secondaryColor }}
                />
              </div>

              <div>
                <span className="text-xs font-bold text-[#2D2D2D] dark:text-white block truncate">
                  {p.name}
                </span>
                <span className="text-[10px] text-[#7A7468] dark:text-slate-400 line-clamp-1">
                  {p.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "compact",
  className = "",
  showLabel = false
}) => {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();

  if (variant === "palette") {
    return <SanctuaryColorPicker className={className} />;
  }

  if (variant === "cards") {
    const themes: Array<{
      id: ThemeMode;
      title: string;
      subtitle: string;
      bgPreview: string;
      cardBg: string;
      accentColor: string;
      textColor: string;
    }> = [
      {
        id: "light",
        title: "Sacred Ivory Linen",
        subtitle: "Warm parchment canvas with regal gold accents",
        bgPreview: "#F9F7F2",
        cardBg: "#FFFFFF",
        accentColor: "#C5A059",
        textColor: "#2D2D2D"
      },
      {
        id: "midnight",
        title: "Midnight Sanctuary",
        subtitle: "Deep navy and charcoal tones with celestial gold glow",
        bgPreview: "#0B111E",
        cardBg: "#162033",
        accentColor: "#D4AF37",
        textColor: "#F8FAFC"
      }
    ];

    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
        {themes.map((t) => {
          const isSelected = theme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                isSelected
                  ? isDark
                    ? "bg-[#162033] border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-lg shadow-black/40"
                    : "bg-[#FAF6EE] border-[#C5A059] ring-1 ring-[#C5A059]/40 shadow-sm"
                  : isDark
                  ? "bg-[#111928] border-[#1E2D44] hover:border-[#D4AF37]/50"
                  : "bg-[#F9F7F2] border-[#E5E0D5] hover:border-[#C5A059]"
              }`}
            >
              {/* Palette Visual Swatch Mini-Preview */}
              <div
                className="w-full h-12 rounded-xl p-2 mb-2.5 flex items-center justify-between border shadow-inner transition-transform group-hover:scale-101"
                style={{
                  backgroundColor: t.bgPreview,
                  borderColor: isSelected ? t.accentColor : "rgba(150, 150, 150, 0.2)"
                }}
              >
                <div
                  className="px-2.5 py-1 rounded-md text-[10px] font-bold shadow-xs flex items-center gap-1.5"
                  style={{
                    backgroundColor: t.cardBg,
                    color: t.textColor,
                    border: `1px solid ${t.accentColor}40`
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: t.accentColor }}
                  />
                  <span>Sanctuary</span>
                </div>

                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{ color: t.accentColor }}
                >
                  {t.id === "midnight" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm">
                    {t.title}
                  </h4>
                  <p className="text-[11px] opacity-75 mt-0.5 leading-snug">
                    {t.subtitle}
                  </p>
                </div>
                {isSelected && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white shadow-xs"
                    style={{ backgroundColor: t.accentColor }}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "switch") {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
              isDark ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "bg-[#C5A059]/15 text-[#C5A059]"
            }`}
          >
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </div>
          <div>
            <span className="text-xs font-bold block">
              {isDark ? "Midnight Sanctuary" : "Sacred Ivory Linen"}
            </span>
            <span className="text-[10px] text-[#7A7468] dark:text-[#94A3B8] block">
              {isDark ? "Deep navy & charcoal dark theme" : "Warm daytime light theme"}
            </span>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          onClick={toggleTheme}
          className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-[#C5A059] ${
            isDark ? "bg-[#D4AF37]" : "bg-[#E5E0D5]"
          }`}
          title="Toggle between Light and Midnight Sanctuary Dark Theme"
        >
          <div
            className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center text-[#2D2D2D] ${
              isDark ? "translate-x-5.5 text-[#0B111E]" : "translate-x-0 text-[#C5A059]"
            }`}
          >
            {isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
          </div>
        </button>
      </div>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
          isDark
            ? "bg-[#162033] hover:bg-[#1E2D44] border-[#1E2D44] text-[#F8FAFC] hover:border-[#D4AF37]/60"
            : "bg-white hover:bg-[#F9F7F2] border-[#E5E0D5] text-[#2D2D2D] hover:border-[#C5A059]"
        } ${className}`}
        title={`Switch to ${isDark ? "Sacred Ivory Light Theme" : "Midnight Sanctuary Dark Theme"}`}
        aria-label="Toggle Theme"
      >
        <div
          className={`w-4 h-4 rounded-full flex items-center justify-center ${
            isDark ? "text-[#D4AF37]" : "text-[#C5A059]"
          }`}
        >
          {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </div>
        <span>{isDark ? "Midnight Sanctuary" : "Light Theme"}</span>
      </button>
    );
  }

  // Default: Compact Header Button
  return (
    <button
      type="button"
      id="global-theme-toggle-btn"
      onClick={toggleTheme}
      className={`group relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer shadow-2xs ${
        isDark
          ? "bg-[#162033] hover:bg-[#1E2D44] border-[#1E2D44] text-[#F8FAFC] hover:border-[#D4AF37]/60"
          : "bg-white hover:bg-[#F9F7F2] border-[#E5E0D5] text-[#7A7468] hover:text-[#C5A059] hover:border-[#C5A059]"
      } ${className}`}
      title={isDark ? "Switch to Sacred Ivory Light Theme" : "Switch to Midnight Sanctuary Dark Theme"}
      aria-label={isDark ? "Activate Light Theme" : "Activate Midnight Sanctuary Dark Theme"}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-[#D4AF37] transition-transform group-hover:-rotate-12" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-[#C5A059] transition-transform group-hover:rotate-45" />
        )}
      </div>

      {(showLabel || true) && (
        <span className="hidden md:inline font-sans text-xs tracking-tight">
          {isDark ? "Midnight" : "Light"}
        </span>
      )}
    </button>
  );
};
