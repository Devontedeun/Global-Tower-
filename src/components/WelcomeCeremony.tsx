import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Heart,
  Crown,
  Flame,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Volume2,
  VolumeX,
  RotateCw,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookMarked,
  CheckCircle2
} from "lucide-react";
import { Logo } from "./Logo";
import { achievementCelebrationService } from "../lib/achievementCelebrationService";

interface WelcomeCeremonyProps {
  userName: string;
  onComplete: () => void;
  totalDurationSeconds?: number; // 25-35s duration
}

// Pure SVG Dove with outspread wings, golden aura, and olive branch
const PeacefulWelcomeDove: React.FC<{ size?: number; flip?: boolean }> = ({ size = 52, flip = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: flip ? "scaleX(-1)" : undefined }}
    className="filter drop-shadow-[0_4px_16px_rgba(255,230,150,0.85)]"
  >
    <circle cx="50" cy="50" r="36" fill="url(#welcomeDoveAura)" opacity="0.45" />
    <g className="dove-flapping-wings" style={{ transformOrigin: "50px 48px" }}>
      <path
        d="M50 46 C42 22 25 12 10 16 C12 28 22 40 38 48 C42 49 46 48 50 46 Z"
        fill="url(#welcomeDoveFeatherLight)"
        stroke="#E6D3A3"
        strokeWidth="1.2"
      />
      <path
        d="M52 46 C60 22 77 12 92 16 C90 28 80 40 64 48 C60 49 56 48 52 46 Z"
        fill="url(#welcomeDoveFeatherLight)"
        stroke="#E6D3A3"
        strokeWidth="1.2"
      />
      <path d="M18 20 C28 28 36 38 44 46" stroke="#FAF6EE" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <path d="M84 20 C74 28 66 38 58 46" stroke="#FAF6EE" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
    </g>
    <path
      d="M50 36 C46 36 43 39 44 43 C44 46 46 50 48 58 C49 64 48 72 45 80 C48 82 54 82 57 80 C54 72 53 64 54 58 C56 50 58 46 58 43 C59 39 56 36 50 36 Z"
      fill="url(#welcomeDoveBodyGrad)"
      stroke="#E6D3A3"
      strokeWidth="1.2"
    />
    <path
      d="M45 78 C40 86 34 94 30 96 C42 94 50 90 51 82 C52 90 60 94 72 96 C68 94 62 86 57 78 Z"
      fill="url(#welcomeDoveFeatherLight)"
      stroke="#E6D3A3"
      strokeWidth="1.2"
    />
    <polygon points="50,34 52,38 48,38" fill="#F59E0B" />
    <circle cx="48" cy="41" r="1.2" fill="#2D2D2D" />
    <path d="M52 36 Q56 34 60 36 Q58 39 52 37" fill="#10B981" stroke="#059669" strokeWidth="0.6" />
    <defs>
      <radialGradient id="welcomeDoveAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.85" />
        <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="welcomeDoveFeatherLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#FDFCF9" />
        <stop offset="100%" stopColor="#F5EED9" />
      </linearGradient>
      <linearGradient id="welcomeDoveBodyGrad" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#FAF5E8" />
        <stop offset="100%" stopColor="#EFE6CB" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * 3D Medallion for Welcome Ceremony
 * Rotates gracefully on its central vertical axis at a slower, meditative pace
 * with metallic depth and glowing celestial halos.
 */
const WelcomeCentralAxisMedallion: React.FC<{
  stage: number;
  fastSpinTrigger: number;
}> = ({ stage, fastSpinTrigger }) => {
  const isFastSpinning = fastSpinTrigger > 0;

  // Icon corresponding to each scripture stage
  const currentIcon = () => {
    switch (stage) {
      case 1:
        return <Sparkles className="w-10 h-10 text-amber-200 animate-pulse" />;
      case 2:
        return <Heart className="w-10 h-10 text-rose-200 fill-rose-300/30" />;
      case 3:
        return <Crown className="w-10 h-10 text-amber-300" />;
      case 4:
      default:
        return <BookOpen className="w-10 h-10 text-amber-100" />;
    }
  };

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* Radiant Celestial Halo Behind Medallion */}
      <div className="absolute w-44 h-44 rounded-full bg-radial from-amber-300/45 via-amber-500/20 to-transparent blur-2xl pointer-events-none animate-pulse" />

      {/* Orbiting Sacred Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-40 h-40 rounded-full border border-amber-300/40 animate-spin"
          style={{ animationDuration: "20s" }}
        />
        <div
          className="w-48 h-48 rounded-full border border-amber-400/25 border-dashed animate-spin"
          style={{ animationDuration: "30s", animationDirection: "reverse" }}
        />
      </div>

      {/* THE 3D ROTATING MEDALLION ON CENTRAL VERTICAL AXIS */}
      <motion.div
        key={`stage-spin-${stage}-${fastSpinTrigger}`}
        initial={{ rotateY: 0 }}
        animate={
          isFastSpinning
            ? { rotateY: 1080 } // 3-second celebratory spin when triggered
            : { rotateY: [0, 360] } // Majestic slower continuous rotation (18s per full cycle)
        }
        transition={
          isFastSpinning
            ? {
                duration: 3.0,
                ease: [0.12, 0.95, 0.28, 1.0], // Decelerating halt after 3 seconds
              }
            : {
                repeat: Infinity,
                duration: 18,
                ease: "linear",
              }
        }
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
        className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl relative flex items-center justify-center cursor-pointer group"
      >
        {/* Front Embossed Face */}
        <div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#E2B755] via-[#C5A059] to-[#8C6B2D] border-4 border-[#FFF3D1] shadow-[0_12px_36px_rgba(197,160,89,0.55)] flex items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Inner Inset Rim */}
          <div className="absolute inset-1.5 rounded-2xl border-2 border-[#FFE8A3]/70 bg-gradient-to-tr from-amber-600/30 via-transparent to-white/20 pointer-events-none" />

          {/* Central Stage Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center text-white drop-shadow-md">
            {currentIcon()}
          </div>

          {/* Glint Sheen Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
        </div>

        {/* Back Embossed Face (For True 3D Rotation Symmetry) */}
        <div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#8C6B2D] via-[#C5A059] to-[#E2B755] border-4 border-[#FFF3D1] shadow-[0_12px_36px_rgba(197,160,89,0.55)] flex items-center justify-center overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="absolute inset-1.5 rounded-2xl border-2 border-[#FFE8A3]/70 bg-gradient-to-tr from-amber-600/30 via-transparent to-white/20 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center justify-center text-white drop-shadow-md">
            <Sparkles className="w-9 h-9 text-amber-200" />
            <span className="text-[9px] font-serif font-black uppercase tracking-widest mt-1 text-amber-100">
              GTC Sanctuary
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// 4 Curated Holy Scripture Illuminations for New Believers
interface ScriptureSlide {
  stage: number;
  badge: string;
  theme: string;
  verse: string;
  reference: string;
  reflection: string;
  colorClass: string;
}

const SANCTUARY_SCRIPTURES: ScriptureSlide[] = [
  {
    stage: 1,
    badge: "1/4 • Calling & Consecration",
    theme: "Ordered Steps of Divine Purpose",
    verse: "The steps of a good man are ordered by the Lord: and he delighteth in his way.",
    reference: "Psalm 37:23",
    reflection: "You have not arrived in this sanctuary by chance. The Lord Himself has ordered your steps into a blessed dwelling of faith, revelation, and prayer.",
    colorClass: "from-amber-500 to-amber-700",
  },
  {
    stage: 2,
    badge: "2/4 • Sanctuary Fellowship",
    theme: "The Living Presence of Christ",
    verse: "For where two or three are gathered together in my name, there am I in the midst of them.",
    reference: "Matthew 18:20",
    reflection: "As you unite with believers worldwide across this platform, Christ promises His holy presence in our midst to guide, heal, and strengthen your soul.",
    colorClass: "from-emerald-500 to-emerald-700",
  },
  {
    stage: 3,
    badge: "3/4 • Kingdom Dominion & Light",
    theme: "Arise in Heavenly Authority",
    verse: "Arise, shine; for thy light is come, and the glory of the Lord is risen upon thee.",
    reference: "Isaiah 60:1",
    reflection: "Step boldly into the Kingdom of God. Every chapter studied, note written, and prayer offered will illuminate your spiritual walk with victory.",
    colorClass: "from-amber-600 to-yellow-600",
  },
  {
    stage: 4,
    badge: "4/4 • The Apostolic Benediction",
    theme: "Aaronic Blessing of Eternal Peace",
    verse: "The Lord bless you and keep you; The Lord make his face shine upon you and be gracious to you; The Lord lift up his countenance upon you, and give you peace.",
    reference: "Numbers 6:24–26",
    reflection: "May the grace of our Lord Jesus Christ, the love of the Father, and the sweet fellowship of the Holy Spirit dwell richly with you always. Amen.",
    colorClass: "from-[#C5A059] to-[#8C6B2D]",
  },
];

export const WelcomeCeremony: React.FC<WelcomeCeremonyProps> = ({
  userName,
  onComplete,
  totalDurationSeconds = 30, // Default 30 seconds (within 25-35s requested)
}) => {
  // Configurable 25s, 30s, or 35s duration
  const [ceremonyDuration, setCeremonyDuration] = useState<number>(() => {
    if (totalDurationSeconds >= 25 && totalDurationSeconds <= 35) {
      return totalDurationSeconds;
    }
    return 30; // 30s optimal balance
  });

  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [fastSpinTrigger, setFastSpinTrigger] = useState(0);
  const hasCompletedRef = useRef(false);

  // Trigger heavenly sound upon initial entrance
  useEffect(() => {
    achievementCelebrationService.playHeavenlySound();
  }, []);

  // Timer loop for the 25-35s ceremony
  useEffect(() => {
    if (isPaused) return;

    const intervalMs = 100;
    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + intervalMs / 1000;

        // Synchronize stage based on total duration divided across 4 scriptures
        const stageDuration = ceremonyDuration / 4;
        const computedIndex = Math.min(3, Math.floor(next / stageDuration));
        setCurrentSlideIndex((prevIdx) => {
          if (prevIdx !== computedIndex) {
            // Play a gentle sound on slide transition
            if (!isMuted) {
              achievementCelebrationService.playHeavenlySound();
            }
            return computedIndex;
          }
          return prevIdx;
        });

        if (next >= ceremonyDuration) {
          clearInterval(timer);
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            setTimeout(onComplete, 600);
          }
          return ceremonyDuration;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [ceremonyDuration, isPaused, isMuted, onComplete]);

  const progressPercent = Math.min(100, Math.round((elapsed / ceremonyDuration) * 100));
  const secondsRemaining = Math.max(0, Math.ceil(ceremonyDuration - elapsed));
  const activeSlide = SANCTUARY_SCRIPTURES[currentSlideIndex] || SANCTUARY_SCRIPTURES[0];
  const displayName = userName.trim() || "Beloved Believer";

  const handleSkip = () => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      achievementCelebrationService.playHeavenlySound();
      onComplete();
    }
  };

  const handleManualSlide = (newIndex: number) => {
    const clamped = Math.max(0, Math.min(3, newIndex));
    setCurrentSlideIndex(clamped);
    setElapsed((clamped * ceremonyDuration) / 4);
    if (!isMuted) {
      achievementCelebrationService.playHeavenlySound();
    }
  };

  const handleTriggerFastSpin = () => {
    setFastSpinTrigger((prev) => prev + 1);
    if (!isMuted) {
      achievementCelebrationService.playHeavenlySound();
    }
  };

  // Staggered dove coordinates & motion tracks (floating gently down)
  const doves = [
    { id: 1, leftPercent: 12, delay: 0.2, duration: 8.5, size: 52, flip: false },
    { id: 2, leftPercent: 30, delay: 3.5, duration: 9.0, size: 44, flip: true },
    { id: 3, leftPercent: 48, delay: 1.0, duration: 8.0, size: 62, flip: false },
    { id: 4, leftPercent: 70, delay: 4.8, duration: 8.8, size: 48, flip: true },
    { id: 5, leftPercent: 86, delay: 2.2, duration: 9.2, size: 50, flip: false },
  ];

  // Golden celestial sparkles / motes
  const sparkles = [
    { id: 1, left: "14%", delay: 0.2, duration: 5.8, size: 8 },
    { id: 2, left: "26%", delay: 1.6, duration: 6.2, size: 10 },
    { id: 3, left: "42%", delay: 0.8, duration: 5.5, size: 12 },
    { id: 4, left: "58%", delay: 2.4, duration: 6.5, size: 14 },
    { id: 5, left: "72%", delay: 1.2, duration: 5.7, size: 9 },
    { id: 6, left: "84%", delay: 2.0, duration: 6.1, size: 11 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F0] dark:bg-[#0D131F] text-[#2D2D2D] dark:text-white font-sans flex flex-col justify-between overflow-hidden selection:bg-[#C5A059] selection:text-white">
      {/* 1. CELESTIAL GOD RAYS STREAMING DOWN FROM HEAVEN (Same as Achievements) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Divine Source Glow at Very Top */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[140vw] h-72 bg-radial from-amber-200/55 via-[#C5A059]/25 to-transparent blur-3xl opacity-90 animate-pulse" />

        {/* Central Vertical Pillar of Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 sm:w-[480px] h-[115vh] bg-linear-to-b from-amber-100/40 via-amber-200/15 to-transparent blur-2xl god-rays-beam" />

        {/* Diagonal Ray 1: Leftward Tilt */}
        <div
          className="absolute -top-20 left-[12%] w-56 sm:w-72 h-[120vh] bg-linear-to-b from-amber-100/30 via-[#FDE68A]/12 to-transparent blur-xl god-rays-beam"
          style={{ transform: "rotate(-18deg)", transformOrigin: "top left", animationDelay: "0.2s" }}
        />

        {/* Diagonal Ray 2: Leftward Angle */}
        <div
          className="absolute -top-20 left-[30%] w-64 sm:w-80 h-[120vh] bg-linear-to-b from-white/40 via-amber-200/18 to-transparent blur-xl god-rays-beam"
          style={{ transform: "rotate(-9deg)", transformOrigin: "top left", animationDelay: "0.6s" }}
        />

        {/* Diagonal Ray 3: Rightward Angle */}
        <div
          className="absolute -top-20 right-[30%] w-64 sm:w-80 h-[120vh] bg-linear-to-b from-white/40 via-amber-200/18 to-transparent blur-xl god-rays-beam"
          style={{ transform: "rotate(9deg)", transformOrigin: "top right", animationDelay: "0.4s" }}
        />

        {/* Diagonal Ray 4: Rightward Tilt */}
        <div
          className="absolute -top-20 right-[12%] w-56 sm:w-72 h-[120vh] bg-linear-to-b from-amber-100/30 via-[#FDE68A]/12 to-transparent blur-xl god-rays-beam"
          style={{ transform: "rotate(18deg)", transformOrigin: "top right", animationDelay: "0.8s" }}
        />

        {/* Ambient warm radiance filter */}
        <div className="absolute inset-0 bg-linear-to-b from-amber-100/15 dark:from-amber-950/20 via-transparent to-transparent mix-blend-screen" />
      </div>

      {/* 2. GOLDEN SPARKLES / CELESTIAL MOTES DRIFTING DOWN */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparkles.map((sp) => (
          <motion.div
            key={`sparkle-${sp.id}`}
            initial={{ y: -20, opacity: 0, scale: 0.5 }}
            animate={{
              y: ["-5vh", "105vh"],
              opacity: [0, 0.9, 0.9, 0],
              scale: [0.6, 1.2, 0.9, 0.4],
              x: [0, (sp.id % 2 === 0 ? 30 : -30), 0],
            }}
            transition={{
              duration: sp.duration,
              delay: sp.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ left: sp.left }}
            className="absolute top-0 pointer-events-none"
          >
            <div
              style={{ width: sp.size, height: sp.size }}
              className="rounded-full bg-linear-to-tr from-amber-300 via-amber-100 to-white shadow-[0_0_12px_#FDE68A]"
            />
          </motion.div>
        ))}
      </div>

      {/* 3. PEACEFUL DOVES GLIDING DOWN WITH OLIVE BRANCHES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {doves.map((d) => (
          <motion.div
            key={`dove-${d.id}`}
            initial={{ y: -80, opacity: 0 }}
            animate={{
              y: ["-10vh", "110vh"],
              opacity: [0, 0.95, 0.95, 0],
              x: [0, (d.flip ? -50 : 50), 0],
            }}
            transition={{
              duration: d.duration,
              delay: d.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ left: `${d.leftPercent}%` }}
            className="absolute top-0 pointer-events-none z-10"
          >
            <PeacefulWelcomeDove size={d.size} flip={d.flip} />
          </motion.div>
        ))}
      </div>

      {/* Top Header Bar with Sanctuary Controls */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-[#E5E0D5]/70 dark:border-slate-800 bg-white/75 dark:bg-[#121A2B]/80 backdrop-blur-md shadow-2xs">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#E5E0D5] dark:border-slate-700">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8F702E] dark:text-amber-400 font-serif">
              Consecration Ceremony
            </span>
            <span className="text-stone-300 dark:text-slate-600">•</span>
            <span className="text-xs text-[#7A7468] dark:text-slate-400">
              Welcome, <strong className="text-[#2D2D2D] dark:text-white">{displayName}</strong>
            </span>
          </div>
        </div>

        {/* Ceremony Speed / Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Duration Selector: 25s, 30s, 35s */}
          <div className="hidden sm:flex items-center gap-1 bg-[#FAF6EE] dark:bg-slate-800/80 p-1 rounded-full border border-[#E5E0D5] dark:border-slate-700 text-[11px]">
            <span className="px-2 font-bold text-[#8F702E] dark:text-amber-300 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Duration:</span>
            </span>
            {[25, 30, 35].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => {
                  setCeremonyDuration(sec);
                  setElapsed(0);
                }}
                className={`px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                  ceremonyDuration === sec
                    ? "bg-[#2D2D2D] dark:bg-white text-white dark:text-[#162033] shadow-xs"
                    : "text-[#7A7468] dark:text-slate-300 hover:text-[#2D2D2D] dark:hover:text-white"
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>

          {/* Pause / Meditate Button to read scripture without rushing */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isPaused
                ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                : "bg-white dark:bg-slate-800 text-[#7A7468] dark:text-slate-300 border-[#E5E0D5] dark:border-slate-700 hover:border-amber-400"
            }`}
            title={isPaused ? "Resume ceremony countdown" : "Pause countdown to take your time reading"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPaused ? "Resume Timer" : "Pause to Read"}</span>
          </button>

          {/* Heavenly Sound Replay / Mute Controls */}
          <button
            type="button"
            onClick={() => {
              const nextMute = !isMuted;
              setIsMuted(nextMute);
              if (!nextMute) {
                achievementCelebrationService.playHeavenlySound();
              }
            }}
            className="p-2 rounded-full hover:bg-stone-200/60 dark:hover:bg-slate-800 text-[#7A7468] dark:text-slate-300 transition-colors cursor-pointer"
            title={isMuted ? "Unmute heavenly sound" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-[#C5A059]" />}
          </button>

          {/* Skip / Enter Sanctuary Button */}
          <button
            type="button"
            id="btn-welcome-enter-now"
            onClick={handleSkip}
            className="px-4 py-1.5 bg-[#FAF6EE] dark:bg-slate-800 hover:bg-[#F2E8D5] dark:hover:bg-slate-700 text-[#8F702E] dark:text-amber-300 border border-[#C5A059]/40 dark:border-amber-700/50 rounded-full text-xs font-bold font-serif uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <span>Enter Sanctuary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Center Stage: Slower 3D Rotating Medallion & Scripture Reading Sanctuary */}
      <main className="relative z-20 flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-center">
        {/* The 3D Medallion Rotating Gracefully on its Central Vertical Axis */}
        <div className="mb-4 sm:mb-6 flex flex-col items-center">
          <WelcomeCentralAxisMedallion
            stage={activeSlide.stage}
            fastSpinTrigger={fastSpinTrigger}
          />
          <button
            type="button"
            onClick={handleTriggerFastSpin}
            className="mt-3 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-[#E5E0D5] dark:border-slate-700 text-[11px] font-bold text-[#8F702E] dark:text-amber-300 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer backdrop-blur-xs"
            title="Spin on central axis for 3 seconds with heavenly sound"
          >
            <RotateCw className="w-3 h-3 text-[#C5A059]" />
            <span>Spin Seal & Heavenly Chime</span>
          </button>
        </div>

        {/* The Scripture Reading Sanctuary Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`scripture-card-${activeSlide.stage}`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full bg-white/95 dark:bg-[#151F33]/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#E5E0D5] dark:border-slate-700 shadow-xl space-y-5 text-center relative overflow-hidden"
          >
            {/* Top Badge & Scripture Index */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E0D5]/60 dark:border-slate-800 pb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <BookMarked className="w-3.5 h-3.5" />
                <span>{activeSlide.badge}</span>
              </div>

              <div className="text-xs font-serif font-bold text-[#8F702E] dark:text-amber-400 flex items-center gap-1">
                <span>{activeSlide.theme}</span>
              </div>
            </div>

            {/* Sacred Scripture Quote (Generous reading size & typography) */}
            <div className="space-y-3 py-1">
              <blockquote className="text-lg sm:text-2xl font-serif italic text-[#2D2D2D] dark:text-slate-100 leading-relaxed max-w-2xl mx-auto">
                “{activeSlide.verse}”
              </blockquote>
              <div className="inline-block px-3 py-0.5 rounded-full bg-[#FAF6EE] dark:bg-slate-800 border border-[#C5A059]/40 text-xs font-bold font-mono text-[#8F702E] dark:text-amber-300 uppercase tracking-wider">
                — {activeSlide.reference}
              </div>
            </div>

            {/* Spiritual Reflection / Meaning */}
            <p className="text-xs sm:text-sm text-[#7A7468] dark:text-slate-300 max-w-xl mx-auto leading-relaxed border-t border-[#E5E0D5]/60 dark:border-slate-800 pt-3">
              {activeSlide.reflection}
            </p>

            {/* Manual Scripture Navigation Controls (< Previous | Next >) */}
            <div className="pt-2 flex items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={() => handleManualSlide(currentSlideIndex - 1)}
                disabled={currentSlideIndex === 0}
                className="px-3 py-1.5 rounded-xl border border-[#E5E0D5] dark:border-slate-700 text-[#7A7468] dark:text-slate-300 hover:text-[#2D2D2D] dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Scripture</span>
              </button>

              {/* 4 Scripture Pagination Dots */}
              <div className="flex items-center gap-1.5">
                {SANCTUARY_SCRIPTURES.map((item, idx) => (
                  <button
                    key={item.stage}
                    type="button"
                    onClick={() => handleManualSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentSlideIndex
                        ? "w-7 bg-linear-to-r from-[#C5A059] to-[#D4AF37]"
                        : "bg-[#E5E0D5] dark:bg-slate-700 hover:bg-amber-400"
                    }`}
                    title={`Go to scripture ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (currentSlideIndex < 3) {
                    handleManualSlide(currentSlideIndex + 1);
                  } else {
                    handleSkip();
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-linear-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 text-[#18140D] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
              >
                <span>{currentSlideIndex < 3 ? "Next Scripture" : "Enter Sanctuary"}</span>
                {currentSlideIndex < 3 ? <ChevronRight className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Progress Bar & Stage Indicator */}
      <footer className="relative z-20 w-full max-w-xl mx-auto px-6 pb-6 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-serif text-[#7A7468] dark:text-slate-400">
          <span className="font-bold text-[#8F702E] dark:text-amber-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Scripture {currentSlideIndex + 1} of 4 • {activeSlide.reference}</span>
          </span>
          <span className="font-mono text-stone-500 dark:text-slate-400">
            {isPaused ? "Paused" : `${secondsRemaining}s remaining`} • {progressPercent}%
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-1.5 bg-[#E5E0D5] dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-[#C5A059] via-[#E3C584] to-[#C5A059] rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={handleSkip}
            className="text-[11px] font-serif text-[#8A8478] dark:text-slate-400 hover:text-[#C5A059] dark:hover:text-amber-300 underline cursor-pointer"
          >
            Finished reading? Click here to enter sanctuary immediately
          </button>
        </div>
      </footer>
    </div>
  );
};
