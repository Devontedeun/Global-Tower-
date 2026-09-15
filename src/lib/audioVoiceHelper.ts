// High-Quality Bible Voice Narration System
// Dedicated Male and Female voice narrator engines with natural pacing, warm reverent tone,
// and natural breathing pauses without altering, shortening, or paraphrasing the biblical text.

import { VoiceGender } from "../types";
import { bluetoothAudioService } from "./bluetoothAudioService";

export interface NarratorVoiceConfig {
  voice: SpeechSynthesisVoice | null;
  pitch: number;
  rate: number;
  gender: VoiceGender;
  voiceName: string;
}

export interface VoiceOption {
  id: string; // e.g. "en-US-GuyNeural", "en-US-ChristopherNeural", "gemini:Puck", "browser:Samantha"
  name: string; // Display label
  gender: VoiceGender;
  provider: "microsoft" | "gemini" | "browser";
  description?: string;
  isDefault?: boolean;
}

export const GENDER_STORAGE_KEY = "gtc_narrator_voice_gender";
export const VOICE_STORAGE_KEY = "gtc_selected_narrator_voice";

// Comprehensive Catalog of High-Quality Server Voices
export const SERVER_VOICES: VoiceOption[] = [
  // Microsoft Edge Neural Voices (Male)
  {
    id: "en-US-GuyNeural",
    name: "Guy (Microsoft Neural • Reverent US)",
    gender: "male",
    provider: "microsoft",
    description: "Deep, warm, mature narrator — reverent scripture tone",
    isDefault: true,
  },
  {
    id: "en-US-ChristopherNeural",
    name: "Christopher (Microsoft Neural • Authoritative US)",
    gender: "male",
    provider: "microsoft",
    description: "Clear, resonant, and dignified delivery",
  },
  {
    id: "en-US-EricNeural",
    name: "Eric (Microsoft Neural • Calm & Gentle US)",
    gender: "male",
    provider: "microsoft",
    description: "Soft, contemplative delivery for devotional meditation",
  },
  {
    id: "en-US-BrianNeural",
    name: "Brian (Microsoft Neural • Expressive US)",
    gender: "male",
    provider: "microsoft",
    description: "Articulate and engaging American narrator",
  },
  {
    id: "en-GB-RyanNeural",
    name: "Ryan (Microsoft Neural • British Narrator)",
    gender: "male",
    provider: "microsoft",
    description: "Distinguished British classical cathedral cadence",
  },

  // Microsoft Edge Neural Voices (Female)
  {
    id: "en-US-JennyNeural",
    name: "Jenny (Microsoft Neural • Reverent US)",
    gender: "female",
    provider: "microsoft",
    description: "Warm, clear, and reverent female scripture reader",
    isDefault: true,
  },
  {
    id: "en-US-AriaNeural",
    name: "Aria (Microsoft Neural • Expressive US)",
    gender: "female",
    provider: "microsoft",
    description: "Vibrant, poetic, lyrical narrator",
  },
  {
    id: "en-US-MichelleNeural",
    name: "Michelle (Microsoft Neural • Gentle US)",
    gender: "female",
    provider: "microsoft",
    description: "Gentle, peaceful, and comforting cadence",
  },
  {
    id: "en-GB-SoniaNeural",
    name: "Sonia (Microsoft Neural • British Narrator)",
    gender: "female",
    provider: "microsoft",
    description: "Refined British female narrative delivery",
  },

  // Gemini AI Voices (Server-side Studio AI)
  {
    id: "gemini:Charon",
    name: "Charon (Gemini AI • Deep Male)",
    gender: "male",
    provider: "gemini",
    description: "Solemn, low-frequency AI-synthesized narrator",
  },
  {
    id: "gemini:Puck",
    name: "Puck (Gemini AI • Clear Male)",
    gender: "male",
    provider: "gemini",
    description: "Crisp, articulated modern AI narrator",
  },
  {
    id: "gemini:Fenrir",
    name: "Fenrir (Gemini AI • Resonant Male)",
    gender: "male",
    provider: "gemini",
    description: "Rich and deep AI timber",
  },
  {
    id: "gemini:Kore",
    name: "Kore (Gemini AI • Gentle Female)",
    gender: "female",
    provider: "gemini",
    description: "Soothing and peaceful AI narrator",
  },
  {
    id: "gemini:Aoede",
    name: "Aoede (Gemini AI • Expressive Female)",
    gender: "female",
    provider: "gemini",
    description: "Melodic, dynamic female AI cadence",
  },
  {
    id: "gemini:Zephyr",
    name: "Zephyr (Gemini AI • Crisp Female)",
    gender: "female",
    provider: "gemini",
    description: "Clear and precise modern female AI delivery",
  },
];

export interface WebVoiceOption {
  id: string;
  name: string;
  lang: string;
  gender: VoiceGender;
  isNatural: boolean;
  isDefault: boolean;
}

// Banned robotic / novelty voice names in browser SpeechSynthesis
export const BANNED_VOICE_NAMES = [
  "zarvox",
  "trinoids",
  "whisper",
  "cellos",
  "bad news",
  "organ",
  "deranged",
  "bubbles",
  "bells",
  "boing",
  "good news",
  "hysterical",
  "junior",
  "pipe organ",
  "wobble",
  "xander",
  "albert",
  "ralph"
];

export function isNaturalVoice(voice: SpeechSynthesisVoice): boolean {
  const lower = (voice.name + " " + voice.voiceURI).toLowerCase();
  return (
    lower.includes("natural") ||
    lower.includes("neural") ||
    lower.includes("online") ||
    lower.includes("google") ||
    lower.includes("enhanced") ||
    lower.includes("premium") ||
    lower.includes("siri") ||
    lower.includes("samantha") ||
    lower.includes("daniel")
  );
}

export function detectVoiceGender(voice: SpeechSynthesisVoice): VoiceGender {
  const lower = (voice.name + " " + voice.voiceURI).toLowerCase();
  if (
    lower.includes("female") ||
    lower.includes("jenny") ||
    lower.includes("aria") ||
    lower.includes("samantha") ||
    lower.includes("victoria") ||
    lower.includes("zira") ||
    lower.includes("karen") ||
    lower.includes("moira") ||
    lower.includes("fiona") ||
    lower.includes("tessa") ||
    lower.includes("sonia") ||
    lower.includes("ava") ||
    lower.includes("emma")
  ) {
    return "female";
  }
  if (
    lower.includes("male") ||
    lower.includes("guy") ||
    lower.includes("david") ||
    lower.includes("mark") ||
    lower.includes("george") ||
    lower.includes("christopher") ||
    lower.includes("eric") ||
    lower.includes("brian") ||
    lower.includes("ryan") ||
    lower.includes("daniel") ||
    lower.includes("oliver") ||
    lower.includes("arthur") ||
    lower.includes("steffan") ||
    lower.includes("andrew")
  ) {
    return "male";
  }
  return "male";
}

export function getAvailableWebVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }
  const allVoices = window.speechSynthesis.getVoices();
  const validVoices = allVoices.filter((v) => {
    const lower = (v.name + " " + v.voiceURI).toLowerCase();
    return !BANNED_VOICE_NAMES.some((banned) => lower.includes(banned));
  });

  // Sort: Natural English first, then other English, then other languages
  return [...validVoices].sort((a, b) => {
    const aIsEn = a.lang.toLowerCase().startsWith("en");
    const bIsEn = b.lang.toLowerCase().startsWith("en");
    if (aIsEn && !bIsEn) return -1;
    if (!aIsEn && bIsEn) return 1;

    const aIsNat = isNaturalVoice(a);
    const bIsNat = isNaturalVoice(b);
    if (aIsNat && !bIsNat) return -1;
    if (!aIsNat && bIsNat) return 1;

    return a.name.localeCompare(b.name);
  });
}

export function findBestVoiceForGender(
  voices: SpeechSynthesisVoice[],
  gender: VoiceGender
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = english.length > 0 ? english : voices;

  // 1. Natural voice matching gender
  const naturalMatch = pool.find((v) => detectVoiceGender(v) === gender && isNaturalVoice(v));
  if (naturalMatch) return naturalMatch;

  // 2. Any voice matching gender
  const genderMatch = pool.find((v) => detectVoiceGender(v) === gender);
  if (genderMatch) return genderMatch;

  // 3. Natural voice in pool
  const naturalAny = pool.find((v) => isNaturalVoice(v));
  if (naturalAny) return naturalAny;

  // 4. Default or first in pool
  return pool.find((v) => v.default) || pool[0] || null;
}

// Module-level listener for voiceschanged event
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  const handleVoicesChanged = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      console.log(`[AudioVoiceHelper:WebSpeech] 🎙️ voiceschanged: ${voices.length} voices ready.`);
      window.dispatchEvent(
        new CustomEvent("gtc_web_voices_loaded", { detail: { count: voices.length } })
      );
    }
  };
  window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
  window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
}

export function getSavedVoiceGender(): VoiceGender {
  if (typeof window === "undefined") return "male";
  try {
    const saved = localStorage.getItem(GENDER_STORAGE_KEY);
    if (saved === "female" || saved === "male") return saved;
  } catch (e) {
    // fallback
  }
  return "male";
}

export function setSavedVoiceGender(gender: VoiceGender) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GENDER_STORAGE_KEY, gender);

    // Pick best voice for gender from available browser voices
    if ("speechSynthesis" in window) {
      const voices = getAvailableWebVoices();
      const best = findBestVoiceForGender(voices, gender);
      if (best) {
        const bestId = best.voiceURI || best.name;
        localStorage.setItem(VOICE_STORAGE_KEY, bestId);
        window.dispatchEvent(
          new CustomEvent("gtc_voice_changed", {
            detail: { voiceId: bestId, gender }
          })
        );
      }
    }
  } catch (e) {
    // ignore
  }
}

/**
 * Retrieve the saved voice ID from localStorage or select the best native browser voice.
 * Restores seamlessly after page reload.
 */
export function getSavedVoiceId(): string {
  if (typeof window === "undefined") return "";
  try {
    const saved = localStorage.getItem(VOICE_STORAGE_KEY);
    if (saved && saved.trim()) {
      const trimmed = saved.trim();
      // If it's not an obsolete Azure Neural string, return it
      if (!(trimmed.startsWith("en-US-") && trimmed.endsWith("Neural"))) {
        return trimmed;
      }
    }
  } catch (e) {
    // fallback
  }

  // Fallback to best matching voice from available browser voices
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const voices = getAvailableWebVoices();
    const gender = getSavedVoiceGender();
    const best = findBestVoiceForGender(voices, gender);
    if (best) {
      return best.voiceURI || best.name;
    }
  }
  return "";
}

/**
 * Persist the selected voice ID to localStorage and notify all active listeners.
 */
export function setSavedVoiceId(voiceId: string) {
  if (typeof window === "undefined" || !voiceId) return;
  try {
    localStorage.setItem(VOICE_STORAGE_KEY, voiceId);

    let activeGender = getSavedVoiceGender();
    if ("speechSynthesis" in window) {
      const voices = window.speechSynthesis.getVoices();
      const matched = voices.find((v) => v.voiceURI === voiceId || v.name === voiceId);
      if (matched) {
        activeGender = detectVoiceGender(matched);
        localStorage.setItem(GENDER_STORAGE_KEY, activeGender);
      }
    }

    console.log(`[AudioVoiceHelper] Voice persisted to localStorage: id="${voiceId}", gender="${activeGender}"`);

    window.dispatchEvent(
      new CustomEvent("gtc_voice_changed", {
        detail: { voiceId, gender: activeGender }
      })
    );
  } catch (e) {
    console.warn("[AudioVoiceHelper] Failed to save voice to localStorage:", e);
  }
}

// -------------------------------------------------------------
// Persistent Audio Mute & Volume Management
// -------------------------------------------------------------
export const MUTE_STORAGE_KEY = "gtc_audio_is_muted";
export const VOLUME_STORAGE_KEY = "gtc_audio_volume";

export function getSavedMuteState(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const saved = localStorage.getItem(MUTE_STORAGE_KEY);
    return saved === "true";
  } catch (e) {
    return false;
  }
}

export function setSavedMuteState(isMuted: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, String(isMuted));
    console.log(`[AudioVoiceHelper] Mute state updated: isMuted=${isMuted}`);
    window.dispatchEvent(
      new CustomEvent("gtc_audio_mute_changed", {
        detail: { isMuted }
      })
    );
  } catch (e) {
    console.warn("[AudioVoiceHelper] Failed to persist mute state:", e);
  }
}

export function getSavedAudioVolume(): number {
  if (typeof window === "undefined") return 1.0;
  try {
    const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
    if (saved !== null) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        return parsed;
      }
    }
  } catch (e) {
    // fallback
  }
  return 1.0;
}

export function setSavedAudioVolume(volume: number) {
  if (typeof window === "undefined") return;
  try {
    const clamped = Math.max(0, Math.min(1, volume));
    localStorage.setItem(VOLUME_STORAGE_KEY, String(clamped));
    window.dispatchEvent(
      new CustomEvent("gtc_audio_volume_changed", {
        detail: { volume: clamped }
      })
    );
  } catch (e) {
    // ignore
  }
}

// -------------------------------------------------------------
// AudioTrack & Speech Segments Model
// -------------------------------------------------------------
export interface AudioTrack {
  id: string;
  title: string;
  subtitle: string;
  category?: string;
  textToRead?: string;
  audioSrc?: string;
  verses?: { num: number; text: string }[];
  book?: string;
  chapter?: number;
  voiceId?: string;
  onVerseChange?: (verseNum: number) => void;
  onChapterComplete?: () => void;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
}

export interface SpeechSegment {
  text: string;
  verseNum?: number;
}

export function splitTextIntoNaturalChunks(text: string, maxLen = 160): string[] {
  if (!text || text.length <= maxLen) return text ? [text] : [];

  const sentenceRegex = /[^.!?]+(?:[.!?]+(?:\s+|$)|$)/g;
  const rawSentences = text.match(sentenceRegex) || [text];
  const chunks: string[] = [];

  for (const sentence of rawSentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;
    if (trimmed.length <= maxLen) {
      chunks.push(trimmed);
    } else {
      const clauseRegex = /[^,;:—]+(?:[,;:—]+(?:\s+|$)|$)/g;
      const clauses = trimmed.match(clauseRegex) || [trimmed];
      let current = "";
      for (const clause of clauses) {
        const cTrimmed = clause.trim();
        if (!cTrimmed) continue;
        if ((current + " " + cTrimmed).trim().length <= maxLen) {
          current = (current + " " + cTrimmed).trim();
        } else {
          if (current) chunks.push(current);
          current = cTrimmed;
        }
      }
      if (current) chunks.push(current);
    }
  }

  return chunks.length > 0 ? chunks : [text];
}

export function buildSegmentsFromTrack(track: AudioTrack): SpeechSegment[] {
  if (track.verses && track.verses.length > 0) {
    const segments: SpeechSegment[] = [];
    track.verses.forEach((v, idx) => {
      const intro = idx === 0 && track.book && track.chapter
        ? `${track.book}, chapter ${track.chapter}. `
        : "";
      const fullVerse = formatBibleTextForSpeech(`${intro}${v.text}`);
      // Preserve verse integrity as a single natural segment.
      // Only split if the verse is extraordinarily long (> 450 characters)
      if (fullVerse.length > 450) {
        const sub = splitTextIntoNaturalChunks(fullVerse, 350);
        sub.forEach((chunk) => {
          segments.push({ text: chunk, verseNum: v.num });
        });
      } else {
        segments.push({ text: fullVerse, verseNum: v.num });
      }
    });
    return segments;
  }

  if (track.textToRead) {
    const formatted = formatBibleTextForSpeech(track.textToRead);
    if (formatted.length > 450) {
      const sub = splitTextIntoNaturalChunks(formatted, 350);
      return sub.map((chunk) => ({ text: chunk }));
    }
    return [{ text: formatted }];
  }

  return [];
}

// -------------------------------------------------------------
// Universal Global Audio State & Engine
// Unified audio architecture that operates identically across
// Laptop, PC, Mobile (iOS/Android), Tablet, and APK/WebViews.
// -------------------------------------------------------------

export type AudioContextStateStatus = "uninitialized" | "suspended" | "running" | "interrupted" | "closed" | "unsupported";

export type AudioPlaybackStatus = "READY" | "READING" | "GENERATING" | "PLAYING" | "PAUSED" | "FINISHED" | "ERROR";

export interface GlobalAudioState {
  currentTrack: AudioTrack | null;
  segments: SpeechSegment[];
  currentSegmentIndex: number;
  totalSegments: number;
  progress: number;
  playbackStatus: AudioPlaybackStatus;
  isPlaying: boolean;
  isFinished: boolean;
  isLoading: boolean;
  isMuted: boolean;
  volume: number;
  playbackRate: number;
  activeVoiceId: string;
  activeGender: VoiceGender;
  narratorName: string;
  hasAutoplayBlock: boolean;
  errorMessage?: string | null;
  currentVerseNum: number | null;
  audioContextStatus: AudioContextStateStatus;
  isAudioContextReady: boolean;
}

export interface ActiveAudioSession {
  track: AudioTrack;
  segments: SpeechSegment[];
  currentSegmentIndex: number;
  audioUrl: string;
  voiceId: string;
  gender: VoiceGender;
  startedAt: number;
  isPlaying: boolean;
}

/**
 * Detects iOS devices (iPhone, iPad, iPod) and iPadOS on WebKit.
 */
export function isIOS(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent || "") ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/**
 * Robust State Management Engine for Web Audio API AudioContext.
 * Automatically monitors lifecycle states and activates on first user gesture.
 */
export class AudioContextStateManager {
  private ctx: AudioContext | null = null;
  private status: AudioContextStateStatus = "uninitialized";
  private listeners: Set<(status: AudioContextStateStatus) => void> = new Set();
  private isUserGestureBound: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.bindUserInteractionListeners();
    }
  }

  public getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.status = this.ctx.state as AudioContextStateStatus;
          this.ctx.onstatechange = () => {
            if (this.ctx) {
              this.updateStatus(this.ctx.state as AudioContextStateStatus);
            }
          };
        } else {
          this.status = "unsupported";
        }
      } catch (err) {
        console.warn("[AudioContextStateManager] Notice creating AudioContext:", err);
      }
    }
    return this.ctx;
  }

  public getStatus(): AudioContextStateStatus {
    if (this.ctx) {
      return this.ctx.state as AudioContextStateStatus;
    }
    return this.status;
  }

  public isReady(): boolean {
    return this.getStatus() === "running";
  }

  public subscribe(fn: (status: AudioContextStateStatus) => void): () => void {
    this.listeners.add(fn);
    fn(this.getStatus());
    return () => this.listeners.delete(fn);
  }

  private updateStatus(newStatus: AudioContextStateStatus) {
    if (this.status === newStatus) return;
    this.status = newStatus;
    this.listeners.forEach((fn) => {
      try {
        fn(newStatus);
      } catch {}
    });
    // If browser tab sleeps or loses focus and suspends again, re-bind listeners
    if (newStatus === "suspended" || newStatus === "interrupted") {
      this.bindUserInteractionListeners();
    }
  }

  public async ensureRunning(): Promise<boolean> {
    const ctx = this.getContext();
    if (!ctx) return false;

    if (ctx.state === "running") {
      this.updateStatus("running");
      return true;
    }

    try {
      await ctx.resume();

      // On iOS Safari / WebKit: Play a micro silent buffer to unlock the audio output pipeline
      try {
        const silentBuf = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = silentBuf;
        source.connect(ctx.destination);
        source.start(0);
      } catch {}

      this.updateStatus(ctx.state as AudioContextStateStatus);
      return (ctx.state as string) === "running";
    } catch (err) {
      console.warn("[AudioContextStateManager] AudioContext resume note:", err);
      this.updateStatus(ctx.state as AudioContextStateStatus);
      return false;
    }
  }

  public bindUserInteractionListeners() {
    if (typeof window === "undefined" || this.isUserGestureBound) return;
    this.isUserGestureBound = true;

    const handleUserGesture = async () => {
      try {
        await this.ensureRunning();
        unlockAudio();
      } catch {}

      if (this.isReady()) {
        const events = ["click", "touchstart", "touchend", "pointerdown", "keydown"];
        events.forEach((evt) => {
          window.removeEventListener(evt, handleUserGesture, true);
        });
        this.isUserGestureBound = false;
      }
    };

    const events = ["click", "touchstart", "touchend", "pointerdown", "keydown"];
    events.forEach((evt) => {
      window.addEventListener(evt, handleUserGesture, { capture: true, passive: true });
    });

    // Auto-resume on iOS tab return and visibility wake
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          this.ensureRunning().catch(() => {});
        }
      }, { passive: true });
    }
  }
}

export const audioContextManager = new AudioContextStateManager();

let sharedAudioElement: HTMLAudioElement | null = null;

// 0.05s silent WAV audio data URI to prime HTMLAudioElement on iOS Safari and Android Chrome
const SILENT_WAV_DATA_URI = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAP8A";

/**
 * Creates or retrieves the single master HTMLAudioElement.
 * Embedded directly in document.body with playsinline and x-webkit-airplay
 * to ensure iOS Safari, Android Chrome, and APK WebViews treat it
 * as an active foreground media element that never gets suspended.
 */
export function getOrCreateMasterAudioElement(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudioElement) {
    try {
      const existingInDom = document.getElementById("gtc-master-audio-player") as HTMLAudioElement | null;
      if (existingInDom) {
        sharedAudioElement = existingInDom;
      } else {
        sharedAudioElement = new Audio();
        sharedAudioElement.id = "gtc-master-audio-player";
        sharedAudioElement.preload = "auto";
        (sharedAudioElement as any).playsInline = true;
        sharedAudioElement.setAttribute("playsinline", "true");
        sharedAudioElement.setAttribute("webkit-playsinline", "true");
        sharedAudioElement.setAttribute("x-webkit-airplay", "allow");
        sharedAudioElement.setAttribute("aria-hidden", "true");

        // Error safety: ignore benign errors when src is unset or idle
        sharedAudioElement.onerror = () => {
          if (!sharedAudioElement?.src || 
              sharedAudioElement.src === window.location.href || 
              sharedAudioElement.src.endsWith("/")) {
            return;
          }
        };

        sharedAudioElement.muted = false;
        if (!isIOS()) {
          try {
            sharedAudioElement.volume = getSavedAudioVolume();
          } catch {}
        }

        if (typeof document !== "undefined" && document.body) {
          sharedAudioElement.style.position = "fixed";
          sharedAudioElement.style.bottom = "0";
          sharedAudioElement.style.right = "0";
          sharedAudioElement.style.width = "1px";
          sharedAudioElement.style.height = "1px";
          sharedAudioElement.style.opacity = "0.01";
          sharedAudioElement.style.pointerEvents = "none";
          sharedAudioElement.style.zIndex = "-1";
          document.body.appendChild(sharedAudioElement);
        }
      }
      bluetoothAudioService.registerMediaElement(sharedAudioElement);
    } catch (e) {
      console.warn("[GlobalAudioEngine] Audio element creation notice:", e);
    }
  }
  return sharedAudioElement;
}

export function getSharedAudioPlayer(): HTMLAudioElement | null {
  return getOrCreateMasterAudioElement();
}

/**
 * Universal Hardware Audio Unlocker
 * Wakes up AudioContext, primes HTMLAudioElement for iOS Safari / Android Chrome, and prepares synthesis.
 * Note: Never overrides player.src with dummy audio during active playback flows to prevent AbortError.
 */
export function unlockAudio(): boolean {
  if (typeof window === "undefined") return false;
  try {
    // 1. Hardware Web Audio API Unlock via manager
    audioContextManager.ensureRunning().catch(() => {});

    // 2. Hardware HTMLAudioElement ready state
    const player = getOrCreateMasterAudioElement();
    if (player) {
      player.muted = false;
      if (!isIOS()) {
        try {
          player.volume = getSavedAudioVolume();
        } catch {}
      }
    }

    // 3. SpeechSynthesis Engine Unlock (if available)
    if ("speechSynthesis" in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      try {
        window.speechSynthesis.getVoices();
      } catch {}
    }

    return true;
  } catch (e) {
    return false;
  }
}

class GlobalAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private currentTrack: AudioTrack | null = null;
  private segments: SpeechSegment[] = [];
  private currentSegmentIndex: number = 0;
  private playbackStatus: AudioPlaybackStatus = "READY";
  private isPlaying: boolean = false;
  private isFinished: boolean = false;
  private isLoading: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 1.0;
  private playbackRate: number = 0.95;
  private activeVoiceId: string = "";
  private activeGender: VoiceGender = "male";
  private narratorName: string = "Narrator";
  private hasAutoplayBlock: boolean = false;
  private errorMessage: string | null = null;
  private listeners: Set<(state: GlobalAudioState) => void> = new Set();
  private keepAliveInterval: any = null;
  private currentPlaySessionId: number = 0;

  constructor() {
    if (typeof window !== "undefined") {
      this.isMuted = getSavedMuteState();
      this.volume = getSavedAudioVolume();
      this.activeGender = getSavedVoiceGender();
      this.activeVoiceId = getSavedVoiceId();

      const initialVoice = getNaturalBibleVoice(this.activeGender, this.activeVoiceId);
      this.narratorName = initialVoice.voiceName;

      audioContextManager.subscribe(() => {
        this.notify();
      });

      // Synchronize stop audio events across tabs and components
      window.addEventListener("gtc_stop_audio", () => {
        this.stop();
      });

      window.addEventListener("gtc_web_voices_loaded", () => {
        const resolved = getNaturalBibleVoice(this.activeGender, this.activeVoiceId);
        if (resolved.voice) {
          this.narratorName = resolved.voice.name;
          if (!this.activeVoiceId) {
            this.activeVoiceId = resolved.voice.voiceURI || resolved.voice.name;
          }
        }
        this.notify();
      });
    }
  }

  public getAudioElement(): HTMLAudioElement | null {
    if (!this.audio) {
      this.audio = getOrCreateMasterAudioElement();
    }
    return this.audio;
  }

  public getState(): GlobalAudioState {
    const total = this.segments.length;
    const progress = total > 0 ? Math.round(((this.currentSegmentIndex + 1) / total) * 100) : 0;
    const currentSeg = this.segments[this.currentSegmentIndex];
    return {
      currentTrack: this.currentTrack,
      segments: this.segments,
      currentSegmentIndex: this.currentSegmentIndex,
      totalSegments: total,
      progress,
      playbackStatus: this.playbackStatus,
      isPlaying: this.isPlaying,
      isFinished: this.isFinished,
      isLoading: this.isLoading,
      isMuted: this.isMuted,
      volume: this.volume,
      playbackRate: this.playbackRate,
      activeVoiceId: this.activeVoiceId,
      activeGender: this.activeGender,
      narratorName: this.narratorName,
      hasAutoplayBlock: this.hasAutoplayBlock,
      errorMessage: this.errorMessage,
      currentVerseNum: currentSeg?.verseNum || null,
      audioContextStatus: audioContextManager.getStatus(),
      isAudioContextReady: audioContextManager.isReady(),
    };
  }

  public subscribe(listener: (state: GlobalAudioState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (e) {
        console.warn("[GlobalAudioEngine] Listener notice:", e);
      }
    });
  }

  public playTrack(
    track: AudioTrack,
    options?: { startSegment?: number; voiceId?: string; gender?: VoiceGender; rate?: number }
  ): boolean {
    if (typeof window === "undefined") return false;

    // Deduplication protection: If the exact same track is already active, don't restart needlessly
    const targetStartSeg = options?.startSegment !== undefined ? options.startSegment : 0;
    if (
      this.currentTrack &&
      this.currentTrack.id === track.id &&
      (this.isPlaying || this.isLoading) &&
      this.currentSegmentIndex === targetStartSeg &&
      Date.now() - this.currentPlaySessionId < 1500
    ) {
      console.log("[GlobalAudioEngine] Track already active, skipping redundant start:", track.id);
      return true;
    }

    this.currentPlaySessionId = Date.now();
    const sessionId = this.currentPlaySessionId;

    // 1. Hardware unlock immediately within user touch/click gesture
    unlockAudio();
    this.isMuted = false;
    setSavedMuteState(false);
    this.errorMessage = null;

    // 2. Build segments
    const segments = buildSegmentsFromTrack(track);
    if (segments.length === 0) {
      console.warn("[GlobalAudioEngine] Track has no valid speech segments to narrate:", track.id);
      this.playbackStatus = "ERROR";
      this.errorMessage = "No readable scripture text available for this passage.";
      this.notify();
      return false;
    }

    // 3. Resolve target voice & gender
    const targetVoice = options?.voiceId || track.voiceId || this.activeVoiceId || getSavedVoiceId();
    const targetGender = options?.gender || this.activeGender || getSavedVoiceGender();
    this.activeVoiceId = targetVoice;
    this.activeGender = targetGender;

    const natural = getNaturalBibleVoice(targetGender, targetVoice);
    this.narratorName = natural.voiceName;

    if (options?.rate) {
      this.playbackRate = options.rate;
    }

    this.currentTrack = track;
    this.segments = segments;
    this.isFinished = false;
    this.hasAutoplayBlock = false;
    this.playbackStatus = "READY";
    this.isLoading = true;
    this.isPlaying = false;

    console.log(
      `[GlobalAudioEngine] 🎵 Starting Track: "${track.title}" • Voice="${this.activeVoiceId}" (${this.narratorName}) • ${segments.length} segments`
    );

    // 4. Update MediaSession metadata for lock screen & notifications
    this.updateMediaSession(track);

    // 5. Play initial segment
    const startIdx = options?.startSegment !== undefined ? options.startSegment : 0;
    this.playCurrentSegment(startIdx, sessionId);
    return true;
  }

  public togglePlay() {
    unlockAudio();
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public pause() {
    this.isPlaying = false;
    this.isLoading = false;
    this.playbackStatus = "PAUSED";
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.playbackState = "paused";
      } catch {}
    }
    this.stopKeepAlive();
    this.currentTrack?.onPlaybackStateChange?.(false);
    console.log("[GlobalAudioEngine] ⏸️ Audio playback PAUSED.");
    this.notify();
  }

  public resume() {
    unlockAudio();
    this.isMuted = false;
    this.errorMessage = null;
    setSavedMuteState(false);

    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.playbackState = "playing";
      } catch {}
    }

    if (this.isFinished || this.getState().progress >= 100) {
      this.playCurrentSegment(0, this.currentPlaySessionId);
      return;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        this.playbackStatus = "READING";
        this.isPlaying = true;
        this.isLoading = false;
        this.startKeepAlive();
        this.currentTrack?.onPlaybackStateChange?.(true);
        this.notify();
        return;
      }
    }

    this.playCurrentSegment(this.currentSegmentIndex, this.currentPlaySessionId);
  }

  public stop() {
    this.currentPlaySessionId = Date.now();
    this.isPlaying = false;
    this.isLoading = false;
    this.isFinished = false;
    this.playbackStatus = "READY";
    this.errorMessage = null;
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.playbackState = "none";
      } catch {}
    }
    this.currentTrack?.onPlaybackStateChange?.(false);
    this.currentTrack = null;
    this.segments = [];
    this.currentSegmentIndex = 0;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.stopKeepAlive();
    console.log("[GlobalAudioEngine] ⏹️ Audio playback STOPPED and reset.");
    this.notify();
  }

  public nextSegment() {
    if (this.currentSegmentIndex + 1 < this.segments.length) {
      this.playCurrentSegment(this.currentSegmentIndex + 1, this.currentPlaySessionId);
    }
  }

  public prevSegment() {
    if (this.currentSegmentIndex > 0) {
      this.playCurrentSegment(this.currentSegmentIndex - 1, this.currentPlaySessionId);
    } else {
      this.playCurrentSegment(0, this.currentPlaySessionId);
    }
  }

  public seekSegment(index: number) {
    if (index >= 0 && index < this.segments.length) {
      this.playCurrentSegment(index, this.currentPlaySessionId);
    }
  }

  public setVoice(newVoiceId: string) {
    this.activeVoiceId = newVoiceId;
    setSavedVoiceId(newVoiceId);
    const resolved = getNaturalBibleVoice(this.activeGender, newVoiceId);
    if (resolved.voice) {
      this.narratorName = resolved.voice.name;
      this.activeGender = resolved.gender;
    }
    console.log(`[GlobalAudioEngine] Voice selector changed to: "${newVoiceId}" (${this.narratorName})`);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("gtc_voice_changed", {
          detail: { voiceId: newVoiceId, gender: this.activeGender, name: this.narratorName }
        })
      );
    }

    this.notify();
    if (this.isPlaying && this.segments.length > 0) {
      this.playCurrentSegment(this.currentSegmentIndex, this.currentPlaySessionId);
    }
  }

  public setGender(gender: VoiceGender) {
    this.activeGender = gender;
    setSavedVoiceGender(gender);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const voices = getAvailableWebVoices();
      const best = findBestVoiceForGender(voices, gender);
      if (best) {
        this.setVoice(best.voiceURI || best.name);
      }
    }
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    this.notify();
    if (this.isPlaying && this.segments.length > 0) {
      this.playCurrentSegment(this.currentSegmentIndex, this.currentPlaySessionId);
    }
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.volume = clamped;
    setSavedAudioVolume(clamped);
    if (clamped === 0) {
      this.isMuted = true;
      setSavedMuteState(true);
    } else {
      this.isMuted = false;
      setSavedMuteState(false);
    }
    this.notify();
  }

  public toggleMute() {
    unlockAudio();
    this.isMuted = !this.isMuted;
    setSavedMuteState(this.isMuted);
    this.notify();
  }

  private finishPlayback() {
    console.log(`[GlobalAudioEngine] 🏁 Continuous narration completed all verses.`);
    this.isPlaying = false;
    this.isFinished = true;
    this.isLoading = false;
    this.playbackStatus = "FINISHED";
    this.currentSegmentIndex = Math.max(0, this.segments.length - 1);
    this.stopKeepAlive();
    this.notify();
    this.currentTrack?.onChapterComplete?.();
    this.currentTrack?.onPlaybackStateChange?.(false);
  }

  private playCurrentSegment(index: number, sessionId: number) {
    if (sessionId !== this.currentPlaySessionId) return;

    if (index >= this.segments.length) {
      this.finishPlayback();
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("[GlobalAudioEngine] window.speechSynthesis is not supported in this environment.");
      this.playbackStatus = "ERROR";
      this.errorMessage = "Speech synthesis is not supported in this browser.";
      this.isLoading = false;
      this.isPlaying = false;
      this.notify();
      return;
    }

    const currentSeg = this.segments[index];
    const rawText = (currentSeg.text || "").trim();
    const formattedText = formatBibleTextForSpeech(rawText);

    if (!formattedText) {
      console.warn(`[GlobalAudioEngine] Segment ${index + 1} text is empty, advancing.`);
      if (index + 1 < this.segments.length) {
        this.playCurrentSegment(index + 1, sessionId);
      } else {
        this.finishPlayback();
      }
      return;
    }

    this.currentSegmentIndex = index;
    this.isFinished = false;
    this.errorMessage = null;

    // Do NOT fake playing state: accurate READY/Loading status before speech starts
    this.playbackStatus = "READY";
    this.isLoading = true;
    this.isPlaying = false;
    this.notify();

    // Maintain iOS Lock Screen media playback permissions
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.playbackState = "playing";
      } catch {}
    }

    try {
      // Cancel previous utterance safely before starting new
      window.speechSynthesis.cancel();
      this.stopKeepAlive();

      const utterance = new SpeechSynthesisUtterance(formattedText);

      // Resolve voice and ensure it is assigned directly to utterance.voice
      const resolved = getNaturalBibleVoice(this.activeGender, this.activeVoiceId);
      if (resolved.voice) {
        utterance.voice = resolved.voice;
        this.narratorName = resolved.voice.name;
      }
      utterance.pitch = resolved.pitch || 1.0;
      utterance.rate = this.playbackRate || resolved.rate || 0.95;
      utterance.volume = this.isMuted ? 0 : this.volume;

      utterance.onstart = () => {
        if (this.currentPlaySessionId !== sessionId) return;
        console.log(
          `[GlobalAudioEngine:WebSpeech] 🎙️ Reading aloud segment ${index + 1}/${this.segments.length}: ` +
          `"${formattedText.substring(0, 45)}..." | Voice: ${utterance.voice?.name || "System Default"}`
        );
        this.playbackStatus = "READING";
        this.isPlaying = true;
        this.isLoading = false;
        this.hasAutoplayBlock = false;
        this.errorMessage = null;
        this.startKeepAlive();
        this.notify();

        if (currentSeg.verseNum && this.currentTrack?.onVerseChange) {
          this.currentTrack.onVerseChange(currentSeg.verseNum);
        }
        this.currentTrack?.onPlaybackStateChange?.(true);
      };

      utterance.onpause = () => {
        if (this.currentPlaySessionId !== sessionId) return;
        this.playbackStatus = "PAUSED";
        this.isPlaying = false;
        this.notify();
        this.currentTrack?.onPlaybackStateChange?.(false);
      };

      utterance.onresume = () => {
        if (this.currentPlaySessionId !== sessionId) return;
        this.playbackStatus = "READING";
        this.isPlaying = true;
        this.notify();
        this.currentTrack?.onPlaybackStateChange?.(true);
      };

      utterance.onend = () => {
        this.stopKeepAlive();
        if (this.currentPlaySessionId === sessionId) {
          if (index + 1 < this.segments.length) {
            this.playCurrentSegment(index + 1, sessionId);
          } else {
            this.finishPlayback();
          }
        }
      };

      utterance.onerror = (e) => {
        this.stopKeepAlive();
        if (e.error === "canceled" || e.error === "interrupted") {
          return;
        }
        console.error("[GlobalAudioEngine:WebSpeech] Utterance error:", e);
        if (this.currentPlaySessionId === sessionId) {
          this.playbackStatus = "ERROR";
          this.errorMessage = `Speech synthesis error: ${e.error || "playback failed"}`;
          this.isLoading = false;
          this.isPlaying = false;
          this.notify();
          this.currentTrack?.onPlaybackStateChange?.(false);
        }
      };

      // 25ms delay avoids WebKit/Blink cancel-speak race condition
      setTimeout(() => {
        if (this.currentPlaySessionId === sessionId) {
          window.speechSynthesis.speak(utterance);
        }
      }, 25);
    } catch (err: any) {
      console.error("[GlobalAudioEngine:WebSpeech] Failed to speak segment:", err);
      this.playbackStatus = "ERROR";
      this.errorMessage = err?.message || "Speech synthesis failed.";
      this.isLoading = false;
      this.isPlaying = false;
      this.notify();
    }
  }

  private startKeepAlive() {
    this.stopKeepAlive();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    this.keepAliveInterval = window.setInterval(() => {
      if (this.isPlaying && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 12000);
  }

  private stopKeepAlive() {
    if (this.keepAliveInterval !== null) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  private updateMediaSession(track: AudioTrack) {
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: "Global Tower of Christ",
          album: track.subtitle || "Scripture Audio",
          artwork: [
            { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
            { src: "/favicon.svg", sizes: "512x512", type: "image/svg+xml" }
          ]
        });
        navigator.mediaSession.setActionHandler("play", () => this.resume());
        navigator.mediaSession.setActionHandler("pause", () => this.pause());
        navigator.mediaSession.setActionHandler("nexttrack", () => this.nextSegment());
        navigator.mediaSession.setActionHandler("previoustrack", () => this.prevSegment());
      } catch (e) {
        // ignore
      }
    }
  }
}

export const globalAudioEngine = new GlobalAudioEngine();

/**
 * Backwards compatible adapters
 */
export function startSynchronousAudioPlayback(
  track: AudioTrack,
  overrideVoiceId?: string,
  overrideGender?: VoiceGender
): boolean {
  const chosenVoice = overrideVoiceId || track.voiceId || getSavedVoiceId();
  const chosenGender = overrideGender || getSavedVoiceGender();
  return globalAudioEngine.playTrack(track, {
    voiceId: chosenVoice,
    gender: chosenGender,
  });
}

export function getActiveAudioSession(): ActiveAudioSession | null {
  const state = globalAudioEngine.getState();
  if (!state.currentTrack) return null;
  return {
    track: state.currentTrack,
    segments: state.segments,
    currentSegmentIndex: state.currentSegmentIndex,
    audioUrl: "",
    voiceId: state.activeVoiceId,
    gender: state.activeGender,
    startedAt: Date.now(),
    isPlaying: state.isPlaying
  };
}

export function clearActiveAudioSession(): void {
  globalAudioEngine.stop();
}

// Global user interaction trigger for instant audio capability on touch
let hasSetupGlobalUnlock = false;
if (typeof window !== "undefined" && !hasSetupGlobalUnlock) {
  hasSetupGlobalUnlock = true;
  const userInteractionTrigger = () => {
    unlockAudio();
  };
  window.addEventListener("pointerdown", userInteractionTrigger, { passive: true });
  window.addEventListener("keydown", userInteractionTrigger, { passive: true });
  window.addEventListener("touchstart", userInteractionTrigger, { passive: true });
}

export const PREFERRED_MALE_VOICES = [
  "Microsoft Guy Online (Natural)",
  "Microsoft Christopher Online (Natural)",
  "Microsoft Eric Online (Natural)",
  "Microsoft Ryan Online (Natural)",
  "Microsoft David",
  "Microsoft Mark",
  "Microsoft George",
  "Microsoft Steffan Online (Natural)",
  "Microsoft Andrew Online (Natural)",
  "Microsoft Brian Online (Natural)",
  "en-US-Neural2-D",
  "en-US-Neural2-J",
  "Google UK English Male",
  "en-GB-Neural2-B",
  "en-GB-Neural2-D",
  "en-US-Standard-B",
  "en-US-Standard-D",
  "Google US English"
];

export const PREFERRED_FEMALE_VOICES = [
  "Microsoft Jenny Online (Natural)",
  "Microsoft Aria Online (Natural)",
  "Microsoft Sonia Online (Natural)",
  "Microsoft Libby Online (Natural)",
  "Microsoft Zira",
  "Microsoft Michelle Online (Natural)",
  "Microsoft Ava Online (Natural)",
  "Microsoft Emma Online (Natural)",
  "en-US-Neural2-F",
  "en-US-Neural2-C",
  "Google UK English Female",
  "en-GB-Neural2-A",
  "en-GB-Neural2-C",
  "en-US-Standard-C",
  "Samantha",
  "Victoria",
  "Google US English"
];

/**
 * Returns a direct URL to the Server TTS endpoint (/api/tts).
 * Properly passes the selected voice ID so the server synthesizes the EXACT requested voice.
 */
export function getAudioTTSUrl(text: string, voiceId?: string, gender?: VoiceGender): string {
  const clean = text.trim();
  const activeGender = gender || getSavedVoiceGender();
  const activeVoiceId = voiceId || getSavedVoiceId();

  console.log(`[AudioTTS URL] Requesting TTS stream:`, {
    selectedVoice: activeVoiceId,
    gender: activeGender,
    textLength: clean.length,
    snippet: clean.substring(0, 40) + "..."
  });

  return `/api/tts?voice=${encodeURIComponent(activeVoiceId)}&gender=${encodeURIComponent(activeGender)}&text=${encodeURIComponent(clean)}`;
}

/**
 * Alias for getAudioTTSUrl to maintain compatibility across legacy callers.
 */
export function getMicrosoftTTSUrl(text: string, genderOrVoice?: VoiceGender | string): string {
  if (genderOrVoice === "male" || genderOrVoice === "female") {
    const savedVoiceId = getSavedVoiceId();
    const savedGender = getSavedVoiceGender();
    // If the saved voice matches the requested gender, use the saved voice
    const targetVoice = (savedGender === genderOrVoice)
      ? savedVoiceId
      : (genderOrVoice === "female" ? "en-US-JennyNeural" : "en-US-GuyNeural");
    return getAudioTTSUrl(text, targetVoice, genderOrVoice);
  }
  return getAudioTTSUrl(text, genderOrVoice);
}

/**
 * Resolves the requested voice in browser SpeechSynthesis at runtime.
 * Explicitly enumerates available voices and finds the requested voice.
 * Never silently defaults without clear diagnostic logging.
 */
export function getNaturalBibleVoice(
  genderParam?: VoiceGender,
  requestedVoiceId?: string
): NarratorVoiceConfig & { requestedVoice: string; actualVoiceName: string; fallbackUsed: boolean; provider: string } {
  const gender: VoiceGender = genderParam || getSavedVoiceGender();
  const rawTargetVoiceId = requestedVoiceId || getSavedVoiceId();

  const isBrowserVoice = rawTargetVoiceId.startsWith("browser:");
  const searchName = isBrowserVoice ? rawTargetVoiceId.replace("browser:", "") : rawTargetVoiceId;

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn(`[SpeechSynthesis] window.speechSynthesis unavailable in this environment. Requested: "${rawTargetVoiceId}"`);
    return {
      voice: null,
      pitch: gender === "male" ? 0.94 : 1.02,
      rate: 0.94,
      gender,
      voiceName: gender === "male" ? "Guy (Natural Male)" : "Jenny (Natural Female)",
      requestedVoice: rawTargetVoiceId,
      actualVoiceName: "None (SpeechSynthesis unavailable)",
      fallbackUsed: true,
      provider: "none"
    };
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    console.warn(`[SpeechSynthesis] No voices enumerated by browser yet. Requested: "${rawTargetVoiceId}"`);
    return {
      voice: null,
      pitch: gender === "male" ? 0.94 : 1.02,
      rate: 0.94,
      gender,
      voiceName: gender === "male" ? "Guy (Natural Male)" : "Jenny (Natural Female)",
      requestedVoice: rawTargetVoiceId,
      actualVoiceName: "None (Empty voice list)",
      fallbackUsed: true,
      provider: "none"
    };
  }

  // Filter out unwanted / robotic voices
  const validVoices = voices.filter((v) => {
    const lower = (v.name + " " + v.voiceURI).toLowerCase();
    return !BANNED_VOICE_NAMES.some((banned) => lower.includes(banned));
  });
  const voicePool = validVoices.length > 0 ? validVoices : voices;

  // 1. Direct match by URI or exact name
  const exactMatch = voicePool.find(
    (v) =>
      v.voiceURI === searchName ||
      v.name === searchName ||
      v.voiceURI.toLowerCase() === searchName.toLowerCase() ||
      v.name.toLowerCase() === searchName.toLowerCase()
  );

  if (exactMatch) {
    console.log(`[SpeechSynthesis] Requested voice "${rawTargetVoiceId}" FOUND:`, {
      name: exactMatch.name,
      lang: exactMatch.lang,
      voiceURI: exactMatch.voiceURI,
      fallbackUsed: false
    });
    return {
      voice: exactMatch,
      pitch: gender === "male" ? 0.94 : 1.02,
      rate: 0.94,
      gender,
      voiceName: exactMatch.name,
      requestedVoice: rawTargetVoiceId,
      actualVoiceName: exactMatch.name,
      fallbackUsed: false,
      provider: "browser"
    };
  }

  // 2. Partial match on voice name (e.g. if user selected "en-US-ChristopherNeural" or "Christopher")
  const cleanKeyword = searchName
    .replace(/^(en-US-|en-GB-|Microsoft |Google |Online \(Natural\)|Neural)/gi, "")
    .trim()
    .toLowerCase();

  if (cleanKeyword.length >= 3) {
    const keywordMatch = voicePool.find(
      (v) => v.name.toLowerCase().includes(cleanKeyword) || v.voiceURI.toLowerCase().includes(cleanKeyword)
    );
    if (keywordMatch) {
      console.log(`[SpeechSynthesis] Requested voice "${rawTargetVoiceId}" matched by keyword "${cleanKeyword}":`, {
        name: keywordMatch.name,
        lang: keywordMatch.lang,
        fallbackUsed: false
      });
      return {
        voice: keywordMatch,
        pitch: gender === "male" ? 0.94 : 1.02,
        rate: 0.94,
        gender,
        voiceName: keywordMatch.name,
        requestedVoice: rawTargetVoiceId,
        actualVoiceName: keywordMatch.name,
        fallbackUsed: false,
        provider: "browser"
      };
    }
  }

  // 3. Fallback: select best natural browser voice for gender
  const fallbackMatch = findBestVoiceForGender(voicePool, gender);

  console.warn(`[SpeechSynthesis] Requested voice "${rawTargetVoiceId}" NOT directly found in browser voices. Fallback used:`, {
    requestedVoice: rawTargetVoiceId,
    fallbackVoice: fallbackMatch?.name || "System default",
    lang: fallbackMatch?.lang,
    fallbackUsed: true
  });

  return {
    voice: fallbackMatch || null,
    pitch: gender === "male" ? 0.94 : 1.02,
    rate: 0.94,
    gender,
    voiceName: fallbackMatch ? fallbackMatch.name : (gender === "male" ? "Natural Male" : "Natural Female"),
    requestedVoice: rawTargetVoiceId,
    actualVoiceName: fallbackMatch ? fallbackMatch.name : "System Default",
    fallbackUsed: true,
    provider: "browser"
  };
}

/**
 * Prepares the biblical text for audio recitation.
 * IMPORTANT CONSTRAINT:
 * Do not change, paraphrase, shorten, or add to the biblical text.
 * Only introduces natural breathing punctuation pauses (commas/periods cadence).
 */
export function formatBibleTextForSpeech(text: string): string {
  if (!text) return "";

  return text
    // Replace semi-colons and colons with natural pause-inducing commas
    .replace(/;/g, ", ")
    // Ensure em-dashes and hyphens have natural breathing space
    .replace(/—/g, ", ")
    .replace(/--/g, ", ")
    // Remove bracketed verse citation numbers like [1] or (v. 4)
    .replace(/\[\d+\]/g, "")
    // Ensure periods and exclamation marks have a clean break so sentences don't collide
    .replace(/\.([A-Za-z])/g, ". $1")
    // Clean redundant whitespace
    .replace(/\s+/g, " ")
    .trim();
}

// Aliases for backwards compatibility
export const getDeeperManlyVoice = () => getNaturalBibleVoice("male");
