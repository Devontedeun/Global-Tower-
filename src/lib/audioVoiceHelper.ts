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

// Top natural, warm, mature voice profiles
const PREFERRED_MALE_VOICES = [
  "Google UK English Male",
  "Microsoft Guy Online (Natural)",
  "Microsoft Christopher Online (Natural)",
  "Microsoft Eric Online (Natural)",
  "Microsoft Ryan Online (Natural)",
  "Daniel",
  "Alex",
  "Oliver",
  "en-US-Neural2-D",
  "en-US-Neural2-J",
  "en-GB-Neural2-B",
  "en-GB-Neural2-D",
  "en-US-Standard-B",
  "en-US-Standard-D",
  "Microsoft David",
  "Microsoft Mark",
  "Google US English"
];

const PREFERRED_FEMALE_VOICES = [
  "Google UK English Female",
  "Microsoft Jenny Online (Natural)",
  "Microsoft Aria Online (Natural)",
  "Microsoft Sonia Online (Natural)",
  "Microsoft Libby Online (Natural)",
  "Samantha",
  "Victoria",
  "Karen",
  "Serena",
  "Moira",
  "Fiona",
  "en-US-Neural2-F",
  "en-US-Neural2-C",
  "en-GB-Neural2-A",
  "en-GB-Neural2-C",
  "en-US-Standard-C",
  "Microsoft Zira",
  "Google US English"
];

export function getNaturalBibleVoice(genderParam?: VoiceGender): NarratorVoiceConfig {
  const gender: VoiceGender = genderParam || getSavedVoiceGender();

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return {
      voice: null,
      pitch: gender === "male" ? 0.94 : 1.02,
      rate: 0.94,
      gender,
      voiceName: gender === "male" ? "Default Reverent Male" : "Default Reverent Female"
    };
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    return {
      voice: null,
      pitch: gender === "male" ? 0.94 : 1.02,
      rate: 0.94,
      gender,
      voiceName: gender === "male" ? "Default Male" : "Default Female"
    };
  }

  const preferredList = gender === "male" ? PREFERRED_MALE_VOICES : PREFERRED_FEMALE_VOICES;

  // 1. Check exact or partial matches in the preferred natural list
  for (const name of preferredList) {
    const found = voices.find((v) =>
      v.name.toLowerCase().includes(name.toLowerCase()) ||
      v.voiceURI.toLowerCase().includes(name.toLowerCase())
    );
    if (found) {
      return {
        voice: found,
        // Pacing: 0.94 provides calm, articulate, reverent cadence without dragging
        rate: gender === "male" ? 0.94 : 0.95,
        // Pitch: 1% deeper warm resonance for male (0.94), clear warmth for female (1.02)
        pitch: gender === "male" ? 0.94 : 1.02,
        gender,
        voiceName: found.name
      };
    }
  }

  // 2. Gender heuristic based on voice name keywords if exact match wasn't found
  const genderKeywords = gender === "male"
    ? ["male", "guy", "man", "david", "daniel", "george", "alex", "christopher", "ryan"]
    : ["female", "woman", "girl", "zira", "samantha", "victoria", "karen", "aria", "jenny"];

  const matchedByKeyword = voices.find((v) => {
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

  // 3. Any English voice fallback
  const anyEnglish = voices.find((v) => v.lang.startsWith("en"));
  const chosen = anyEnglish || voices[0];

  return {
    voice: chosen || null,
    rate: gender === "male" ? 0.93 : 0.95,
    pitch: gender === "male" ? 0.92 : 1.04, // 1% deeper modulation for male voice fallback
    gender,
    voiceName: chosen ? chosen.name : (gender === "male" ? "Narrator (Male)" : "Narrator (Female)")
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
