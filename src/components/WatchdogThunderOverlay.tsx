import React, { useState, useEffect } from "react";
import { Zap, ShieldAlert, Sparkles } from "lucide-react";

interface ThunderEventData {
  intensity?: "normal" | "intense" | "apocalyptic";
  incident?: any;
  timestamp: number;
}

export const WatchdogThunderOverlay: React.FC = () => {
  const [activeThunder, setActiveThunder] = useState<ThunderEventData | null>(null);

  useEffect(() => {
    const handleThunder = (e: any) => {
      const data: ThunderEventData = e.detail || { timestamp: Date.now() };
      setActiveThunder(data);

      // Auto clear after animation completes
      const duration = data.intensity === "apocalyptic" ? 2400 : 1800;
      setTimeout(() => {
        setActiveThunder((current) => (current?.timestamp === data.timestamp ? null : current));
      }, duration);
    };

    window.addEventListener("gtc_watchdog_thunder_event", handleThunder);
    return () => {
      window.removeEventListener("gtc_watchdog_thunder_event", handleThunder);
    };
  }, []);

  if (!activeThunder) return null;

  const isApocalyptic = activeThunder.intensity === "apocalyptic";

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none">
      {/* 1. Full-Screen Strobe Lightning Flash */}
      <div
        className={`absolute inset-0 bg-linear-to-b from-white via-amber-100/90 to-amber-200/80 lightning-flash-overlay ${
          isApocalyptic ? "opacity-95" : "opacity-90"
        }`}
      />

      {/* 2. Electric Cyan / Divine Gold Arc Tint for dramatic atmospheric depth */}
      <div className="absolute inset-0 bg-[#C5A059]/20 mix-blend-color-dodge lightning-flash-overlay" />

      {/* 3. Expanding Seismic Thunder Shockwave Ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 rounded-full border-4 border-[#C5A059] thunder-shockwave-ring" />
      </div>

      {/* 4. Cinematic Lightning Bolt SVG Display */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
        <div className="relative animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400/30 backdrop-blur-md border border-amber-300/80 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.8)]">
            <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-white fill-amber-300 drop-shadow-[0_0_20px_rgba(255,255,255,1)]" />
          </div>

          <div className="mt-3 px-4 py-1.5 rounded-full bg-[#19150E]/90 border border-amber-400 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase shadow-2xl flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Watchdog Thunder Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
