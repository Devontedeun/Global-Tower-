import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Award,
  BookOpen,
  Heart,
  Search,
  ShieldCheck,
  Sun,
  Flame,
  Sparkles,
  Shield,
  Crown,
  FileText,
  Bookmark,
  BookMarked,
  Volume2,
  Headphones,
  Music,
  UserCheck,
  Compass,
  Moon,
  CheckCircle2,
  Lock,
  ChevronRight,
  Filter,
  X,
  Share2,
  Layers,
  RotateCw
} from "lucide-react";
import {
  ACHIEVEMENTS_LIST,
  Achievement,
  AchievementCategory,
  calculateAchievementsSummary
} from "../data/achievementsData";
import { SpiritualJourneyMetrics } from "../types";
import { Storage } from "../lib/storage";
import { RotatingAchievementMedallion } from "./AchievementCelebrationOverlay";
import { achievementCelebrationService } from "../lib/achievementCelebrationService";

interface AchievementsHubProps {
  metrics?: SpiritualJourneyMetrics;
  isRegistered?: boolean;
  onOpenBible?: () => void;
  onOpenPrayers?: () => void;
  onNavigate?: (view: string) => void;
  className?: string;
}

export const AchievementsHub: React.FC<AchievementsHubProps> = ({
  metrics: propMetrics,
  isRegistered = true,
  onOpenBible,
  onOpenPrayers,
  onNavigate,
  className = ""
}) => {
  const metrics = useMemo(() => {
    return propMetrics || Storage.getSpiritualMetrics();
  }, [propMetrics]);

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalAchievement, setActiveModalAchievement] = useState<Achievement | null>(null);
  const [modalSpinTrigger, setModalSpinTrigger] = useState(0);

  const handleSelectAchievement = (achievement: Achievement) => {
    setActiveModalAchievement(achievement);
    const result = summary.results.find((r) => r.achievement.id === achievement.id);
    if (result?.isUnlocked) {
      setModalSpinTrigger((prev) => prev + 1);
      achievementCelebrationService.playHeavenlySound();
    } else {
      setModalSpinTrigger(0);
    }
  };

  const summary = useMemo(() => {
    return calculateAchievementsSummary(metrics, isRegistered);
  }, [metrics, isRegistered]);

  // Map icon names to Lucide components
  const renderIcon = (name: string, iconClass: string) => {
    switch (name) {
      case "BookOpen":
        return <BookOpen className={iconClass} />;
      case "Heart":
        return <Heart className={iconClass} />;
      case "Search":
        return <Search className={iconClass} />;
      case "ShieldCheck":
        return <ShieldCheck className={iconClass} />;
      case "Award":
        return <Award className={iconClass} />;
      case "Sun":
        return <Sun className={iconClass} />;
      case "Flame":
        return <Flame className={iconClass} />;
      case "Sparkles":
        return <Sparkles className={iconClass} />;
      case "Shield":
        return <Shield className={iconClass} />;
      case "Crown":
        return <Crown className={iconClass} />;
      case "FileText":
        return <FileText className={iconClass} />;
      case "Bookmark":
        return <Bookmark className={iconClass} />;
      case "BookMarked":
        return <BookMarked className={iconClass} />;
      case "Volume2":
        return <Volume2 className={iconClass} />;
      case "Headphones":
        return <Headphones className={iconClass} />;
      case "Music":
        return <Music className={iconClass} />;
      case "UserCheck":
        return <UserCheck className={iconClass} />;
      case "Compass":
        return <Compass className={iconClass} />;
      case "Moon":
        return <Moon className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  const filteredResults = useMemo(() => {
    return summary.results.filter((res) => {
      const matchCat =
        selectedCategory === "all"
          ? true
          : selectedCategory === "unlocked"
          ? res.isUnlocked
          : selectedCategory === "in_progress"
          ? !res.isUnlocked
          : res.achievement.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        res.achievement.title.toLowerCase().includes(q) ||
        res.achievement.description.toLowerCase().includes(q) ||
        res.achievement.verseReference.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [summary.results, selectedCategory, searchQuery]);

  // Determine Spiritual Standing title based on earned points
  const spiritualTitle = useMemo(() => {
    const pts = summary.earnedScore;
    if (pts >= 3000) return { rank: "Sanctuary Pillar of Light", color: "from-amber-400 to-yellow-500", desc: "Walking in mature apostolic fullness and spiritual stature" };
    if (pts >= 1800) return { rank: "Consecrated Watchman", color: "from-violet-500 to-purple-600", desc: "Fervent intercessor with deep scripture roots" };
    if (pts >= 900) return { rank: "Noble Berean Disciple", color: "from-blue-500 to-indigo-600", desc: "Faithful explorer of the holy scriptures" };
    if (pts >= 350) return { rank: "Faithful Scribe", color: "from-emerald-500 to-teal-600", desc: "Treasure keeper of divine revelations" };
    return { rank: "Pilgrim of Grace", color: "from-amber-500 to-orange-500", desc: "Stepping forth into the beauty of the Lord" };
  }, [summary.earnedScore]);

  const categories: Array<{ id: AchievementCategory | "unlocked" | "in_progress"; label: string; count: number; color: string }> = [
    { id: "all", label: "All Milestones", count: summary.totalCount, color: "border-[#C5A059] text-[#C5A059]" },
    { id: "unlocked", label: "Unlocked", count: summary.unlockedCount, color: "border-emerald-500 text-emerald-600" },
    { id: "in_progress", label: "In Progress", count: summary.totalCount - summary.unlockedCount, color: "border-amber-500 text-amber-600" },
    { id: "scripture", label: "Scripture", count: ACHIEVEMENTS_LIST.filter(a => a.category === "scripture").length, color: "border-blue-500 text-blue-600" },
    { id: "streak", label: "Streaks", count: ACHIEVEMENTS_LIST.filter(a => a.category === "streak").length, color: "border-orange-500 text-orange-600" },
    { id: "prayer", label: "Prayer", count: ACHIEVEMENTS_LIST.filter(a => a.category === "prayer").length, color: "border-rose-500 text-rose-600" },
    { id: "notes", label: "Notes", count: ACHIEVEMENTS_LIST.filter(a => a.category === "notes").length, color: "border-emerald-500 text-emerald-600" },
    { id: "audio", label: "Voices / Audio", count: ACHIEVEMENTS_LIST.filter(a => a.category === "audio").length, color: "border-purple-500 text-purple-600" },
    { id: "fellowship", label: "Fellowship", count: ACHIEVEMENTS_LIST.filter(a => a.category === "fellowship").length, color: "border-cyan-500 text-cyan-600" }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Hero Spiritual Standing & Score Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-[#FAF8F5] to-[#F3EFE6] dark:from-[#162033] dark:via-[#131C2E] dark:to-[#0F1626] border border-[#E5E0D5] dark:border-slate-800 shadow-sm">
        {/* Ambient Decorative Accents */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-gradient-to-br from-amber-400/20 to-purple-500/20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-400/20 to-blue-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              <Crown className="w-3.5 h-3.5" />
              <span>Spiritual Milestones & Kingdom Badges</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2D2D] dark:text-white flex items-center gap-3">
              <span>{spiritualTitle.rank}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7468] dark:text-slate-400 max-w-xl">
              {spiritualTitle.desc} • Every chapter read, prayer offered, note written, and audio scripture heard advances your sanctified walk.
            </p>

            {/* Milestone Celebration Status */}
            {summary.unlockedCount > 0 ? (
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const unlockedItem = summary.results.find((r) => r.isUnlocked)?.achievement;
                    if (unlockedItem) {
                      achievementCelebrationService.triggerCelebration(unlockedItem, false);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 active:scale-95 text-[#18140D] font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  title="Celebrate your unlocked spiritual milestone"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#18140D]" />
                  <span>Celebrate Unlocked Milestone ({summary.unlockedCount} Earned)</span>
                </button>
              </div>
            ) : (
              <div className="pt-1 flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Milestones in Progress • 0 of {summary.totalCount} Unlocked</span>
                </div>
              </div>
            )}
          </div>

          {/* Points & Progress Badges */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs border border-[#E5E0D5] dark:border-slate-700 px-5 py-3.5 rounded-2xl text-center shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A7468] dark:text-slate-400 block">
                Faith Points
              </span>
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
                {summary.earnedScore.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#A0988A] dark:text-slate-500 block">
                of {summary.totalScore.toLocaleString()} max
              </span>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs border border-[#E5E0D5] dark:border-slate-700 px-5 py-3.5 rounded-2xl text-center shadow-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A7468] dark:text-slate-400 block">
                Unlocked
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {summary.unlockedCount} / {summary.totalCount}
              </span>
              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-semibold block">
                {summary.overallPercent}% Mastered
              </span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-[#7A7468] dark:text-slate-400">
            <span>Consecration Journey Completion</span>
            <span>{summary.overallPercent}%</span>
          </div>
          <div className="w-full bg-[#E5E0D5]/70 dark:bg-slate-700/70 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-500 transition-all duration-700"
              style={{ width: `${Math.max(4, summary.overallPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Scrollable Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? "bg-[#2D2D2D] dark:bg-white text-white dark:text-[#162033] border-[#2D2D2D] dark:border-white shadow-xs"
                    : "bg-white dark:bg-slate-800 text-[#7A7468] dark:text-slate-300 border-[#E5E0D5] dark:border-slate-700 hover:border-[#C5A059]"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-white/20 dark:bg-black/20 text-white dark:text-black font-extrabold"
                      : "bg-[#F4F1EA] dark:bg-slate-700 text-[#7A7468] dark:text-slate-300"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="relative shrink-0 sm:w-64">
          <Search className="w-4 h-4 text-[#A0988A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search achievements or scriptures..."
            className="w-full pl-9 pr-8 py-2 rounded-2xl text-xs bg-white dark:bg-slate-800 border border-[#E5E0D5] dark:border-slate-700 text-[#2D2D2D] dark:text-white focus:outline-hidden focus:border-[#C5A059]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A0988A] hover:text-[#2D2D2D] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Achievements */}
      {filteredResults.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800/50 rounded-3xl border border-[#E5E0D5] dark:border-slate-700">
          <Award className="w-12 h-12 text-[#A0988A] mx-auto mb-3 opacity-40" />
          <h4 className="text-base font-bold text-[#2D2D2D] dark:text-white mb-1">
            No Milestones Found
          </h4>
          <p className="text-xs text-[#7A7468] dark:text-slate-400">
            Try adjusting your search query or switching to another category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResults.map((item) => {
            const { achievement, isUnlocked, currentProgress, targetCount, percent } = item;
            return (
              <motion.div
                key={achievement.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleSelectAchievement(achievement)}
                className={`p-4.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                  isUnlocked
                    ? `bg-white dark:bg-slate-800 border-[#E5E0D5] dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-sm hover:shadow-md`
                    : `bg-white/60 dark:bg-slate-900/40 border-[#E5E0D5]/70 dark:border-slate-800/80 opacity-80 hover:opacity-100 hover:border-amber-400`
                }`}
              >
                {/* Status and Points Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Badge Icon Container with Jewel-Tone Glow */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs relative transition-transform group-hover:scale-105 ${
                        isUnlocked
                          ? `bg-gradient-to-br ${achievement.badgeColor.gradient} text-white shadow-lg ${achievement.badgeColor.glow}`
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {renderIcon(achievement.iconName, "w-6 h-6")}
                      {isUnlocked && (
                        <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                        </div>
                      )}
                      {!isUnlocked && (
                        <div className="absolute -bottom-1 -right-1 bg-slate-200 dark:bg-slate-700 rounded-full p-0.5">
                          <Lock className="w-3 h-3 text-slate-500" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-[#2D2D2D] dark:text-white truncate">
                          {achievement.title}
                        </h4>
                      </div>
                      <span className="text-[11px] text-[#7A7468] dark:text-slate-400 line-clamp-1">
                        {achievement.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Points Tag */}
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 border ${
                      isUnlocked
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                    }`}
                  >
                    +{achievement.points} pts
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#5D574D] dark:text-slate-300 line-clamp-2 mb-3">
                  {achievement.description}
                </p>

                {/* Progress bar & Scripture citation */}
                <div className="pt-2 border-t border-[#F2EFE8] dark:border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-amber-700 dark:text-amber-400 font-serif">
                      {achievement.verseReference}
                    </span>
                    <span className="font-bold text-[#2D2D2D] dark:text-slate-200">
                      {currentProgress} / {targetCount} ({percent}%)
                    </span>
                  </div>

                  <div className="w-full bg-[#E5E0D5]/70 dark:bg-slate-700/70 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked
                          ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                          : "bg-gradient-to-r from-amber-400 to-yellow-500"
                      }`}
                      style={{ width: `${Math.max(4, percent)}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {activeModalAchievement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#162033] w-full max-w-md rounded-3xl p-6 border border-[#E5E0D5] dark:border-slate-700 shadow-2xl relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalAchievement(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#F4F1EA] dark:bg-slate-800 text-[#7A7468] hover:text-[#2D2D2D] dark:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Content */}
              <div className="text-center space-y-4 pt-2">
                {/* 3D Rotating Achievement Medallion on Central Vertical Axis */}
                <div className="py-2 flex flex-col items-center justify-center">
                  <RotatingAchievementMedallion
                    achievement={activeModalAchievement}
                    spinTrigger={modalSpinTrigger}
                    size="md"
                  />
                  {summary.results.find((r) => r.achievement.id === activeModalAchievement.id)?.isUnlocked ? (
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setModalSpinTrigger((c) => c + 1);
                          achievementCelebrationService.playHeavenlySound();
                        }}
                        className="px-3 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 active:scale-95 text-amber-700 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-amber-400/30"
                        title="Spin on central axis for 3 seconds with heavenly sound"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Replay 3s Spin & Heavenly Sound</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const ach = activeModalAchievement;
                          setActiveModalAchievement(null);
                          achievementCelebrationService.triggerCelebration(ach, false);
                        }}
                        className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        title="Full screen celebration with God rays & heavenly sound"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-100" />
                        <span>Full Screen Celebration</span>
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-stone-700 dark:text-stone-300 text-xs">
                      <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>
                          Milestone Locked • Progress: {summary.results.find((r) => r.achievement.id === activeModalAchievement.id)?.currentProgress || 0} / {activeModalAchievement.targetCount} ({summary.results.find((r) => r.achievement.id === activeModalAchievement.id)?.percent || 0}%)
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 text-center">
                        Celebrations can only be collected once this milestone is fully earned.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-1">
                    <span>+{activeModalAchievement.points} Faith Points</span>
                    <span>•</span>
                    <span className="capitalize">{activeModalAchievement.category}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#2D2D2D] dark:text-white">
                    {activeModalAchievement.title}
                  </h3>
                  <p className="text-xs text-[#7A7468] dark:text-slate-400">
                    {activeModalAchievement.subtitle}
                  </p>
                </div>

                <p className="text-sm text-[#5D574D] dark:text-slate-300 px-2">
                  {activeModalAchievement.description}
                </p>

                {/* Biblical Verse Reference Box */}
                <div className="bg-[#FAF7F0] dark:bg-slate-800/80 p-4 rounded-2xl border border-[#E5E0D5] dark:border-slate-700 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                    <span className="font-serif text-sm">{activeModalAchievement.verseReference}</span>
                    <span className="text-[10px] uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-full">
                      Holy Scripture
                    </span>
                  </div>
                  <blockquote className="text-xs sm:text-sm italic text-[#2D2D2D] dark:text-slate-200 border-l-2 border-[#C5A059] pl-3 py-0.5">
                    "{activeModalAchievement.verseQuote}"
                  </blockquote>
                </div>

                {/* Quick Action Button */}
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      const cat = activeModalAchievement.category;
                      setActiveModalAchievement(null);
                      if (cat === "scripture" || cat === "audio") {
                        if (onOpenBible) onOpenBible();
                        else if (onNavigate) onNavigate("bible");
                      } else if (cat === "prayer" || cat === "fellowship") {
                        if (onOpenPrayers) onOpenPrayers();
                        else if (onNavigate) onNavigate("prayers");
                      } else if (cat === "notes") {
                        if (onNavigate) onNavigate("library");
                        else if (onOpenBible) onOpenBible();
                      } else if (cat === "streak") {
                        if (onNavigate) onNavigate("plans");
                        else if (onOpenBible) onOpenBible();
                      } else {
                        if (onOpenBible) onOpenBible();
                        else if (onNavigate) onNavigate("bible");
                      }
                    }}
                    className="w-full py-3 bg-[#2D2D2D] dark:bg-white text-white dark:text-[#162033] rounded-2xl text-xs font-bold hover:bg-[#C5A059] dark:hover:bg-amber-400 transition-colors shadow-md cursor-pointer"
                  >
                    Continue Journey in Sanctification
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
