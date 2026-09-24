import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { WatchdogApprovalData } from "../lib/watchdogApprovalService";
import { isCurrentAdminUser } from "../lib/storage";

// Pristine SVG Dove with anatomically proportioned outspread wings & tail
const DoveGraphic: React.FC<{ size?: number; flip?: boolean }> = ({ size = 56, flip = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: flip ? "scaleX(-1)" : undefined }}
    className="filter drop-shadow-[0_4px_16px_rgba(255,230,150,0.9)]"
  >
    {/* Holy Golden Aura Behind Dove */}
    <circle cx="50" cy="50" r="36" fill="url(#doveAura)" opacity="0.45" />

    {/* Flapping Wings Group */}
    <g className="dove-flapping-wings" style={{ transformOrigin: "50px 48px" }}>
      {/* Left / Upper Wing */}
      <path
        d="M50 46 C42 22 25 12 10 16 C12 28 22 40 38 48 C42 49 46 48 50 46 Z"
        fill="url(#doveFeatherLight)"
        stroke="#E6D3A3"
        strokeWidth="1.2"
      />
      {/* Right / Upper Wing */}
      <path
        d="M52 46 C60 22 77 12 92 16 C90 28 80 40 64 48 C60 49 56 48 52 46 Z"
        fill="url(#doveFeatherLight)"
        stroke="#E6D3A3"
        strokeWidth="1.2"
      />
      {/* Wing Feather Ridges */}
      <path d="M18 20 C28 28 36 38 44 46" stroke="#FAF6EE" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <path d="M84 20 C74 28 66 38 58 46" stroke="#FAF6EE" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
    </g>

    {/* Dove Body & Head */}
    <path
      d="M50 36 C46 36 43 39 44 43 C44 46 46 50 48 58 C49 64 48 72 45 80 C48 82 54 82 57 80 C54 72 53 64 54 58 C56 50 58 46 58 43 C59 39 56 36 50 36 Z"
      fill="url(#doveBodyGrad)"
      stroke="#E6D3A3"
      strokeWidth="1.2"
    />

    {/* Dove Fanned Tail Feathers */}
    <path
      d="M45 78 C40 86 34 94 30 96 C42 94 50 90 51 82 C52 90 60 94 72 96 C68 94 62 86 57 78 Z"
      fill="url(#doveFeatherLight)"
      stroke="#E6D3A3"
      strokeWidth="1"
    />

    {/* Peaceful Beak & Olive Branch */}
    <polygon points="50,34 52,38 48,38" fill="#F59E0B" />
    <circle cx="48" cy="41" r="1.2" fill="#2D2D2D" />
    <path d="M52 36 Q56 34 60 36 Q58 39 52 37" fill="#10B981" stroke="#059669" strokeWidth="0.6" />

    {/* Gradient Definitions */}
    <defs>
      <radialGradient id="doveAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
        <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="doveFeatherLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#FDFCF9" />
        <stop offset="100%" stopColor="#F5EED9" />
      </linearGradient>
      <linearGradient id="doveBodyGrad" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#FAF5E8" />
        <stop offset="100%" stopColor="#EFE6CB" />
      </linearGradient>
    </defs>
  </svg>
);

interface WatchdogApprovalOverlayProps {
  isAdmin?: boolean;
}

export const WatchdogApprovalOverlay: React.FC<WatchdogApprovalOverlayProps> = ({ isAdmin }) => {
  const [activeApproval, setActiveApproval] = useState<WatchdogApprovalData | null>(null);

  const authorized = isAdmin ?? isCurrentAdminUser();

  useEffect(() => {
    if (!authorized) return;

    const handleApproval = (e: any) => {
      const data: WatchdogApprovalData = e.detail || {
        pingCount: 1,
        score: 100,
        latencyMs: 15,
        serverUptimeSeconds: 3600,
        timestamp: Date.now(),
        message: "5-Minute Watchdog Ping Approved",
        source: "periodic_5m_ping",
      };

      setActiveApproval(data);

      // Auto-dismiss after full animation concludes (~5.8s)
      const timer = setTimeout(() => {
        setActiveApproval((current) => (current?.timestamp === data.timestamp ? null : current));
      }, 5800);

      return () => clearTimeout(timer);
    };

    window.addEventListener("gtc_watchdog_approval_event", handleApproval);
    return () => {
      window.removeEventListener("gtc_watchdog_approval_event", handleApproval);
    };
  }, [authorized]);

  if (!authorized || !activeApproval) return null;

  // Staggered dove coordinates & motion tracks
  const doves = [
    { id: 1, leftPercent: 12, delay: 0.1, duration: 4.8, size: 58, driftX: 30, flip: false },
    { id: 2, leftPercent: 28, delay: 0.5, duration: 5.2, size: 48, driftX: -25, flip: true },
    { id: 3, leftPercent: 46, delay: 0.2, duration: 4.5, size: 68, driftX: 20, flip: false }, // Central flagship dove
    { id: 4, leftPercent: 64, delay: 0.7, duration: 5.0, size: 52, driftX: -35, flip: true },
    { id: 5, leftPercent: 82, delay: 0.35, duration: 4.7, size: 54, driftX: 25, flip: false },
    { id: 6, leftPercent: 36, delay: 1.1, duration: 4.9, size: 42, driftX: -15, flip: false },
    { id: 7, leftPercent: 74, delay: 1.3, duration: 4.6, size: 44, driftX: 30, flip: true },
  ];

  // Golden celestial sparkles / motes
  const sparkles = [
    { id: 1, left: "15%", delay: 0.2, duration: 3.8, size: 6 },
    { id: 2, left: "25%", delay: 0.6, duration: 4.2, size: 8 },
    { id: 3, left: "38%", delay: 0.1, duration: 3.5, size: 10 },
    { id: 4, left: "50%", delay: 0.4, duration: 4.5, size: 12 },
    { id: 5, left: "62%", delay: 0.8, duration: 3.7, size: 8 },
    { id: 6, left: "75%", delay: 0.3, duration: 4.1, size: 9 },
    { id: 7, left: "88%", delay: 0.5, duration: 3.9, size: 7 },
  ];

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden select-none">
      {/* 1. CELESTIAL GOD RAYS STREAMING DOWN FROM HEAVEN */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Divine Source Glow at Very Top */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[140vw] h-64 bg-radial from-amber-200/55 via-[#C5A059]/25 to-transparent blur-3xl opacity-90 animate-pulse" />

        {/* Central Vertical Pillar of Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-[110vh] bg-linear-to-b from-amber-100/40 via-amber-200/15 to-transparent blur-2xl god-rays-beam" />

        {/* Diagonal Ray 1: Leftward Tilt */}
        <div
          className="absolute -top-20 left-[15%] w-48 sm:w-64 h-[120vh] bg-linear-to-b from-amber-100/35 via-[#FDE68A]/15 to-transparent blur-xl god-rays-beam"
          style={{ transform: "rotate(-18deg)", transformOrigin: "top left", animationDelay: "0.2s" }}
        />

        {/* Diagonal Ray 2: Leftward Wide Angle */}
        <div
          className="absolute -top-20 left-[32%] w-56 sm:w-72 h-[120vh] bg-linear-to-b from-white/45 via-amber-200/20 to-transparent blur-xl god-rays-beam"
          style={{ transform: "rotate(-9deg)", transformOrigin: "top left", animationDelay: "0.6s" }}
        />

        {/* Diagonal Ray 3: Rightward Wide Angle */}
        <div
          className="absolute -top-20 right-[32%] w-56 sm:w-72 h-[120vh] bg-linear-to-b from-white/45 via-amber-200/20 to-transparent blur-xl god-rays-beam"
          style={{ transform: "rotate(9deg)", transformOrigin: "top right", animationDelay: "0.4s" }}
        />

        {/* Diagonal Ray 4: Rightward Tilt */}
        <div
          className="absolute -top-20 right-[15%] w-48 sm:w-64 h-[120vh] bg-linear-to-b from-amber-100/35 via-[#FDE68A]/15 to-transparent blur-xl god-rays-beam"
          style={{ transform: "rotate(18deg)", transformOrigin: "top right", animationDelay: "0.8s" }}
        />

        {/* Radiance Overlay to cast warm reverent light across viewport */}
        <div className="absolute inset-0 bg-linear-to-b from-amber-100/15 via-transparent to-transparent mix-blend-screen" />
      </div>

      {/* 2. GOLDEN SPARKLES / CELESTIAL MOTES DRIFTING DOWN */}
      {sparkles.map((sp) => (
        <motion.div
          key={`sparkle-${sp.id}`}
          initial={{ y: -20, opacity: 0, scale: 0.5 }}
          animate={{ y: "105vh", opacity: [0, 0.9, 0.8, 0], scale: [0.5, 1.2, 1] }}
          transition={{ duration: sp.duration, delay: sp.delay, ease: "easeInOut" }}
          style={{ left: sp.left, width: sp.size, height: sp.size }}
          className="absolute rounded-full bg-amber-200 shadow-[0_0_12px_#F59E0B] pointer-events-none"
        />
      ))}

      {/* 3. WHITE DOVES / PIGEONS FLOATING DOWNWARD */}
      {doves.map((dove) => (
        <motion.div
          key={`dove-${dove.id}`}
          initial={{
            y: -90,
            x: 0,
            opacity: 0,
            rotate: dove.flip ? 8 : -8,
            scale: 0.8,
          }}
          animate={{
            y: "115vh",
            x: [0, dove.driftX, -dove.driftX * 0.7, dove.driftX * 0.5, 0],
            opacity: [0, 1, 1, 1, 0],
            rotate: dove.flip ? [8, -4, 6, -3, 5] : [-8, 4, -6, 3, -5],
            scale: [0.8, 1, 1, 0.95, 0.9],
          }}
          transition={{
            duration: dove.duration,
            delay: dove.delay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{
            position: "absolute",
            left: `${dove.leftPercent}%`,
            top: 0,
          }}
          className="pointer-events-none"
        >
          <DoveGraphic size={dove.size} flip={dove.flip} />
        </motion.div>
      ))}

      {/* 4. SUPER ADMIN APPROVAL CONFIRMATION BANNER */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative bg-[#19150E]/95 text-[#FDFCF9] border-2 border-[#C5A059] rounded-2xl p-4 shadow-[0_10px_40px_rgba(197,160,89,0.35)] backdrop-blur-xl overflow-hidden"
        >
          {/* Subtle golden shimmer gradient line on top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#FDE68A] to-transparent animate-pulse" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/60 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                <ShieldCheck className="w-6 h-6 text-amber-300 fill-amber-400/30" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-sm flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    APPROVED • 100% OPTIMAL
                  </span>
                  <span className="text-[10px] font-mono text-[#C5A059]">
                    PING #{activeApproval.pingCount}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#FDFCF9] mt-0.5 flex items-center gap-1.5">
                  <span>Sanctuary Watchdog Heartbeat Approved</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h4>
              </div>
            </div>

            <button
              onClick={() => setActiveApproval(null)}
              className="text-[#A89F91] hover:text-[#FDFCF9] p-1 rounded-lg transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#E5E0D5]/90 mt-2 leading-relaxed">
            {activeApproval.message || "5-minute heartbeat verified. God rays and peaceful doves confirmed all sanctuary services in reverent health."}
          </p>

          <div className="mt-3 pt-2.5 border-t border-[#C5A059]/30 flex items-center justify-between text-[11px] font-mono text-[#C5A059]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Next Ping in 5m
            </span>
            <span>
              Latency: {activeApproval.latencyMs !== null && activeApproval.latencyMs !== undefined ? `${activeApproval.latencyMs}ms` : "Optimal"}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
