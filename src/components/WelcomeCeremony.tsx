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
  Compass
} from "lucide-react";
import { Logo } from "./Logo";

interface WelcomeCeremonyProps {
  userName: string;
  onComplete: () => void;
  totalDurationSeconds?: number; // defaults to 12s (within 10-15s requested)
}

// Plays a gentle, peaceful harmonic sanctuary chime
function playHarmonicChime(freqMultiplier = 1.0) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Harmonic triad: 528Hz (Peace/Creation), 660Hz (Major third), 792Hz (Fifth)
    [528 * freqMultiplier, 660 * freqMultiplier, 792 * freqMultiplier].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.05 + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5 + idx * 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + 2.7 + idx * 0.12);
    });
  } catch (err) {
    console.warn("Notice during welcome chime:", err);
  }
}

export const WelcomeCeremony: React.FC<WelcomeCeremonyProps> = ({
  userName,
  onComplete,
  totalDurationSeconds = 12
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const hasCompletedRef = useRef(false);

  // Play chime on mount
  useEffect(() => {
    playHarmonicChime(1.0);
  }, []);

  // Timer update loop
  useEffect(() => {
    const intervalMs = 100;
    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + intervalMs / 1000;
        if (next >= totalDurationSeconds) {
          clearInterval(timer);
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            setTimeout(onComplete, 400);
          }
          return totalDurationSeconds;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [totalDurationSeconds, onComplete]);

  // Determine stage based on elapsed time (4 equal parts over ~12s)
  // Stage 1: 0 - 3.2s
  // Stage 2: 3.2 - 6.8s
  // Stage 3: 6.8 - 10.2s
  // Stage 4: 10.2 - 12.0s
  const stage =
    elapsed < 3.2 ? 1 : elapsed < 6.8 ? 2 : elapsed < 10.2 ? 3 : 4;

  const progressPercent = Math.min(100, Math.round((elapsed / totalDurationSeconds) * 100));
  const secondsRemaining = Math.max(1, Math.ceil(totalDurationSeconds - elapsed));

  const handleSkip = () => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      playHarmonicChime(1.2);
      onComplete();
    }
  };

  const displayName = userName.trim() || "Beloved Believer";

  return (
    <div className="fixed inset-0 z-50 bg-[#F9F7F2] text-[#2D2D2D] font-sans flex flex-col justify-between overflow-hidden selection:bg-[#C5A059] selection:text-white">
      {/* Ambient background illumination */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#F5EEDC] via-transparent to-transparent" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-[#E5E0D5]/80 bg-white/70 backdrop-blur-md">
        <Logo size="md" />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsMuted(!isMuted);
              if (isMuted) playHarmonicChime();
            }}
            className="p-2 rounded-full hover:bg-stone-200/60 text-[#7A7468] transition-colors cursor-pointer"
            title={isMuted ? "Unmute sanctuary audio" : "Mute sanctuary audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-[#C5A059]" />}
          </button>

          <button
            type="button"
            id="btn-welcome-enter-now"
            onClick={handleSkip}
            className="px-4 py-1.5 bg-[#FAF6EE] hover:bg-[#F2E8D5] text-[#8F702E] border border-[#C5A059]/40 rounded-full text-xs font-bold font-serif uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <span>Enter Sanctuary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Center Stage: Animated Sequences with Smooth Transitions */}
      <main className="relative z-10 flex-1 max-w-2xl w-full mx-auto p-6 sm:p-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {stage === 1 && (
            <motion.div
              key="stage-1"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="text-center space-y-6 w-full"
            >
              {/* Sacred Crest */}
              <div className="mx-auto w-20 h-20 rounded-3xl bg-linear-to-tr from-[#C5A059] to-[#E3C584] text-white flex items-center justify-center shadow-xl ring-8 ring-[#C5A059]/15">
                <Sparkles className="w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#8F702E] font-serif block">
                  Apostolic Welcome & Blessing
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#2D2D2D] tracking-tight">
                  Welcome to the Sanctuary, {displayName}
                </h1>
                <p className="text-sm text-[#7A7468] font-sans max-w-lg mx-auto">
                  A dedicated spiritual dwelling place has been consecrated for your walk of faith, daily study, and prayer.
                </p>
              </div>

              {/* Scripture Card */}
              <div className="p-5 rounded-2xl bg-white border border-[#E5E0D5] shadow-xs max-w-md mx-auto">
                <blockquote className="text-sm sm:text-base font-serif italic text-[#2D2D2D]">
                  “The steps of a good man are ordered by the Lord: and he delighteth in his way.”
                </blockquote>
                <span className="block text-[11px] font-bold text-[#C5A059] uppercase tracking-wider mt-2 font-mono">
                  — Psalm 37:23
                </span>
              </div>
            </motion.div>
          )}

          {stage === 2 && (
            <motion.div
              key="stage-2"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="text-center space-y-6 w-full"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#8F702E] font-serif block">
                  The Foundations of Our Faith
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D2D2D]">
                  Worship • Dominion • Victory
                </h2>
                <p className="text-xs sm:text-sm text-[#7A7468] font-sans max-w-lg mx-auto">
                  Aligning your spiritual arsenal for deep scripture revelation, dream discernment, and fervent prayer.
                </p>
              </div>

              {/* 3 Pillar Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-lg mx-auto">
                <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5] shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] text-[#C5A059] flex items-center justify-center mx-auto">
                    <Heart className="w-4 h-4 fill-[#C5A059]/20" />
                  </div>
                  <h3 className="font-serif font-bold text-xs text-[#2D2D2D]">Worship</h3>
                  <p className="text-[11px] text-[#7A7468] font-sans">
                    Dwelling in the presence of the Almighty in spirit and truth.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5] shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] text-[#C5A059] flex items-center justify-center mx-auto">
                    <Crown className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <h3 className="font-serif font-bold text-xs text-[#2D2D2D]">Dominion</h3>
                  <p className="text-[11px] text-[#7A7468] font-sans">
                    Walking in Kingdom authority, wisdom, and righteousness.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5] shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] text-[#C5A059] flex items-center justify-center mx-auto">
                    <Flame className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <h3 className="font-serif font-bold text-xs text-[#2D2D2D]">Victory</h3>
                  <p className="text-[11px] text-[#7A7468] font-sans">
                    Overcoming every trial through the precious blood of the Lamb.
                  </p>
                </div>
              </div>

              <p className="text-xs font-serif italic text-[#8F702E]">
                “Where two or three are gathered together in my name, there am I in the midst.” — Matthew 18:20
              </p>
            </motion.div>
          )}

          {stage === 3 && (
            <motion.div
              key="stage-3"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="text-center space-y-6 w-full"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-[#FAF6EE] border border-[#C5A059]/40 text-[#C5A059] flex items-center justify-center shadow-md">
                <ShieldCheck className="w-8 h-8 text-[#C5A059]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#8F702E] font-serif block">
                  Apostolic Blessing Upon Your Walk
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D2D2D]">
                  Grace, Peace & Illumination
                </h2>
                <p className="text-xs sm:text-sm text-[#7A7468] font-sans max-w-lg mx-auto">
                  May every verse you read, every dream you record, and every prayer you utter ignite divine revelation in your soul.
                </p>
              </div>

              {/* Aaronic Blessing Quote */}
              <div className="p-5 rounded-2xl bg-white border-2 border-[#C5A059]/40 shadow-xs max-w-md mx-auto">
                <blockquote className="text-sm sm:text-base font-serif italic text-[#2D2D2D] leading-relaxed">
                  “The Lord bless you and keep you; the Lord make his face shine upon you and be gracious to you; the Lord lift up his countenance upon you, and give you peace.”
                </blockquote>
                <span className="block text-[11px] font-bold text-[#8F702E] uppercase tracking-wider mt-2 font-mono">
                  — Numbers 6:24–26
                </span>
              </div>
            </motion.div>
          )}

          {stage === 4 && (
            <motion.div
              key="stage-4"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="text-center space-y-6 w-full"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-tr from-[#C5A059] to-[#DFBF7A] text-white flex items-center justify-center shadow-lg animate-bounce">
                <BookOpen className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#8F702E] font-serif block">
                  Consecration Complete
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D2D2D]">
                  Your Sanctuary is Prepared
                </h2>
                <p className="text-xs sm:text-sm text-[#7A7468] font-sans max-w-md mx-auto">
                  Entering the holy sanctuary of God. May His presence surround you always.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  id="btn-welcome-enter-final"
                  onClick={handleSkip}
                  className="px-8 py-3 bg-linear-to-r from-[#C5A059] to-[#B38D46] hover:from-[#B38D46] hover:to-[#9F7A35] text-white font-serif font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Step Inside Sanctuary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Progress Bar & Stage Indicator */}
      <footer className="relative z-10 w-full max-w-xl mx-auto px-6 pb-6 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-serif text-[#7A7468]">
          <span className="font-bold text-[#8F702E]">
            {stage === 1
              ? "1/4 • Welcome & Calling"
              : stage === 2
              ? "2/4 • The Three Pillars"
              : stage === 3
              ? "3/4 • Apostolic Blessing"
              : "4/4 • Entering Sanctuary"}
          </span>
          <span className="font-mono text-stone-500">
            {secondsRemaining}s • {progressPercent}%
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-1.5 bg-[#E5E0D5] rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-[#C5A059] to-[#E3C584] rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </footer>
    </div>
  );
};
