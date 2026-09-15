import React, { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  Trash2,
  X,
  ShieldAlert,
  BookOpen,
  Heart,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  Sliders,
  CheckSquare,
  Square
} from "lucide-react";
import { UserProfile } from "../types";
import { useAuth } from "../lib/AuthContext";
import { UserDataService } from "../lib/userDataService";
import {
  getAudioTTSUrl,
  getNaturalBibleVoice,
  getSavedVoiceGender,
  getSavedVoiceId,
  startSynchronousAudioPlayback,
  unlockAudio,
  globalAudioEngine
} from "../lib/audioVoiceHelper";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onNavigate?: (view: string) => void;
}

interface PartingScripture {
  id: string;
  reference: string;
  title: string;
  text: string;
  benediction: string;
  spokenText: string;
}

const PARTING_SCRIPTURES: PartingScripture[] = [
  {
    id: "numbers-6",
    reference: "Numbers 6:24–26",
    title: "The Priestly Benediction",
    text: "The Lord bless you and keep you; The Lord make His face shine upon you, and be gracious to you; The Lord lift up His countenance upon you, and give you peace.",
    benediction: "Go forth in peace and love. May the grace of our Lord Jesus Christ, the love of God, and the fellowship of the Holy Spirit be with you always. Amen.",
    spokenText:
      "Numbers chapter six, verses twenty-four to twenty-six. The Lord bless you and keep you. The Lord make His face shine upon you, and be gracious to you. The Lord lift up His countenance upon you, and give you peace. Amen. Depart in peace, and may the love of God guard your heart always."
  },
  {
    id: "romans-15",
    reference: "Romans 15:13",
    title: "The God of Hope & Peace",
    text: "Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope by the power of the Holy Spirit.",
    benediction: "May God's infinite hope and peace go before you, lighting every step of your journey.",
    spokenText:
      "Romans chapter fifteen, verse thirteen. Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope by the power of the Holy Spirit. Amen. Go in peace."
  },
  {
    id: "philippians-4",
    reference: "Philippians 4:7",
    title: "The Surpassing Peace of God",
    text: "And the peace of God, which surpasses all understanding, will guard your hearts and minds through Christ Jesus.",
    benediction: "Rest securely in His unfailing grace, knowing you are deeply cherished.",
    spokenText:
      "Philippians chapter four, verse seven. And the peace of God, which surpasses all understanding, will guard your hearts and minds through Christ Jesus. Amen. Walk in His peace always."
  }
];

// Plays a gentle, peaceful harmonic sanctuary chime before reading scripture
function playSanctuaryChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Harmonic triad: 528Hz (Harmony/Peace) & 660Hz (Major third) & 792Hz (Fifth)
    [528, 660, 792].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 2.3);
    });
  } catch (err) {
    console.warn("Chime playback notice:", err);
  }
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  const { deleteAccount, finalizeAccountDeparture } = useAuth();

  // Modal Flow Step: 'confirm' -> 'deleting' -> 'benediction'
  const [modalStep, setModalStep] = useState<"confirm" | "deleting" | "benediction">("confirm");
  const [deleteMode, setDeleteMode] = useState<"selective" | "permanent">("permanent");

  // Selective Data Purge State
  const [selectedCategories, setSelectedCategories] = useState<{
    notes: boolean;
    dreams: boolean;
    reading: boolean;
    bookmarks: boolean;
    prayers: boolean;
  }>({
    notes: true,
    dreams: true,
    reading: true,
    bookmarks: true,
    prayers: false
  });
  const [isPurgingSelective, setIsPurgingSelective] = useState(false);
  const [selectiveSuccessNotice, setSelectiveSuccessNotice] = useState<string | null>(null);

  // Permanent Account Deletion State
  const [confirmInput, setConfirmInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [understoodCheckbox, setUnderstoodCheckbox] = useState(false);
  const [reason, setReason] = useState("fresh_start");
  const [customReason, setCustomReason] = useState("");
  const [adminOverride, setAdminOverride] = useState(false);
  const [deletionProgress, setDeletionProgress] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Closing Scripture & Audio State
  const [selectedScriptureId, setSelectedScriptureId] = useState<string>("numbers-6");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasFinishedSpeaking, setHasFinishedSpeaking] = useState(false);
  const [isDeparting, setIsDeparting] = useState(false);

  const activeScripture =
    PARTING_SCRIPTURES.find((s) => s.id === selectedScriptureId) || PARTING_SCRIPTURES[0];

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      globalAudioEngine.stop();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const isSuperAdmin =
    user.role === "super_admin" ||
    user.email === "sangorichard@gmail.com" ||
    user.email === "info@globaltowerofchrist.com" ||
    user.id === "u-apostle-sango-admin" ||
    user.id === "u-admin-rsango";

  const userEmail = (user.email || "").toLowerCase().trim();
  const isConfirmationMatch =
    confirmInput.trim().toUpperCase() === "DELETE" ||
    confirmInput.trim().toLowerCase() === userEmail;

  const canSubmit =
    isConfirmationMatch &&
    understoodCheckbox &&
    modalStep === "confirm";

  // Handle selective records purge (allows user to reset data without destroying account)
  const handlePurgeSelective = async () => {
    setIsPurgingSelective(true);
    setSelectiveSuccessNotice(null);
    setErrorMessage(null);
    try {
      const res = await UserDataService.purgeSelectiveData(user.id, selectedCategories);
      if (res.success) {
        setSelectiveSuccessNotice(
          "Selected records have been cleared from your sanctuary! Your changes have taken effect immediately."
        );
        setTimeout(() => setSelectiveSuccessNotice(null), 5000);
      } else {
        setErrorMessage(res.message || "Could not clear records.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to purge selected records.");
    } finally {
      setIsPurgingSelective(false);
    }
  };

  const handleToggleCategory = (key: keyof typeof selectedCategories) => {
    setSelectedCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAllCategories = (select: boolean) => {
    setSelectedCategories({
      notes: select,
      dreams: select,
      reading: select,
      bookmarks: select,
      prayers: select
    });
  };

  // Speak the closing scripture aloud using reverent voice narration with unified audio pipeline
  const speakClosingScripture = (scriptureToSpeak: PartingScripture, muted = false) => {
    unlockAudio();
    if (muted) {
      globalAudioEngine.stop();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    setHasFinishedSpeaking(false);

    startSynchronousAudioPlayback({
      id: `departure-${scriptureToSpeak.id}`,
      title: scriptureToSpeak.title,
      subtitle: scriptureToSpeak.reference,
      textToRead: scriptureToSpeak.spokenText,
      onPlaybackStateChange: (playing) => {
        setIsSpeaking(playing);
        if (!playing) setHasFinishedSpeaking(true);
      },
      onChapterComplete: () => {
        setIsSpeaking(false);
        setHasFinishedSpeaking(true);
      }
    });
  };

  // Switch scripture and read aloud immediately
  const handleSelectScripture = (scripture: PartingScripture) => {
    setSelectedScriptureId(scripture.id);
    setHasFinishedSpeaking(false);
    speakClosingScripture(scripture, isMuted);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      speakClosingScripture(activeScripture, false);
    } else {
      setIsMuted(true);
      globalAudioEngine.stop();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  };

  // Replay Audio
  const handleReplay = () => {
    playSanctuaryChime();
    speakClosingScripture(activeScripture, false);
    setIsMuted(false);
  };

  // Complete Deletion and Transition to Benediction
  const handleDelete = async () => {
    if (!canSubmit) return;

    setModalStep("deleting");
    setErrorMessage(null);

    const fullReason =
      reason === "other"
        ? customReason.trim() || "Other reason"
        : reason === "fresh_start"
        ? "Desire a fresh start / reset spiritual records"
        : reason === "privacy"
        ? "Sacred privacy & data minimization"
        : reason === "no_longer_using"
        ? "No longer actively using the platform"
        : "Technical or personal preference";

    try {
      setDeletionProgress("Expunging personal records and revoking credentials...");
      // Permanently purges user documents and deletes Firebase Auth credentials immediately
      await deleteAccount(fullReason, passwordInput.trim() || undefined);

      const farewellPayload = {
        name: user.name || "Beloved Believer",
        email: user.email,
        deletedAt: new Date().toISOString(),
        reason: fullReason
      };
      try {
        sessionStorage.setItem("gtc_farewell_exit_active", JSON.stringify(farewellPayload));
      } catch {}

      // Transition immediately into Stage 3: Departure Benediction Ceremony
      setModalStep("benediction");
      playSanctuaryChime();
      speakClosingScripture(activeScripture, false);
    } catch (err: any) {
      console.error("Account deletion failed:", err);
      if (err?.code === "auth/requires-recent-login" || (err?.message && err.message.includes("password"))) {
        setNeedsPassword(true);
        setErrorMessage("Firebase requires your account password to verify your identity before permanent deletion. Please enter your password below and click Permanently Delete.");
      } else {
        setErrorMessage(
          err?.message || "An unexpected error occurred while deleting your account. Please check your connection and try again."
        );
      }
      setModalStep("confirm");
      setDeletionProgress("");
    }
  };

  // Final Departure when user clicks "Amen • Depart in Peace"
  const handleFinalDeparture = async () => {
    setIsDeparting(true);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    try {
      const farewellPayload = {
        name: user.name || "Beloved Believer",
        email: user.email,
        deletedAt: new Date().toISOString(),
        reason: reason
      };
      try {
        sessionStorage.setItem("gtc_farewell_exit_active", JSON.stringify(farewellPayload));
      } catch {}
      window.dispatchEvent(new CustomEvent("gtc_account_departed", { detail: farewellPayload }));
      await finalizeAccountDeparture();
    } catch (err) {
      console.warn("Notice during final session clearing:", err);
    } finally {
      setIsDeparting(false);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#2D2D2D]/80 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          if (modalStep === "benediction") {
            handleFinalDeparture();
          } else {
            onClose();
          }
        }
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E5E0D5] overflow-hidden text-[#2D2D2D]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================================
            STAGE 3: BENEDICTION - CLOSING SCRIPTURE READING ("LET THEM GO IN PEACE")
           ========================================================================= */}
        {modalStep === "benediction" && (
          <div className="flex flex-col animate-in fade-in zoom-in-95 duration-300">
            {/* Sacred Gold Top Banner */}
            <div className="bg-linear-to-b from-[#FAF7EE] to-[#F5EEDC] p-6 border-b border-[#E5DBBF] text-center relative">
              <div className="mx-auto w-12 h-12 rounded-full bg-linear-to-tr from-[#C5A059] to-[#DFBF7A] text-white flex items-center justify-center shadow-md mb-3 ring-4 ring-[#C5A059]/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8F702E] block mb-1">
                Apostolic Parting Benediction
              </span>
              <h2 className="text-xl font-bold font-serif text-[#2D2D2D]">
                Depart in Peace, Beloved
              </h2>
              <p className="text-xs text-[#6E6759] font-sans max-w-sm mx-auto mt-1">
                Your account and personal records have been completely expunged. Receive this closing scripture as our blessing upon your steps:
              </p>
            </div>

            {/* Main Scripture Card */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Scripture Display with Golden Frame */}
              <div className="p-5 rounded-2xl bg-[#FDFCF9] border-2 border-[#C5A059]/40 shadow-xs relative overflow-hidden">
                {/* Visual Audio Waveform Indicator */}
                <div className="flex items-center justify-between border-b border-[#EADFC7] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#8F702E] font-serif uppercase tracking-wider">
                      {activeScripture.reference}
                    </span>
                    <span className="text-[10px] text-[#A39B8B]">•</span>
                    <span className="text-[11px] font-serif text-[#5E584D] italic">
                      {activeScripture.title}
                    </span>
                  </div>

                  {/* Audio Status & Wave Bars */}
                  <div className="flex items-center gap-2">
                    {isSpeaking && !isMuted ? (
                      <div className="flex items-center gap-1 text-[11px] text-[#8F702E] font-medium font-mono">
                        <span className="inline-flex gap-0.5 items-end h-3.5">
                          <span className="w-1 h-3 bg-[#C5A059] rounded-full animate-pulse" />
                          <span className="w-1 h-4 bg-[#C5A059] rounded-full animate-pulse delay-75" />
                          <span className="w-1 h-2 bg-[#C5A059] rounded-full animate-pulse delay-150" />
                        </span>
                        <span>Reading scripture...</span>
                      </div>
                    ) : hasFinishedSpeaking ? (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Scripture Spoken
                      </span>
                    ) : null}

                    {/* Audio Controls */}
                    <div className="flex items-center gap-1 ml-1">
                      <button
                        type="button"
                        onClick={handleToggleMute}
                        title={isMuted ? "Unmute Audio" : "Mute Audio"}
                        className="p-1.5 rounded-full hover:bg-stone-200/60 text-[#6E6759] transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-[#8F702E]" />}
                      </button>
                      <button
                        type="button"
                        onClick={handleReplay}
                        title="Replay Spoken Scripture"
                        className="p-1.5 rounded-full hover:bg-stone-200/60 text-[#6E6759] transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* The Scripture Text */}
                <blockquote className="text-base sm:text-lg font-serif italic text-[#2D2D2D] leading-relaxed text-center px-2 py-1">
                  “{activeScripture.text}”
                </blockquote>

                {/* Farewell Benediction Note */}
                <p className="text-xs text-center text-[#7A7468] font-sans mt-3 pt-3 border-t border-[#EADFC7]/60">
                  {activeScripture.benediction}
                </p>
              </div>

              {/* Scripture Choice Tabs */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7468] block">
                  Listen to Another Parting Scripture:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {PARTING_SCRIPTURES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectScripture(s)}
                      className={`p-2 rounded-xl text-left border transition-all text-xs font-serif ${
                        selectedScriptureId === s.id
                          ? "bg-[#FAF5E8] border-[#C5A059] text-[#8F702E] font-bold shadow-2xs"
                          : "bg-[#FDFCF9] border-[#E5E0D5] text-[#524E48] hover:border-[#C5A059]/60"
                      }`}
                    >
                      <span className="block font-bold">{s.reference}</span>
                      <span className="text-[10px] text-[#7A7468] font-sans line-clamp-1">{s.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Assurance of Privacy Trust */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  All your personal notes, journal entries, and authentication records have been completely expunged.
                </span>
              </div>

              {/* Primary Departure Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinalDeparture}
                  disabled={isDeparting}
                  className="w-full py-3.5 px-6 bg-linear-to-r from-[#C5A059] to-[#B38D46] hover:from-[#B38D46] hover:to-[#9F7A35] text-white rounded-2xl text-sm font-bold font-serif uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isDeparting ? "Departing in Peace..." : "Amen • Depart in Peace"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-[#8A8478] mt-2 font-sans">
                  May God bless and keep your steps always.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 2: ACTIVE PURGE PROGRESS
           ========================================================================= */}
        {modalStep === "deleting" && (
          <div className="p-8 text-center space-y-5 animate-in fade-in">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shadow-xs">
              <div className="w-6 h-6 border-3 border-rose-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold font-serif text-[#2D2D2D]">
                Expunging Spiritual Records
              </h3>
              <p className="text-xs text-[#7A7468] font-sans">
                Committed to sacred privacy trust and complete right-to-erasure.
              </p>
            </div>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
              <p className="text-xs font-mono text-[#524E48] transition-all">
                {deletionProgress || "Connecting to sanctuary storage..."}
              </p>
            </div>
            <p className="text-[11px] text-stone-500 italic">
              Preparing closing scripture benediction...
            </p>
          </div>
        )}

        {/* =========================================================================
            STAGE 1: CONFIRMATION & SAFEGUARDS
           ========================================================================= */}
        {modalStep === "confirm" && (
          <div>
            {/* Header with Danger Accent */}
            <div className="bg-rose-50 border-b border-rose-100 p-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-serif text-rose-950">
                    Sanctuary Deletion & Record Management
                  </h2>
                  <p className="text-xs text-rose-700 font-sans">
                    Sacred Privacy Trust & Right to Complete Erasure
                  </p>
                </div>
              </div>
              <button
                type="button"
                id="btn-close-delete-modal"
                onClick={onClose}
                className="p-2 text-rose-400 hover:text-rose-700 rounded-full hover:bg-rose-100/50 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-[#E5E0D5] bg-[#FAF8F5] px-6 pt-3 gap-2">
              <button
                type="button"
                id="btn-tab-selective-reset"
                onClick={() => setDeleteMode("selective")}
                className={`pb-3 px-3 text-xs font-bold font-serif transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
                  deleteMode === "selective"
                    ? "border-[#C5A059] text-[#8F702E]"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Reset Specific Records</span>
              </button>
              <button
                type="button"
                id="btn-tab-permanent-delete"
                onClick={() => setDeleteMode("permanent")}
                className={`pb-3 px-3 text-xs font-bold font-serif transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
                  deleteMode === "permanent"
                    ? "border-rose-600 text-rose-700"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Permanent Account Erasure</span>
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
              {/* =========================================================================
                  TAB A: SELECTIVE RECORDS RESET (Allows changing data without deleting account)
                 ========================================================================= */}
              {deleteMode === "selective" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-3.5 bg-[#FDFCF9] border border-[#E5E0D5] rounded-2xl space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#7A7468] block font-serif">
                      Selective Sanctuary Reset
                    </span>
                    <p className="text-xs text-[#524E48] font-sans leading-relaxed">
                      Choose which categories of your spiritual records you wish to erase or reset.
                      Your account credentials and login will remain intact.
                    </p>
                  </div>

                  {/* Quick Select / Deselect Buttons */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-semibold text-stone-700">Select items to erase:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        id="btn-select-all-categories"
                        onClick={() => handleSelectAllCategories(true)}
                        className="text-[11px] font-bold text-[#8F702E] hover:underline cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-stone-300">•</span>
                      <button
                        type="button"
                        id="btn-deselect-all-categories"
                        onClick={() => handleSelectAllCategories(false)}
                        className="text-[11px] font-bold text-stone-500 hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* Category Checkboxes */}
                  <div className="space-y-2.5">
                    <label className="flex items-start gap-3 p-3 bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        id="checkbox-selective-notes"
                        checked={selectedCategories.notes}
                        onChange={() => handleToggleCategory("notes")}
                        className="w-4 h-4 mt-0.5 text-[#C5A059] accent-[#C5A059] rounded cursor-pointer"
                      />
                      <div className="text-xs space-y-0.5">
                        <span className="font-bold text-stone-800 block">Personal Study Notes & Sermon Highlights</span>
                        <span className="text-stone-500 text-[11px]">Expunges private notes, theological reflections, and highlighted verses.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        id="checkbox-selective-dreams"
                        checked={selectedCategories.dreams}
                        onChange={() => handleToggleCategory("dreams")}
                        className="w-4 h-4 mt-0.5 text-[#C5A059] accent-[#C5A059] rounded cursor-pointer"
                      />
                      <div className="text-xs space-y-0.5">
                        <span className="font-bold text-stone-800 block">Dreams & Vision Journal Entries</span>
                        <span className="text-stone-500 text-[11px]">Purges private dream inquiries, symbols, and spiritual insight records.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        id="checkbox-selective-reading"
                        checked={selectedCategories.reading}
                        onChange={() => handleToggleCategory("reading")}
                        className="w-4 h-4 mt-0.5 text-[#C5A059] accent-[#C5A059] rounded cursor-pointer"
                      />
                      <div className="text-xs space-y-0.5">
                        <span className="font-bold text-stone-800 block">Bible Reading Streaks & Study Plans</span>
                        <span className="text-stone-500 text-[11px]">Resets completed chapters, active plans, and daily streak counters.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        id="checkbox-selective-bookmarks"
                        checked={selectedCategories.bookmarks}
                        onChange={() => handleToggleCategory("bookmarks")}
                        className="w-4 h-4 mt-0.5 text-[#C5A059] accent-[#C5A059] rounded cursor-pointer"
                      />
                      <div className="text-xs space-y-0.5">
                        <span className="font-bold text-stone-800 block">Saved Bookmarks & Passages</span>
                        <span className="text-stone-500 text-[11px]">Clears your saved scripture bookmarks across all translations.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        id="checkbox-selective-prayers"
                        checked={selectedCategories.prayers}
                        onChange={() => handleToggleCategory("prayers")}
                        className="w-4 h-4 mt-0.5 text-[#C5A059] accent-[#C5A059] rounded cursor-pointer"
                      />
                      <div className="text-xs space-y-0.5">
                        <span className="font-bold text-stone-800 block">Personal Prayer Requests</span>
                        <span className="text-stone-500 text-[11px]">Removes your private and submitted prayer items.</span>
                      </div>
                    </label>
                  </div>

                  {/* Selective Success Notice */}
                  {selectiveSuccessNotice && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-sans flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{selectiveSuccessNotice}</span>
                    </div>
                  )}

                  {/* Error Notice */}
                  {errorMessage && (
                    <div className="p-3 bg-rose-100 border border-rose-300 rounded-xl text-xs text-rose-900 font-sans">
                      {errorMessage}
                    </div>
                  )}

                  {/* Action Buttons for Selective Mode */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E5E0D5]">
                    <button
                      type="button"
                      id="btn-cancel-selective"
                      onClick={onClose}
                      className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#7A7468] hover:bg-stone-100 rounded-full cursor-pointer transition-colors"
                    >
                      Keep Everything
                    </button>
                    <button
                      type="button"
                      id="btn-execute-selective-reset"
                      onClick={handlePurgeSelective}
                      disabled={isPurgingSelective || (!selectedCategories.notes && !selectedCategories.dreams && !selectedCategories.reading && !selectedCategories.bookmarks && !selectedCategories.prayers)}
                      className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#B48F48] disabled:bg-stone-300 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs inline-flex items-center gap-2 cursor-pointer transition-colors disabled:cursor-not-allowed"
                    >
                      {isPurgingSelective ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Purging Selected...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Reset Selected Records</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB B: PERMANENT ACCOUNT ERASURE
                 ========================================================================= */}
              {deleteMode === "permanent" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Apostolic Founder Protection Notice with Override Option */}
                  {isSuperAdmin && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-amber-800 font-bold font-serif text-sm">
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        <span>Apostolic Oversight Protection</span>
                      </div>
                      <p className="text-xs text-amber-900/90 leading-relaxed font-sans">
                        This account anchors apostolic leadership for <strong>Global Tower of Christ</strong>.
                        To prevent accidental lockouts, account deletion requires enabling the administrator override.
                      </p>
                      <label className="flex items-center gap-2.5 p-2.5 bg-amber-100/80 border border-amber-300 rounded-xl cursor-pointer select-none">
                        <input
                          type="checkbox"
                          id="checkbox-admin-override"
                          checked={adminOverride}
                          onChange={(e) => setAdminOverride(e.target.checked)}
                          className="w-4 h-4 text-amber-700 accent-amber-700 rounded cursor-pointer"
                        />
                        <span className="text-xs font-bold text-amber-950 font-sans">
                          Enable Admin Override to allow account deletion
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Deletion Scope Explanation */}
                  <div className="p-4 bg-[#FDFCF9] border border-[#E5E0D5] rounded-2xl space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#7A7468] block">
                      What will be permanently erased:
                    </span>
                    <ul className="space-y-2 text-xs text-[#524E48] font-sans">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>
                          <strong>Personal Spiritual Journal:</strong> All private study notes, sermon reflections, and scripture highlights.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>
                          <strong>Dreams & Vision Records:</strong> All private dream inquiries, spiritual interpretations, and vision journals.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>
                          <strong>Bible Study Plans & Streaks:</strong> Reading progress, completions, and bookmarked passages.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>
                          <strong>Account & Login Profile:</strong> Registered email ({user.email}), password hash, and active sessions.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Reason Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2D2D2D] block font-serif">
                      Reason for Leaving (Optional)
                    </label>
                    <select
                      id="select-delete-reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl text-[#2D2D2D] focus:outline-none focus:border-rose-400 cursor-pointer"
                    >
                      <option value="fresh_start">I want a fresh start / reset my spiritual notes</option>
                      <option value="privacy">Sacred privacy & data minimization (Right to Erasure)</option>
                      <option value="no_longer_using">I am no longer actively using the platform</option>
                      <option value="technical">Encountered technical difficulties</option>
                      <option value="other">Other reason</option>
                    </select>
                    {reason === "other" && (
                      <input
                        type="text"
                        id="input-custom-reason"
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Briefly describe your reason..."
                        maxLength={150}
                        className="w-full mt-2 px-3.5 py-2 text-xs bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl text-[#2D2D2D] focus:outline-none focus:border-rose-400"
                      />
                    )}
                  </div>

                  {/* Confirmation Checkbox */}
                  <label className="flex items-start gap-3 p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="checkbox-confirm-deletion"
                      checked={understoodCheckbox}
                      onChange={(e) => setUnderstoodCheckbox(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-rose-600 accent-rose-600 rounded cursor-pointer"
                    />
                    <span className="text-xs text-rose-950 font-sans leading-relaxed">
                      I understand that this action is <strong>irreversible</strong>. Once deleted, my
                      account, spiritual reflections, and reading progress cannot be recovered.
                    </span>
                  </label>

                  {/* Confirmation Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2D2D2D] block font-sans">
                      To confirm, type <span className="font-mono font-bold text-rose-700">DELETE</span> or your email address:
                    </label>
                    <input
                      type="text"
                      id="input-confirm-delete"
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                      placeholder="Type DELETE or your email"
                      className={`w-full px-3.5 py-2.5 text-xs bg-[#FDFCF9] border rounded-xl font-mono focus:outline-none transition-colors ${
                        isConfirmationMatch
                          ? "border-emerald-500 bg-emerald-50/30 text-emerald-950"
                          : "border-[#E5E0D5] text-[#2D2D2D] focus:border-rose-400"
                      }`}
                    />
                    {confirmInput.trim().length > 0 && !isConfirmationMatch && (
                      <p className="text-[11px] text-rose-600">
                        Input does not match "DELETE" or your email ({user.email}).
                      </p>
                    )}
                  </div>

                  {/* Account Password for Firebase Auth Re-authentication */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#2D2D2D] block font-sans">
                        Account Password (for Firebase Auth verification):
                      </label>
                      {needsPassword && (
                        <span className="text-[10px] font-bold uppercase text-rose-600">
                          Required by Firebase
                        </span>
                      )}
                    </div>
                    <input
                      type="password"
                      id="input-delete-password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter password to verify"
                      className={`w-full px-3.5 py-2.5 text-xs bg-[#FDFCF9] border rounded-xl focus:outline-none transition-colors ${
                        needsPassword
                          ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                          : "border-[#E5E0D5] text-[#2D2D2D] focus:border-rose-400"
                      }`}
                    />
                    <p className="text-[11px] text-[#7A7468]">
                      Verifies your identity with Firebase Authentication before permanently deleting credentials.
                    </p>
                  </div>

                  {/* Error Notice */}
                  {errorMessage && (
                    <div className="p-3 bg-rose-100 border border-rose-300 rounded-xl text-xs text-rose-900 font-sans">
                      {errorMessage}
                    </div>
                  )}

                  {/* Parting Scripture Promise */}
                  <div className="p-3 bg-[#FAF7EE] border border-[#E8DFC8] rounded-xl flex items-center gap-2 text-xs text-[#755D28] font-sans">
                    <BookOpen className="w-4 h-4 shrink-0 text-[#C5A059]" />
                    <span>
                      Before you leave, the sanctuary will read a closing scripture blessing over you to let you go in peace.
                    </span>
                  </div>

                  {/* Action Buttons for Permanent Deletion */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E0D5]">
                    <button
                      type="button"
                      id="btn-cancel-permanent"
                      onClick={onClose}
                      className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#7A7468] hover:bg-stone-100 rounded-full cursor-pointer transition-colors"
                    >
                      Cancel & Keep Account
                    </button>
                    <button
                      type="button"
                      id="btn-permanently-delete"
                      onClick={handleDelete}
                      disabled={!canSubmit}
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs inline-flex items-center gap-2 cursor-pointer transition-colors disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Permanently Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
