import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  LogOut
} from "lucide-react";
import { Logo } from "./Logo";
import {
  getAudioTTSUrl,
  getNaturalBibleVoice,
  getSavedVoiceGender,
  getSavedVoiceId,
  startSynchronousAudioPlayback,
  globalAudioEngine
} from "../lib/audioVoiceHelper";

export interface FarewellUser {
  name: string;
  email: string;
  deletedAt?: string;
  reason?: string;
}

interface FarewellExitPageProps {
  formerUser?: FarewellUser | null;
  onReturnToSanctuary: () => void;
}

interface PartingScripture {
  id: string;
  reference: string;
  title: string;
  text: string;
  benediction: string;
  spokenText: string;
}

const FAREWELL_SCRIPTURES: PartingScripture[] = [
  {
    id: "numbers-aaronic",
    reference: "Numbers 6:24–26",
    title: "The Aaronic Blessing of Peace",
    text: "The Lord bless you and keep you; the Lord make his face shine upon you and be gracious to you; the Lord turn his face toward you and give you peace.",
    benediction: "May His eternal face shine bright upon every step of your journey, granting you unshakeable peace and protection.",
    spokenText:
      "Numbers chapter six, verses twenty-four to twenty-six. The Lord bless you and keep you; the Lord make his face shine upon you and be gracious to you; the Lord turn his face toward you and give you peace. Amen. Walk in His peace always."
  },
  {
    id: "philippians-work",
    reference: "Philippians 1:6",
    title: "Good Work Completed in You",
    text: "Being confident of this very thing, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.",
    benediction: "God has not finished the great work He started in your heart. May you continue to grow and flourish in grace.",
    spokenText:
      "Philippians chapter one, verse six. Being confident of this very thing, that he who began a good work in you will carry it on to completion until the day of Christ Jesus. Amen."
  },
  {
    id: "jeremiah-hope",
    reference: "Jeremiah 29:11",
    title: "Thoughts of Peace & Hope",
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    benediction: "Your future rests securely in His sovereign hands. Go forth into your season of hope, joy, and fruitfulness.",
    spokenText:
      "Jeremiah chapter twenty-nine, verse eleven. For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future. Amen."
  },
  {
    id: "psalm-preservation",
    reference: "Psalm 121:7–8",
    title: "The Lord Preserves Your Going Out",
    text: "The Lord will keep you from all harm—he will watch over your life; the Lord will watch over your coming and going both now and forevermore.",
    benediction: "From this sanctuary onward, may the Lord watch over your soul and preserve your coming and your going.",
    spokenText:
      "Psalm one hundred twenty-one, verses seven and eight. The Lord will keep you from all harm, he will watch over your life; the Lord will watch over your coming and going both now and forevermore. Amen."
  }
];

// Plays a gentle, peaceful harmonic sanctuary chime
function playHarmonicExitChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Harmonic triad: 528Hz (Peace/Restoration), 660Hz (Major third), 792Hz (Fifth)
    [528, 660, 792].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.05 + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8 + idx * 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + 3.0 + idx * 0.15);
    });
  } catch (err) {
    console.warn("Chime could not play:", err);
  }
}

export const FarewellExitPage: React.FC<FarewellExitPageProps> = ({
  formerUser,
  onReturnToSanctuary
}) => {
  const [selectedScriptureId, setSelectedScriptureId] = useState<string>("numbers-aaronic");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeScripture =
    FAREWELL_SCRIPTURES.find((s) => s.id === selectedScriptureId) || FAREWELL_SCRIPTURES[0];

  const displayName = formerUser?.name || "Beloved Believer";

  // Play gentle chime on entry
  useEffect(() => {
    playHarmonicExitChime();
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      globalAudioEngine.stop();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speak scripture aloud using Microsoft Neural Voice with unified mobile/desktop audio pipeline
  const speakScripture = (scripture: PartingScripture, muted = false) => {
    globalAudioEngine.stop();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (muted) {
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    startSynchronousAudioPlayback({
      id: `farewell-${scripture.id}`,
      title: scripture.title,
      subtitle: scripture.reference,
      textToRead: scripture.spokenText,
      onPlaybackStateChange: (playing) => setIsSpeaking(playing),
      onChapterComplete: () => setIsSpeaking(false)
    });
  };

  const handleSelectScripture = (scripture: PartingScripture) => {
    setSelectedScriptureId(scripture.id);
    if (!isMuted) {
      speakScripture(scripture, false);
    }
  };

  const handleToggleAudio = () => {
    if (isSpeaking) {
      globalAudioEngine.stop();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setIsMuted(true);
    } else {
      setIsMuted(false);
      playHarmonicExitChime();
      speakScripture(activeScripture, false);
    }
  };

  const handleCopyBlessing = async () => {
    const textToCopy = `Apostolic Blessing for ${displayName}:
"${activeScripture.text}" — ${activeScripture.reference}

Benediction: ${activeScripture.benediction}

May the Lord bless your steps, preserve your soul, and guide your way forevermore.
With love in Christ Jesus • Global Tower of Christ`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full min-h-screen min-h-[100dvh] bg-[#F9F7F2] text-[#2D2D2D] font-sans flex flex-col selection:bg-[#C5A059] selection:text-white">
      {/* Sacred Top Header */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#E5E0D5] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <Logo size="md" />
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8F702E] px-3.5 py-1.5 bg-[#FAF6EE] rounded-full border border-[#C5A059]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Apostolic Parting Benediction</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col items-center justify-center space-y-6">
        {/* Card: Dedicated Farewell Sanctuary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full bg-white rounded-3xl shadow-xl border border-[#E5E0D5] overflow-hidden"
        >
          {/* Sacred Golden Banner */}
          <div className="bg-linear-to-b from-[#FAF7EE] via-[#F6EEDD] to-[#F1E4C9] p-8 sm:p-10 border-b border-[#E5DBBF] text-center relative overflow-hidden">
            <div className="relative z-10 max-w-xl mx-auto space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-tr from-[#C5A059] to-[#DFBF7A] text-white flex items-center justify-center shadow-lg ring-6 ring-[#C5A059]/20">
                <Heart className="w-8 h-8 fill-white/20 text-white" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#8F702E] font-serif block">
                  Sacred Departure & Consecration
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D2D2D]">
                  Depart in Peace, {displayName}
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-[#6E6759] font-sans leading-relaxed">
                Your account and spiritual data have been permanently erased in accordance with your Right to Complete Erasure. As you step forward into your next season, receive this scripture and prayer upon your path.
              </p>
            </div>

            {/* Subtle Radiant Background Decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C5A059] via-transparent to-transparent" />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Confirmation of Permanent Erasure Banner */}
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start sm:items-center gap-3.5 text-xs text-emerald-950 font-sans">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-emerald-900 block text-xs">
                  Right to Erasure Fulfilled: Account & Records Permanently Expunged
                </span>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  All personal study notes, dream inquiries, sermon bookmarks, reading streaks, and login credentials have been expunged from the sanctuary databases. No lingering telemetry remains.
                </p>
              </div>
            </div>

            {/* Primary Scripture Box with Audio Controls */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#FDFCF9] border-2 border-[#C5A059]/40 shadow-xs relative space-y-4">
              {/* Header inside scripture box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADFC7] pb-3.5">
                <div>
                  <span className="text-xs font-bold text-[#8F702E] font-serif uppercase tracking-wider block">
                    {activeScripture.reference}
                  </span>
                  <span className="text-xs font-serif text-[#5E584D] italic">
                    {activeScripture.title}
                  </span>
                </div>

                {/* Audio and Copy Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="btn-farewell-listen"
                    onClick={handleToggleAudio}
                    className="px-3.5 py-1.5 bg-[#FAF6EE] hover:bg-[#F4ECE0] text-[#8F702E] border border-[#C5A059]/40 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title={isSpeaking ? "Pause spoken scripture" : "Listen to scripture spoken aloud"}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                        <span>Mute Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Listen Aloud</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    id="btn-farewell-copy"
                    onClick={handleCopyBlessing}
                    className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full transition-colors cursor-pointer"
                    title="Copy scripture and blessing"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Main Scripture Text */}
              <blockquote className="text-lg sm:text-xl font-serif italic text-[#2D2D2D] text-center leading-relaxed px-2 py-3">
                “{activeScripture.text}”
              </blockquote>

              {/* Scripture Benediction */}
              <p className="text-xs text-center text-[#7A7468] font-sans border-t border-[#EADFC7]/60 pt-3">
                {activeScripture.benediction}
              </p>
            </div>

            {/* Selectable Scripture Alternatives */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A7468] block font-serif">
                Select Parting Scripture of Blessing:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {FAREWELL_SCRIPTURES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectScripture(s)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedScriptureId === s.id
                        ? "bg-[#FAF5E8] border-[#C5A059] text-[#8F702E] font-bold shadow-2xs"
                        : "bg-[#FDFCF9] border-[#E5E0D5] text-[#524E48] hover:border-[#C5A059]/60"
                    }`}
                  >
                    <span className="block font-serif font-bold text-xs">{s.reference}</span>
                    <span className="text-[11px] text-[#7A7468] font-sans line-clamp-1">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pastoral Blessing For Former User */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5] space-y-2.5">
              <div className="flex items-center gap-2 text-[#8F702E] font-serif font-bold text-xs">
                <BookOpen className="w-4 h-4 text-[#C5A059]" />
                <span>Apostolic Prayer for Your Continued Journey</span>
              </div>
              <p className="text-xs text-[#524E48] font-sans leading-relaxed italic">
                “Beloved {displayName}, though you have chosen to close this chapter in our digital sanctuary, our prayers for your spiritual growth, health, family, and victory remain steadfast. May the peace of Christ rule in your heart, may every good seed planted during your walk bear abundant fruit, and may the Lord direct your steps in righteousness and truth forevermore.”
              </p>
              <div className="text-right text-[11px] font-serif font-bold text-[#8F702E]">
                — The Ministry & Intercessory Team at Global Tower of Christ
              </div>
            </div>

            {/* Navigation Options */}
            <div className="pt-2 border-t border-[#E5E0D5] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#8A8478] font-sans text-center sm:text-left">
                The sanctuary doors remain open whenever you desire to return.
              </div>

              <button
                type="button"
                id="btn-farewell-return"
                onClick={onReturnToSanctuary}
                className="w-full sm:w-auto px-7 py-3 bg-linear-to-r from-[#C5A059] to-[#B38D46] hover:from-[#B38D46] hover:to-[#9F7A35] text-white rounded-2xl text-xs font-bold font-serif uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Return to Sanctuary / Sign In or Register</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full bg-white border-t border-[#E5E0D5] px-4 sm:px-8 py-3 flex items-center justify-center text-[11px] font-medium tracking-wider text-[#8A8478] uppercase">
        <span>Global Tower of Christ • Worship • Dominion • Victory</span>
      </footer>
    </div>
  );
};
