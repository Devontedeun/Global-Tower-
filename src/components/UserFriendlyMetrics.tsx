import React, { useState, useEffect } from "react";
import {
  Flame,
  BookOpen,
  Heart,
  BookMarked,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Bookmark,
  FileText,
  ChevronRight,
  Calendar,
  Volume2,
  Users,
  ShieldCheck,
  Award
} from "lucide-react";
import { SpiritualJourneyMetrics } from "../types";
import { Storage } from "../lib/storage";
import { AchievementsHub } from "./AchievementsHub";
import { ACHIEVEMENTS_LIST } from "../data/achievementsData";

interface UserFriendlyMetricsProps {
  onNavigate: (view: string, data?: any) => void;
  compact?: boolean;
}

export const UserFriendlyMetrics: React.FC<UserFriendlyMetricsProps> = ({
  onNavigate,
  compact = false,
}) => {
  const [metrics, setMetrics] = useState<SpiritualJourneyMetrics>(() =>
    Storage.getSpiritualMetrics()
  );
  const [activeTab, setActiveTab] = useState<"personal" | "achievements" | "fellowship">("personal");

  useEffect(() => {
    const handleUpdate = () => {
      setMetrics(Storage.getSpiritualMetrics());
    };
    window.addEventListener("gtc_metrics_updated", handleUpdate);
    window.addEventListener("gtc_notes_updated", handleUpdate);
    window.addEventListener("gtc_data_cleared", handleUpdate);
    return () => {
      window.removeEventListener("gtc_metrics_updated", handleUpdate);
      window.removeEventListener("gtc_notes_updated", handleUpdate);
      window.removeEventListener("gtc_data_cleared", handleUpdate);
    };
  }, []);

  if (compact) {
    return (
      <div className="w-full bg-[#FDFCF9] dark:bg-[#162033] rounded-2xl p-4 border border-[#E5E0D5] dark:border-[#1E2D44] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-serif font-bold text-sm text-[#2D2D2D] dark:text-[#F8FAFC]">
              {metrics.currentStreakDays}-Day Active Walk
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#8C6B2D] dark:text-[#E5B869] border border-[#C5A059]/30">
            {metrics.milestoneTitle}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-white dark:bg-[#111928] p-2 rounded-xl border border-[#E5E0D5] dark:border-[#1E2D44]">
            <span className="block font-serif font-bold text-base text-[#2D2D2D] dark:text-[#F8FAFC]">
              {metrics.totalChaptersRead}
            </span>
            <span className="text-[9px] text-[#7A7468] dark:text-[#94A3B8]">Chapters</span>
          </div>
          <div className="bg-white dark:bg-[#111928] p-2 rounded-xl border border-[#E5E0D5] dark:border-[#1E2D44]">
            <span className="block font-serif font-bold text-base text-rose-600 dark:text-rose-400">
              {metrics.prayersOfferedCount}
            </span>
            <span className="text-[9px] text-[#7A7468] dark:text-[#94A3B8]">Prayers</span>
          </div>
          <div className="bg-white dark:bg-[#111928] p-2 rounded-xl border border-[#E5E0D5] dark:border-[#1E2D44]">
            <span className="block font-serif font-bold text-base text-emerald-600 dark:text-emerald-400">
              {metrics.studyNotesCount}
            </span>
            <span className="text-[9px] text-[#7A7468] dark:text-[#94A3B8]">Notes</span>
          </div>
          <div className="bg-white dark:bg-[#111928] p-2 rounded-xl border border-[#E5E0D5] dark:border-[#1E2D44]">
            <span className="block font-serif font-bold text-base text-[#C5A059]">
              {metrics.studyPlanDaysCompleted}
            </span>
            <span className="text-[9px] text-[#7A7468] dark:text-[#94A3B8]">Days Plan</span>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#7A7468] dark:text-[#94A3B8]">
            <span className="truncate max-w-[200px]">{metrics.nextMilestoneGoal}</span>
            <span className="font-bold text-[#C5A059] shrink-0">{metrics.milestoneProgressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#E5E0D5] dark:bg-[#1E2D44] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C5A059] to-[#E5B869] rounded-full"
              style={{ width: `${Math.max(10, metrics.milestoneProgressPercent)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="user-friendly-metrics-card"
      className="w-full bg-white dark:bg-[#111928] rounded-[32px] p-5 sm:p-7 border border-[#E5E0D5] dark:border-[#1E2D44] shadow-xs transition-colors space-y-6"
    >
      {/* Header with Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF6EE] dark:bg-[#162033] border border-[#E5E0D5] dark:border-[#1E2D44] flex items-center justify-center text-[#C5A059] shadow-2xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2D2D2D] dark:text-[#F8FAFC]">
                Your Spiritual Journey
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#8C6B2D] dark:text-[#E5B869] border border-[#C5A059]/30">
                Live Walk
              </span>
            </div>
            <p className="text-xs text-[#7A7468] dark:text-[#94A3B8]">
              Encouraging milestones in Scripture, prayer, and discipleship
            </p>
          </div>
        </div>

        {/* Tab Toggle: Personal Walk vs Achievements vs Fellowship Pulse */}
        <div className="inline-flex p-1 bg-[#F9F7F2] dark:bg-[#0B111E] rounded-2xl border border-[#E5E0D5] dark:border-[#1E2D44] self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "personal"
                ? "bg-white dark:bg-[#162033] text-[#2D2D2D] dark:text-[#F8FAFC] shadow-2xs border border-[#E5E0D5]/80 dark:border-[#1E2D44]"
                : "text-[#7A7468] dark:text-[#94A3B8] hover:text-[#2D2D2D] dark:hover:text-[#F8FAFC]"
            }`}
          >
            My Walk
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("achievements")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "achievements"
                ? "bg-white dark:bg-[#162033] text-[#2D2D2D] dark:text-[#F8FAFC] shadow-2xs border border-[#E5E0D5]/80 dark:border-[#1E2D44]"
                : "text-[#7A7468] dark:text-[#94A3B8] hover:text-[#2D2D2D] dark:hover:text-[#F8FAFC]"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Achievements</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-extrabold">
              {ACHIEVEMENTS_LIST.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fellowship")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "fellowship"
                ? "bg-white dark:bg-[#162033] text-[#2D2D2D] dark:text-[#F8FAFC] shadow-2xs border border-[#E5E0D5]/80 dark:border-[#1E2D44]"
                : "text-[#7A7468] dark:text-[#94A3B8] hover:text-[#2D2D2D] dark:hover:text-[#F8FAFC]"
            }`}
          >
            Fellowship Pulse
          </button>
        </div>
      </div>

      {activeTab === "personal" ? (
        <>
          {/* 4 Core User-Friendly Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. Daily Devotion Streak */}
            <div
              onClick={() => onNavigate("bible")}
              className="bg-[#FDFCF9] dark:bg-[#162033] hover:bg-[#FAF6EE] dark:hover:bg-[#1E2D44] p-4 rounded-2xl border border-[#E5E0D5] dark:border-[#1E2D44] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478] dark:text-[#94A3B8]">
                  Word Streak
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif font-bold text-2xl sm:text-3xl text-[#2D2D2D] dark:text-[#F8FAFC]">
                    {metrics.currentStreakDays}
                  </span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    Days Active
                  </span>
                </div>
                <p className="text-[11px] text-[#7A7468] dark:text-[#94A3B8] mt-1 line-clamp-1">
                  Consecutive communion in the Word
                </p>
              </div>
            </div>

            {/* 2. Chapters Read & Heard */}
            <div
              onClick={() => onNavigate("bible")}
              className="bg-[#FDFCF9] dark:bg-[#162033] hover:bg-[#FAF6EE] dark:hover:bg-[#1E2D44] p-4 rounded-2xl border border-[#E5E0D5] dark:border-[#1E2D44] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478] dark:text-[#94A3B8]">
                  Scripture Read
                </span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif font-bold text-2xl sm:text-3xl text-[#2D2D2D] dark:text-[#F8FAFC]">
                    {metrics.totalChaptersRead}
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    Chapters
                  </span>
                </div>
                <p className="text-[11px] text-[#7A7468] dark:text-[#94A3B8] mt-1 line-clamp-1">
                  {metrics.audioListeningMinutes > 0
                    ? `+${metrics.audioListeningMinutes}m Audio Bible narration`
                    : "Old & New Testament"}
                </p>
              </div>
            </div>

            {/* 3. Prayers Offered & Wall Intercessions */}
            <div
              onClick={() => onNavigate("prayers")}
              className="bg-[#FDFCF9] dark:bg-[#162033] hover:bg-[#FAF6EE] dark:hover:bg-[#1E2D44] p-4 rounded-2xl border border-[#E5E0D5] dark:border-[#1E2D44] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478] dark:text-[#94A3B8]">
                  Intercessions
                </span>
                <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif font-bold text-2xl sm:text-3xl text-[#2D2D2D] dark:text-[#F8FAFC]">
                    {metrics.prayersOfferedCount}
                  </span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    Prayers
                  </span>
                </div>
                <p className="text-[11px] text-[#7A7468] dark:text-[#94A3B8] mt-1 line-clamp-1">
                  Petitions & intercessions prayed
                </p>
              </div>
            </div>

            {/* 4. Notes & Study Reflections */}
            <div
              onClick={() => onNavigate("library")}
              className="bg-[#FDFCF9] dark:bg-[#162033] hover:bg-[#FAF6EE] dark:hover:bg-[#1E2D44] p-4 rounded-2xl border border-[#E5E0D5] dark:border-[#1E2D44] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478] dark:text-[#94A3B8]">
                  Study Notes
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif font-bold text-2xl sm:text-3xl text-[#2D2D2D] dark:text-[#F8FAFC]">
                    {metrics.studyNotesCount}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Saved
                  </span>
                </div>
                <p className="text-[11px] text-[#7A7468] dark:text-[#94A3B8] mt-1 line-clamp-1">
                  {metrics.bookmarksCount} bookmarked verses
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Rhythm & Spiritual Milestone Track */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-[#E5E0D5] dark:border-[#1E2D44]">
            {/* Weekly Activity Rhythm (7-Day Indicator) */}
            <div className="md:col-span-7 bg-[#FDFCF9] dark:bg-[#162033] p-4 rounded-2xl border border-[#E5E0D5] dark:border-[#1E2D44] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-xs font-bold text-[#2D2D2D] dark:text-[#F8FAFC]">
                    7-Day Spiritual Rhythm
                  </span>
                </div>
                <span className="text-[11px] text-[#7A7468] dark:text-[#94A3B8]">
                  Consistent daily communion
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {metrics.weeklyRhythm.map((day, idx) => (
                  <div
                    key={`${day.dateString}-${idx}`}
                    className={`flex flex-col items-center p-1 sm:p-2 rounded-xl border transition-all min-w-0 ${
                      day.isToday
                        ? "border-[#C5A059] bg-[#C5A059]/10 dark:bg-[#C5A059]/20"
                        : "border-[#E5E0D5]/70 dark:border-[#1E2D44] bg-white dark:bg-[#111928]"
                    }`}
                  >
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#8A8478] dark:text-[#94A3B8] truncate">
                      {day.dayName}
                    </span>
                    <div className="mt-1 sm:mt-1.5 mb-0.5 sm:mb-1">
                      {day.hasActivity ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
                          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#F5F2EA] dark:bg-[#1E2D44] flex items-center justify-center text-[#AAA498] dark:text-[#64748B] text-[9px] sm:text-[10px] font-medium">
                          •
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-[8px] sm:text-[9px] font-semibold truncate ${
                        day.isToday
                          ? "text-[#C5A059] font-bold"
                          : day.hasActivity
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-[#AAA498] dark:text-[#64748B]"
                      }`}
                    >
                      {day.isToday ? "Today" : day.hasActivity ? "Done" : "Rest"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spiritual Growth Milestone */}
            <div className="md:col-span-5 bg-[#FDFCF9] dark:bg-[#162033] p-4 rounded-2xl border border-[#E5E0D5] dark:border-[#1E2D44] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478] dark:text-[#94A3B8]">
                    Spiritual Milestone
                  </span>
                  <span className="text-xs font-bold text-[#C5A059]">
                    {metrics.milestoneProgressPercent}%
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base text-[#2D2D2D] dark:text-[#F8FAFC]">
                  {metrics.milestoneTitle}
                </h4>
                <p className="text-xs text-[#7A7468] dark:text-[#94A3B8] mt-1 leading-relaxed">
                  {metrics.nextMilestoneGoal}
                </p>
              </div>

              {/* Clean Non-Slop Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2 bg-[#E5E0D5] dark:bg-[#1E2D44] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C5A059] to-[#E5B869] rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(10, metrics.milestoneProgressPercent)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#8A8478] dark:text-[#94A3B8]">
                  <span>Tier Progress</span>
                  <span>Dominion & Victory</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : activeTab === "achievements" ? (
        /* Rich Spiritual Milestones & Achievements Hub */
        <AchievementsHub
          metrics={metrics}
          onOpenBible={() => onNavigate("bible")}
          onOpenPrayers={() => onNavigate("prayers")}
          onNavigate={onNavigate}
        />
      ) : (
        /* Fellowship Pulse View (Global Ministry Reach) */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#FDFCF9] dark:bg-[#162033] p-4 rounded-2xl border border-[#E5E0D5] dark:border-[#1E2D44]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478] dark:text-[#94A3B8]">
              Canon Index
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-serif font-bold text-2xl text-[#2D2D2D] dark:text-[#F8FAFC]">
                66
              </span>
              <span className="text-xs font-bold text-[#C5A059]">Books</span>
            </div>
            <p className="text-[11px] text-[#7A7468] dark:text-[#94A3B8] mt-1">
              1,189 verified canonical chapters
            </p>
          </div>

          <div className="bg-[#FDFCF9] dark:bg-[#162033] p-4 rounded-2xl border border-[#E5E0D5] dark:border-[#1E2D44]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478] dark:text-[#94A3B8]">
              Scripture Integrity
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-serif font-bold text-2xl text-emerald-600 dark:text-emerald-400">
                100%
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Verified
              </span>
            </div>
            <p className="text-[11px] text-[#7A7468] dark:text-[#94A3B8] mt-1">
              Zero hallucination Bible database
            </p>
          </div>

          <div className="bg-[#FDFCF9] dark:bg-[#162033] p-4 rounded-2xl border border-[#E5E0D5] dark:border-[#1E2D44]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478] dark:text-[#94A3B8]">
              Corporate Intercession
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-serif font-bold text-2xl text-rose-600 dark:text-rose-400">
                24/7
              </span>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Active
              </span>
            </div>
            <p className="text-[11px] text-[#7A7468] dark:text-[#94A3B8] mt-1">
              Global believers in agreement
            </p>
          </div>

          <div className="bg-[#FDFCF9] dark:bg-[#162033] p-4 rounded-2xl border border-[#E5E0D5] dark:border-[#1E2D44]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478] dark:text-[#94A3B8]">
              Apostolic Audio
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-serif font-bold text-2xl text-blue-600 dark:text-blue-400">
                12+
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                Voices
              </span>
            </div>
            <p className="text-[11px] text-[#7A7468] dark:text-[#94A3B8] mt-1">
              Deep Voice & natural narration
            </p>
          </div>
        </div>
      )}

      {/* Quick Action Footer */}
      <div className="pt-3 border-t border-[#E5E0D5] dark:border-[#1E2D44] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-[#7A7468] dark:text-[#94A3B8]">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>
            {activeTab === "personal"
              ? "All actions in Bible Hub, Prayer Sanctuary, and Plans update your walk instantly."
              : "Global Tower of Christ: Apostolic Ministry of Worship, Dominion, and Victory."}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("bible")}
            className="px-3 py-1.5 bg-[#FAF6EE] dark:bg-[#162033] hover:bg-[#F2ECE0] dark:hover:bg-[#1E2D44] text-[#8C6B2D] dark:text-[#E5B869] border border-[#C5A059]/30 rounded-xl font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Open Bible Hub</span>
            <ChevronRight className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate("library")}
            className="px-3 py-1.5 bg-[#F9F7F2] dark:bg-[#0B111E] hover:bg-[#EFECE4] dark:hover:bg-[#162033] text-[#4A4438] dark:text-[#CBD5E1] border border-[#E5E0D5] dark:border-[#1E2D44] rounded-xl font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Bookmark className="w-3 h-3 text-[#C5A059]" />
            <span>My Library</span>
          </button>
        </div>
      </div>
    </div>
  );
};
