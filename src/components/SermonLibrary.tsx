import React, { useState, useEffect } from "react";
import {
  Video,
  Play,
  Volume2,
  Bookmark,
  Share2,
  FileText,
  User,
  Search,
  Check,
  Sparkles,
  ArrowRight,
  BookOpen,
  Filter,
  Upload,
  Clock,
  Film,
  Layers
} from "lucide-react";
import { Sermon, MinistryVideo, VideoWatchProgress, UserProfile } from "../types";
import { SERMONS_DATABASE } from "../data/mockData";
import { Storage } from "../lib/storage";
import { AudioTrack } from "./AudioPlayerBar";
import { unlockAudio, startSynchronousAudioPlayback } from "../lib/audioVoiceHelper";
import { GtcVideoPlayer } from "./video/GtcVideoPlayer";
import { AdminVideoUploadModal } from "./video/AdminVideoUploadModal";
import { VideoCard } from "./video/VideoCard";
import { ContinueWatchingRow } from "./video/ContinueWatchingRow";

interface SermonLibraryProps {
  initialSermonId?: string;
  currentUser?: UserProfile;
  onPlayAudio?: (track: AudioTrack) => void;
  onAskAI?: (topic: string) => void;
  onNavigateToTeacher?: (teacherName: string) => void;
  onNavigateToBible?: (book: string, chapter: number) => void;
}

export const SermonLibrary: React.FC<SermonLibraryProps> = ({
  initialSermonId,
  currentUser,
  onPlayAudio,
  onAskAI,
  onNavigateToTeacher,
  onNavigateToBible,
}) => {
  const [videos, setVideos] = useState<MinistryVideo[]>(Storage.getVideos());
  const [sermons, setSermons] = useState<Sermon[]>(SERMONS_DATABASE);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeVideo, setActiveVideo] = useState<MinistryVideo | null>(() => {
    const list = Storage.getVideos();
    if (initialSermonId) {
      const match = list.find((v) => v.id === initialSermonId);
      if (match) return match;
    }
    return list[0] || null;
  });

  const [savedVideoIds, setSavedVideoIds] = useState<string[]>(Storage.getSavedSermonIds());
  const [showTranscript, setShowTranscript] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [continueWatchingItems, setContinueWatchingItems] = useState(Storage.getContinueWatchingList());

  // Reload videos and progress periodically
  const refreshLibrary = () => {
    setVideos(Storage.getVideos());
    setContinueWatchingItems(Storage.getContinueWatchingList());
  };

  const categories = [
    "All",
    "sermons",
    "worship",
    "bible-studies",
    "interviews",
    "healing",
    "finance",
    "youth",
    "leadership",
    "prayer",
    "prophecy",
    "conferences",
    "live-recordings"
  ];

  const handleToggleSave = (id: string) => {
    const updated = Storage.toggleSaveSermon(id);
    setSavedVideoIds(updated);
  };

  const handleShare = (vid: MinistryVideo) => {
    const shareText = `Watch "${vid.title}" by ${vid.speaker} on Global Tower of Christ: https://globaltowerofchrist.org/media/${vid.id}`;
    navigator.clipboard.writeText(shareText);
    setCopiedId(vid.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleListenAudio = (vid: MinistryVideo) => {
    unlockAudio();
    const track: AudioTrack = {
      id: `media-audio-${vid.id}`,
      title: vid.title,
      subtitle: `${vid.speaker} • ${vid.category}`,
      textToRead: `${vid.title}. Ministered by ${vid.speaker}. ${vid.description}. Key scriptures: ${(vid.scriptureReferences || []).join(", ")}. Transcript excerpt: ${vid.transcript || ""}`
    };
    if (onPlayAudio) {
      onPlayAudio(track);
    } else {
      startSynchronousAudioPlayback(track);
    }
  };

  const filteredVideos = videos.filter((v) => {
    const matchesCat = selectedCategory === "All" || v.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div id="sermon-library-container" className="w-full space-y-8">
      {/* Top Header Bar & Admin Upload CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E5E0D5] rounded-[32px] p-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2D2D2D]">
              Global Tower of Christ Video & Media Sanctuary
            </h1>
            <p className="text-xs text-[#7A7468] font-sans">
              First-party hosted sermons, worship sessions, theological studies, and prophetic recordings.
            </p>
          </div>
        </div>

        {/* Upload Video Trigger */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#C5A059] hover:bg-[#B48F48] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md shadow-[#C5A059]/20 transition-all cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Ministry Video</span>
        </button>
      </div>

      {/* Continue Watching Row (If any in-progress videos) */}
      <ContinueWatchingRow
        items={continueWatchingItems}
        onSelectVideo={(video) => {
          setActiveVideo(video);
          window.scrollTo({ top: 120, behavior: "smooth" });
        }}
      />

      {/* Featured Video Player Area (Native GtcVideoPlayer) */}
      {activeVideo && (
        <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[#E5E0D5]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              <Video className="w-4 h-4 text-[#C5A059]" />
              <span>GTC First-Party Media Player</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#8A8478] font-mono">
              <span>{activeVideo.storagePath || `/videos/${activeVideo.category}/${activeVideo.id}.mp4`}</span>
              <span className="opacity-40">•</span>
              <span>{activeVideo.viewsCount} views</span>
            </div>
          </div>

          {/* Native HTML5 Video Player Frame */}
          <div className="w-full">
            <GtcVideoPlayer
              key={activeVideo.id}
              videoId={activeVideo.id}
              src={activeVideo.playbackUrl}
              title={activeVideo.title}
              speaker={activeVideo.speaker}
              speakerAvatar={activeVideo.speakerAvatar}
              category={activeVideo.category}
              poster={activeVideo.thumbnailUrl}
              storagePath={activeVideo.storagePath}
              duration={activeVideo.duration}
              qualities={activeVideo.qualities}
              onProgressUpdate={() => setContinueWatchingItems(Storage.getContinueWatchingList())}
            />
          </div>

          {/* Active Video Details & Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 bg-[#FDFCF9] text-[#C5A059] border border-[#E5E0D5] text-xs font-bold uppercase rounded-full tracking-wider">
                  {activeVideo.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2D2D2D] mt-2">
                  {activeVideo.title}
                </h2>
                <div
                  onClick={() => onNavigateToTeacher && onNavigateToTeacher(activeVideo.speaker)}
                  className="inline-flex items-center gap-2.5 mt-2 cursor-pointer group"
                >
                  {activeVideo.speakerAvatar && (
                    <img
                      src={activeVideo.speakerAvatar}
                      alt={activeVideo.speaker}
                      className="w-8 h-8 rounded-full object-cover border border-[#C5A059]"
                    />
                  )}
                  <div>
                    <span className="text-xs font-bold text-[#2D2D2D] group-hover:text-[#C5A059] transition-colors">
                      {activeVideo.speaker}
                    </span>
                    <span className="text-[11px] text-[#8A8478] block">
                      {activeVideo.speakerRole || "Minister"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleListenAudio(activeVideo)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#C5A059] hover:bg-[#B48F48] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md shadow-[#C5A059]/20 transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Audio</span>
                </button>

                <button
                  onClick={() => handleToggleSave(activeVideo.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 border rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    savedVideoIds.includes(activeVideo.id)
                      ? "bg-[#FDFCF9] border-[#C5A059] text-[#C5A059] font-bold shadow-2xs"
                      : "bg-[#F9F7F2] hover:bg-white border-[#E5E0D5] text-[#7A7468] hover:text-[#2D2D2D]"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${savedVideoIds.includes(activeVideo.id) ? "fill-[#C5A059]" : ""}`} />
                  <span>{savedVideoIds.includes(activeVideo.id) ? "Saved" : "Save"}</span>
                </button>

                <button
                  onClick={() => handleShare(activeVideo)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#F9F7F2] hover:bg-white border border-[#E5E0D5] text-[#7A7468] hover:text-[#2D2D2D] rounded-full text-xs font-semibold transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedId === activeVideo.id ? "Copied!" : "Share"}</span>
                </button>

                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#F9F7F2] hover:bg-white border border-[#E5E0D5] text-[#7A7468] hover:text-[#C5A059] rounded-full text-xs font-semibold transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#C5A059]" />
                  <span>{showTranscript ? "Hide Transcript" : "Transcript"}</span>
                </button>
              </div>
            </div>

            {/* Description & Key Takeaways */}
            <p className="text-[#7A7468] text-sm leading-relaxed font-sans">{activeVideo.description}</p>

            {/* Scripture references tags */}
            {(activeVideo.scriptureReferences || []).length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-[#2D2D2D]">Key Scriptures:</span>
                {(activeVideo.scriptureReferences || []).map((ref, idx) => {
                  const parts = ref.split(" ");
                  const book = parts[0];
                  const chapter = parseInt(parts[1]?.split(":")[0] || "1");
                  return (
                    <button
                      key={idx}
                      onClick={() => onNavigateToBible && onNavigateToBible(book, chapter)}
                      className="px-3 py-1 bg-[#FDFCF9] text-[#C5A059] border border-[#E5E0D5] hover:border-[#C5A059] rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>{ref}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Key Takeaways */}
            {(activeVideo.takeaways || []).length > 0 && (
              <div className="p-5 bg-[#FDFCF9] border border-[#E5E0D5] rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider font-serif">
                  Spiritual Foundations & Takeaways
                </h4>
                <ul className="space-y-1.5">
                  {(activeVideo.takeaways || []).map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#7A7468]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full Transcript Drawer */}
            {showTranscript && (
              <div className="p-6 bg-[#FDFCF9] border border-[#E5E0D5] rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider font-serif">
                    Full Sermon Transcript
                  </h4>
                  {onAskAI && (
                    <button
                      onClick={() => onAskAI(`Explain key theological themes in the sermon: "${activeVideo.title}"`)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A059] hover:underline cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze Theological Themes with AI</span>
                    </button>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto font-serif text-xs text-[#2D2D2D] leading-relaxed whitespace-pre-line p-4 bg-white rounded-2xl border border-[#E5E0D5]">
                  {activeVideo.transcript || activeVideo.description}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Videos Library Grid & Filter Section */}
      <div className="space-y-4">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4.5 rounded-[28px] border border-[#E5E0D5] shadow-xs">
          {/* Category Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs font-semibold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap capitalize transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#C5A059] text-white font-bold shadow-2xs"
                    : "bg-[#F9F7F2] text-[#7A7468] hover:bg-white hover:text-[#C5A059] border border-[#E5E0D5]"
                }`}
              >
                {cat.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search library, ministers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#F9F7F2] border border-[#E5E0D5] focus:border-[#C5A059] focus:bg-white rounded-xl text-xs font-medium focus:outline-none transition-all placeholder:text-[#AAA498]"
            />
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => {
            const isSaved = savedVideoIds.includes(video.id);
            const watchProg = Storage.getWatchProgress(video.id);

            return (
              <VideoCard
                key={video.id}
                video={video}
                watchProgress={watchProg || undefined}
                isSaved={isSaved}
                onSelect={(selected) => {
                  setActiveVideo(selected);
                  window.scrollTo({ top: 120, behavior: "smooth" });
                }}
                onToggleSave={handleToggleSave}
                onShare={handleShare}
              />
            );
          })}
        </div>
      </div>

      {/* Admin Video Upload Modal */}
      {isUploadModalOpen && (
        <AdminVideoUploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onVideoUploaded={(newVid) => {
            refreshLibrary();
            setActiveVideo(newVid);
          }}
        />
      )}
    </div>
  );
};
