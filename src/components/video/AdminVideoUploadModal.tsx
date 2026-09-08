import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Film,
  CheckCircle2,
  AlertCircle,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  FileVideo,
  Eye,
  Check,
  Globe,
  Lock,
  Share2,
  Layers,
  RefreshCw,
  Image as ImageIcon
} from "lucide-react";
import { MinistryVideo, VideoStorageCategory, VideoStatus } from "../../types";
import { Storage } from "../../lib/storage";
import { GtcVideoPlayer } from "./GtcVideoPlayer";

interface AdminVideoUploadModalProps {
  onClose: () => void;
  onVideoUploaded?: (video: MinistryVideo) => void;
}

export const AdminVideoUploadModal: React.FC<AdminVideoUploadModalProps> = ({
  onClose,
  onVideoUploaded,
}) => {
  // Step state: 1: Select -> 2: Uploading/Resumable -> 3: Details & Thumbnail -> 4: Processing Qualities -> 5: Review & Publish
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileObjectUrl, setFileObjectUrl] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const [extractedDurationSeconds, setExtractedDurationSeconds] = useState<number>(0);

  // Resumable upload progress state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [uploadSpeedMbps, setUploadSpeedMbps] = useState(4.2);
  const [uploadEtaSeconds, setUploadEtaSeconds] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [isSimulatingInterruption, setIsSimulatingInterruption] = useState(false);

  // Video Metadata
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("Apostle R.Sango");
  const [speakerRole, setSpeakerRole] = useState("Founder & Lead Minister");
  const [speakerAvatar, setSpeakerAvatar] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
  );
  const [category, setCategory] = useState<VideoStorageCategory>("sermons");
  const [description, setDescription] = useState("");
  const [scriptureRefs, setScriptureRefs] = useState("Romans 8:37, Ephesians 1:19-23");
  const [visibility, setVisibility] = useState<"public" | "private" | "unlisted">("public");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&auto=format&fit=crop&q=80"
  );
  const [customThumbnailPreview, setCustomThumbnailPreview] = useState<string>("");
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);

  // Transcoding / Multi-Quality Processing Step State
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<string>("Analyzing video stream...");
  const [isPublished, setIsPublished] = useState(false);
  const [finalVideoObject, setFinalVideoObject] = useState<MinistryVideo | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const uploadTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle File Selection
  const handleFileSelect = (file: File) => {
    setFileError("");
    const validTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v", "video/ogg"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|m4v|ogg)$/i)) {
      setFileError("Invalid format. Please upload an MP4, WebM, or MOV video file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024 * 1024) {
      setFileError("File is too large. Maximum supported size is 2.0 GB.");
      return;
    }

    setSelectedFile(file);
    setTotalBytes(file.size);
    setUploadedBytes(0);
    setUploadProgress(0);
    setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));

    const objUrl = URL.createObjectURL(file);
    setFileObjectUrl(objUrl);

    // Auto extract duration and thumbnail frame
    extractThumbnailAndDuration(objUrl);
    setCurrentStep(2);
    startResumableUpload(file.size);
  };

  // Extract thumbnail and duration from video file using canvas
  const extractThumbnailAndDuration = (videoUrl: string) => {
    setIsGeneratingThumbnail(true);
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.currentTime = 2; // Capture at 2s

    video.onloadeddata = () => {
      setExtractedDurationSeconds(Math.floor(video.duration || 1800));
      setTimeout(() => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            setThumbnailUrl(dataUrl);
            setCustomThumbnailPreview(dataUrl);
          }
        } catch (e) {
          console.warn("Canvas capture skipped, using standard ministry poster:", e);
        } finally {
          setIsGeneratingThumbnail(false);
        }
      }, 500);
    };
  };

  // Resumable upload simulator
  const startResumableUpload = (total: number) => {
    if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    setIsPaused(false);

    uploadTimerRef.current = setInterval(() => {
      setUploadedBytes((prev) => {
        const chunkSize = 2.4 * 1024 * 1024; // ~2.4MB per tick
        const next = Math.min(total, prev + chunkSize);
        const percent = Math.min(100, Math.round((next / total) * 100));
        setUploadProgress(percent);

        const remainingBytes = total - next;
        const eta = Math.ceil(remainingBytes / (4.2 * 1024 * 1024));
        setUploadEtaSeconds(eta);

        if (next >= total) {
          if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
          setTimeout(() => setCurrentStep(3), 800);
        }
        return next;
      });
    }, 400);
  };

  const togglePauseUpload = () => {
    if (isPaused) {
      setIsPaused(false);
      startResumableUpload(totalBytes);
    } else {
      setIsPaused(true);
      if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    }
  };

  const handleSimulateDisconnect = () => {
    setIsSimulatingInterruption(true);
    if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    setIsPaused(true);
  };

  const handleResumeAfterDisconnect = () => {
    setIsSimulatingInterruption(false);
    setIsPaused(false);
    startResumableUpload(totalBytes);
  };

  // Start Multi-Quality Processing Pipeline
  const handleProceedToProcessing = () => {
    setCurrentStep(4);
    setProcessingProgress(15);
    setProcessingStage("Generating storage path & cloud manifests...");

    setTimeout(() => {
      setProcessingProgress(45);
      setProcessingStage("Transcoding 1080p, 720p, 480p, 360p adaptive bitrates...");
    }, 1200);

    setTimeout(() => {
      setProcessingProgress(80);
      setProcessingStage("Extracting speech transcript & generating Scripture references...");
    }, 2400);

    setTimeout(() => {
      setProcessingProgress(100);
      setProcessingStage("Video ready for review and congregation publishing.");

      const storageDirectory = `/videos/${category}/`;
      const fileName = `${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Date.now()}.mp4`;
      const fullStoragePath = `${storageDirectory}${fileName}`;

      const createdVideo: MinistryVideo = {
        id: `video-${Date.now()}`,
        title: title || "Ministry Message",
        description: description || "Powerful sermon ministered at Global Tower of Christ.",
        speaker: speaker || "Apostle R.Sango",
        speakerRole: speakerRole || "Founder & Lead Minister",
        speakerAvatar: speakerAvatar,
        category: category,
        storagePath: fullStoragePath,
        playbackUrl: fileObjectUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        qualities: {
          "1080p": fileObjectUrl,
          "720p": fileObjectUrl,
          "480p": fileObjectUrl,
          "360p": fileObjectUrl
        },
        thumbnailUrl: thumbnailUrl,
        duration: formatDuration(extractedDurationSeconds || 2400),
        durationSeconds: extractedDurationSeconds || 2400,
        fileSize: totalBytes || 450 * 1024 * 1024,
        fileSizeFormatted: formatFileSize(totalBytes || 450 * 1024 * 1024),
        mimeType: selectedFile?.type || "video/mp4",
        createdAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        visibility: visibility,
        status: "ready",
        viewsCount: 0,
        savesCount: 0,
        scriptureReferences: scriptureRefs.split(",").map((s) => s.trim()).filter(Boolean),
        takeaways: [
          "Walking in spiritual authority and divine covenant victory.",
          "Living by the infallible written Word of God."
        ],
        transcript: description || "Full video sermon ministered on the altar of Christ Jesus."
      };

      setFinalVideoObject(createdVideo);
      setCurrentStep(5);
    }, 3600);
  };

  const handleFinalPublish = () => {
    if (!finalVideoObject) return;
    const published = { ...finalVideoObject, status: "published" as VideoStatus };
    Storage.saveVideo(published);

    // Also sync to Sermons database if category is sermons
    Storage.saveSermon({
      id: published.id,
      title: published.title,
      speaker: published.speaker,
      speakerRole: published.speakerRole,
      speakerAvatar: published.speakerAvatar,
      category: published.category,
      duration: published.duration,
      durationSeconds: published.durationSeconds,
      playbackUrl: published.playbackUrl,
      storagePath: published.storagePath,
      thumbnailUrl: published.thumbnailUrl,
      qualities: published.qualities,
      description: published.description,
      scriptureReferences: published.scriptureReferences || ["Romans 8:37"],
      takeaways: published.takeaways || [],
      transcript: published.transcript || "",
      publishedDate: new Date().toISOString().split("T")[0],
      viewsCount: 1,
      savesCount: 0,
      approvalStatus: "published"
    });

    setIsPublished(true);
    if (onVideoUploaded) onVideoUploaded(published);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s > 0 ? `${s}s` : ""}`.trim();
  };

  useEffect(() => {
    return () => {
      if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#12110F]/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-white border border-[#E5E0D5] rounded-[32px] w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-5 border-b border-[#E5E0D5] flex items-center justify-between gap-4 bg-[#FDFCF9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2D2D2D]">
                First-Party Video Hosting & Processing Center
              </h2>
              <p className="text-xs text-[#7A7468] font-sans">
                Upload, store, transcode, and publish ministry media directly on Global Tower of Christ.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F0ECE1] text-[#7A7468] hover:text-[#2D2D2D] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-6 py-3 bg-[#F9F7F2] border-b border-[#E5E0D5] flex items-center justify-between text-xs font-semibold text-[#8A8478]">
          {[
            { step: 1, label: "Select File" },
            { step: 2, label: "Resumable Upload" },
            { step: 3, label: "Metadata & Poster" },
            { step: 4, label: "Transcode Qualities" },
            { step: 5, label: "Review & Publish" }
          ].map((s) => (
            <div
              key={s.step}
              className={`flex items-center gap-1.5 ${
                currentStep >= s.step ? "text-[#C5A059] font-bold" : "opacity-50"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep >= s.step
                    ? "bg-[#C5A059] text-white"
                    : "bg-[#E5E0D5] text-[#7A7468]"
                }`}
              >
                {currentStep > s.step ? <Check className="w-3 h-3" /> : s.step}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: SELECT FILE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) {
                    handleFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-dashed border-[#C5A059]/60 hover:border-[#C5A059] bg-[#FDFCF9] hover:bg-[#F9F7F2] rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3.5 cursor-pointer transition-all shadow-inner group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                  }}
                />

                <div className="w-16 h-16 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-base font-serif font-bold text-[#2D2D2D]">
                    Select Ministry Video to Upload
                  </h3>
                  <p className="text-xs text-[#7A7468] mt-1">
                    Drag and drop your video here, or tap to browse files
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#8A8478] pt-2">
                  <span className="px-2.5 py-1 bg-white border border-[#E5E0D5] rounded-full">
                    Formats: MP4, WebM, MOV, M4V
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-[#E5E0D5] rounded-full">
                    Max File Size: 2.0 GB
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-[#E5E0D5] rounded-full">
                    Resumable Upload Supported
                  </span>
                </div>
              </div>

              {fileError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{fileError}</span>
                </div>
              )}

              {/* Target Storage Paths Information */}
              <div className="bg-[#F9F7F2] border border-[#E5E0D5] rounded-2xl p-4 text-xs space-y-2">
                <h4 className="font-bold text-[#2D2D2D] font-serif flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Organized Cloud Storage Paths</span>
                </h4>
                <p className="text-[#7A7468]">
                  Uploaded videos are stored in isolated, secure storage directories:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-[#555]">
                  <span className="p-1.5 bg-white rounded border border-[#E5E0D5]">/videos/sermons/</span>
                  <span className="p-1.5 bg-white rounded border border-[#E5E0D5]">/videos/worship/</span>
                  <span className="p-1.5 bg-white rounded border border-[#E5E0D5]">/videos/bible-studies/</span>
                  <span className="p-1.5 bg-white rounded border border-[#E5E0D5]">/videos/interviews/</span>
                  <span className="p-1.5 bg-white rounded border border-[#E5E0D5]">/videos/healing/</span>
                  <span className="p-1.5 bg-white rounded border border-[#E5E0D5]">/videos/live-recordings/</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: RESUMABLE UPLOAD IN PROGRESS */}
          {currentStep === 2 && selectedFile && (
            <div className="space-y-6">
              <div className="p-6 bg-[#FDFCF9] border border-[#E5E0D5] rounded-3xl space-y-5 shadow-xs">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
                      <FileVideo className="w-6 h-6" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-serif font-bold text-[#2D2D2D] text-sm truncate">
                        {selectedFile.name}
                      </h4>
                      <p className="text-xs text-[#7A7468] font-sans mt-0.5">
                        {formatFileSize(uploadedBytes)} / {formatFileSize(totalBytes)} • {selectedFile.type || "video/mp4"}
                      </p>
                    </div>
                  </div>

                  <span className="text-2xl font-serif font-bold text-[#C5A059]">
                    {uploadProgress}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full h-3 bg-[#E5E0D5] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className="h-full bg-gradient-to-r from-[#C5A059] to-[#E5C378] rounded-full transition-all duration-300"
                  />
                </div>

                {/* Speed & ETA stats */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7A7468] pt-1">
                  <span>Upload Speed: <strong>{isPaused ? "0.0 MB/s" : `${uploadSpeedMbps} MB/s`}</strong></span>
                  <span>Estimated Time Remaining: <strong>{uploadEtaSeconds}s</strong></span>
                  <span className="text-emerald-700 font-bold">
                    {isPaused ? "Paused" : "Uploading Chunk..."}
                  </span>
                </div>
              </div>

              {/* Upload Controls (Pause, Resume, Cancel, Interrupted simulation) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePauseUpload}
                    className="px-4 py-2 bg-white hover:bg-[#F9F7F2] border border-[#E5E0D5] text-[#2D2D2D] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
                    <span>{isPaused ? "Resume Upload" : "Pause Upload"}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
                      setSelectedFile(null);
                      setCurrentStep(1);
                    }}
                    className="px-4 py-2 bg-white hover:bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl cursor-pointer shadow-2xs transition-all"
                  >
                    Cancel
                  </button>
                </div>

                {/* Simulated Network Interruption Recovery Button */}
                <button
                  onClick={isSimulatingInterruption ? handleResumeAfterDisconnect : handleSimulateDisconnect}
                  className="px-3.5 py-1.5 bg-[#F9F7F2] border border-[#E5E0D5] text-[11px] font-semibold text-[#8A8478] hover:text-[#2D2D2D] rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3 h-3 ${isSimulatingInterruption ? "text-red-500 animate-spin" : ""}`} />
                  <span>{isSimulatingInterruption ? "Connection Recovered! Tap to Resume" : "Test Network Interruption Recovery"}</span>
                </button>
              </div>

              {isSimulatingInterruption && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-1">
                  <strong>Network Connection Interrupted:</strong> Resumable upload chunk stream paused at {uploadProgress}%. No progress lost. Tap <em>Resume Upload</em> or the recovery button above to continue seamlessly.
                </div>
              )}
            </div>
          )}

          {/* STEP 3: METADATA, DETAILS & THUMBNAIL SELECTION */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                    Sermon / Media Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Walking in Kingdom Authority & Power"
                    className="w-full p-3 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl text-xs text-[#2D2D2D] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                {/* Category & Storage Directory */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                    Category & Storage Directory *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VideoStorageCategory)}
                    className="w-full p-3 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl text-xs text-[#2D2D2D] focus:border-[#C5A059] focus:outline-none"
                  >
                    <option value="sermons">Sermons (/videos/sermons/)</option>
                    <option value="worship">Worship & Praise (/videos/worship/)</option>
                    <option value="bible-studies">Bible Studies (/videos/bible-studies/)</option>
                    <option value="interviews">Interviews (/videos/interviews/)</option>
                    <option value="healing">Healing & Miracles (/videos/healing/)</option>
                    <option value="finance">Financial Stewardship (/videos/finance/)</option>
                    <option value="youth">Youth & Young Adults (/videos/youth/)</option>
                    <option value="leadership">Kingdom Leadership (/videos/leadership/)</option>
                    <option value="prayer">Intercession & Prayer (/videos/prayer/)</option>
                    <option value="prophecy">Prophetic Ministry (/videos/prophecy/)</option>
                    <option value="conferences">Conferences (/videos/conferences/)</option>
                    <option value="live-recordings">Live Recordings (/videos/live-recordings/)</option>
                  </select>
                </div>

                {/* Speaker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                    Speaker / Minister Name *
                  </label>
                  <input
                    type="text"
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    placeholder="Apostle R.Sango"
                    className="w-full p-3 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl text-xs text-[#2D2D2D] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                    Description & Summary
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide context, foundational message summary, and spiritual takeaways..."
                    className="w-full p-3 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl text-xs text-[#2D2D2D] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                {/* Key Scriptures */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                    Key Scripture References (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={scriptureRefs}
                    onChange={(e) => setScriptureRefs(e.target.value)}
                    placeholder="Romans 8:37, Ephesians 1:19-23, John 4:23-24"
                    className="w-full p-3 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl text-xs text-[#2D2D2D] focus:border-[#C5A059] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Thumbnail Selector / Frame Capture */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider flex items-center justify-between">
                  <span>Video Poster Thumbnail</span>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Auto-Captured Frame Available
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#FDFCF9] border border-[#E5E0D5] rounded-2xl">
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail Preview"
                    className="w-full sm:w-48 aspect-video object-cover rounded-xl border border-[#E5E0D5] shadow-xs"
                  />
                  <div className="space-y-2 text-xs">
                    <p className="text-[#7A7468]">
                      A high-definition thumbnail was automatically extracted from the uploaded video. You can also upload a custom image.
                    </p>
                    <button
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="px-4 py-2 bg-white border border-[#E5E0D5] text-[#2D2D2D] hover:bg-[#F9F7F2] rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Upload Custom Poster</span>
                    </button>
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const url = URL.createObjectURL(e.target.files[0]);
                          setThumbnailUrl(url);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E0D5]">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#7A7468] hover:bg-[#F9F7F2] rounded-full cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToProcessing}
                  className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#B48F48] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <span>Start Video Transcoding & Processing</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PROCESSING & TRANSCODING */}
          {currentStep === 4 && (
            <div className="py-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] mx-auto animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-[#2D2D2D]">
                  Processing First-Party Video Stream
                </h3>
                <p className="text-xs text-[#7A7468] max-w-md mx-auto">
                  {processingStage}
                </p>
              </div>

              {/* Multi-Quality Processing Tracker */}
              <div className="max-w-md mx-auto space-y-2">
                <div className="relative w-full h-3 bg-[#E5E0D5] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${processingProgress}%` }}
                    className="h-full bg-gradient-to-r from-[#C5A059] to-emerald-500 rounded-full transition-all duration-500"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[#8A8478]">
                  <span>1080p • 720p • 480p • 360p</span>
                  <span className="font-bold text-[#C5A059]">{processingProgress}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-lg mx-auto text-xs text-stone-600 pt-3">
                <div className="p-2.5 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl flex items-center gap-1.5 justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1080p HD</span>
                </div>
                <div className="p-2.5 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl flex items-center gap-1.5 justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>720p HD</span>
                </div>
                <div className="p-2.5 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl flex items-center gap-1.5 justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>480p SD</span>
                </div>
                <div className="p-2.5 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl flex items-center gap-1.5 justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>360p Low</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & FINAL PUBLISH */}
          {currentStep === 5 && finalVideoObject && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#2D2D2D]">
                    Review Video Before Publishing
                  </h3>
                  <p className="text-xs text-[#7A7468]">
                    Verify playback quality, captions, and details in the native GTC Player.
                  </p>
                </div>

                <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Congregation
                </span>
              </div>

              {/* Interactive Player Preview */}
              <div className="rounded-3xl overflow-hidden shadow-xl border border-[#E5E0D5]">
                <GtcVideoPlayer
                  videoId={finalVideoObject.id}
                  src={finalVideoObject.playbackUrl}
                  title={finalVideoObject.title}
                  speaker={finalVideoObject.speaker}
                  speakerAvatar={finalVideoObject.speakerAvatar}
                  category={finalVideoObject.category}
                  poster={finalVideoObject.thumbnailUrl}
                  storagePath={finalVideoObject.storagePath}
                  duration={finalVideoObject.duration}
                  qualities={finalVideoObject.qualities}
                />
              </div>

              {/* Stored Metadata Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl">
                  <div className="text-[10px] text-[#8A8478] uppercase font-bold">Cloud Path</div>
                  <div className="font-mono text-[#2D2D2D] truncate font-bold">{finalVideoObject.storagePath}</div>
                </div>
                <div className="p-3 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl">
                  <div className="text-[10px] text-[#8A8478] uppercase font-bold">File Size</div>
                  <div className="text-[#2D2D2D] font-bold">{finalVideoObject.fileSizeFormatted}</div>
                </div>
                <div className="p-3 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl">
                  <div className="text-[10px] text-[#8A8478] uppercase font-bold">Duration</div>
                  <div className="text-[#2D2D2D] font-bold">{finalVideoObject.duration}</div>
                </div>
                <div className="p-3 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl">
                  <div className="text-[10px] text-[#8A8478] uppercase font-bold">Stream Qualities</div>
                  <div className="text-emerald-700 font-bold">1080p, 720p, 480p</div>
                </div>
              </div>

              {/* Publish Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E0D5]">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#7A7468] hover:bg-[#F9F7F2] rounded-full cursor-pointer"
                >
                  Save as Draft
                </button>
                <button
                  onClick={handleFinalPublish}
                  disabled={isPublished}
                  className="px-7 py-3 bg-[#C5A059] hover:bg-[#B48F48] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md cursor-pointer transition-all flex items-center gap-2"
                >
                  {isPublished ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Published to Media Library!</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      <span>Publish to Global Tower of Christ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
