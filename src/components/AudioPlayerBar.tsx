import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Square,
  X,
  FastForward,
  Bookmark,
  Sparkles,
  Maximize2,
  Mic,
  Bluetooth,
  Headphones,
  Check,
  ChevronDown,
  FileText,
  Save,
  CheckCircle2
} from "lucide-react";
import {
  getNaturalBibleVoice,
  getSavedVoiceGender,
  setSavedVoiceGender,
  getSavedVoiceId,
  setSavedVoiceId,
  getSavedMuteState,
  setSavedMuteState,
  getSavedAudioVolume,
  setSavedAudioVolume,
  unlockAudio,
  formatBibleTextForSpeech,
  getAudioTTSUrl,
  getMicrosoftTTSUrl,
  SERVER_VOICES,
  VoiceOption
} from "../lib/audioVoiceHelper";
import { bluetoothAudioService, AudioOutputDevice } from "../lib/bluetoothAudioService";
import { Storage } from "../lib/storage";
import { VoiceGender, StudyNote } from "../types";

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

interface SpeechSegment {
  text: string;
  verseNum?: number;
}

function splitTextIntoNaturalChunks(text: string, maxLen = 160): string[] {
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

function buildSegmentsFromTrack(track: AudioTrack): SpeechSegment[] {
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

interface AudioPlayerBarProps {
  currentTrack: AudioTrack | null;
  onClose: () => void;
  onAnalyzeWithAI?: (text: string) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentTrack,
  onClose,
  onAnalyzeWithAI,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [voiceGender, setVoiceGender] = useState<VoiceGender>(getSavedVoiceGender());
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(() => {
    return currentTrack?.voiceId || getSavedVoiceId();
  });
  const [activeNarratorName, setActiveNarratorName] = useState<string>("");
  const [availableDevices, setAvailableDevices] = useState<AudioOutputDevice[]>([]);
  const [activeOutput, setActiveOutput] = useState<{ deviceId: string; label: string; isBluetooth: boolean }>({
    deviceId: "default",
    label: "Device Speaker",
    isBluetooth: false
  });
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => getSavedMuteState());
  const [volume, setVolume] = useState<number>(() => getSavedAudioVolume());
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [hasAutoplayBlock, setHasAutoplayBlock] = useState(false);
  const [showNotePopover, setShowNotePopover] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  const getCurrentPlayingVerse = (): number | undefined => {
    if (segmentsRef.current && segmentsRef.current[currentSegmentIndexRef.current]?.verseNum) {
      return segmentsRef.current[currentSegmentIndexRef.current].verseNum;
    }
    return undefined;
  };

  const handleSavePlayerNote = () => {
    if (!noteText.trim() || !currentTrack) return;
    const verseNum = getCurrentPlayingVerse();
    const bookName = currentTrack.book || "Scripture";
    const chapNum = currentTrack.chapter;
    const ref = chapNum && verseNum
      ? `${bookName} ${chapNum}:${verseNum}`
      : chapNum
      ? `${bookName} ${chapNum}`
      : bookName;

    const newNote: StudyNote = {
      id: `note-${Date.now()}`,
      title: `${ref} Audio Reflection`,
      content: noteText.trim(),
      scriptureRef: ref,
      tags: ["Audio Reflection", bookName],
      folder: "Audio Bible",
      isPrivate: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    Storage.saveNote(newNote);
    setNoteSavedFeedback(true);
    setTimeout(() => {
      setNoteSavedFeedback(false);
      setShowNotePopover(false);
      setNoteText("");
    }, 1000);
  };

  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const segmentsRef = useRef<SpeechSegment[]>([]);
  const currentSegmentIndexRef = useRef<number>(0);
  const keepAliveIntervalRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const isMutedRef = useRef<boolean>(isMuted);
  const volumeRef = useRef<number>(volume);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Sync selected voice with currentTrack if specified
  useEffect(() => {
    if (currentTrack?.voiceId && currentTrack.voiceId !== selectedVoiceId) {
      setSelectedVoiceId(currentTrack.voiceId);
      setSavedVoiceId(currentTrack.voiceId);
    }
  }, [currentTrack?.voiceId]);

  // Subscribe to external voice changes (e.g. from BibleHub settings or other views)
  useEffect(() => {
    const handleVoiceChange = (e: any) => {
      const vId = e?.detail?.voiceId;
      if (vId && vId !== selectedVoiceId) {
        console.log(`[AudioPlayerBar] Received global voice change: "${vId}"`);
        setSelectedVoiceId(vId);
        const serverVoice = SERVER_VOICES.find((v) => v.id === vId);
        if (serverVoice) {
          setVoiceGender(serverVoice.gender);
          setActiveNarratorName(serverVoice.name);
        }
        if (isPlayingRef.current) {
          playSegment(currentSegmentIndexRef.current, undefined, undefined, vId);
        }
      }
    };

    window.addEventListener("gtc_voice_changed", handleVoiceChange);
    return () => window.removeEventListener("gtc_voice_changed", handleVoiceChange);
  }, [selectedVoiceId]);

  // Subscribe to global mute and volume events
  useEffect(() => {
    const handleMuteEvent = (e: any) => {
      if (typeof e?.detail?.isMuted === "boolean") {
        const nextMute = e.detail.isMuted;
        setIsMuted(nextMute);
        isMutedRef.current = nextMute;
        if (audioRef.current) {
          audioRef.current.muted = nextMute;
          audioRef.current.volume = nextMute ? 0 : (volumeRef.current || 1.0);
          if (!nextMute && audioRef.current.paused && isPlayingRef.current) {
            audioRef.current.play().catch(() => {});
          }
        }
      }
    };

    const handleVolumeEvent = (e: any) => {
      if (typeof e?.detail?.volume === "number") {
        const nextVol = e.detail.volume;
        setVolume(nextVol);
        volumeRef.current = nextVol;
        if (audioRef.current) {
          audioRef.current.volume = isMutedRef.current ? 0 : nextVol;
        }
      }
    };

    const handleStopEvent = () => {
      console.log("[AudioPlayerBar] Received global stop audio event");
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      stopKeepAlive();
      setIsPlaying(false);
      isPlayingRef.current = false;
      onClose();
    };

    window.addEventListener("gtc_audio_mute_changed", handleMuteEvent);
    window.addEventListener("gtc_audio_volume_changed", handleVolumeEvent);
    window.addEventListener("gtc_stop_audio", handleStopEvent);
    return () => {
      window.removeEventListener("gtc_audio_mute_changed", handleMuteEvent);
      window.removeEventListener("gtc_audio_volume_changed", handleVolumeEvent);
      window.removeEventListener("gtc_stop_audio", handleStopEvent);
    };
  }, [onClose]);

  // Subscribe to Bluetooth audio device changes
  useEffect(() => {
    bluetoothAudioService.init();
    const unsubscribe = bluetoothAudioService.subscribe((devices, active) => {
      setAvailableDevices(devices);
      if (active) {
        setActiveOutput(active);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const startKeepAlive = () => {
    stopKeepAlive();
    keepAliveIntervalRef.current = window.setInterval(() => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 9000);
  };

  const stopKeepAlive = () => {
    if (keepAliveIntervalRef.current !== null) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
  };

  const playSegment = (
    index: number,
    genderToUse?: VoiceGender,
    customRate?: number,
    voiceToUse?: string
  ) => {
    const segments = segmentsRef.current;
    if (index >= segments.length) {
      // Reached the end of the chapter!
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      stopKeepAlive();
      setIsPlaying(false);
      isPlayingRef.current = false;
      setIsFinished(true);
      setProgress(100);
      currentTrack?.onChapterComplete?.();
      return;
    }

    // Clean up active speech synthesis if running
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    currentSegmentIndexRef.current = index;
    setIsFinished(false);
    setIsPlaying(true);
    isPlayingRef.current = true;

    const currentSeg = segments[index];
    const pct = Math.min(100, Math.round(((index + 1) / segments.length) * 100));
    setProgress(pct);

    if (currentSeg.verseNum && currentTrack?.onVerseChange) {
      currentTrack.onVerseChange(currentSeg.verseNum);
    }

    const targetVoice = voiceToUse || selectedVoiceId || getSavedVoiceId();
    const targetGender = genderToUse || voiceGender;
    const rate = (customRate !== undefined ? customRate : playbackRate) || 1.0;

    // Resolve voice display name
    const serverVoice = SERVER_VOICES.find((v) => v.id === targetVoice);
    const narratorLabel = serverVoice
      ? serverVoice.name
      : targetVoice.startsWith("browser:")
      ? targetVoice.replace("browser:", "")
      : targetGender === "female"
      ? "Jenny (Natural Female)"
      : "Guy (Natural Male)";
    setActiveNarratorName(narratorLabel);

    console.log(`[AudioPlayerBar] Segment ${index + 1}/${segments.length}:`, {
      selectedVoice: targetVoice,
      actualVoiceName: narratorLabel,
      provider: serverVoice?.provider || (targetVoice.startsWith("browser:") ? "browser" : "microsoft"),
      gender: targetGender,
      rate,
      snippet: currentSeg.text.substring(0, 40) + "..."
    });

    // SpeechSynthesis fallback that strictly honors requested voice
    const fallbackToSpeechSynthesis = () => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const utterance = new SpeechSynthesisUtterance(currentSeg.text);
      const resolved = getNaturalBibleVoice(targetGender, targetVoice);

      if (resolved.voice) {
        utterance.voice = resolved.voice;
      }
      setActiveNarratorName(resolved.actualVoiceName);
      utterance.pitch = resolved.pitch;
      utterance.rate = (customRate !== undefined ? customRate : playbackRate) || resolved.rate;
      utterance.volume = isMutedRef.current ? 0 : (volumeRef.current || 1.0);

      console.log(`[AudioPlayerBar:SpeechSynthesis] Utterance ready:`, {
        requestedVoice: targetVoice,
        actualVoice: resolved.actualVoiceName,
        fallbackUsed: resolved.fallbackUsed,
        provider: resolved.provider,
        volume: utterance.volume
      });

      utterance.onend = () => {
        if (isPlayingRef.current) {
          playSegment(index + 1, targetGender, customRate, targetVoice);
        }
      };

      utterance.onerror = (e) => {
        if (e.error === "canceled" || e.error === "interrupted") return;
        if (isPlayingRef.current) {
          playSegment(index + 1, targetGender, customRate, targetVoice);
        }
      };

      synthRef.current = utterance;
      startKeepAlive();
      window.speechSynthesis.speak(utterance);
    };

    // If a browser voice was explicitly selected, bypass server TTS and speak directly
    if (targetVoice.startsWith("browser:")) {
      fallbackToSpeechSynthesis();
      return;
    }

    try {
      const ttsUrl = getAudioTTSUrl(currentSeg.text, targetVoice, targetGender);

      // Reuse the same HTMLAudioElement instance for seamless continuous playback
      let audio = audioRef.current;
      if (!audio) {
        audio = new Audio();
        audio.preload = "auto";
        (audio as any).playsInline = true;
        audioRef.current = audio;
        bluetoothAudioService.registerMediaElement(audio);
      }

      audio.pause();
      audio.onended = null;
      audio.onerror = null;
      audio.src = ttsUrl;
      audio.playbackRate = rate;
      audio.muted = isMutedRef.current;
      audio.volume = isMutedRef.current ? 0 : (volumeRef.current || 1.0);

      audio.onended = () => {
        if (isPlayingRef.current) {
          playSegment(index + 1, targetGender, customRate, targetVoice);
        }
      };

      audio.onerror = () => {
        console.warn(`[AudioPlayerBar] Server TTS notice for "${targetVoice}", switching to synthesizer.`);
        fallbackToSpeechSynthesis();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setHasAutoplayBlock(false);
          })
          .catch((e) => {
            if (e?.name === "AbortError") {
              return;
            }
            if (e?.name === "NotAllowedError") {
              console.warn("[AudioPlayerBar] Browser blocked autoplay audio. Click unmute/play to hear:", e);
              setHasAutoplayBlock(true);
            }
            console.warn("[AudioPlayerBar] Audio play catch:", e?.name, e?.message);
            fallbackToSpeechSynthesis();
          });
      }

      // Prefetch the next segment with the exact same voice
      if (index + 1 < segments.length) {
        const nextSeg = segments[index + 1];
        const nextUrl = getAudioTTSUrl(nextSeg.text, targetVoice, targetGender);
        fetch(nextUrl, { cache: "force-cache" }).catch(() => {});
      }
    } catch (e) {
      fallbackToSpeechSynthesis();
    }
  };

  useEffect(() => {
    if (!currentTrack) {
      setIsPlaying(false);
      setIsFinished(false);
      setProgress(0);
      stopKeepAlive();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    const segments = buildSegmentsFromTrack(currentTrack);
    segmentsRef.current = segments;
    currentSegmentIndexRef.current = 0;
    setProgress(0);
    setIsFinished(false);

    if (segments.length > 0) {
      unlockAudio();
      playSegment(0, voiceGender);
    } else {
      setIsPlaying(true);
    }

    return () => {
      stopKeepAlive();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentTrack]);

  // Handle Play / Pause
  const togglePlay = () => {
    unlockAudio();
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.pause();
      }
      stopKeepAlive();
      setIsPlaying(false);
      isPlayingRef.current = false;
      currentTrack?.onPlaybackStateChange?.(false);
    } else {
      currentTrack?.onPlaybackStateChange?.(true);
      if (isFinished || progress >= 100) {
        setProgress(0);
        setIsFinished(false);
        playSegment(0);
      } else if (audioRef.current && audioRef.current.paused && audioRef.current.src) {
        audioRef.current.muted = isMutedRef.current;
        audioRef.current.volume = isMutedRef.current ? 0 : (volumeRef.current || 1.0);
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            isPlayingRef.current = true;
            setHasAutoplayBlock(false);
          })
          .catch(() => {
            playSegment(currentSegmentIndexRef.current);
          });
      } else if (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        startKeepAlive();
        setIsPlaying(true);
        isPlayingRef.current = true;
      } else {
        playSegment(currentSegmentIndexRef.current);
      }
    }
  };

  const handleToggleMute = () => {
    unlockAudio();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    isMutedRef.current = nextMuted;
    setSavedMuteState(nextMuted);

    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      audioRef.current.volume = nextMuted ? 0 : (volumeRef.current || 1.0);
      if (!nextMuted) {
        setHasAutoplayBlock(false);
        if (audioRef.current.paused && isPlayingRef.current) {
          audioRef.current.play().catch((e) => {
            console.warn("[AudioPlayerBar] Play on unmute catch:", e);
          });
        }
      }
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (nextMuted) {
        window.speechSynthesis.pause();
      } else {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    }

    // If audio was blocked or stalled while unmuting, restart active segment so sound immediately comes out
    if (!nextMuted && (!isPlaying || hasAutoplayBlock)) {
      setHasAutoplayBlock(false);
      playSegment(currentSegmentIndexRef.current);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolume(clamped);
    volumeRef.current = clamped;
    setSavedAudioVolume(clamped);

    if (clamped === 0) {
      setIsMuted(true);
      isMutedRef.current = true;
      setSavedMuteState(true);
      if (audioRef.current) {
        audioRef.current.muted = true;
        audioRef.current.volume = 0;
      }
    } else {
      if (isMuted) {
        setIsMuted(false);
        isMutedRef.current = false;
        setSavedMuteState(false);
      }
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.volume = clamped;
        if (audioRef.current.paused && isPlayingRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }
    }
  };

  const handleForceUnblockAndPlay = () => {
    unlockAudio();
    setHasAutoplayBlock(false);
    setIsMuted(false);
    isMutedRef.current = false;
    setSavedMuteState(false);
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.volume = volumeRef.current || 1.0;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
        })
        .catch(() => {
          playSegment(currentSegmentIndexRef.current);
        });
    } else {
      playSegment(currentSegmentIndexRef.current);
    }
  };

  const handleVoiceChange = (newVoiceId: string) => {
    setSelectedVoiceId(newVoiceId);
    setSavedVoiceId(newVoiceId);
    const serverVoice = SERVER_VOICES.find((v) => v.id === newVoiceId);
    let g = voiceGender;
    if (serverVoice) {
      g = serverVoice.gender;
      setVoiceGender(g);
      setActiveNarratorName(serverVoice.name);
    }
    console.log(`[AudioPlayerBar] Voice manually changed from player: "${newVoiceId}"`);
    playSegment(currentSegmentIndexRef.current, g, undefined, newVoiceId);
  };

  const handleGenderToggle = (newGender: VoiceGender) => {
    setVoiceGender(newGender);
    setSavedVoiceGender(newGender);
    const newVoiceId = getSavedVoiceId();
    setSelectedVoiceId(newVoiceId);
    const serverVoice = SERVER_VOICES.find((v) => v.id === newVoiceId);
    if (serverVoice) {
      setActiveNarratorName(serverVoice.name);
    }
    console.log(`[AudioPlayerBar] Gender toggled to "${newGender}", active voice: "${newVoiceId}"`);
    playSegment(currentSegmentIndexRef.current, newGender, undefined, newVoiceId);
  };

  const handleSpeedChange = () => {
    const speeds = [0.85, 0.95, 1.0, 1.15, 1.3];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newRate = speeds[nextIdx];
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const handleSkip = (direction: number) => {
    const total = segmentsRef.current.length;
    if (total === 0) return;
    const nextIdx = direction > 0
      ? Math.min(total - 1, currentSegmentIndexRef.current + 1)
      : Math.max(0, currentSegmentIndexRef.current - 1);
    playSegment(nextIdx);
  };

  const handleSelectAudioDevice = async (device: AudioOutputDevice) => {
    await bluetoothAudioService.routeToDevice(device.deviceId, device.label, device.isBluetooth);
    setShowDeviceMenu(false);
  };

  if (!currentTrack) return null;

  return (
    <div
      id="global-audio-player"
      className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] lg:bottom-5 left-2 right-2 sm:left-4 sm:right-4 lg:left-72 lg:right-8 z-40 bg-[#FDFCF9]/98 backdrop-blur-md border border-[#E5E0D5] rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 transition-all animate-slideUp space-y-2 sm:space-y-2.5"
    >
      {/* Autoplay unblock notification banner */}
      {hasAutoplayBlock && (
        <div
          id="audio-autoplay-unblock-banner"
          onClick={handleForceUnblockAndPlay}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-md cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <VolumeX className="w-4 h-4 text-white animate-pulse shrink-0" />
            <span>Sound paused by browser policy. Click anywhere to Unmute & Hear the Bible!</span>
          </div>
          <span className="px-2.5 py-1 bg-white text-amber-900 rounded-xl text-[11px] font-extrabold uppercase tracking-wide shrink-0 shadow-xs">
            Unmute Now
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div className="w-full bg-[#E5E0D5]/60 h-1.5 rounded-full overflow-hidden cursor-pointer">
        <div
          className="bg-[#C5A059] h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Track Info & Voice / Bluetooth Indicators */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="audio-left-mute-toggle"
            onClick={handleToggleMute}
            className={`w-10 h-10 rounded-2xl text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs cursor-pointer transition-all ${
              isMuted
                ? "bg-rose-600 hover:bg-rose-700 ring-2 ring-rose-400/60 shadow-rose-600/30 animate-pulse"
                : "bg-[#C5A059] hover:bg-[#B48F48]"
            }`}
            title={isMuted ? "Audio is Muted • Click to Unmute & Hear Sound" : "Audio Playing • Click to Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : volume < 0.5 ? (
              <Volume1 className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
            ) : (
              <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
            )}
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-xs sm:text-sm font-serif font-bold text-[#2D2D2D] truncate">
                {currentTrack.title}
              </h4>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-[#2D2D2D] text-[#C5A059] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Natural Audio Bible
              </span>

              {/* Bluetooth Status Chip */}
              <div className="relative inline-block">
                <button
                  onClick={() => {
                    bluetoothAudioService.scanAndRouteDevices(true);
                    setShowDeviceMenu(!showDeviceMenu);
                  }}
                  className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold border transition-all cursor-pointer ${
                    activeOutput.isBluetooth
                      ? "bg-blue-50 text-blue-800 border-blue-200"
                      : "bg-[#F9F7F2] text-[#7A7468] border-[#E5E0D5] hover:border-[#C5A059]"
                  }`}
                  title="Audio routing destination (Click to manage Bluetooth / speaker output)"
                >
                  {activeOutput.isBluetooth ? (
                    <Bluetooth className="w-3 h-3 text-blue-600" />
                  ) : (
                    <Headphones className="w-3 h-3 text-[#7A7468]" />
                  )}
                  <span className="max-w-[110px] truncate">{activeOutput.label}</span>
                  <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                </button>

                {/* Device Selection Popover */}
                {showDeviceMenu && (
                  <div className="absolute left-0 bottom-full mb-2 w-64 max-w-[calc(100vw-2rem)] bg-white border border-[#E5E0D5] rounded-2xl shadow-xl p-3 z-50 text-xs space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-1.5">
                      <span className="font-bold text-[#2D2D2D] text-[11px] uppercase tracking-wider">
                        Audio Output Routing
                      </span>
                      <button
                        onClick={() => setShowDeviceMenu(false)}
                        className="text-[#8A8478] hover:text-[#2D2D2D]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-[#7A7468]">
                      Auto-routes audio when Bluetooth headphones or speakers are connected.
                    </p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      <button
                        onClick={() =>
                          handleSelectAudioDevice({
                            deviceId: "default",
                            label: "Device Speaker",
                            isBluetooth: false,
                            groupId: ""
                          })
                        }
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                          activeOutput.deviceId === "default"
                            ? "bg-[#C5A059] text-white font-bold"
                            : "hover:bg-[#F9F7F2] text-[#2D2D2D]"
                        }`}
                      >
                        <span>Default Device Speaker</span>
                        {activeOutput.deviceId === "default" && <Check className="w-3 h-3" />}
                      </button>

                      {availableDevices.map((d) => (
                        <button
                          key={d.deviceId}
                          onClick={() => handleSelectAudioDevice(d)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                            activeOutput.deviceId === d.deviceId
                              ? "bg-[#C5A059] text-white font-bold"
                              : "hover:bg-[#F9F7F2] text-[#2D2D2D]"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            {d.isBluetooth ? (
                              <Bluetooth className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                            ) : (
                              <Headphones className="w-3.5 h-3.5 shrink-0 text-[#8A8478]" />
                            )}
                            <span className="truncate">{d.label}</span>
                          </div>
                          {activeOutput.deviceId === d.deviceId && <Check className="w-3 h-3 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-[11px] text-[#7A7468] truncate font-sans">
              {isFinished ? (
                <span className="text-amber-800 font-semibold inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Chapter Complete • Press Play to Replay</span>
                </span>
              ) : (
                <>
                  {currentTrack.subtitle}
                  {activeNarratorName ? ` • ${activeNarratorName}` : ""}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Voice Selector & Playback Controls */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2 sm:gap-3">
          {/* Narrator Voice Selector Dropdown */}
          <div className="inline-flex items-center">
            <select
              id="audio-player-voice-select"
              value={selectedVoiceId}
              onChange={(e) => handleVoiceChange(e.target.value)}
              className="bg-[#F9F7F2] hover:bg-white border border-[#E5E0D5] hover:border-[#C5A059] text-[#2D2D2D] rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#C5A059] max-w-[155px] sm:max-w-[200px] truncate shadow-2xs"
              title="Select narrator voice"
            >
              <optgroup label="Microsoft Neural Voices">
                {SERVER_VOICES.filter((v) => v.provider === "microsoft").map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Gemini AI Voices">
                {SERVER_VOICES.filter((v) => v.provider === "gemini").map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Quick Male / Female Toggle */}
          <div className="inline-flex items-center p-0.5 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-[11px] font-semibold">
            <button
              onClick={() => handleGenderToggle("male")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                voiceGender === "male"
                  ? "bg-[#C5A059] text-white shadow-2xs font-bold"
                  : "text-[#7A7468] hover:text-[#2D2D2D]"
              }`}
              title="Warm, reverent male narrator voice"
            >
              Male
            </button>
            <button
              onClick={() => handleGenderToggle("female")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                voiceGender === "female"
                  ? "bg-[#C5A059] text-white shadow-2xs font-bold"
                  : "text-[#7A7468] hover:text-[#2D2D2D]"
              }`}
              title="Clear, reverent female narrator voice"
            >
              Female
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSkip(-1)}
              className="p-1.5 text-[#7A7468] hover:text-[#C5A059] hover:bg-[#F9F7F2] rounded-xl text-xs cursor-pointer transition-colors"
              title="Previous verse / sentence"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="audio-play-pause-btn"
              onClick={togglePlay}
              title={
                isPlaying
                  ? "Pause Narration"
                  : isFinished
                  ? "Replay Chapter from Beginning"
                  : "Play Narration"
              }
              className={`w-10 h-10 rounded-full text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer ${
                isFinished
                  ? "bg-amber-600 hover:bg-amber-700 ring-4 ring-amber-400/50 shadow-amber-600/30 animate-pulse"
                  : "bg-[#C5A059] hover:bg-[#B48F48] shadow-[#C5A059]/25"
              }`}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            <button
              onClick={() => handleSkip(1)}
              className="p-1.5 text-[#7A7468] hover:text-[#C5A059] hover:bg-[#F9F7F2] rounded-xl text-xs cursor-pointer transition-colors"
              title="Next verse / sentence"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Dedicated UNMUTE / MUTE button */}
            <button
              id="audio-player-mute-btn"
              onClick={handleToggleMute}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isMuted
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md ring-2 ring-rose-400/50 animate-pulse"
                  : "bg-[#F9F7F2] hover:bg-white text-[#7A7468] hover:text-[#2D2D2D] border border-[#E5E0D5]"
              }`}
              title={isMuted ? "Audio is Muted — Click to Unmute & Hear Sound" : "Mute Audio"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-white" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide">Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#C5A059]" />
                  <span className="hidden sm:inline text-[11px]">Mute</span>
                </>
              )}
            </button>

            {/* Volume Control Popover */}
            <div className="relative inline-block">
              <button
                id="audio-volume-control-btn"
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className={`p-1.5 rounded-xl text-xs cursor-pointer transition-colors ${
                  showVolumeSlider
                    ? "bg-[#C5A059] text-white"
                    : "text-[#7A7468] hover:text-[#C5A059] hover:bg-[#F9F7F2]"
                }`}
                title={`Volume: ${Math.round(isMuted ? 0 : volume * 100)}%`}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-600" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              {showVolumeSlider && (
                <div className="absolute right-0 bottom-full mb-2 bg-white border border-[#E5E0D5] rounded-2xl shadow-xl p-3 z-50 flex items-center gap-2.5 w-48 max-w-[calc(100vw-2.5rem)] animate-fadeIn">
                  <button
                    onClick={handleToggleMute}
                    className="text-[#7A7468] hover:text-[#2D2D2D] cursor-pointer shrink-0"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#C5A059]" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-[#E5E0D5] accent-[#C5A059] rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] font-bold text-[#7A7468] w-7 text-right shrink-0">
                    {Math.round(isMuted ? 0 : volume * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Speed toggle */}
            <button
              onClick={handleSpeedChange}
              className="px-2.5 py-1 bg-[#F9F7F2] border border-[#E5E0D5] hover:bg-white text-[#2D2D2D] rounded-xl text-[11px] font-bold transition-all cursor-pointer"
              title="Playback speed"
            >
              {playbackRate}x
            </button>

            {/* Quick Study Reflection Note button */}
            <button
              onClick={() => setShowNotePopover(!showNotePopover)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                showNotePopover
                  ? "bg-[#C5A059] text-white border-[#C5A059]"
                  : "bg-white hover:bg-[#F9F7F2] text-[#2D2D2D] border-[#E5E0D5]"
              }`}
              title="Take a note while listening"
            >
              <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden xs:inline">Note</span>
            </button>

            {/* AI Insight trigger for this chapter/verse */}
            {onAnalyzeWithAI && currentTrack.textToRead && (
              <button
                onClick={() => onAnalyzeWithAI(currentTrack.textToRead!)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2D2D2D] hover:bg-black text-white text-[11px] font-semibold rounded-xl cursor-pointer transition-colors"
                title="Send text to Spiritual Insight Engine"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>AI Insight</span>
              </button>
            )}

            {/* Close */}
            <button
              onClick={() => {
                if (typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
                onClose();
              }}
              className="p-1.5 text-[#8A8478] hover:text-[#2D2D2D] hover:bg-[#F9F7F2] rounded-xl cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Study Reflection Note Popover (runs concurrently with playback) */}
      {showNotePopover && (
        <div
          id="audio-quick-note-popover"
          className="absolute right-2 sm:right-6 bottom-full mb-3 w-[calc(100vw-32px)] sm:w-96 max-w-sm bg-white border border-[#E5E0D5] rounded-3xl shadow-2xl p-4 sm:p-5 z-50 animate-fadeIn space-y-3"
        >
          <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center font-bold">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#2D2D2D] block leading-none">
                  {currentTrack.book || "Bible"} {currentTrack.chapter ? `Ch ${currentTrack.chapter}` : ""} Reflection
                </span>
                {getCurrentPlayingVerse() && (
                  <span className="text-[10px] text-[#C5A059] font-semibold">
                    Reciting Verse {getCurrentPlayingVerse()}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowNotePopover(false)}
              className="p-1 text-[#8A8478] hover:text-[#2D2D2D] rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[11px] text-amber-950 flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-[#C5A059] animate-pulse shrink-0" />
            <span className="leading-tight">
              Audio continues uninterrupted while you take notes. Reflections are saved to your Study Notes.
            </span>
          </div>

          <textarea
            rows={3}
            autoFocus
            placeholder="Jot down quick thoughts, revelations, or prayers as you listen..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full p-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-xs focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all placeholder:text-[#AAA498]"
          />

          {noteSavedFeedback && (
            <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-center flex items-center justify-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Saved to your Study Notes!</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowNotePopover(false)}
              className="px-3 py-1.5 text-xs text-[#7A7468] hover:bg-[#F9F7F2] rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSavePlayerNote}
              disabled={!noteText.trim()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C5A059] hover:bg-[#B48F48] disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Note</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
