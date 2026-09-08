import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textColor?: string;
  orientation?: "horizontal" | "vertical";
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  textColor = "text-[#2D2D2D]",
  orientation = "horizontal",
}) => {
  const sizeMap = {
    sm: { icon: 32, title: "text-sm sm:text-base font-black tracking-tight", sub: "text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em]" },
    md: { icon: 42, title: "text-lg sm:text-xl md:text-2xl font-black tracking-tight", sub: "text-xs sm:text-sm font-extrabold tracking-[0.25em]" },
    lg: { icon: 56, title: "text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight", sub: "text-sm sm:text-base font-black tracking-[0.28em]" },
    xl: { icon: 72, title: "text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight", sub: "text-base sm:text-lg lg:text-xl font-black tracking-[0.32em]" },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      id="gtc-brand-logo"
      className={`inline-flex ${
        orientation === "vertical" ? "flex-col items-center text-center gap-2.5" : "items-center gap-3.5"
      } ${className}`}
    >
      {/* Icon: Cross over Globe with Artisanal Gold Radiance */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xs transition-transform duration-300 hover:scale-105"
        >
          {/* Subtle Divine Halo / Radiance */}
          <circle cx="50" cy="50" r="46" fill="#FDFCF9" />
          <circle cx="50" cy="50" r="44" stroke="#E5E0D5" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="40" stroke="#C5A059" strokeWidth="0.75" opacity="0.4" />

          {/* Globe Outline & Meridians */}
          <circle cx="50" cy="62" r="27" stroke="#C5A059" strokeWidth="2" fill="#F9F7F2" />
          
          {/* Globe Latitude Lines */}
          <ellipse cx="50" cy="62" rx="27" ry="11" stroke="#C5A059" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
          <ellipse cx="50" cy="62" rx="27" ry="20" stroke="#C5A059" strokeWidth="0.75" opacity="0.4" />
          <line x1="23" y1="62" x2="77" y2="62" stroke="#C5A059" strokeWidth="1.2" opacity="0.8" />
          <line x1="50" y1="35" x2="50" y2="89" stroke="#C5A059" strokeWidth="1.2" opacity="0.6" />

          {/* Stylized Continents */}
          <path
            d="M40 54 Q45 50 49 55 Q53 60 48 66 Q42 68 40 54 Z"
            fill="#C5A059"
            opacity="0.25"
          />
          <path
            d="M58 58 Q64 56 66 62 Q63 68 59 66 Z"
            fill="#C5A059"
            opacity="0.25"
          />

          {/* The Cross positioned with victory and dominion */}
          <path
            d="M46 12 H54 V26 H68 V34 H54 V72 H46 V34 H32 V26 H46 V12 Z"
            fill="url(#artisticGoldGradient)"
            filter="drop-shadow(0 2px 5px rgba(197, 160, 89, 0.35))"
          />

          {/* Inner Cross Highlight */}
          <path
            d="M48.5 15 H51.5 V28 H65 V32 H51.5 V69 H48.5 V32 H35 V28 H48.5 V15 Z"
            fill="#FFFFFF"
            opacity="0.85"
          />

          {/* Pinnacle Light */}
          <circle cx="50" cy="12" r="2.5" fill="#FAF6EE" stroke="#C5A059" strokeWidth="1" />
          
          <defs>
            <linearGradient id="artisticGoldGradient" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D9B76E" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#A8823B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none select-none">
          <span className={`font-serif font-black tracking-tight text-[#C5A059] uppercase drop-shadow-[0_1px_2px_rgba(197,160,89,0.3)] ${currentSize.title}`}>
            GLOBAL TOWER
          </span>
          <span className={`font-serif font-black tracking-widest text-[#2D2D2D] uppercase mt-0.5 ${currentSize.sub}`}>
            OF CHRIST
          </span>
        </div>
      )}
    </div>
  );
};

