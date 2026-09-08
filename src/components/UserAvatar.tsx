import React from "react";

interface UserAvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  bgColor?: string;
  textColor?: string;
}

// Deterministic pleasant color palette for user initials avatars
const COLOR_PALETTES = [
  { bg: "bg-[#C5A059]", text: "text-white", border: "border-[#B48F48]" }, // Signature Gold
  { bg: "bg-[#2D2D2D]", text: "text-[#FAF6EE]", border: "border-[#1F1F1F]" }, // Deep Charcoal
  { bg: "bg-[#7A5C3E]", text: "text-white", border: "border-[#62472F]" }, // Warm Amber Brown
  { bg: "bg-[#4A6B5D]", text: "text-white", border: "border-[#3B574A]" }, // Forest Sage
  { bg: "bg-[#3D5A80]", text: "text-white", border: "border-[#293241]" }, // Regal Deep Blue
  { bg: "bg-[#8D5B4C]", text: "text-white", border: "border-[#724538]" }, // Terracotta
  { bg: "bg-[#5E503F]", text: "text-white", border: "border-[#493E31]" }, // Earth Taupe
];

export function getInitials(name: string): string {
  if (!name || !name.trim()) return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getPaletteForName(name: string) {
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTES.length;
  return COLOR_PALETTES[index];
}

const SIZE_CONFIGS = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 sm:w-9 sm:h-9 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 sm:w-14 sm:h-14 text-base sm:text-lg",
  xl: "w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl",
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  size = "md",
  className = "",
  bgColor,
  textColor,
}) => {
  const initials = getInitials(name);
  const palette = getPaletteForName(name);
  const sizeClasses = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;

  const finalBg = bgColor || palette.bg;
  const finalTextColor = textColor || palette.text;

  return (
    <div
      aria-label={name}
      className={`rounded-full shrink-0 flex items-center justify-center font-serif font-bold select-none border shadow-2xs transition-transform ${sizeClasses} ${finalBg} ${finalTextColor} ${palette.border} ${className}`}
    >
      <span>{initials}</span>
    </div>
  );
};
