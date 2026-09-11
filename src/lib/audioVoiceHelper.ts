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

const GENDER_STORAGE_KEY = "gtc_narrator_voice_gender";

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
  } catch (e) {
    // ignore
  }
}

// Top natural, warm, mature voice profiles with Microsoft Voices prioritized first
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

const PREFERRED_MALE_VOICES = [
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

const PREFERRED_FEMALE_VOICES = [
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
 * Returns a direct URL to the Microsoft Edge Neural Audio stream.
 * Produces studio-grade natural human speech.
 */
export function getMicrosoftTTSUrl(text: string, gender: VoiceGender = "male"): string {
  const clean = text.trim();
  const voice = gender === "female" ? "en-US-JennyNeural" : "en-US-GuyNeural";
  return `/api/tts?voice=${encodeURIComponent(voice)}&gender=${encodeURIComponent(gender)}&text=${encodeURIComponent(clean)}`;
}

export function getNaturalBibleVoice(genderParam?: VoiceGender): NarratorVoiceConfig {
  const gender: VoiceGender = genderParam || getSavedVoiceGender();

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return {
      voice: null,
      pitch: gender === "male" ? 0.94 : 1.02,
      rate: 0.94,
      gender,
      voiceName: gender === "male" ? "Microsoft Guy (Natural Male)" : "Microsoft Jenny (Natural Female)"
    };
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    return {
      voice: null,
      pitch: gender === "male" ? 0.94 : 1.02,
      rate: 0.94,
      gender,
      voiceName: gender === "male" ? "Microsoft Guy (Natural Male)" : "Microsoft Jenny (Natural Female)"
    };
  }

  // Filter out unwanted / robotic voices (e.g. Daniel, Fred)
  const validVoices = voices.filter((v) => {
    const lower = (v.name + " " + v.voiceURI).toLowerCase();
    return !BANNED_VOICE_NAMES.some((banned) => lower.includes(banned));
  });

  const voicePool = validVoices.length > 0 ? validVoices : voices;

  // 1. Strict priority: Search for Microsoft natural voices first
  const msVoice = voicePool.find((v) => {
    const lower = (v.name + " " + v.voiceURI).toLowerCase();
    if (!lower.includes("microsoft")) return false;
    if (gender === "male") {
      return (
        lower.includes("guy") ||
        lower.includes("christopher") ||
        lower.includes("eric") ||
        lower.includes("ryan") ||
        lower.includes("david") ||
        lower.includes("mark") ||
        lower.includes("george") ||
        lower.includes("male")
      );
    } else {
      return (
        lower.includes("jenny") ||
        lower.includes("aria") ||
        lower.includes("sonia") ||
        lower.includes("libby") ||
        lower.includes("zira") ||
        lower.includes("michelle") ||
        lower.includes("female")
      );
    }
  });

  if (msVoice) {
    return {
      voice: msVoice,
      rate: gender === "male" ? 0.94 : 0.95,
      pitch: gender === "male" ? 0.94 : 1.02,
      gender,
      voiceName: msVoice.name
    };
  }

  // Any Microsoft voice in the preferred gender
  const anyMs = voicePool.find((v) => {
    const lower = (v.name + " " + v.voiceURI).toLowerCase();
    return lower.includes("microsoft");
  });
  if (anyMs) {
    return {
      voice: anyMs,
      rate: gender === "male" ? 0.94 : 0.95,
      pitch: gender === "male" ? 0.94 : 1.02,
      gender,
      voiceName: anyMs.name
    };
  }

  const preferredList = gender === "male" ? PREFERRED_MALE_VOICES : PREFERRED_FEMALE_VOICES;

  // 2. Check exact or partial matches in the preferred natural list (all non-banned)
  for (const name of preferredList) {
    const found = voicePool.find((v) =>
      v.name.toLowerCase().includes(name.toLowerCase()) ||
      v.voiceURI.toLowerCase().includes(name.toLowerCase())
    );
    if (found) {
      return {
        voice: found,
        rate: gender === "male" ? 0.94 : 0.95,
        pitch: gender === "male" ? 0.94 : 1.02,
        gender,
        voiceName: found.name
      };
    }
  }

  // 3. Gender heuristic based on voice name keywords (excluding banned voices)
  const genderKeywords = gender === "male"
    ? ["male", "guy", "man", "david", "george", "christopher", "ryan", "eric"]
    : ["female", "woman", "girl", "zira", "samantha", "victoria", "karen", "aria", "jenny"];

  const matchedByKeyword = voicePool.find((v) => {
    if (!v.lang.startsWith("en")) return false;
    const nameLower = v.name.toLowerCase();
    return genderKeywords.some((kw) => nameLower.includes(kw));
  });

  if (matchedByKeyword) {
    return {
      voice: matchedByKeyword,
      rate: gender === "male" ? 0.94 : 0.95,
      pitch: gender === "male" ? 0.94 : 1.02,
      gender,
      voiceName: matchedByKeyword.name
    };
  }

  // 4. Any English voice fallback (still excluding banned voices)
  const anyEnglish = voicePool.find((v) => v.lang.startsWith("en"));
  const chosen = anyEnglish || voicePool[0];

  return {
    voice: chosen || null,
    rate: gender === "male" ? 0.93 : 0.95,
    pitch: gender === "male" ? 0.92 : 1.04,
    gender,
    voiceName: chosen ? chosen.name : (gender === "male" ? "Microsoft Guy (Natural Male)" : "Microsoft Jenny (Natural Female)")
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
