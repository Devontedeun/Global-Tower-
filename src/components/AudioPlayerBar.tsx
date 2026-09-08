import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
  FastForward,
  Bookmark,
  Sparkles,
  Maximize2,
  Mic,
  Bluetooth,
  Headphones,
  Check,
  ChevronDown
} from "lucide-react";
import {
  getNaturalBibleVoice,
  getSavedVoiceGender,
  setSavedVoiceGender,
  formatBibleTextForSpeech
} from "../lib/audioVoiceHelper";
import { bluetoothAudioService, AudioOutputDevice } from "../lib/bluetoothAudioService";
import { VoiceGender } from "../types";

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
  onVerseChange?: (verseNum: number) => void;
  onChapterComplete?: () => void;
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
  const [activeNarratorName, setActiveNarratorName] = useState<string>("");
  const [availableDevices, setAvailableDevices] = useState<AudioOutputDevice[]>([]);
  const [activeOutput, setActiveOutput] = useState<{ deviceId: string; label: string; isBluetooth: boolean }>({
    deviceId: "default",
    label: "Device Speaker",
    isBluetooth: false
  });
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);

  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const segmentsRef = useRef<SpeechSegment[]>([]);
  const currentSegmentIndexRef = useRef<number>(0);
  const keepAliveIntervalRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);

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

  const playSegment = (index: number, genderToUse?: VoiceGender, customRate?: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const segments = segmentsRef.current;
    if (index >= segments.length) {
      // Reached the end of the chapter!
      window.speechSynthesis.cancel();
      stopKeepAlive();
      setIsPlaying(false);
      isPlayingRef.current = false;
      setIsFinished(true);
      setProgress(100);
      currentTrack?.onChapterComplete?.();
      return;
    }

    window.speechSynthesis.cancel();
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

    const targetGender = genderToUse || voiceGender;
    const utterance = new SpeechSynthesisUtterance(currentSeg.text);
    const { voice, pitch: defaultPitch, rate: defaultRate, voiceName } = getNaturalBibleVoice(targetGender);

    if (voice) {
      utterance.voice = voice;
    }
    setActiveNarratorName(voiceName);
    utterance.pitch = defaultPitch; // 1% deeper male voice (0.94)
    utterance.rate = (customRate !== undefined ? customRate : playbackRate) || defaultRate;

    utterance.onend = () => {
      // Continue uninterrupted reading to next segment till end of chapter
      playSegment(index + 1, targetGender, customRate);
    };

    utterance.onerror = (e) => {
      if (e.error === "canceled" || e.error === "interrupted") return;
      // In case of dropped utterance, safely advance to keep reading till the end of the chapter
      playSegment(index + 1, targetGender, customRate);
    };

    synthRef.current = utterance;
    startKeepAlive();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!currentTrack) {
      setIsPlaying(false);
      setIsFinished(false);
      setProgress(0);
      stopKeepAlive();
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

    if (segments.length > 0 && typeof window !== "undefined" && "speechSynthesis" in window) {
      playSegment(0, voiceGender);
    } else {
      setIsPlaying(true);
    }

    return () => {
      stopKeepAlive();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentTrack]);

  // Handle Play / Pause
  const togglePlay = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsPlaying(!isPlaying);
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      stopKeepAlive();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      if (isFinished || progress >= 100) {
        // Replay chapter from beginning!
        setProgress(0);
        setIsFinished(false);
        playSegment(0);
      } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        startKeepAlive();
        setIsPlaying(true);
        isPlayingRef.current = true;
      } else {
        playSegment(currentSegmentIndexRef.current);
      }
    }
  };

  const handleGenderToggle = (newGender: VoiceGender) => {
    setVoiceGender(newGender);
    setSavedVoiceGender(newGender);
    playSegment(currentSegmentIndexRef.current, newGender);
  };

  const handleSpeedChange = () => {
    const speeds = [0.85, 0.95, 1.0, 1.15, 1.3];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newRate = speeds[nextIdx];
    setPlaybackRate(newRate);
    if (isPlaying) {
      playSegment(currentSegmentIndexRef.current, voiceGender, newRate);
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
      className="fixed bottom-16 md:bottom-5 left-4 right-4 md:left-72 md:right-8 z-40 bg-[#FDFCF9]/98 backdrop-blur-md border border-[#E5E0D5] rounded-3xl shadow-xl p-4 transition-all animate-slideUp space-y-2.5"
    >
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
          <div className="w-10 h-10 rounded-2xl bg-[#C5A059] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            <Volume2 className="w-5 h-5 animate-pulse" />
          </div>
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
                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-white border border-[#E5E0D5] rounded-2xl shadow-xl p-3 z-50 text-xs space-y-2 animate-fadeIn">
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

        {/* Voice Gender Selector & Playback Controls */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2 sm:gap-3">
          {/* Male / Female Voice Selector */}
          <div className="inline-flex items-center p-0.5 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-[11px] font-semibold">
            <button
              onClick={() => handleGenderToggle("male")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                voiceGender === "male"
                  ? "bg-[#C5A059] text-white shadow-2xs font-bold"
                  : "text-[#7A7468] hover:text-[#2D2D2D]"
              }`}
              title="Warm, reverent male narrator voice (1% deeper)"
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

            {/* Speed toggle */}
            <button
              onClick={handleSpeedChange}
              className="px-2.5 py-1 bg-[#F9F7F2] border border-[#E5E0D5] hover:bg-white text-[#2D2D2D] rounded-xl text-[11px] font-bold transition-all cursor-pointer"
              title="Playback speed"
            >
              {playbackRate}x
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
    </div>
  );
};
