import React, { useState, useEffect } from "react";
import {
  BookMarked,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  BookOpen,
  HelpCircle,
  Share2,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import confetti from "canvas-confetti";
import { BibleStudyPlan } from "../types";
import { Storage } from "../lib/storage";
import { StudyPlanProgressBar } from "./StudyPlanProgressBar";
import { UserDataService } from "../lib/userDataService";
import { useAuth } from "../lib/AuthContext";

interface StudyPlansHubProps {
  initialPlanId?: string;
  onNavigateToBible?: (book: string, chapter: number) => void;
  onAskAI?: (prompt: string) => void;
}

export const StudyPlansHub: React.FC<StudyPlansHubProps> = ({
  initialPlanId,
  onNavigateToBible,
  onAskAI,
}) => {
  const { currentUser } = useAuth();
  const [plans, setPlans] = useState<BibleStudyPlan[]>([]);
  const [activePlan, setActivePlan] = useState<BibleStudyPlan | null>(null);
  const [activeDayNum, setActiveDayNum] = useState<number>(1);
  const [quizSelection, setQuizSelection] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Load and subscribe to plan changes
  useEffect(() => {
    const refreshPlans = () => {
      const loadedPlans = Storage.getStudyPlans();
      setPlans(loadedPlans);
      setActivePlan((prev) => {
        if (!prev) {
          const defaultPlan = initialPlanId
            ? loadedPlans.find((p) => p.id === initialPlanId) || loadedPlans[0]
            : loadedPlans[0];
          return defaultPlan || null;
        }
        return loadedPlans.find((p) => p.id === prev.id) || loadedPlans[0] || null;
      });
    };

    refreshPlans();

    // Reconcile user progress from Firestore whenever user changes or database updates
    if (currentUser?.uid) {
      UserDataService.fetchStudyProgress(currentUser.uid).then((progressMap) => {
        if (progressMap && Object.keys(progressMap).length > 0) {
          const currentPlans = Storage.getStudyPlans();
          const updatedPlans = currentPlans.map((plan) => {
            const userProg = progressMap[plan.id];
            if (!userProg) return plan;

            const completedNums = new Set<number>(
              Array.isArray(userProg.completedDayNumbers) ? userProg.completedDayNumbers : []
            );

            const days = (plan.days || []).map((d, index) => {
              const num = d.dayNumber ?? d.day ?? index + 1;
              return {
                ...d,
                isCompleted: completedNums.has(num) || !!d.isCompleted
              };
            });

            const completedCount = days.filter((d) => d.isCompleted).length;

            return {
              ...plan,
              isEnrolled: userProg.isEnrolled !== undefined ? userProg.isEnrolled : plan.isEnrolled,
              currentDay: userProg.currentDay || plan.currentDay || 1,
              completedDays: completedCount,
              days
            };
          });

          Storage.saveStudyPlans(updatedPlans);
          refreshPlans();
        }
      }).catch((err) => console.warn("Could not load study plans from Firestore:", err));
    }

    const handlePlansUpdated = () => {
      refreshPlans();
    };

    window.addEventListener("gtc_study_plans_updated", handlePlansUpdated);
    return () => {
      window.removeEventListener("gtc_study_plans_updated", handlePlansUpdated);
    };
  }, [initialPlanId, currentUser?.uid]);

  const handleToggleEnrollment = (planId: string) => {
    const updated = plans.map((p) => {
      if (p.id === planId) {
        const nextEnrolled = !p.isEnrolled;
        const completedNums = (p.days || [])
          .filter((d) => d.isCompleted)
          .map((d, i) => d.dayNumber ?? d.day ?? i + 1);

        // Instantly sync to user's database record
        UserDataService.saveStudyProgress(planId, {
          isEnrolled: nextEnrolled,
          currentDay: p.currentDay || 1,
          completedDays: p.completedDays || 0,
          completedDayNumbers: completedNums
        }).catch(() => {});

        return { ...p, isEnrolled: nextEnrolled };
      }
      return p;
    });

    setPlans(updated);
    Storage.saveStudyPlans(updated);
    if (activePlan?.id === planId) {
      setActivePlan({ ...activePlan, isEnrolled: !activePlan.isEnrolled });
    }
  };

  const handleToggleDayComplete = (planId: string, dayNum: number) => {
    let newlyCompletedPlan: BibleStudyPlan | null = null;

    const updated = plans.map((p) => {
      if (p.id === planId) {
        const days = (p.days || []).map((d, index) => {
          const num = d.dayNumber ?? d.day ?? index + 1;
          return num === dayNum ? { ...d, isCompleted: !d.isCompleted } : d;
        });
        const completedCount = days.filter((d) => d.isCompleted).length;
        const nextCurrentDay = Math.min(p.totalDays || days.length || 1, completedCount + 1);

        const completedNums = days
          .filter((d) => d.isCompleted)
          .map((d, i) => d.dayNumber ?? d.day ?? i + 1);

        // Instantly persist to user's Firestore record
        UserDataService.saveStudyProgress(planId, {
          isEnrolled: true,
          currentDay: nextCurrentDay,
          completedDays: completedCount,
          completedDayNumbers: completedNums
        }).catch(() => {});

        const updatedItem: BibleStudyPlan = {
          ...p,
          isEnrolled: true,
          days,
          completedDays: completedCount,
          currentDay: nextCurrentDay
        };

        newlyCompletedPlan = updatedItem;
        return updatedItem;
      }
      return p;
    });

    setPlans(updated);
    Storage.saveStudyPlans(updated);

    if (newlyCompletedPlan) {
      setActivePlan(newlyCompletedPlan);
      const isNowCompleted = newlyCompletedPlan.days?.find((d, idx) => (d.dayNumber ?? d.day ?? idx + 1) === dayNum)?.isCompleted;
      if (isNowCompleted) {
        Storage.recordActivity(`Completed Day ${dayNum} of ${newlyCompletedPlan.title}`);
      }
      // Confetti celebration
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#C5A059", "#10B981", "#E0C078"]
      });
    }
  };

  const currentDayData =
    activePlan?.days?.find((d) => (d.dayNumber ?? d.day) === activeDayNum) ||
    activePlan?.days?.[0];

  const currentDayNumber = currentDayData?.dayNumber ?? currentDayData?.day ?? activeDayNum;
  const devotionalBody = currentDayData?.devotionalText || currentDayData?.teaching || "";
  const passagesList =
    (currentDayData?.assignedPassages && currentDayData.assignedPassages.length > 0)
      ? currentDayData.assignedPassages
      : currentDayData?.scriptureRef
      ? [currentDayData.scriptureRef]
      : [];

  return (
    <div id="study-plans-container" className="w-full space-y-6">
      {/* Hero */}
      <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDFCF9] border border-[#E5E0D5] text-[#C5A059] rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <BookMarked className="w-3.5 h-3.5" />
              <span>Structured Spiritual Growth</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2D2D]">
              Bible Study Plans & Devotionals
            </h1>
            <p className="text-[#7A7468] text-sm mt-1 font-sans">
              Engage with curated multi-day reading plans on Dominion, Prophetic Discernment, Worship, and Kingdom Victory.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Plans List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-6 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-[#2D2D2D] text-lg">Available Study Plans</h2>
            <div className="space-y-3">
              {(plans || []).map((plan) => {
                const isSelected = activePlan?.id === plan.id;
                const progressPct = plan.totalDays > 0 ? Math.round(((plan.completedDays || 0) / plan.totalDays) * 100) : 0;

                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      setActivePlan(plan);
                      setActiveDayNum(plan.currentDay || 1);
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#FDFCF9] border-[#C5A059] ring-2 ring-[#C5A059]/20"
                        : "bg-[#F9F7F2] border-[#E5E0D5] hover:border-[#C5A059] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-[#C5A059] bg-[#FDFCF9] px-2.5 py-0.5 rounded-full border border-[#E5E0D5]">
                        {plan.category}
                      </span>
                      <span className="text-xs text-[#8A8478] font-medium">
                        {plan.completedDays || 0}/{plan.totalDays} Days ({progressPct}%)
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-[#2D2D2D] text-base mt-1">{plan.title}</h3>
                    <p className="text-[11px] text-[#7A7468] line-clamp-2 mt-1 font-sans">{plan.description}</p>

                    {/* Visual Progress Bar Card Variant */}
                    <StudyPlanProgressBar plan={plan} variant="card" className="mt-3.5" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Plan & Daily Interactive Study */}
        {activePlan && currentDayData && (
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
              {/* Plan Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E0D5]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">{activePlan.category}</span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2D2D2D] mt-0.5">
                    {activePlan.title}
                  </h2>
                  <p className="text-xs text-[#7A7468] mt-1 font-sans">{activePlan.description}</p>
                </div>

                <button
                  onClick={() => handleToggleEnrollment(activePlan.id)}
                  className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
                    activePlan.isEnrolled
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/20 hover:bg-[#B48F48] border-transparent"
                  }`}
                >
                  {activePlan.isEnrolled ? "Enrolled in Plan" : "Enroll in Plan"}
                </button>
              </div>

              {/* Prominent Visual Progress Tracker Component */}
              <StudyPlanProgressBar
                plan={activePlan}
                activeDayNumber={activeDayNum}
                onSelectDay={(dayNum) => setActiveDayNum(dayNum)}
              />

              {/* Active Day Content */}
              <div className="p-6 bg-[#FDFCF9] border border-[#E5E0D5] rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider font-serif">
                    Day {currentDayNumber} Devotional
                  </span>
                  <button
                    onClick={() => handleToggleDayComplete(activePlan.id, currentDayNumber)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      currentDayData.isCompleted
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-white hover:bg-[#FDFCF9] text-[#7A7468] hover:text-[#2D2D2D] border border-[#E5E0D5]"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{currentDayData.isCompleted ? "Completed" : "Mark Day Complete"}</span>
                  </button>
                </div>

                <h3 className="text-lg font-serif font-bold text-[#2D2D2D]">
                  {currentDayData.title}
                </h3>

                {/* Assigned Scriptures */}
                {passagesList.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 p-3.5 bg-white border border-[#E5E0D5] rounded-2xl">
                    <span className="text-xs font-bold text-[#2D2D2D] flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-[#C5A059]" />
                      <span>Assigned Scripture:</span>
                    </span>
                    {passagesList.map((passage, idx) => (
                      <button
                        key={`passage-${idx}-${passage}`}
                        onClick={() => {
                          if (onNavigateToBible) {
                            const trimmed = passage.trim();
                            const match = trimmed.match(/^((?:\d\s+)?[A-Za-z\s]+?)\s+(\d+)/);
                            if (match) {
                              const book = match[1].trim();
                              const chapter = parseInt(match[2], 10) || 1;
                              onNavigateToBible(book, chapter);
                            } else {
                              const lastSpace = trimmed.lastIndexOf(" ");
                              if (lastSpace > 0) {
                                const book = trimmed.substring(0, lastSpace).trim();
                                const chapter = parseInt(trimmed.substring(lastSpace + 1)) || 1;
                                onNavigateToBible(book, chapter);
                              } else {
                                onNavigateToBible(trimmed, 1);
                              }
                            }
                          }
                        }}
                        className="px-3 py-1 bg-[#FDFCF9] hover:bg-[#C5A059] hover:text-white text-[#C5A059] border border-[#E5E0D5] rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        {passage} →
                      </button>
                    ))}
                  </div>
                )}

                {/* Devotional Text */}
                {devotionalBody && (
                  <div className="font-serif text-sm text-[#2D2D2D] leading-relaxed whitespace-pre-line bg-white p-5 rounded-2xl border border-[#E5E0D5]">
                    {devotionalBody}
                  </div>
                )}

                {/* Scripture Text Quote if present */}
                {currentDayData.scriptureText && (
                  <div className="p-4 bg-amber-50/60 border-l-4 border-[#C5A059] rounded-r-2xl italic font-serif text-xs text-[#2D2D2D] leading-relaxed">
                    "{currentDayData.scriptureText}"
                    {currentDayData.scriptureRef && (
                      <span className="block mt-1 font-sans font-bold text-[#C5A059] not-italic">
                        — {currentDayData.scriptureRef}
                      </span>
                    )}
                  </div>
                )}

                {/* Reflection Questions */}
                {(currentDayData.reflectionQuestions || []).length > 0 && (
                  <div className="p-5 bg-white border border-[#E5E0D5] rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider font-serif flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                      <span>Questions for Personal Meditation</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {(currentDayData.reflectionQuestions || []).map((q, i) => (
                        <li key={`q-${i}`} className="text-xs text-[#7A7468] flex items-start gap-2 font-sans">
                          <span className="font-bold text-[#C5A059]">{i + 1}.</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prayer prompt if available */}
                {currentDayData.prayer && (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200/60 rounded-2xl text-xs text-emerald-950 font-serif leading-relaxed">
                    <span className="font-sans font-bold text-emerald-800 uppercase tracking-wider text-[10px] block mb-1">
                      Guided Prayer
                    </span>
                    "{currentDayData.prayer}"
                  </div>
                )}

                {/* AI Assistant Hook */}
                {onAskAI && (
                  <div className="flex items-center justify-between p-4 bg-white border border-[#C5A059]/40 rounded-2xl text-xs">
                    <div className="flex items-center gap-2 text-[#2D2D2D] font-medium">
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <span>Have questions on Day {currentDayNumber}? Ask Spiritual Insight AI.</span>
                    </div>
                    <button
                      onClick={() => onAskAI(`Explain deeper spiritual context for ${activePlan.title} - Day ${currentDayNumber}: ${currentDayData.title}`)}
                      className="px-4 py-2 bg-[#C5A059] hover:bg-[#B48F48] text-white rounded-full font-bold uppercase tracking-wider text-[11px] shadow-xs cursor-pointer transition-colors"
                    >
                      Explore
                    </button>
                  </div>
                )}

                {/* Day Navigation Controls (Previous / Next) */}
                <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D5]/80">
                  <button
                    disabled={currentDayNumber <= 1}
                    onClick={() => setActiveDayNum(Math.max(1, currentDayNumber - 1))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E5E0D5] bg-white hover:bg-[#F9F7F2] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-[#2D2D2D] transition-all cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#C5A059]" />
                    <span>Previous Day</span>
                  </button>

                  <div className="text-center">
                    <span className="text-xs font-serif font-bold text-[#2D2D2D]">
                      Day {currentDayNumber} of {activePlan.totalDays}
                    </span>
                    <span className="block text-[10px] text-[#8A8478] font-sans">
                      {Math.round(((activePlan.completedDays || 0) / activePlan.totalDays) * 100)}% Plan Completed
                    </span>
                  </div>

                  <button
                    disabled={currentDayNumber >= (activePlan.totalDays || activePlan.days.length)}
                    onClick={() => setActiveDayNum(Math.min(activePlan.totalDays || activePlan.days.length, currentDayNumber + 1))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#C5A059] bg-[#C5A059] text-white hover:bg-[#B48F48] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Next Day</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
