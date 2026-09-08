import React from "react";
import { Play, Clock, Sparkles } from "lucide-react";
import { MinistryVideo, VideoWatchProgress } from "../../types";

interface ContinueWatchingRowProps {
  items: { video: MinistryVideo; progress: VideoWatchProgress }[];
  onSelectVideo: (video: MinistryVideo) => void;
}

export const ContinueWatchingRow: React.FC<ContinueWatchingRowProps> = ({
  items,
  onSelectVideo
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
          <Clock className="w-4 h-4 text-[#C5A059]" />
          <span>Continue Watching ({items.length})</span>
        </div>
        <span className="text-xs text-[#7A7468]">Pick up where you left off</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(({ video, progress }) => (
          <div
            key={video.id}
            onClick={() => onSelectVideo(video)}
            className="group bg-[#FDFCF9] hover:bg-[#F9F7F2] border border-[#E5E0D5] hover:border-[#C5A059]/50 rounded-2xl p-3 flex gap-3 cursor-pointer transition-all shadow-2xs"
          >
            {/* Mini Thumbnail */}
            <div className="relative w-28 aspect-video rounded-xl overflow-hidden bg-black shrink-0">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                <div className="w-7 h-7 rounded-full bg-[#C5A059] text-white flex items-center justify-center shadow-md">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
              {/* Progress Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                <div
                  style={{ width: `${progress.percentage}%` }}
                  className="h-full bg-[#C5A059]"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <h4 className="text-xs font-serif font-bold text-[#2D2D2D] line-clamp-1 group-hover:text-[#C5A059] transition-colors">
                  {video.title}
                </h4>
                <p className="text-[11px] text-[#7A7468] truncate mt-0.5">
                  {video.speaker}
                </p>
              </div>

              <div className="text-[10px] text-[#C5A059] font-semibold flex items-center gap-1">
                <span>{Math.floor(progress.currentTime / 60)}m watched</span>
                <span className="opacity-40">•</span>
                <span>{progress.percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
