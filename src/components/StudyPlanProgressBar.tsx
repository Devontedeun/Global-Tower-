import React, { useRef } from "react";
import {
  CheckCircle2,
  Circle,
  Award,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { BibleStudyPlan } from "../types";

interface StudyPlanProgressBarProps {
  plan: BibleStudyPlan;
  activeDayNumber?: number;
  onSelectDay?: (dayNumber: number) => void;
  className?: string;
  variant?: "full" | "card";
}

export const StudyPlanProgressBar: React.FC<StudyPlanProgressBarProps> = ({
  plan,
  activeDayNumber = 1,
  onSelectDay,
  className = "",
  variant = "full"
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Compute reliable completion metrics
  const totalDays = Math.max(1, plan.totalDays || plan.days?.length || 1);
  const completedCount = Array.isArray(plan.days)
    ? plan.days.filter((d) => d.isCompleted).length
    : plan.completedDays || 0;
  const percentage = Math.min(100, Math.max(0, Math.round((completedCount / totalDays) * 100)));
  const daysRemaining = Math.max(0, totalDays - completedCount);
  const isAllCompleted = completedCount >= totalDays;

  // Milestone label based on percentage
  const getMilestone = () => {
    if (percentage === 100) return { label: "Victorious Completion!", badge: "Victory", color: "text-emerald-700 bg-emerald-50 border-emerald-300" };
    if (percentage >= 75) return { label: "Nearing the Glorious Finish", badge: "Final Phase", color: "text-amber-800 bg-amber-50 border-[#C5A059]" };
    if (percentage >= 50) return { label: "Deepening Revelation & Faith", badge: "Halfway Strong", color: "text-[#B48F48] bg-[#FDFCF9] border-[#C5A059]" };
    if (percentage >= 25) return { label: "Building Steadfast Momentum", badge: "Growing", color: "text-[#7A7468] bg-[#F9F7F2] border-[#E5E0D5]" };
    if (percentage > 0) return { label: "Spiritual Foundation Laid", badge: "Initiated", color: "text-[#7A7468] bg-[#F9F7F2] border-[#E5E0D5]" };
    return { label: "Ready to Begin Day 1", badge: "Not Started", color: "text-[#8A8478] bg-[#F9F7F2] border-[#E5E0D5]" };
  };

  const milestone = getMilestone();

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 240;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  // Compact variant for plan list cards
  if (variant === "card") {
    return (
      <div className={`w-full space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-medium text-[#7A7468] truncate">
            {completedCount} of {totalDays} Days Completed
          </span>
          <span className={`text-[11px] font-bold ${isAllCompleted ? "text-emerald-600" : "text-[#C5A059]"}`}>
            {percentage}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${plan.title} progress: ${percentage}%`}
          className="w-full h-2 bg-[#EFECE4] rounded-full overflow-hidden border border-[#E5E0D5]"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isAllCompleted
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : "bg-gradient-to-r from-[#C5A059] via-[#D8B46E] to-[#B48F48]"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  // Full detailed interactive progress tracker
  return (
    <div
      id={`study-progress-tracker-${plan.id}`}
      className={`w-full bg-white border border-[#E5E0D5] rounded-3xl p-4 sm:p-6 shadow-2xs space-y-5 ${className}`}
    >
      {/* Top Header: Title, Milestone, Percentage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FDFCF9] border border-[#E5E0D5] text-[#C5A059]">
              <TrendingUp className="w-3 h-3" />
              <span>Study Progress</span>
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${milestone.color}`}
            >
              {isAllCompleted ? <Award className="w-3 h-3 text-emerald-600" /> : <Sparkles className="w-3 h-3 text-[#C5A059]" />}
              <span>{milestone.badge}</span>
            </span>
          </div>
          <div className="text-xs text-[#7A7468] font-sans pt-0.5">
            {milestone.label}
          </div>
        </div>

        {/* Big Percentage Metric */}
        <div className="flex items-baseline gap-1.5 self-start sm:self-auto shrink-0">
          <span
            className={`text-2xl sm:text-3xl font-serif font-bold ${
              isAllCompleted ? "text-emerald-600" : "text-[#2D2D2D]"
            }`}
          >
            {percentage}%
          </span>
          <span className="text-xs font-semibold text-[#8A8478] uppercase tracking-wider">
            Completed
          </span>
        </div>
      </div>

      {/* Main Animated Progress Bar Track */}
      <div className="space-y-1.5">
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${plan.title} progress: ${percentage}% completed (${completedCount} of ${totalDays} days)`}
          className="relative w-full h-3.5 sm:h-4 bg-[#F2EFE8] rounded-full overflow-hidden p-0.5 border border-[#E5E0D5]"
        >
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out relative ${
              isAllCompleted
                ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 shadow-xs"
                : "bg-gradient-to-r from-[#C5A059] via-[#DEBD7A] to-[#B48F48] shadow-xs"
            }`}
            style={{ width: `${percentage}%` }}
          >
            {/* Shimmer light effect */}
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
          </div>
        </div>

        {/* Sub-label indicators */}
        <div className="flex items-center justify-between text-[11px] text-[#8A8478] font-medium px-1">
          <span>Day 1: Genesis</span>
          <span>Day {totalDays}: Dominion</span>
        </div>
      </div>

      {/* Responsive Metrics Cards Grid (1 to 4 cols) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Metric 1: Completed Days */}
        <div className="p-3 bg-[#FDFCF9] rounded-2xl border border-[#E5E0D5] flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isAllCompleted ? "bg-emerald-100 text-emerald-700" : "bg-[#F5EFE0] text-[#C5A059]"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-[#8A8478] uppercase tracking-wider truncate">
              Completed
            </div>
            <div className="text-xs sm:text-sm font-serif font-bold text-[#2D2D2D] truncate">
              {completedCount} of {totalDays} Days
            </div>
          </div>
        </div>

        {/* Metric 2: Remaining */}
        <div className="p-3 bg-[#FDFCF9] rounded-2xl border border-[#E5E0D5] flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#F5EFE0] text-[#C5A059] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-[#8A8478] uppercase tracking-wider truncate">
              Remaining
            </div>
            <div className="text-xs sm:text-sm font-serif font-bold text-[#2D2D2D] truncate">
              {daysRemaining === 0 ? "Goal Met" : `${daysRemaining} Days to Go`}
            </div>
          </div>
        </div>

        {/* Metric 3: Current Viewing Day */}
        <div className="p-3 bg-[#FDFCF9] rounded-2xl border border-[#E5E0D5] flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center shrink-0">
            <span className="font-serif font-bold text-xs">{activeDayNumber}</span>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-[#8A8478] uppercase tracking-wider truncate">
              Active Focus
            </div>
            <div className="text-xs sm:text-sm font-serif font-bold text-[#2D2D2D] truncate">
              Day {activeDayNumber} of {totalDays}
            </div>
          </div>
        </div>

        {/* Metric 4: Enrollment Status */}
        <div className="p-3 bg-[#FDFCF9] rounded-2xl border border-[#E5E0D5] flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              plan.isEnrolled ? "bg-emerald-100 text-emerald-700" : "bg-[#F0EDE6] text-[#7A7468]"
            }`}
          >
            <Award className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-[#8A8478] uppercase tracking-wider truncate">
              Enrollment
            </div>
            <div className="text-xs sm:text-sm font-serif font-bold text-[#2D2D2D] truncate">
              {plan.isEnrolled ? "Enrolled Journey" : "Previewing Plan"}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Day Scrubber with horizontal scroll on small devices */}
      {onSelectDay && Array.isArray(plan.days) && plan.days.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#E5E0D5]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider font-serif text-[#2D2D2D]">
              Interactive Day Scrubber:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                title="Scroll left"
                className="p-1 rounded-full text-[#7A7468] hover:text-[#2D2D2D] hover:bg-[#F9F7F2] border border-[#E5E0D5] cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                title="Scroll right"
                className="p-1 rounded-full text-[#7A7468] hover:text-[#2D2D2D] hover:bg-[#F9F7F2] border border-[#E5E0D5] cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scroll-smooth"
          >
            {plan.days.map((d, index) => {
              const dayNum = d.dayNumber ?? d.day ?? index + 1;
              const isActive = activeDayNumber === dayNum;
              const isDone = !!d.isCompleted;

              return (
                <button
                  key={`progress-dot-${plan.id}-${dayNum}`}
                  type="button"
                  onClick={() => onSelectDay(dayNum)}
                  title={`Day ${dayNum}: ${d.title} (${isDone ? "Completed" : "Incomplete"})`}
                  className={`min-w-[40px] h-9 sm:h-10 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 border ${
                    isActive
                      ? "bg-[#C5A059] text-white border-[#B48F48] shadow-xs scale-105"
                      : isDone
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                      : "bg-[#F9F7F2] text-[#7A7468] border-[#E5E0D5] hover:border-[#C5A059] hover:bg-white"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Circle className={`w-3 h-3 ${isActive ? "text-white" : "text-[#A39D90]"}`} />
                  )}
                  <span>{dayNum}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
