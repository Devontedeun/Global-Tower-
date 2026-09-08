import React, { useState, useEffect } from "react";
import {
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Smile,
  Compass,
  Search,
  Filter,
  Users,
  Play,
  ArrowLeft,
  GraduationCap,
  Flame,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";
import { MASTER_20_QUIZZES, QuizItem, QuizQuestion } from "../data/quizzesData";

export const YouthAndQuizzes: React.FC = () => {
  const [quizzesList] = useState<QuizItem[]>(MASTER_20_QUIZZES);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Filter and search state
  const [audienceFilter, setAudienceFilter] = useState<"All" | "Kids" | "Adults">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Local storage score history
  const [savedScores, setSavedScores] = useState<Record<string, { score: number; total: number; completedAt: string }>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gtc_quiz_scores");
      if (raw) setSavedScores(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const saveQuizScore = (quizId: string, finalScore: number, total: number) => {
    try {
      const updated = {
        ...savedScores,
        [quizId]: { score: finalScore, total, completedAt: new Date().toISOString() }
      };
      setSavedScores(updated);
      localStorage.setItem("gtc_quiz_scores", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const activeQuiz = quizzesList.find((q) => q.id === activeQuizId) || null;
  const activeQuestion: QuizQuestion | null = activeQuiz ? activeQuiz.questions[currentQuestionIdx] : null;

  const categories = ["All", ...Array.from(new Set(quizzesList.map((q) => q.category)))];

  const filteredQuizzes = quizzesList.filter((q) => {
    const matchesAudience = audienceFilter === "All" || q.audience === audienceFilter;
    const matchesCategory = categoryFilter === "All" || q.category === categoryFilter;
    const qTerm = searchQuery.toLowerCase();
    const matchesSearch =
      !qTerm ||
      q.title.toLowerCase().includes(qTerm) ||
      q.description.toLowerCase().includes(qTerm) ||
      q.keyScripture.toLowerCase().includes(qTerm) ||
      q.category.toLowerCase().includes(qTerm);
    return matchesAudience && matchesCategory && matchesSearch;
  });

  const handleStartQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setIsFinished(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerRevealed || !activeQuestion) return;
    setSelectedOption(idx);
    setIsAnswerRevealed(true);

    if (idx === activeQuestion.correctIndex) {
      const newScore = score + 1;
      setScore(newScore);
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.8 },
        colors: ["#C5A059", "#10B981"]
      });
    }
  };

  const handleNext = () => {
    if (!activeQuiz) return;
    if (currentQuestionIdx < activeQuiz.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      setIsFinished(true);
      saveQuizScore(activeQuiz.id, score, activeQuiz.questions.length);
      confetti({
        particleCount: 60,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#C5A059", "#F59E0B", "#10B981"]
      });
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setIsFinished(false);
  };

  const handleBackToTable = () => {
    setActiveQuizId(null);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div id="youth-quizzes-container" className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDFCF9] border border-[#E5E0D5] text-[#C5A059] rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Interactive Biblical Education • 20 Master Quizzes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2D2D]">
              Biblical Quizzes for Kids & Adults
            </h1>
            <p className="text-[#7A7468] text-xs sm:text-sm mt-1 font-sans">
              20 comprehensive Bible quizzes in an interactive table format — testing knowledge across Creation, Parables, Spiritual Warfare, Covenants, and Apostle R.Sango's teachings.
            </p>
          </div>

          {activeQuizId && (
            <button
              onClick={handleBackToTable}
              className="self-start sm:self-center px-4 py-2 bg-[#FAF6EE] hover:bg-[#F2EFE9] text-[#8C6B2D] border border-[#C5A059]/40 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Quiz Table</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Active Quiz Player */}
      {activeQuiz && activeQuestion ? (
        <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
          {!isFinished ? (
            <>
              {/* Top Quiz Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E0D5]">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      activeQuiz.audience === "Kids"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-900 border border-amber-200"
                    }`}
                  >
                    {activeQuiz.audience} Quiz #{activeQuiz.quizNumber}
                  </span>
                  <h2 className="font-serif font-bold text-[#2D2D2D] text-base sm:text-lg">
                    {activeQuiz.title}
                  </h2>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-[#7A7468]">
                  <span>
                    Question <strong className="text-[#2D2D2D]">{currentQuestionIdx + 1}</strong> of{" "}
                    <strong>{activeQuiz.questions.length}</strong>
                  </span>
                  <span className="bg-[#FAF6EE] px-2.5 py-1 rounded-full text-[#8C6B2D] font-bold border border-[#C5A059]/30">
                    Current Score: {score}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">
                  Question {currentQuestionIdx + 1}
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#2D2D2D] leading-snug">
                  {activeQuestion.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {activeQuestion.options.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = i === activeQuestion.correctIndex;

                  let btnClass = "bg-[#FDFCF9] border-[#E5E0D5] hover:border-[#C5A059] text-[#2D2D2D]";
                  if (isAnswerRevealed) {
                    if (isCorrect) {
                      btnClass = "bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-400 font-bold";
                    } else if (isSelected && !isCorrect) {
                      btnClass = "bg-rose-50 border-rose-400 text-rose-950 font-bold";
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswerRevealed}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer font-sans ${btnClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white border border-[#E5E0D5] text-[#7A7468] text-xs font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswerRevealed && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswerRevealed && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Answer Explanation & Scripture Anchor */}
              {isAnswerRevealed && (
                <div className="p-5 bg-[#FAF6EE] border border-[#C5A059]/40 rounded-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C6B2D] uppercase tracking-wider font-serif">
                    <BookOpen className="w-4 h-4 text-[#C5A059]" />
                    <span>Scriptural Anchor ({activeQuestion.scriptureRef})</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#2D2D2D] leading-relaxed font-serif">
                    {activeQuestion.explanation}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNext}
                      className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#B48F48] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs inline-flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <span>
                        {currentQuestionIdx < activeQuiz.questions.length - 1
                          ? "Next Question"
                          : "Finish Quiz & View Results"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-8 sm:py-12 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#FAF6EE] border border-[#C5A059]/40 text-[#C5A059] flex items-center justify-center mx-auto shadow-sm">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#2D2D2D]">
                Quiz #{activeQuiz.quizNumber} Completed!
              </h2>
              <p className="text-xs sm:text-sm text-[#7A7468] font-sans">
                You scored <strong className="text-[#C5A059] font-bold text-lg">{score}</strong> out of{" "}
                <strong>{activeQuiz.questions.length}</strong> ({Math.round((score / activeQuiz.questions.length) * 100)}%)
              </p>

              <div className="p-4 bg-[#FDFCF9] border border-[#E5E0D5] rounded-2xl text-xs text-[#2D2D2D] font-serif">
                {score === activeQuiz.questions.length ? (
                  <p className="text-emerald-800 font-bold">
                    "Well done, good and faithful servant! You mastered every question according to Scripture."
                  </p>
                ) : score >= activeQuiz.questions.length / 2 ? (
                  <p className="text-[#8C6B2D] font-medium">
                    "Praise God! Great understanding of the Word. Continue to study to show yourself approved unto God."
                  </p>
                ) : (
                  <p className="text-[#7A7468]">
                    "Keep pressing into the Scriptures! Retake the quiz or study the Bible passages to deepen your roots."
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 bg-[#FAF6EE] hover:bg-[#F2EFE9] text-[#8C6B2D] border border-[#C5A059]/40 text-xs font-bold uppercase tracking-wider rounded-full shadow-2xs inline-flex items-center gap-2 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
                <button
                  onClick={handleBackToTable}
                  className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#B48F48] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs inline-flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>Return to 20-Quiz Table</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: The 20 Quizzes in a Table */
        <div className="space-y-4">
          {/* Filter and Control Bar */}
          <div className="bg-white border border-[#E5E0D5] rounded-[28px] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Audience Tabs */}
            <div className="flex items-center gap-1.5 bg-[#F9F7F2] p-1 rounded-2xl border border-[#E5E0D5] self-start md:self-auto">
              {(["All", "Kids", "Adults"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setAudienceFilter(tab)}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    audienceFilter === tab
                      ? "bg-[#C5A059] text-white shadow-2xs"
                      : "text-[#7A7468] hover:text-[#2D2D2D]"
                  }`}
                >
                  {tab === "All" ? "All (20)" : tab === "Kids" ? "Kids (10)" : "Adults (10)"}
                </button>
              ))}
            </div>

            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 flex-1 md:max-w-md">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-[#8A8478] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 20 quizzes by title, scripture, or theme..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#FDFCF9] border border-[#E5E0D5] focus:border-[#C5A059] rounded-xl text-xs text-[#2D2D2D] placeholder:text-[#8A8478] focus:outline-none"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl text-xs text-[#2D2D2D] focus:outline-none focus:border-[#C5A059]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All Categories" : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container with Horizontal Scroll on Small Devices */}
          <div className="bg-white border border-[#E5E0D5] rounded-[28px] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] text-[#8C6B2D] border-b border-[#E5E0D5] font-serif">
                    <th className="py-3.5 px-4 font-bold w-12 text-center">#</th>
                    <th className="py-3.5 px-4 font-bold min-w-[220px]">Quiz Title & Theme</th>
                    <th className="py-3.5 px-4 font-bold min-w-[90px]">Audience</th>
                    <th className="py-3.5 px-4 font-bold min-w-[130px]">Category</th>
                    <th className="py-3.5 px-4 font-bold min-w-[90px]">Questions</th>
                    <th className="py-3.5 px-4 font-bold min-w-[100px]">Difficulty</th>
                    <th className="py-3.5 px-4 font-bold min-w-[120px]">Anchor Scripture</th>
                    <th className="py-3.5 px-4 font-bold min-w-[100px]">Status / Score</th>
                    <th className="py-3.5 px-4 font-bold min-w-[110px] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E0D5]/70 font-sans">
                  {filteredQuizzes.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-[#7A7468]">
                        No quizzes found matching your criteria. Try adjusting the search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredQuizzes.map((quiz) => {
                      const scoreData = savedScores[quiz.id];

                      return (
                        <tr
                          key={quiz.id}
                          className="hover:bg-[#FDFCF9] transition-colors group cursor-pointer"
                          onClick={() => handleStartQuiz(quiz.id)}
                        >
                          <td className="py-3.5 px-4 font-bold text-center text-[#7A7468]">
                            {quiz.quizNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-serif font-bold text-[#2D2D2D] group-hover:text-[#C5A059] transition-colors">
                              {quiz.title}
                            </div>
                            <div className="text-[11px] text-[#7A7468] line-clamp-1 mt-0.5">
                              {quiz.description}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                quiz.audience === "Kids"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-amber-50 text-amber-900 border border-amber-200"
                              }`}
                            >
                              {quiz.audience}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#4A4438] font-medium">
                            {quiz.category}
                          </td>
                          <td className="py-3.5 px-4 text-[#7A7468]">
                            {quiz.questions.length} Questions
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                quiz.difficulty === "Beginner"
                                  ? "bg-blue-50 text-blue-700"
                                  : quiz.difficulty === "Intermediate"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-purple-50 text-purple-700"
                              }`}
                            >
                              {quiz.difficulty}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#8C6B2D]">
                            {quiz.keyScripture}
                          </td>
                          <td className="py-3.5 px-4">
                            {scoreData ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <Check className="w-3 h-3" />
                                {scoreData.score}/{scoreData.total} ({Math.round((scoreData.score / scoreData.total) * 100)}%)
                              </span>
                            ) : (
                              <span className="text-[11px] text-[#8A8478]">
                                Not Taken
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartQuiz(quiz.id);
                              }}
                              className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#B48F48] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-2xs inline-flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>{scoreData ? "Retake" : "Start"}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Summary Count */}
            <div className="bg-[#FAF6EE] px-4 py-3 border-t border-[#E5E0D5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C6B2D] font-medium gap-2">
              <span>Showing {filteredQuizzes.length} of 20 Master Quizzes</span>
              <span className="text-[11px] text-[#7A7468]">
                Authored under the apostolic guidance of Apostle R.Sango
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
