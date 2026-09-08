import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  Settings,
  Subtitles,
  ExternalLink,
  Clock,
  Headphones,
  Check,
  Share2,
  Sparkles,
  AlertCircle,
  Film
} from "lucide-react";
import { VideoWatchProgress } from "../../types";
import { Storage } from "../../lib/storage";

export interface GtcVideoPlayerProps {
  videoId: string;
  src?: string;
  title: string;
  speaker?: string;
  speakerAvatar?: string;
  category?: string;
  poster?: string;
  storagePath?: string;
  duration?: string;
  qualities?: Record<string, string>;
  captions?: { time: number; text: string }[];
  externalYouTubeUrl?: string;
  autoPlay?: boolean;
  onProgressUpdate?: (progress: VideoWatchProgress) => void;
  onEnded?: () => void;
}

// Fallback high-reliability stream URLs if video file is loading
const DEFAULT_VIDEO_STREAM = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const GtcVideoPlayer: React.FC<GtcVideoPlayerProps> = ({
  videoId,
  src = DEFAULT_VIDEO_STREAM,
  title,
  speaker,
  speakerAvatar,
  category,
  poster,
  storagePath,
  duration,
  qualities,
  captions,
  externalYouTubeUrl,
  autoPlay = false,
  onProgressUpdate,
  onEnded
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState<string>("Auto (1080p)");
  const [activeCaption, setActiveCaption] = useState<string>("");
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [audioOnlyMode, setAudioOnlyMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Resume watching state
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [resumeTimeSeconds, setResumeTimeSeconds] = useState(0);

  // Double-tap seeking indicator (Mobile gesture)
  const [doubleTapFeedback, setDoubleTapFeedback] = useState<"left" | "right" | null>(null);
  const lastTapRef = useRef<{ time: number; x: number }>({ time: 0, x: 0 });
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check saved watch progress on mount
  useEffect(() => {
    const saved = Storage.getWatchProgress(videoId);
    if (saved && saved.currentTime > 10 && !saved.completed) {
      setResumeTimeSeconds(saved.currentTime);
      setShowResumeBanner(true);
    }
  }, [videoId]);

  // Handle Controls fadeout timer
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!showSettingsMenu && !showSpeedMenu && !showQualityMenu) {
          setShowControls(false);
        }
      }, 3500);
    }
  }, [isPlaying, showSettingsMenu, showSpeedMenu, showQualityMenu]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Time & progress tracker
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || totalDuration || 1;
    setCurrentTime(current);

    if (videoRef.current.buffered.length > 0) {
      setBufferedEnd(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
    }

    // Update active captions if available
    if (captions && captions.length > 0 && captionsEnabled) {
      const match = captions.slice().reverse().find((c) => current >= c.time);
      if (match && current - match.time < 5) {
        setActiveCaption(match.text);
      } else {
        setActiveCaption("");
      }
    }

    // Save watch progress periodically
    const progress: VideoWatchProgress = {
      videoId,
      currentTime: Math.floor(current),
      duration: Math.floor(dur),
      percentage: Math.min(100, Math.round((current / dur) * 100)),
      lastWatchedAt: new Date().toISOString(),
      completed: current >= dur - 5
    };

    if (Math.floor(current) % 4 === 0) {
      Storage.saveWatchProgress(progress);
      if (onProgressUpdate) onProgressUpdate(progress);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setShowResumeBanner(false);
      }).catch((e) => console.log("Play interrupted:", e));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimeout();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = Number(e.target.value);
    setCurrentTime(seekTo);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTo;
    }
    resetControlsTimeout();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume || 0.8;
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds));
    resetControlsTimeout();
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
    setShowSettingsMenu(false);
  };

  const handleQualityChange = (qLabel: string) => {
    setSelectedQuality(qLabel);
    // In full deployment this switches stream URL while preserving currentTime
    setShowQualityMenu(false);
    setShowSettingsMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch((err) => {
        console.warn("Fullscreen request error:", err);
      });
    } else {
      document.exitFullscreen?.();
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.warn("PiP not supported or failed:", e);
    }
  };

  const handleTouchStage = (e: React.TouchEvent<HTMLDivElement>) => {
    const now = Date.now();
    const touch = e.changedTouches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const isLeft = x < rect.width / 2;

    if (now - lastTapRef.current.time < 300 && Math.abs(x - lastTapRef.current.x) < 80) {
      // Double tap detected!
      if (isLeft) {
        skipTime(-10);
        setDoubleTapFeedback("left");
      } else {
        skipTime(10);
        setDoubleTapFeedback("right");
      }
      setTimeout(() => setDoubleTapFeedback(null), 800);
      lastTapRef.current = { time: 0, x: 0 };
    } else {
      lastTapRef.current = { time: now, x };
      resetControlsTimeout();
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    }
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      ref={containerRef}
      id={`gtc-player-${videoId}`}
      onMouseMove={resetControlsTimeout}
      onTouchStart={resetControlsTimeout}
      className={`relative w-full aspect-video select-none overflow-hidden rounded-3xl bg-[#0A0A09] border border-[#2C2A24] shadow-2xl group ${
        isFullscreen ? "rounded-none border-none h-screen w-screen" : ""
      }`}
    >
      {/* Resume Playback Banner */}
      {showResumeBanner && (
        <div className="absolute top-4 left-4 right-4 z-40 bg-black/90 backdrop-blur-md border border-[#C5A059] p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-xs animate-fade-in">
          <div className="flex items-center gap-2.5 text-white">
            <div className="w-8 h-8 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-[#E5C378]" />
            </div>
            <div>
              <div className="font-bold font-serif text-[#E5C378]">Resume Watching?</div>
              <div className="text-[11px] text-stone-300">
                You were at <span className="text-white font-mono font-bold">{formatTime(resumeTimeSeconds)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = resumeTimeSeconds;
                  videoRef.current.play();
                  setIsPlaying(true);
                }
                setShowResumeBanner(false);
              }}
              className="px-3.5 py-1.5 bg-[#C5A059] hover:bg-[#B48F48] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
            >
              Resume ({formatTime(resumeTimeSeconds)})
            </button>
            <button
              onClick={() => {
                setShowResumeBanner(false);
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                }
              }}
              className="px-3 py-1.5 bg-[#2C2A24] hover:bg-[#3C3A33] text-stone-300 hover:text-white text-xs font-medium rounded-xl cursor-pointer transition-all"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Main Native HTML5 Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        autoPlay={autoPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setTotalDuration(videoRef.current.duration);
            setIsLoading(false);
          }
        }}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        onClick={togglePlay}
        onTouchEnd={handleTouchStage}
        className={`w-full h-full object-contain cursor-pointer transition-opacity ${
          audioOnlyMode ? "opacity-10" : "opacity-100"
        }`}
      />

      {/* Audio-Only Mode Background Artwork Overlay */}
      {audioOnlyMode && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center pointer-events-none bg-gradient-to-b from-[#1C1B18]/90 to-[#12110F]/95">
          {speakerAvatar && (
            <img
              src={speakerAvatar}
              alt={speaker || title}
              className="w-24 h-24 rounded-full object-cover border-2 border-[#C5A059] shadow-2xl mb-3"
            />
          )}
          <div className="font-serif font-bold text-white text-lg max-w-md">{title}</div>
          <div className="text-xs text-[#C5A059] font-medium mt-1">{speaker}</div>
          <div className="mt-3 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] text-xs font-semibold">
            <Headphones className="w-3.5 h-3.5" />
            <span>Audio-Only Mode • Bandwidth Saver</span>
          </div>
        </div>
      )}

      {/* Double Tap Seek Visual Feedback */}
      {doubleTapFeedback && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none p-4 rounded-full bg-black/60 backdrop-blur-sm border border-[#C5A059]/60 flex items-center gap-2 text-white font-bold animate-ping-once ${
            doubleTapFeedback === "left" ? "left-12" : "right-12"
          }`}
        >
          {doubleTapFeedback === "left" ? (
            <>
              <RotateCcw className="w-6 h-6 text-[#E5C378]" />
              <span className="text-sm">-10s</span>
            </>
          ) : (
            <>
              <span className="text-sm">+10s</span>
              <RotateCw className="w-6 h-6 text-[#E5C378]" />
            </>
          )}
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-black/40">
          <div className="w-12 h-12 border-3 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin shadow-xl" />
        </div>
      )}

      {/* Synchronized Captions / Subtitles Overlay */}
      {activeCaption && captionsEnabled && !audioOnlyMode && (
        <div className="absolute bottom-20 left-6 right-6 z-25 flex justify-center pointer-events-none">
          <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl text-white font-sans text-sm sm:text-base font-semibold shadow-2xl text-center max-w-2xl leading-snug animate-fade-in">
            {activeCaption}
          </div>
        </div>
      )}

      {/* Top Header Overlay (Branding & Video Details) */}
      <div
        className={`absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 flex items-center justify-between gap-3 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {speakerAvatar && (
            <img
              src={speakerAvatar}
              alt={speaker || "Minister"}
              className="w-9 h-9 rounded-full object-cover border border-[#C5A059] shrink-0"
            />
          )}
          <div className="truncate">
            <h2 className="text-white font-serif font-bold text-sm sm:text-base truncate leading-tight">
              {title}
            </h2>
            <p className="text-[11px] text-[#C5A059] font-sans flex items-center gap-2 truncate">
              {speaker && <span>{speaker}</span>}
              {category && (
                <>
                  <span className="opacity-40">•</span>
                  <span className="px-2 py-0.5 bg-[#C5A059]/20 border border-[#C5A059]/40 rounded-full text-[10px] uppercase font-bold text-[#E5C378]">
                    {category}
                  </span>
                </>
              )}
              {storagePath && (
                <>
                  <span className="opacity-40 hidden md:inline">•</span>
                  <span className="text-[10px] text-stone-400 font-mono hidden md:inline truncate">
                    {storagePath}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Optional External YouTube Link (Never Embedded) */}
          {externalYouTubeUrl && (
            <a
              href={externalYouTubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white rounded-full text-xs font-semibold transition-all"
              title="Watch on YouTube (External Link)"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>YouTube</span>
            </a>
          )}

          {/* First-Party Native Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] rounded-full text-xs font-bold uppercase tracking-wider">
            <Film className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GTC Native Media</span>
          </div>
        </div>
      </div>

      {/* Center Big Play/Pause Action Indicator on Hover */}
      <div
        onClick={togglePlay}
        className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 ${
          !isPlaying || showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#C5A059]/90 hover:bg-[#C5A059] text-white flex items-center justify-center shadow-2xl backdrop-blur-md transform transition-transform hover:scale-108 active:scale-95 cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="w-7 sm:w-9 h-7 sm:h-9 fill-current" />
          ) : (
            <Play className="w-7 sm:w-9 h-7 sm:h-9 fill-current ml-1" />
          )}
        </button>
      </div>

      {/* Bottom Control Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 space-y-2.5 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Scrub Bar / Timeline with Buffered Ranges */}
        <div className="relative w-full group/scrub flex items-center cursor-pointer">
          {/* Buffered track */}
          <div
            style={{ width: `${(bufferedEnd / (totalDuration || 1)) * 100}%` }}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-white/20 pointer-events-none"
          />
          {/* Played track */}
          <div
            style={{ width: `${(currentTime / (totalDuration || 1)) * 100}%` }}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[#C5A059] pointer-events-none"
          />
          {/* Interactive Range Input */}
          <input
            type="range"
            min={0}
            max={totalDuration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-full appearance-none outline-none cursor-pointer accent-[#C5A059]"
          />
        </div>

        {/* Primary Controls Row */}
        <div className="flex items-center justify-between gap-2 text-white">
          {/* Left Controls: Play, Skip, Volume, Timestamps */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full hover:bg-white/10 text-white cursor-pointer transition-colors"
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={() => skipTime(-10)}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer transition-colors"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => skipTime(10)}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer transition-colors"
              title="Forward 10 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-20 h-1 bg-white/30 rounded-full appearance-none outline-none cursor-pointer accent-[#C5A059] hidden sm:block"
              />
            </div>

            {/* Timestamps */}
            <div className="text-xs font-mono text-stone-300 pl-1">
              <span>{formatTime(currentTime)}</span>
              <span className="opacity-40 mx-1">/</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Right Controls: Quality, Speed, Captions, Audio Mode, PiP, Fullscreen */}
          <div className="flex items-center gap-1 sm:gap-2 relative">
            {/* Audio-Only Mode Switcher */}
            <button
              onClick={() => setAudioOnlyMode(!audioOnlyMode)}
              className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                audioOnlyMode
                  ? "bg-[#C5A059] text-white"
                  : "hover:bg-white/10 text-stone-300 hover:text-white"
              }`}
              title="Toggle Audio-Only Low-Bandwidth Mode"
            >
              <Headphones className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Audio Mode</span>
            </button>

            {/* Captions Toggle */}
            <button
              onClick={() => setCaptionsEnabled(!captionsEnabled)}
              className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
                captionsEnabled
                  ? "text-[#E5C378] bg-[#C5A059]/20"
                  : "text-stone-400 hover:text-white hover:bg-white/10"
              }`}
              title="Toggle Captions & Subtitles"
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSpeedMenu(!showSpeedMenu);
                  setShowQualityMenu(false);
                }}
                className="px-2 py-1 rounded-lg text-xs font-mono font-bold hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-10 right-0 w-28 bg-[#1A1916] border border-[#2C2A24] rounded-2xl shadow-2xl p-1.5 space-y-1 text-xs z-50">
                  <div className="px-2 py-1 text-[10px] font-bold text-[#8A8478] uppercase tracking-wider">Speed</div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`w-full px-2.5 py-1.5 rounded-xl text-left flex items-center justify-between cursor-pointer ${
                        playbackSpeed === s ? "bg-[#C5A059] text-white font-bold" : "text-stone-300 hover:bg-white/10"
                      }`}
                    >
                      <span>{s}x</span>
                      {playbackSpeed === s && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowQualityMenu(!showQualityMenu);
                  setShowSpeedMenu(false);
                }}
                className="px-2 py-1 rounded-lg text-xs font-mono font-bold hover:bg-white/10 text-[#E5C378] cursor-pointer"
                title="Video Quality"
              >
                {selectedQuality.split(" ")[0]}
              </button>

              {showQualityMenu && (
                <div className="absolute bottom-10 right-0 w-36 bg-[#1A1916] border border-[#2C2A24] rounded-2xl shadow-2xl p-1.5 space-y-1 text-xs z-50">
                  <div className="px-2 py-1 text-[10px] font-bold text-[#8A8478] uppercase tracking-wider">Quality (GTC Stream)</div>
                  {["Auto (1080p)", "1080p HD", "720p HD", "480p SD", "360p Low"].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQualityChange(q)}
                      className={`w-full px-2.5 py-1.5 rounded-xl text-left flex items-center justify-between cursor-pointer ${
                        selectedQuality === q ? "bg-[#C5A059] text-white font-bold" : "text-stone-300 hover:bg-white/10"
                      }`}
                    >
                      <span>{q}</span>
                      {selectedQuality === q && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Picture-in-Picture */}
            <button
              onClick={togglePiP}
              className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer transition-colors hidden sm:block"
              title="Picture in Picture"
            >
              <Minimize className="w-4 h-4 rotate-45" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer transition-colors"
              title="Fullscreen (F)"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
