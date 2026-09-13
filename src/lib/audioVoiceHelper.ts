// High-Quality Bible Voice Narration System
// Dedicated Male and Female voice narrator engines with natural pacing, warm reverent tone,
// and natural breathing pauses without altering, shortening, or paraphrasing the biblical text.

import { VoiceGender } from "../types";

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
// AudioContext & Hardware Unlocker (Guarantees Sound Output)
// -------------------------------------------------------------
let sharedAudioCtx: AudioContext | null = null;
let sharedAudioElement: HTMLAudioElement | null = null;
let hasSetupGlobalUnlock = false;

export function getSharedAudioPlayer(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudioElement) {
    try {
      sharedAudioElement = new Audio();
      sharedAudioElement.preload = "auto";
      (sharedAudioElement as any).playsInline = true;
    } catch (e) {
      // ignore
    }
  }
  return sharedAudioElement;
}

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
      // Play brief silent micro-buffer to satisfy mobile/desktop autoplay policies
      try {
        const buffer = sharedAudioCtx.createBuffer(1, 1, 22050);
        const source = sharedAudioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(sharedAudioCtx.destination);
        source.start(0);
      } catch (e) {
        // ignore buffer error
      }
    }

    // Prime HTMLAudioElement
    const player = getSharedAudioPlayer();
    if (player && player.paused && !player.src) {
      // Brief data URI silent wav to prime audio engine
      player.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
      player.play().then(() => {
        player.pause();
      }).catch(() => {});
    }

    if ("speechSynthesis" in window) {
      // Resume if paused
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      // Warm up voices
      try {
        window.speechSynthesis.getVoices();
      } catch {}
    }

    console.log("[AudioVoiceHelper] Audio pipeline unlocked on user gesture.");
    return true;
  } catch (e) {
    console.warn("[AudioVoiceHelper] Audio unlock exception:", e);
    return false;
  }
}

// Auto-register global unlock on any user interaction in browser
if (typeof window !== "undefined" && !hasSetupGlobalUnlock) {
  hasSetupGlobalUnlock = true;
  const userGestureTrigger = () => {
    unlockAudio();
  };
  window.addEventListener("pointerdown", userGestureTrigger, { passive: true });
  window.addEventListener("keydown", userGestureTrigger, { passive: true });
  window.addEventListener("touchstart", userGestureTrigger, { passive: true });
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
