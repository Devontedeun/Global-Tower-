import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Award,
  BookOpen,
  Heart,
  Search,
  ShieldCheck,
  Sun,
  Flame,
  Shield,
  Crown,
  FileText,
  Bookmark,
  BookMarked,
  Volume2,
  Headphones,
  Music,
  UserCheck,
  Compass,
  Moon,
  RotateCw,
  X,
  VolumeX,
  ChevronRight,
  Share2
} from "lucide-react";
import { Achievement } from "../data/achievementsData";
import {
  achievementCelebrationService,
  AchievementCelebrationEvent
} from "../lib/achievementCelebrationService";

// Helper to render the appropriate Lucide icon for each achievement
export const renderAchievementIcon = (iconName: string, className = "w-10 h-10") => {
  switch (iconName) {
    case "BookOpen":
      return <BookOpen className={className} />;
    case "Heart":
      return <Heart className={className} />;
    case "Search":
      return <Search className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    case "Award":
      return <Award className={className} />;
    case "Sun":
      return <Sun className={className} />;
    case "Flame":
      return <Flame className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "Shield":
      return <Shield className={className} />;
    case "Crown":
      return <Crown className={className} />;
    case "FileText":
      return <FileText className={className} />;
    case "Bookmark":
      return <Bookmark className={className} />;
    case "BookMarked":
      return <BookMarked className={className} />;
    case "Volume2":
      return <Volume2 className={className} />;
    case "Headphones":
      return <Headphones className={className} />;
    case "Music":
      return <Music className={className} />;
    case "UserCheck":
      return <UserCheck className={className} />;
    case "Compass":
      return <Compass className={className} />;
    case "Moon":
      return <Moon className={className} />;
    default:
      return <Award className={className} />;
  }
};

/**
 * 3D Achievement Medallion Component
 * Rotates on its central vertical axis for exactly 3 seconds, then comes to a graceful, motionless halt.
 */
export const RotatingAchievementMedallion: React.FC<{
  achievement: Achievement;
  spinTrigger: number; // Increment to re-spin for 3 seconds
  size?: "md" | "lg" | "xl";
  onSpinEnd?: () => void;
}> = ({ achievement, spinTrigger, size = "lg", onSpinEnd }) => {
  const [isSpinning, setIsSpinning] = useState(true);

  useEffect(() => {
    setIsSpinning(true);
    const timer = setTimeout(() => {
      setIsSpinning(false);
      onSpinEnd?.();
    }, 3000); // Halts rotation at exactly 3.0 seconds

    return () => clearTimeout(timer);
  }, [spinTrigger, onSpinEnd]);

  const sizeStyles = {
    md: { box: "w-24 h-24", icon: "w-12 h-12", rim: "border-4", ring: "w-32 h-32" },
    lg: { box: "w-36 h-36", icon: "w-16 h-16", rim: "border-4", ring: "w-48 h-48" },
    xl: { box: "w-44 h-44", icon: "w-20 h-20", rim: "border-6", ring: "w-56 h-56" },
  }[size];

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* Radiant Celestial Halo Behind Medal */}
      <div
        className={`absolute ${sizeStyles.ring} rounded-full bg-radial from-amber-300/40 via-amber-500/15 to-transparent blur-xl pointer-events-none transition-all duration-700 ${
          isSpinning ? "scale-125 opacity-100 animate-pulse" : "scale-100 opacity-70"
        }`}
      />

      {/* Orbiting Celestial Sparks when spinning */}
      {isSpinning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full border border-amber-300/30 animate-spin" style={{ animationDuration: "3s" }} />
          <div className="w-40 h-40 rounded-full border border-amber-200/40 border-dashed animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
        </div>
      )}

      {/* THE ROTATING MEDALLION ON CENTRAL VERTICAL AXIS */}
      <motion.div
        key={`spin-axis-${spinTrigger}`}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 1080 }} // Exactly 3 full 360-degree rotations
        transition={{
          duration: 3.0,
          ease: [0.12, 0.95, 0.28, 1.0], // Majestic decelerating spin settling perfectly flat at 3.0 seconds
        }}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
        className={`relative ${sizeStyles.box} rounded-3xl p-1 bg-gradient-to-tr from-[#C5A059] via-[#FDE68A] to-[#C5A059] shadow-[0_12px_45px_rgba(217,119,6,0.45)] flex items-center justify-center`}
      >
        {/* Front Face: Jewel-toned Core */}
        <div
          className={`w-full h-full rounded-[22px] bg-gradient-to-br ${achievement.badgeColor.gradient} text-white flex flex-col items-center justify-center shadow-inner relative overflow-hidden`}
        >
          {/* Shimmering glass reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/25 to-white/0 pointer-events-none" />

          {/* Golden Corner Embellishments */}
          <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-amber-200/80 rounded-tl-sm" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-amber-200/80 rounded-tr-sm" />
          <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-amber-200/80 rounded-bl-sm" />
          <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-amber-200/80 rounded-br-sm" />

          {/* Central Icon */}
          <div className="relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            {renderAchievementIcon(achievement.iconName, sizeStyles.icon)}
          </div>
        </div>

        {/* Back Face (Rendered in 3D when rotated) */}
        <div
          style={{
            transform: "rotateY(180deg) translateZ(1px)",
            backfaceVisibility: "hidden",
          }}
          className={`absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#92400E] via-[#D97706] to-[#F59E0B] flex flex-col items-center justify-center text-amber-100 p-2 text-center border-2 border-amber-200 shadow-inner`}
        >
          <Crown className="w-8 h-8 text-amber-200 mb-1 drop-shadow" />
          <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-white">
            {achievement.tier}
          </span>
          <span className="text-xs font-serif font-bold text-amber-100">
            +{achievement.points} pts
          </span>
        </div>
      </motion.div>

      {/* Post-Rotation Halo Shimmer (Appears once rotation comes to rest at 3 seconds) */}
      {!isSpinning && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.15, opacity: [0, 0.8, 0] }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`absolute ${sizeStyles.ring} rounded-full border-2 border-amber-300 pointer-events-none`}
        />
      )}
    </div>
  );
};

export const AchievementCelebrationOverlay: React.FC = () => {
  const [currentCelebration, setCurrentCelebration] = useState<AchievementCelebrationEvent | null>(null);
  const [spinCount, setSpinCount] = useState<number>(1);
  const [hasStoppedSpinning, setHasStoppedSpinning] = useState<boolean>(false);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize baseline on mount
    achievementCelebrationService.initializeBaseline();

    const handleAchievementUnlocked = (e: any) => {
      const event: AchievementCelebrationEvent = e.detail;
      if (!event?.achievement) return;

      setCurrentCelebration(event);
      setSpinCount((prev) => prev + 1);
      setHasStoppedSpinning(false);

      // Reset auto-close timer (dismisses smoothly after 10s of display)
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = setTimeout(() => {
        setCurrentCelebration(null);
      }, 10000);
    };

    window.addEventListener("gtc_achievement_unlocked", handleAchievementUnlocked);

    // Also listen to metrics update to automatically check for newly unlocked achievements
    const handleMetricsUpdated = () => {
      achievementCelebrationService.checkAndCelebrateNewAchievements(true);
    };
    window.addEventListener("gtc_metrics_updated", handleMetricsUpdated);

    return () => {
      window.removeEventListener("gtc_achievement_unlocked", handleAchievementUnlocked);
      window.removeEventListener("gtc_metrics_updated", handleMetricsUpdated);
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    };
  }, []);

  const handleReSpin = () => {
    setHasStoppedSpinning(false);
    setSpinCount((c) => c + 1);
    achievementCelebrationService.playHeavenlySound();

    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    autoCloseTimerRef.current = setTimeout(() => {
      setCurrentCelebration(null);
    }, 10000);
  };

  const handleClose = () => {
    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    setCurrentCelebration(null);
  };

  if (!currentCelebration) return null;

  const { achievement } = currentCelebration;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 select-none">
        {/* Darkened Backdrop Blur with Divine Golden Ambient Glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-[#0E0C09]/85 backdrop-blur-md cursor-pointer"
        />

        {/* Streaming Heavenly God Rays in Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-[100vh] bg-linear-to-b from-amber-200/25 via-amber-400/10 to-transparent blur-3xl god-rays-beam" />
          <div
            className="absolute -top-20 left-[25%] w-72 h-[100vh] bg-linear-to-b from-amber-100/20 via-[#FDE68A]/10 to-transparent blur-2xl god-rays-beam"
            style={{ transform: "rotate(-12deg)", transformOrigin: "top left" }}
          />
          <div
            className="absolute -top-20 right-[25%] w-72 h-[100vh] bg-linear-to-b from-amber-100/20 via-[#FDE68A]/10 to-transparent blur-2xl god-rays-beam"
            style={{ transform: "rotate(12deg)", transformOrigin: "top right" }}
          />
        </div>

        {/* CELEBRATION MODAL CARD */}
        <motion.div
          initial={{ scale: 0.85, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative w-full max-w-lg bg-[#18140D] border-2 border-[#C5A059] rounded-3xl p-6 sm:p-8 text-center text-stone-100 shadow-[0_20px_70px_rgba(197,160,89,0.45)] overflow-hidden z-10"
        >
          {/* Top Golden Light Strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-transparent via-[#FDE68A] to-transparent animate-pulse" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-300/40 text-amber-300 text-xs font-mono font-extrabold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "4s" }} />
            <span>Spiritual Milestone Unlocked</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "4s" }} />
          </div>

          {/* 3D ROTATING ACHIEVEMENT MEDALLION ON CENTRAL AXIS (STOPS AT 3 SECONDS) */}
          <div className="my-5 flex flex-col items-center justify-center">
            <RotatingAchievementMedallion
              achievement={achievement}
              spinTrigger={spinCount}
              size="lg"
              onSpinEnd={() => setHasStoppedSpinning(true)}
            />

            {/* Rotation status indicator */}
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-amber-300/80">
              {!hasStoppedSpinning ? (
                <span className="flex items-center gap-1 text-amber-300 animate-pulse">
                  <RotateCw className="w-3 h-3 animate-spin" />
                  Rotating on Central Axis (3s)...
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span>★</span>
                  <span>Halting Confirmed • Glory to God</span>
                  <span>★</span>
                </span>
              )}
            </div>
          </div>

          {/* Points & Category Pills */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
              +{achievement.points} Faith Points
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-stone-800 text-stone-300 border border-stone-700">
              Tier: {achievement.tier}
            </span>
          </div>

          {/* Achievement Title & Subtitle */}
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight drop-shadow-sm">
            {achievement.title}
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 font-medium mt-1">
            {achievement.subtitle}
          </p>

          <p className="text-xs sm:text-sm text-stone-300 mt-2 px-3 leading-relaxed">
            {achievement.description}
          </p>

          {/* Canonical Holy Scripture Quote Card */}
          <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-[#C5A059]/40 text-left space-y-1.5 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span className="font-serif text-sm tracking-wide">{achievement.verseReference}</span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                Holy Scripture
              </span>
            </div>
            <p className="text-xs sm:text-sm italic text-stone-200 border-l-2 border-[#C5A059] pl-3 py-0.5 leading-relaxed">
              "{achievement.verseQuote}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Replay Spin & Heavenly Sound Button */}
            <button
              onClick={handleReSpin}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-amber-200 border border-amber-400/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              title="Re-play the 3-second central axis spin and heavenly sound"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Replay Spin & Heavenly Sound</span>
            </button>

            {/* Praise God & Continue */}
            <button
              onClick={handleClose}
              className="w-full sm:flex-1 py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#C5A059] active:scale-95 text-[#18140D] font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Praise God & Continue Walk</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
