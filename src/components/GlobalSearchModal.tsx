import React, { useState, useEffect, useMemo } from "react";
import { Search, X, BookOpen, Sparkles, ArrowRight, BookMarked, MessageCircle } from "lucide-react";
import { BIBLE_VERSES_DATABASE, BIBLE_STUDY_PLANS } from "../data/mockData";
import { INITIAL_ENCOURAGEMENTS } from "../data/encouragementsData";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, data?: any) => void;
  onSpiritualInsightQuery: (query: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSpiritualInsightQuery
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) return null;
    const term = searchTerm.toLowerCase();

    // 1. Bible Verses
    const matchedVerses: { book: string; chapter: number; verse: number; text: string; translation: string }[] = [];
    Object.entries(BIBLE_VERSES_DATABASE).forEach(([book, chapters]) => {
      Object.entries(chapters).forEach(([chapterNum, transObj]) => {
        const defaultList = transObj["ESV"] || transObj["KJV"] || transObj["NIV"] || [];
        defaultList.forEach(v => {
          if (v.text.toLowerCase().includes(term) || book.toLowerCase().includes(term)) {
            matchedVerses.push({
              book,
              chapter: Number(chapterNum),
              verse: v.num,
              text: v.text,
              translation: "ESV"
            });
          }
        });
      });
    });

    // 2. Encouragements & Daily Text Messages
    const matchedEncouragements = INITIAL_ENCOURAGEMENTS.filter(e =>
      e.title.toLowerCase().includes(term) ||
      e.message.toLowerCase().includes(term) ||
      e.scriptureRef.toLowerCase().includes(term) ||
      (e.meaning && e.meaning.toLowerCase().includes(term)) ||
      (e.prayer && e.prayer.toLowerCase().includes(term)) ||
      (e.authorName && e.authorName.toLowerCase().includes(term)) ||
      e.theme.toLowerCase().includes(term)
    );

    // 3. Study Plans
    const matchedPlans = BIBLE_STUDY_PLANS.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );

    return {
      verses: matchedVerses.slice(0, 4),
      encouragements: matchedEncouragements.slice(0, 4),
      plans: matchedPlans.slice(0, 3),
      totalCount: matchedVerses.length + matchedEncouragements.length + matchedPlans.length
    };
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div
      id="global-search-overlay"
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-24 px-3 sm:px-4 bg-[#1C1B18]/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="global-search-modal"
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-[32px] shadow-2xl border border-[#E5E0D5] overflow-hidden max-h-[85vh] max-h-[85dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[#E5E0D5] bg-[#FDFCF9] shrink-0">
          <Search className="w-5 h-5 text-[#C5A059] shrink-0 mr-2.5 sm:mr-3" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search Scriptures, words of encouragement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none text-[#2D2D2D] placeholder-[#AAA498] focus:outline-none text-sm sm:text-base font-medium font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="p-1 hover:bg-[#E5E0D5]/50 rounded-full text-[#8A8478] hover:text-[#2D2D2D] mr-2 cursor-pointer transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 sm:px-3 py-1 text-xs font-semibold text-[#7A7468] bg-[#F9F7F2] hover:bg-[#E5E0D5] rounded-full border border-[#E5E0D5] cursor-pointer shrink-0"
          >
            Close
          </button>
        </div>

        {/* Search Body / Results */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Quick AI Search Callout if user entered text */}
          {searchTerm.trim().length > 2 && (
            <div
              id="ai-insight-quick-trigger"
              onClick={() => {
                onSpiritualInsightQuery(searchTerm);
                onClose();
              }}
              className="flex items-center justify-between p-4 bg-[#FDFCF9] rounded-[24px] border border-[#C5A059]/40 cursor-pointer hover:border-[#C5A059] hover:bg-white transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A059] text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-bold text-[#2D2D2D] group-hover:text-[#C5A059] transition-colors">
                    Spiritual Insight AI Analysis
                  </h4>
                  <p className="text-xs text-[#7A7468] font-sans">
                    Analyze "{searchTerm}" with Bible-centred themes, scriptures, and reflection questions.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
            </div>
          )}

          {!searchTerm.trim() ? (
            <div className="py-8 text-center">
              <p className="text-sm font-serif font-bold text-[#2D2D2D]">Quick Searches & Recommended Topics</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
                {["Romans 8:37", "Words of Encouragement", "Dominion & Victory", "River of Life Dream", "Spiritual Armor", "Worship in Spirit", "Holy Spirit Gifts"].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSearchTerm(topic)}
                    className="px-3.5 py-1.5 text-xs font-medium bg-[#F9F7F2] hover:bg-[#C5A059] hover:text-white text-[#7A7468] rounded-full border border-[#E5E0D5] transition-all cursor-pointer"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults && searchResults.totalCount === 0 ? (
            <div className="py-10 text-center text-[#7A7468]">
              <p className="text-sm font-sans">No direct database matches found for "{searchTerm}".</p>
              <button
                onClick={() => {
                  onSpiritualInsightQuery(searchTerm);
                  onClose();
                }}
                className="mt-3.5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#B48F48] shadow-xs cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Ask AI Spiritual Insight Engine
              </button>
            </div>
          ) : searchResults ? (
            <>
              {/* Scripture Results */}
              {(searchResults?.verses || []).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2 font-serif">
                    <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Scripture Verses ({searchResults.verses.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {(searchResults.verses || []).map((v, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          onNavigate("bible", { book: v.book, chapter: v.chapter, verse: v.verse });
                          onClose();
                        }}
                        className="p-3 rounded-2xl hover:bg-[#FDFCF9] border border-transparent hover:border-[#E5E0D5] cursor-pointer transition-all"
                      >
                        <div className="text-xs font-serif font-bold text-[#C5A059]">
                          {v.book} {v.chapter}:{v.verse} ({v.translation})
                        </div>
                        <p className="text-xs text-[#2D2D2D] line-clamp-2 mt-0.5 font-sans leading-relaxed">{v.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Encouragements Results */}
              {(searchResults?.encouragements || []).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2 font-serif">
                    <MessageCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Words of Encouragement ({searchResults.encouragements.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {(searchResults.encouragements || []).map((e) => (
                      <div
                        key={e.id}
                        onClick={() => {
                          onNavigate("encouragements");
                          onClose();
                        }}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#FDFCF9] border border-transparent hover:border-[#E5E0D5] cursor-pointer transition-all"
                      >
                        <div>
                          <div className="text-xs font-serif font-bold text-[#2D2D2D]">{e.title}</div>
                          <div className="text-[11px] text-[#7A7468] mt-0.5 font-sans">
                            <span className="text-[#C5A059] font-medium">{e.scriptureRef}</span> • Daily Promise
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8A8478]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Study Plans Results */}
              {(searchResults?.plans || []).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2 font-serif">
                    <BookMarked className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Bible Study Plans ({searchResults.plans.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {(searchResults.plans || []).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onNavigate("study-plans", { planId: p.id });
                          onClose();
                        }}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#FDFCF9] border border-transparent hover:border-[#E5E0D5] cursor-pointer transition-all"
                      >
                        <div>
                          <div className="text-xs font-serif font-bold text-[#2D2D2D]">{p.title}</div>
                          <div className="text-[11px] text-[#7A7468] mt-0.5 font-sans">
                            {p.daysCount} Days • <span className="text-[#C5A059] font-medium">{p.category}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8A8478]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
