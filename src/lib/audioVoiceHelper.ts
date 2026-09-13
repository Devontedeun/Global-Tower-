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

    // Check if the currently saved voice belongs to this gender
    const currentVoiceId = getSavedVoiceId();
    const currentVoice = SERVER_VOICES.find((v) => v.id === currentVoiceId);
    if (currentVoice && currentVoice.gender !== gender) {
      const defaultVoice = gender === "female" ? "en-US-JennyNeural" : "en-US-GuyNeural";
      localStorage.setItem(VOICE_STORAGE_KEY, defaultVoice);
      console.log(`[AudioVoiceHelper] Gender changed to "${gender}", updated default voice to "${defaultVoice}"`);
      window.dispatchEvent(
        new CustomEvent("gtc_voice_changed", {
          detail: { voiceId: defaultVoice, gender }
        })
      );
    }
  } catch (e) {
    // ignore
  }
}

/**
 * Retrieve the saved voice ID from localStorage.
 * Restores seamlessly after page reload.
 */
export function getSavedVoiceId(): string {
  if (typeof window === "undefined") return "en-US-GuyNeural";
  try {
    const saved = localStorage.getItem(VOICE_STORAGE_KEY);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch (e) {
    // fallback
  }
  const gender = getSavedVoiceGender();
  return gender === "female" ? "en-US-JennyNeural" : "en-US-GuyNeural";
}

/**
 * Persist the selected voice ID to localStorage and notify all active listeners.
 */
export function setSavedVoiceId(voiceId: string) {
  if (typeof window === "undefined" || !voiceId) return;
  try {
    localStorage.setItem(VOICE_STORAGE_KEY, voiceId);

    // If it's a known server voice, align saved gender as well
    const serverVoice = SERVER_VOICES.find((v) => v.id === voiceId);
    let activeGender = getSavedVoiceGender();
    if (serverVoice) {
      activeGender = serverVoice.gender;
      localStorage.setItem(GENDER_STORAGE_KEY, activeGender);
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
      if (fullVerse.length > 180) {
        const sub = splitTextIntoNaturalChunks(fullVerse, 160);
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
    const sub = splitTextIntoNaturalChunks(formatted, 160);
    return sub.map((chunk) => ({ text: chunk }));
  }

  return [];
}

// -------------------------------------------------------------
// Universal Global Audio State & Engine
// Unified audio architecture that operates identically across
// Laptop, PC, Mobile (iOS/Android), Tablet, and APK/WebViews.
// -------------------------------------------------------------

export interface GlobalAudioState {
  currentTrack: AudioTrack | null;
  segments: SpeechSegment[];
  currentSegmentIndex: number;
  totalSegments: number;
  progress: number;
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
  currentVerseNum: number | null;
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

let sharedAudioCtx: AudioContext | null = null;
let sharedAudioElement: HTMLAudioElement | null = null;
let hasSetupGlobalUnlock = false;

/**
 * Creates or retrieves the single master HTMLAudioElement.
 * Embedded directly in document.body with playsinline and crossOrigin
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
        sharedAudioElement.crossOrigin = "anonymous";
        (sharedAudioElement as any).playsInline = true;
        sharedAudioElement.setAttribute("playsinline", "true");
        sharedAudioElement.setAttribute("webkit-playsinline", "true");

        sharedAudioElement.muted = getSavedMuteState();
        sharedAudioElement.volume = getSavedMuteState() ? 0 : getSavedAudioVolume();

        if (typeof document !== "undefined" && document.body) {
          sharedAudioElement.style.position = "fixed";
          sharedAudioElement.style.left = "-9999px";
          sharedAudioElement.style.top = "-9999px";
          sharedAudioElement.style.width = "1px";
          sharedAudioElement.style.height = "1px";
          sharedAudioElement.style.opacity = "0.01";
          sharedAudioElement.style.pointerEvents = "none";
          sharedAudioElement.style.zIndex = "-9999";
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
 * Wakes up AudioContext and initializes speaker buffer on mobile & digital devices.
 */
export function unlockAudio(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      if (!sharedAudioCtx) {
        sharedAudioCtx = new AudioCtx();
      }
      if (sharedAudioCtx.state === "suspended") {
        sharedAudioCtx.resume().catch(() => {});
      }
      try {
        const buffer = sharedAudioCtx.createBuffer(1, 1, 22050);
        const source = sharedAudioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(sharedAudioCtx.destination);
        source.start(0);
      } catch (e) {
        // ignore micro-buffer notice
      }
    }

    const player = getOrCreateMasterAudioElement();
    if (player) {
      player.muted = getSavedMuteState();
      player.volume = getSavedMuteState() ? 0 : getSavedAudioVolume();
    }

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
  private isPlaying: boolean = false;
  private isFinished: boolean = false;
  private isLoading: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 1.0;
  private playbackRate: number = 1.0;
  private activeVoiceId: string = "en-US-GuyNeural";
  private activeGender: VoiceGender = "male";
  private narratorName: string = "Guy (Microsoft Neural • Reverent US)";
  private hasAutoplayBlock: boolean = false;
  private listeners: Set<(state: GlobalAudioState) => void> = new Set();
  private keepAliveInterval: any = null;
  private currentPlaySessionId: number = 0;

  constructor() {
    if (typeof window !== "undefined") {
      this.isMuted = getSavedMuteState();
      this.volume = getSavedAudioVolume();
      this.activeVoiceId = getSavedVoiceId();
      this.activeGender = getSavedVoiceGender();
      const serverVoice = SERVER_VOICES.find((v) => v.id === this.activeVoiceId);
      if (serverVoice) {
        this.narratorName = serverVoice.name;
        this.activeGender = serverVoice.gender;
      }
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
      currentVerseNum: currentSeg?.verseNum || null,
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

    this.currentPlaySessionId = Date.now();
    const sessionId = this.currentPlaySessionId;

    // 1. Hardware unlock immediately within user touch/click event
    unlockAudio();
    this.isMuted = false;
    setSavedMuteState(false);

    // 2. Build segments
    const segments = buildSegmentsFromTrack(track);
    if (segments.length === 0) return false;

    // 3. Resolve target voice & gender
    const targetVoice = options?.voiceId || track.voiceId || this.activeVoiceId || getSavedVoiceId();
    const targetGender = options?.gender || this.activeGender || getSavedVoiceGender();
    this.activeVoiceId = targetVoice;
    this.activeGender = targetGender;

    const serverVoice = SERVER_VOICES.find((v) => v.id === targetVoice);
    if (serverVoice) {
      this.narratorName = serverVoice.name;
    } else {
      const natural = getNaturalBibleVoice(targetGender, targetVoice);
      this.narratorName = natural.voiceName;
    }

    if (options?.rate) {
      this.playbackRate = options.rate;
    }

    this.currentTrack = track;
    this.segments = segments;
    this.isFinished = false;
    this.hasAutoplayBlock = false;

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
    const audio = this.getAudioElement();
    if (audio) {
      audio.pause();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
    this.stopKeepAlive();
    this.currentTrack?.onPlaybackStateChange?.(false);
    this.notify();
  }

  public resume() {
    unlockAudio();
    this.isPlaying = true;
    this.hasAutoplayBlock = false;
    this.isMuted = false;
    setSavedMuteState(false);

    if (this.isFinished || this.getState().progress >= 100) {
      this.playCurrentSegment(0, this.currentPlaySessionId);
      return;
    }

    const audio = this.getAudioElement();
    if (audio && audio.paused && audio.src) {
      audio.muted = false;
      audio.volume = this.volume;
      audio
        .play()
        .then(() => {
          this.hasAutoplayBlock = false;
          this.notify();
        })
        .catch(() => {
          this.playCurrentSegment(this.currentSegmentIndex, this.currentPlaySessionId);
        });
    } else if (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.startKeepAlive();
      this.notify();
    } else {
      this.playCurrentSegment(this.currentSegmentIndex, this.currentPlaySessionId);
    }
    this.currentTrack?.onPlaybackStateChange?.(true);
    this.notify();
  }

  public stop() {
    this.currentPlaySessionId = Date.now();
    this.isPlaying = false;
    this.isLoading = false;
    this.isFinished = false;
    this.currentTrack?.onPlaybackStateChange?.(false);
    this.currentTrack = null;
    this.segments = [];
    this.currentSegmentIndex = 0;

    const audio = this.getAudioElement();
    if (audio) {
      audio.pause();
      audio.onended = null;
      audio.onerror = null;
      audio.src = "";
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.stopKeepAlive();
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
    const serverVoice = SERVER_VOICES.find((v) => v.id === newVoiceId);
    if (serverVoice) {
      this.activeGender = serverVoice.gender;
      this.narratorName = serverVoice.name;
      setSavedVoiceGender(serverVoice.gender);
    }
    this.notify();
    if (this.isPlaying && this.segments.length > 0) {
      this.playCurrentSegment(this.currentSegmentIndex, this.currentPlaySessionId);
    }
  }

  public setGender(gender: VoiceGender) {
    this.activeGender = gender;
    setSavedVoiceGender(gender);
    const defaultVoice = gender === "female" ? "en-US-JennyNeural" : "en-US-GuyNeural";
    this.setVoice(defaultVoice);
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    const audio = this.getAudioElement();
    if (audio) {
      audio.playbackRate = rate;
    }
    this.notify();
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
    const audio = this.getAudioElement();
    if (audio) {
      audio.muted = this.isMuted;
      audio.volume = this.isMuted ? 0 : clamped;
    }
    this.notify();
  }

  public toggleMute() {
    unlockAudio();
    this.isMuted = !this.isMuted;
    setSavedMuteState(this.isMuted);
    const audio = this.getAudioElement();
    if (audio) {
      audio.muted = this.isMuted;
      audio.volume = this.isMuted ? 0 : this.volume;
      if (!this.isMuted && audio.paused && this.isPlaying) {
        audio.play().catch(() => {});
      }
    }
    if (!this.isMuted && this.hasAutoplayBlock) {
      this.hasAutoplayBlock = false;
      this.resume();
    }
    this.notify();
  }

  private playCurrentSegment(index: number, sessionId: number) {
    if (sessionId !== this.currentPlaySessionId) return;

    if (index >= this.segments.length) {
      this.isPlaying = false;
      this.isFinished = true;
      this.isLoading = false;
      this.currentSegmentIndex = Math.max(0, this.segments.length - 1);
      this.stopKeepAlive();
      this.notify();
      this.currentTrack?.onChapterComplete?.();
      this.currentTrack?.onPlaybackStateChange?.(false);
      return;
    }

    this.currentSegmentIndex = index;
    this.isFinished = false;
    this.isPlaying = true;
    this.isLoading = true;
    const currentSeg = this.segments[index];

    // Verse highlight notification
    if (currentSeg.verseNum && this.currentTrack?.onVerseChange) {
      this.currentTrack.onVerseChange(currentSeg.verseNum);
    }
    this.currentTrack?.onPlaybackStateChange?.(true);
    this.notify();

    // Cancel speech synthesis if active
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.stopKeepAlive();
    }

    // 1. Browser SpeechSynthesis voice branch
    if (this.activeVoiceId.startsWith("browser:")) {
      this.playWithSpeechSynthesis(currentSeg.text, index, sessionId);
      return;
    }

    // 2. Server Neural Voice via Master HTMLAudioElement
    try {
      const audio = this.getAudioElement();
      if (!audio) {
        this.playWithSpeechSynthesis(currentSeg.text, index, sessionId);
        return;
      }

      bluetoothAudioService.registerMediaElement(audio);

      const ttsUrl = this.currentTrack?.audioSrc && this.segments.length === 1
        ? this.currentTrack.audioSrc
        : getAudioTTSUrl(currentSeg.text, this.activeVoiceId, this.activeGender);

      audio.playbackRate = this.playbackRate;
      audio.muted = this.isMuted;
      audio.volume = this.isMuted ? 0 : this.volume;

      audio.onended = () => {
        if (this.isPlaying && this.currentPlaySessionId === sessionId) {
          this.playCurrentSegment(index + 1, sessionId);
        }
      };

      audio.onerror = () => {
        console.warn(`[GlobalAudioEngine] Master audio notice on segment ${index}, using resilient fallback.`);
        if (this.currentPlaySessionId === sessionId) {
          this.playWithSpeechSynthesis(currentSeg.text, index, sessionId);
        }
      };

      audio.onplaying = () => {
        if (this.currentPlaySessionId === sessionId) {
          this.isLoading = false;
          this.hasAutoplayBlock = false;
          this.notify();
        }
      };

      if (audio.src !== ttsUrl) {
        audio.src = ttsUrl;
      }
      audio.currentTime = 0;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (this.currentPlaySessionId === sessionId) {
              this.isLoading = false;
              this.hasAutoplayBlock = false;
              this.notify();
            }
          })
          .catch((err) => {
            if (err?.name === "AbortError") {
              return;
            }
            console.warn("[GlobalAudioEngine] Audio play notice:", err);
            if (err?.name === "NotAllowedError") {
              this.hasAutoplayBlock = true;
              this.notify();
              const resumeOnTouch = () => {
                audio.play().then(() => {
                  this.hasAutoplayBlock = false;
                  this.notify();
                }).catch(() => {});
                window.removeEventListener("touchstart", resumeOnTouch);
                window.removeEventListener("pointerdown", resumeOnTouch);
              };
              window.addEventListener("touchstart", resumeOnTouch, { once: true, passive: true });
              window.addEventListener("pointerdown", resumeOnTouch, { once: true, passive: true });
            } else {
              this.playWithSpeechSynthesis(currentSeg.text, index, sessionId);
            }
          });
      }

      // Prefetch next segment in browser HTTP cache
      if (index + 1 < this.segments.length) {
        const nextSeg = this.segments[index + 1];
        const nextUrl = getAudioTTSUrl(nextSeg.text, this.activeVoiceId, this.activeGender);
        fetch(nextUrl, { cache: "force-cache" }).catch(() => {});
      }
    } catch (e) {
      this.playWithSpeechSynthesis(currentSeg.text, index, sessionId);
    }
  }

  private playWithSpeechSynthesis(text: string, index: number, sessionId: number) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.isLoading = false;
      this.notify();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const resolved = getNaturalBibleVoice(this.activeGender, this.activeVoiceId);
      if (resolved.voice) utterance.voice = resolved.voice;
      utterance.pitch = resolved.pitch;
      utterance.rate = this.playbackRate || resolved.rate;

      utterance.onstart = () => {
        if (this.currentPlaySessionId === sessionId) {
          this.isLoading = false;
          this.hasAutoplayBlock = false;
          this.startKeepAlive();
          this.notify();
        }
      };

      utterance.onend = () => {
        this.stopKeepAlive();
        if (this.isPlaying && this.currentPlaySessionId === sessionId) {
          this.playCurrentSegment(index + 1, sessionId);
        }
      };

      utterance.onerror = (e) => {
        this.stopKeepAlive();
        if (e.error === "interrupted" || e.error === "canceled") return;
        this.isLoading = false;
        this.notify();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      this.isLoading = false;
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
  return globalAudioEngine.playTrack(track, {
    voiceId: overrideVoiceId,
    gender: overrideGender,
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
if (typeof window !== "undefined" && !hasSetupGlobalUnlock) {
  hasSetupGlobalUnlock = true;
  const userInteractionTrigger = () => {
    unlockAudio();
  };
  window.addEventListener("pointerdown", userInteractionTrigger, { passive: true });
  window.addEventListener("keydown", userInteractionTrigger, { passive: true });
  window.addEventListener("touchstart", userInteractionTrigger, { passive: true });
}



// Banned robotic voice names in browser SpeechSynthesis
export const BANNED_VOICE_NAMES = [
  "daniel",
  "alex",
  "fred",
  "zarvox",
  "trinoids",
  "whisper",
  "cellos",
  "bad news",
  "organ",
  "deranged",
  "bells",
  "boing",
  "bubbles",
  "albert",
  "junior",
  "ralph"
];

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

  // 3. Fallback: select best voice for gender
  const msVoices = voicePool.filter(
    (v) => v.name.toLowerCase().includes("microsoft") || v.voiceURI.toLowerCase().includes("microsoft")
  );
  const poolToUse = msVoices.length > 0 ? msVoices : voicePool;

  const fallbackMatch =
    poolToUse.find((v) => {
      const lower = (v.name + " " + v.voiceURI).toLowerCase();
      if (gender === "male") {
        return (
          lower.includes("guy") ||
          lower.includes("christopher") ||
          lower.includes("eric") ||
          lower.includes("david") ||
          lower.includes("male")
        );
      } else {
        return lower.includes("jenny") || lower.includes("aria") || lower.includes("zira") || lower.includes("female");
      }
    }) ||
    poolToUse.find((v) => v.lang.startsWith("en")) ||
    poolToUse[0];

  console.warn(`[SpeechSynthesis] Requested voice "${rawTargetVoiceId}" NOT found in browser voices. Fallback used:`, {
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
    voiceName: fallbackMatch ? fallbackMatch.name : (gender === "male" ? "Guy (Natural Male)" : "Jenny (Natural Female)"),
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
