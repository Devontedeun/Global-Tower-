import React from "react";
import {
  Play,
  Clock,
  Eye,
  Bookmark,
  Share2,
  Check,
  Film
} from "lucide-react";
import { MinistryVideo, VideoWatchProgress } from "../../types";

interface VideoCardProps {
  video: MinistryVideo;
  watchProgress?: VideoWatchProgress;
  isSaved?: boolean;
  onSelect: (video: MinistryVideo) => void;
  onToggleSave?: (id: string) => void;
  onShare?: (video: MinistryVideo) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  watchProgress,
  isSaved = false,
  onSelect,
  onToggleSave,
  onShare
}) => {
  return (
    <div
      id={`video-card-${video.id}`}
      className="group bg-white border border-[#E5E0D5] hover:border-[#C5A059]/60 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
      onClick={() => onSelect(video)}
    >
      {/* Thumbnail Area with Duration & Progress */}
      <div className="relative w-full aspect-video bg-[#12110F] overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top Badges: Category & Storage Path indicator */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-full bg-[#12110F]/80 backdrop-blur-md text-[#E5C378] border border-[#C5A059]/40 text-[10px] font-bold uppercase tracking-wider">
            {video.category}
          </span>

          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-stone-300 text-[10px] font-mono">
            {video.duration}
          </span>
        </div>

        {/* Center Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-[#C5A059]/90 text-white flex items-center justify-center shadow-xl backdrop-blur-md transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Watch Progress Bar if user has started watching */}
        {watchProgress && watchProgress.percentage > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
            <div
              style={{ width: `${watchProgress.percentage}%` }}
              className="h-full bg-[#C5A059]"
            />
          </div>
        )}
      </div>

      {/* Video Details Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D2D2D] group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-snug">
            {video.title}
          </h3>

          {/* Speaker Info */}
          <div className="flex items-center gap-2">
            {video.speakerAvatar && (
              <img
                src={video.speakerAvatar}
                alt={video.speaker}
                className="w-6 h-6 rounded-full object-cover border border-[#C5A059]"
              />
            )}
            <span className="text-xs font-semibold text-[#7A7468] truncate font-sans">
              {video.speaker}
            </span>
          </div>

          {/* Progress resume text if partially watched */}
          {watchProgress && watchProgress.percentage > 0 && !watchProgress.completed && (
            <div className="text-[11px] text-[#C5A059] font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Resume at {Math.floor(watchProgress.currentTime / 60)}m ({watchProgress.percentage}%)</span>
            </div>
          )}
        </div>

        {/* Bottom Card Footer: Views, Date, Actions */}
        <div className="pt-3 border-t border-[#E5E0D5] flex items-center justify-between text-[11px] text-[#8A8478] font-sans">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-[#C5A059]" /> {video.viewsCount}
            </span>
            <span className="opacity-40">•</span>
            <span>{video.publishedAt.split("T")[0]}</span>
          </div>

          <div className="flex items-center gap-1">
            {onToggleSave && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(video.id);
                }}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  isSaved
                    ? "text-[#C5A059] bg-[#C5A059]/10"
                    : "text-[#8A8478] hover:text-[#2D2D2D] hover:bg-[#F9F7F2]"
                }`}
                title={isSaved ? "Saved to Library" : "Save video"}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
              </button>
            )}

            {onShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(video);
                }}
                className="p-1.5 rounded-full text-[#8A8478] hover:text-[#2D2D2D] hover:bg-[#F9F7F2] transition-colors cursor-pointer"
                title="Share video"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
