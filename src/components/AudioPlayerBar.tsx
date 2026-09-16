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
  globalAudioEngine,
  GlobalAudioState,
  getAvailableWebVoices,
  AudioTrack,
  SpeechSegment,
  unlockAudio,
  audioContextManager,
  formatPersonVoiceName,
  SERVER_VOICES
} from "../lib/audioVoiceHelper";
import { bluetoothAudioService, AudioOutputDevice } from "../lib/bluetoothAudioService";
import { Storage } from "../lib/storage";
import { VoiceGender, StudyNote } from "../types";

export type { AudioTrack, SpeechSegment };

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
  const [engineState, setEngineState] = useState<GlobalAudioState>(() => globalAudioEngine.getState());
  const [availableDevices, setAvailableDevices] = useState<AudioOutputDevice[]>([]);
  const [activeOutput, setActiveOutput] = useState<{ deviceId: string; label: string; isBluetooth: boolean }>({
    deviceId: "default",
    label: "Device Speaker",
    isBluetooth: false
  });
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showNotePopover, setShowNotePopover] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);
  const [webVoices, setWebVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available browser Web Speech voices
  useEffect(() => {
    const updateVoices = () => {
      const v = getAvailableWebVoices();
      setWebVoices(v);
    };
    updateVoices();
    window.addEventListener("gtc_web_voices_loaded", updateVoices);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    return () => {
      window.removeEventListener("gtc_web_voices_loaded", updateVoices);
    };
  }, []);

  // Subscribe to GlobalAudioEngine state updates
  useEffect(() => {
    const unsubscribe = globalAudioEngine.subscribe((state) => {
      setEngineState(state);
    });
    return unsubscribe;
  }, []);

  // Track authentic audio listening time across the app
  useEffect(() => {
    if (!engineState.isPlaying) return;
    const interval = setInterval(() => {
      // Record 5 seconds of real listening time
      Storage.recordAudioMinutes(5 / 60);
    }, 5000);
    return () => clearInterval(interval);
  }, [engineState.isPlaying]);

  // Sync track with GlobalAudioEngine
  useEffect(() => {
    if (!currentTrack) {
      globalAudioEngine.stop();
      return;
    }
    const engTrack = globalAudioEngine.getState().currentTrack;
    if (!engTrack || engTrack.id !== currentTrack.id) {
      globalAudioEngine.playTrack(currentTrack);
    }
  }, [currentTrack]);

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

  const {
    playbackStatus,
    isPlaying,
    isFinished,
    isLoading,
    errorMessage,
    progress,
    playbackRate,
    activeGender: voiceGender,
    activeVoiceId: selectedVoiceId,
    narratorName: activeNarratorName,
    isMuted,
    volume,
    hasAutoplayBlock,
    currentVerseNum,
    audioContextStatus,
    isAudioContextReady
  } = engineState;

  const getCurrentPlayingVerse = (): number | undefined => {
    return currentVerseNum || undefined;
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

  const togglePlay = () => {
    audioContextManager.ensureRunning().catch(() => {});
    unlockAudio();
    globalAudioEngine.togglePlay();
  };

  const handleToggleMute = () => {
    audioContextManager.ensureRunning().catch(() => {});
    globalAudioEngine.toggleMute();
  };

  const handleVolumeChange = (newVolume: number) => {
    audioContextManager.ensureRunning().catch(() => {});
    globalAudioEngine.setVolume(newVolume);
  };

  const handleForceUnblockAndPlay = () => {
    audioContextManager.ensureRunning().catch(() => {});
    unlockAudio();
    globalAudioEngine.resume();
  };

  const handleVoiceChange = (newVoiceId: string) => {
    globalAudioEngine.setVoice(newVoiceId);
  };

  const handleGenderToggle = (newGender: VoiceGender) => {
    globalAudioEngine.setGender(newGender);
  };

  const handleSpeedChange = () => {
    const speeds = [0.85, 0.95, 1.0, 1.15, 1.3];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newRate = speeds[nextIdx];
    globalAudioEngine.setPlaybackRate(newRate);
  };

  const handleSkip = (direction: number) => {
    if (direction > 0) {
      globalAudioEngine.nextSegment();
    } else {
      globalAudioEngine.prevSegment();
    }
  };

  const handleSelectAudioDevice = async (device: AudioOutputDevice) => {
    await bluetoothAudioService.routeToDevice(device.deviceId, device.label, device.isBluetooth);
    setShowDeviceMenu(false);
  };

  const handleStop = () => {
    globalAudioEngine.stop();
  };

  const handleClose = () => {
    globalAudioEngine.stop();
    onClose();
  };

  if (!currentTrack) return null;

  return (
    <div
      id="global-audio-player"
      className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] lg:bottom-5 left-2 right-2 sm:left-4 sm:right-4 lg:left-72 lg:right-8 z-40 bg-[#FDFCF9]/98 backdrop-blur-md border border-[#E5E0D5] rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 transition-all animate-slideUp space-y-2 sm:space-y-2.5"
    >
      {/* Quick Unmute / Audio Output Banner if blocked or suspended during play */}
      {(hasAutoplayBlock || (isPlaying && audioContextStatus === "suspended")) && (
        <div
          id="audio-autoplay-unblock-banner"
          onClick={handleForceUnblockAndPlay}
          className="w-full bg-[#C5A059] hover:bg-[#B48F48] text-white px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-md cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-white animate-pulse shrink-0" />
            <span>Tap to hear the Audio Bible aloud through your device speaker</span>
          </div>
          <span className="px-3 py-1 bg-white text-[#C5A059] rounded-xl text-[11px] font-bold uppercase tracking-wide shrink-0 shadow-xs">
            Play Aloud
          </span>
        </div>
      )}

      {/* Audio Synthesis / Playback Error Banner */}
      {errorMessage && (
        <div
          id="audio-error-banner"
          className="w-full bg-rose-50 border border-rose-200 text-rose-800 px-3.5 py-2 rounded-2xl text-xs flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span className="font-semibold truncate">{errorMessage}</span>
          </div>
          <button
            onClick={handleForceUnblockAndPlay}
            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold shrink-0 transition-colors cursor-pointer ml-2"
          >
            Retry
          </button>
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

              {/* Real-time Web Speech Synthesis & Playback Status Badge */}
              {errorMessage ? (
                <button
                  onClick={handleForceUnblockAndPlay}
                  className="inline-flex items-center gap-1 text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors"
                  title="Click to clear notice and resume audio"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Speech Notice • Tap to Retry</span>
                </button>
              ) : isLoading ? (
                <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  <span>Starting Voice...</span>
                </span>
              ) : playbackStatus === "READING" || isPlaying ? (
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Reading Aloud</span>
                </span>
              ) : playbackStatus === "PAUSED" ? (
                <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Paused</span>
                </span>
              ) : isFinished || playbackStatus === "FINISHED" ? (
                <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full font-bold">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Finished</span>
                </span>
              ) : null}

              {/* Audio Context Hardware State Badge */}
              <span 
                className={`hidden md:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                  isAudioContextReady
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200 cursor-pointer"
                }`}
                onClick={!isAudioContextReady ? handleForceUnblockAndPlay : undefined}
                title={isAudioContextReady ? "Audio hardware context is active and running" : "Audio hardware is in standby. Click to wake."}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isAudioContextReady ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                <span>{isAudioContextReady ? "Audio Ready" : "Audio Standby (Tap)"}</span>
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
                  {activeNarratorName ? ` • ${formatPersonVoiceName(activeNarratorName)}` : ""}
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
              {SERVER_VOICES.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name} ({voice.gender === "female" ? "Female" : "Male"})
                </option>
              ))}
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

            <button
              id="audio-player-stop-btn"
              onClick={handleStop}
              className="p-1.5 text-[#7A7468] hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs cursor-pointer transition-colors"
              title="Stop Narration"
            >
              <Square className="w-4 h-4" />
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
              onClick={handleClose}
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
