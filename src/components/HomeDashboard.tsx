import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Moon,
  Heart,
  BookMarked,
  Award,
  Volume2,
  ShieldCheck,
  ChevronRight,
  Send,
  MessageCircle,
  Plus
} from "lucide-react";
import { DEVOTIONAL_TODAY } from "../data/mockData";
import { INITIAL_ENCOURAGEMENTS } from "../data/encouragementsData";
import { UserProfile } from "../types";
import { AudioTrack } from "./AudioPlayerBar";
import { UserFriendlyMetrics } from "./UserFriendlyMetrics";

interface HomeDashboardProps {
  user: UserProfile;
  onNavigate: (view: string, data?: any) => void;
  onPlayAudio: (track: AudioTrack) => void;
  onAskAI: (query: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  onNavigate,
  onPlayAudio,
  onAskAI,
}) => {
  const [quickAIQuery, setQuickAIQuery] = useState("");
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  const dailyDevotional = DEVOTIONAL_TODAY;
  const todaysEncouragement = INITIAL_ENCOURAGEMENTS[0];

  const handleQuickAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAIQuery.trim()) {
      onAskAI(quickAIQuery.trim());
      setQuickAIQuery("");
    }
  };

  const quickNavItems = [
    {
      id: "bible",
      title: "Bible Hub",
      subtitle: "66 Canonical Books • Deep Voice Audio",
      symbol: "📖",
      icon: BookOpen,
    },
    {
      id: "encouragements",
      title: "Words of Encouragement",
      subtitle: "Daily Uplifting Messages & Rhema",
      symbol: "🕊",
      icon: MessageCircle,
      badge: "New Daily",
    },
    {
      id: "spiritual-insight",
      title: "Spiritual Insight AI",
      subtitle: "Biblical Search & Dream Discernment",
      symbol: "✦",
      icon: Sparkles,
      badge: "AI Powered",
    },
    {
      id: "journal",
      title: "Dreams & Visions",
      subtitle: "Spiritual Journal & Revelations",
      symbol: "☁",
      icon: Moon,
    },
    {
      id: "prayers",
      title: "Prayer Sanctuary",
      subtitle: "Corporate Intercession & Praise",
      symbol: "🕊",
      icon: Heart,
    },
    {
      id: "study-plans",
      title: "Study Plans",
      subtitle: "Multi-Day Guided Devotionals",
      symbol: "✎",
      icon: BookMarked,
    },
    {
      id: "youth",
      title: "Youth & Quizzes",
      subtitle: "Kingdom Discipleship & Trivia",
      symbol: "🏆",
      icon: Award,
    },
  ];

  return (
    <div id="home-dashboard-container" className="w-full space-y-6 sm:space-y-8">
      {/* 0. User Friendly Spiritual Journey & Fellowship Metrics */}
      <UserFriendlyMetrics onNavigate={onNavigate} />

      {/* Quick Ministry Pulse Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div
          onClick={() => onNavigate("bible", { book: "Romans", chapter: 8 })}
          className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-[24px] border border-[#E5E0D5] hover:border-[#C5A059] shadow-2xs cursor-pointer transition-all flex flex-col xs:flex-row xs:items-center justify-between gap-2 group"
        >
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478] truncate block">Daily Scripture</span>
            <h4 className="font-serif font-bold text-[#2D2D2D] text-base sm:text-lg group-hover:text-[#C5A059] transition-colors truncate">Romans 8</h4>
            <span className="text-[10px] sm:text-[11px] text-[#C5A059] font-medium truncate block">Continue →</span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FDFCF9] border border-[#E5E0D5] flex items-center justify-center text-[#C5A059] shrink-0 self-end xs:self-auto">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("encouragements")}
          className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-[24px] border border-[#E5E0D5] hover:border-[#C5A059] shadow-2xs cursor-pointer transition-all flex flex-col xs:flex-row xs:items-center justify-between gap-2 group"
        >
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] truncate block">Encouragement</span>
            <h4 className="font-serif font-bold text-[#2D2D2D] text-base sm:text-lg group-hover:text-[#C5A059] transition-colors truncate">Word of Peace</h4>
            <span className="text-[10px] sm:text-[11px] text-[#C5A059] font-medium truncate block">Read Today →</span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FAF6EE] border border-[#E5E0D5] flex items-center justify-center text-[#C5A059] shrink-0 self-end xs:self-auto">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("prayers")}
          className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-[24px] border border-[#E5E0D5] hover:border-[#C5A059] shadow-2xs cursor-pointer transition-all flex flex-col xs:flex-row xs:items-center justify-between gap-2 group"
        >
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478] truncate block">Prayer Wall</span>
            <h4 className="font-serif font-bold text-[#2D2D2D] text-base sm:text-lg group-hover:text-[#C5A059] transition-colors truncate">Intercession</h4>
            <span className="text-[10px] sm:text-[11px] text-[#C5A059] font-medium truncate block">Pray for Saints →</span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FDFCF9] border border-[#E5E0D5] flex items-center justify-center text-[#C5A059] shrink-0 self-end xs:self-auto">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("study-plans")}
          className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-[24px] border border-[#E5E0D5] hover:border-[#C5A059] shadow-2xs cursor-pointer transition-all flex flex-col xs:flex-row xs:items-center justify-between gap-2 group"
        >
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478] truncate block">Study Plans</span>
            <h4 className="font-serif font-bold text-[#2D2D2D] text-base sm:text-lg group-hover:text-[#C5A059] transition-colors truncate">Dominion Walk</h4>
            <span className="text-[10px] sm:text-[11px] text-[#C5A059] font-medium truncate block">Daily Journey →</span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FDFCF9] border border-[#E5E0D5] flex items-center justify-center text-[#C5A059] shrink-0 self-end xs:self-auto">
            <BookMarked className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* 1. Artistic Daily Manna & Scripture Spotlight Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-xs border border-[#E5E0D5] relative overflow-hidden">
        {/* Subtle decorative organic corner accent */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#F9F7F2] rounded-bl-[140px] opacity-70 pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[#C5A059] font-serif italic text-lg sm:text-xl tracking-wide">Daily Manna & Rhema Word</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8A8478] bg-[#FDFCF9] px-3.5 py-1 rounded-full border border-[#E5E0D5]">
                Hebrews 4:12
              </span>
            </div>
          </div>

          <blockquote className="text-xl sm:text-3xl lg:text-4xl font-serif leading-relaxed text-[#4A4438] max-w-5xl">
            "For the word of God is <span className="italic text-[#C5A059]">living and active</span>, sharper than any two-edged sword, piercing to the division of soul and of spirit, of joints and of marrow, and discerning the thoughts and intentions of the heart."
          </blockquote>

          <p className="text-xs sm:text-sm text-[#7A7468] max-w-4xl leading-relaxed font-sans">
            The canonical Scriptures are not mere historical ink; they are spirit and life, actively speaking to your circumstances today with divine clarity, apostolic authority, and breakthrough power.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E5E0D5]">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => onNavigate("bible", { book: "Hebrews", chapter: 4, verse: 12 })}
                className="bg-[#C5A059] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#B48F48] shadow-md shadow-[#C5A059]/20 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Chapter in Bible Hub</span>
              </button>

              <button
                onClick={() =>
                  onPlayAudio({
                    id: "audio-hebrews-4-12",
                    title: "Hebrews 4:12 Daily Manna",
                    subtitle: "Scripture Audio Narration",
                    textToRead:
                      "Hebrews chapter 4, verse 12. For the word of God is living and active, sharper than any two-edged sword, piercing to the division of soul and of spirit, of joints and of marrow, and discerning the thoughts and intentions of the heart.",
                  })
                }
                className="px-4 py-2.5 bg-[#FDFCF9] hover:bg-white text-[#7A7468] hover:text-[#C5A059] border border-[#E5E0D5] hover:border-[#C5A059] rounded-full text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-2 shadow-2xs"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Listen Narration</span>
              </button>
            </div>

            <button
              onClick={() => onAskAI("Hebrews 4:12 - Explain the biblical meaning of the Word of God being living and active in spiritual warfare.")}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#C5A059] hover:text-[#B48F48] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Ask Spiritual Insight AI →</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Spiritual Insight Engine Quick Search Box */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E5E0D5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#2D2D2D]">Spiritual Insight Engine</h2>
            <p className="text-xs text-[#8A8478] mt-0.5">Explore theological questions, scripture context, or dream discernment</p>
          </div>
          <span className="self-start sm:self-auto text-[10px] bg-[#FDFCF9] border border-[#E5E0D5] px-3 py-1 rounded-full uppercase tracking-wider text-[#8A8478] font-bold">
            AI Powered Biblical Search
          </span>
        </div>

        <form onSubmit={handleQuickAISubmit} className="relative">
          <textarea
            value={quickAIQuery}
            onChange={(e) => setQuickAIQuery(e.target.value)}
            rows={3}
            className="w-full bg-[#F9F7F2] rounded-2xl p-4 sm:p-5 border border-[#E5E0D5]/80 focus:border-[#C5A059] focus:bg-white focus:outline-none placeholder:text-[#AAA498] text-[#4A4438] text-sm transition-all resize-none font-sans"
            placeholder="Record a dream, vision, or ask a biblical question (e.g. 'What does Scripture say about spiritual gifts?' or 'I dreamt of an olive tree')..."
          ></textarea>

          <div className="sm:absolute sm:bottom-4 sm:right-4 flex items-center justify-end gap-2 mt-3 sm:mt-0">
            <button
              type="button"
              onClick={() => onNavigate("journal")}
              className="p-2.5 bg-white border border-[#E5E0D5] rounded-xl text-[#C5A059] hover:border-[#C5A059] transition-colors cursor-pointer"
              title="Open Dream & Vision Journal"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={!quickAIQuery.trim()}
              className="px-6 py-2.5 bg-[#2D2D2D] hover:bg-black disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>Seek Insight</span>
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>
          </div>
        </form>
      </div>

      {/* 3. Grid of Main Exploration Portals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-serif text-xl sm:text-2xl text-[#2D2D2D]">
            Sanctuary Portals
          </h2>
          <span className="text-xs font-medium text-[#8A8478] uppercase tracking-wider">
            Explore All Biblical Portals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {quickNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group bg-white hover:bg-[#FDFCF9] border border-[#E5E0D5] hover:border-[#C5A059] rounded-[24px] p-5 cursor-pointer shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#F9F7F2] border border-[#E5E0D5] flex items-center justify-center text-[#C5A059] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#FDFCF9] px-2 py-0.5 rounded-full border border-[#E5E0D5]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-[#2D2D2D] text-base group-hover:text-[#C5A059] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#7A7468] mt-1 leading-relaxed">{item.subtitle}</p>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-bold text-[#C5A059]">
                  <span>Enter</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Two-Column Layout: Daily Devotional & Words of Encouragement Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Daily Devotional & Scripture Study */}
        <div className="lg:col-span-7 bg-white border border-[#E5E0D5] rounded-[32px] p-6 sm:p-8 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#C5A059] bg-[#FDFCF9] px-3 py-1 rounded-full border border-[#E5E0D5] uppercase tracking-wider">
                Daily Study Devotional
              </span>
              <span className="text-xs text-[#8A8478] font-medium">{dailyDevotional.date}</span>
            </div>

            <h3 className="font-serif font-bold text-[#2D2D2D] text-2xl">
              {dailyDevotional.title}
            </h3>

            <div className="text-xs font-bold text-[#C5A059]">
              Scripture: {dailyDevotional.scriptureRef} — "{dailyDevotional.scriptureText}"
            </div>

            <div className="font-serif text-[#4A4438] text-sm leading-relaxed whitespace-pre-line bg-[#FDFCF9] p-5 rounded-2xl border border-[#E5E0D5]">
              {dailyDevotional.reflection}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#E5E0D5]">
            <div className="text-xs text-[#8A8478] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-[#2D2D2D] font-medium">Daily Scripture Reflection & Guided Prayer</span>
            </div>

            <button
              onClick={() => onNavigate("study-plans")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] hover:text-[#B48F48] cursor-pointer"
            >
              <span>Explore Study Plans</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Words of Encouragement Hub Highlight */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FDFCF9] rounded-[32px] border border-[#E5E0D5] p-6 shadow-xs flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#2D2D2D] flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#C5A059]" />
                <span>Daily Encouragement</span>
              </h3>
              <button
                onClick={() => onNavigate("encouragements")}
                className="text-xs font-bold text-[#C5A059] hover:underline"
              >
                View All Words →
              </button>
            </div>

            {todaysEncouragement && (
              <div
                onClick={() => onNavigate("encouragements")}
                className="bg-white p-5 rounded-2xl border border-[#E5E0D5] group hover:border-[#C5A059] transition-all cursor-pointer shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider bg-[#FAF6EE] px-2.5 py-0.5 rounded-full border border-[#E5E0D5]">
                    Theme: {todaysEncouragement.theme}
                  </span>
                  <span className="text-[10px] text-[#8A8478]">{todaysEncouragement.date}</span>
                </div>

                <h4 className="font-serif font-bold text-base text-[#2D2D2D] group-hover:text-[#C5A059] transition-colors leading-tight">
                  {todaysEncouragement.title}
                </h4>

                <p className="text-xs text-[#7A7468] line-clamp-2 leading-relaxed font-sans">
                  {todaysEncouragement.message}
                </p>

                <div className="p-2.5 bg-[#FAF6EE] rounded-xl text-[11px] font-serif text-[#3A352C] border border-[#C5A059]/20">
                  <span className="text-[#C5A059] font-bold block mb-0.5">{todaysEncouragement.scriptureRef}</span>
                  <span className="italic">"{todaysEncouragement.scriptureText}"</span>
                </div>

                {todaysEncouragement.prayer && (
                  <div className="p-2.5 bg-[#F9F7F2] rounded-xl text-[11px] font-sans text-[#4A4438] border border-[#E5E0D5]">
                    <span className="text-rose-600 font-bold flex items-center gap-1 mb-0.5">
                      <Heart className="w-3 h-3 fill-rose-600" /> Prayer to Pray Today
                    </span>
                    <p className="font-serif italic text-xs text-[#4A4438] line-clamp-2">
                      "{todaysEncouragement.prayer}"
                    </p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-[11px] text-[#8A8478] border-t border-[#E5E0D5]/60">
                  <span className="text-[#C5A059] font-medium">Daily Scripture & Prayer</span>
                  <span className="text-[#C5A059] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Pray & Share →
                  </span>
                </div>
              </div>
            )}

            {/* Quick post encouragement trigger */}
            <div className="pt-2">
              <button
                onClick={() => onNavigate("encouragements")}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#FAF6EE] border border-[#E5E0D5] hover:border-[#C5A059] text-[#2D2D2D] rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" />
                <span>Add Daily Text Message for Believers</span>
              </button>
            </div>
          </div>

          {/* Continue Reading Widget */}
          <div className="bg-white rounded-[32px] border border-[#E5E0D5] p-6 shadow-xs">
            <h4 className="font-serif text-base text-[#2D2D2D] mb-3">Continue Scripture Reading</h4>
            <div
              onClick={() => onNavigate("bible", { book: "John", chapter: 3 })}
              className="flex items-center gap-3.5 bg-[#FDFCF9] p-3.5 rounded-2xl border border-[#E5E0D5] hover:border-[#C5A059] transition-all cursor-pointer"
            >
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center font-serif text-[#C5A059] text-xl border border-[#E5E0D5]">
                J
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-[#2D2D2D]">Gospel of John 3</p>
                <div className="w-32 h-1 bg-[#E5E0D5] rounded-full mt-1.5 overflow-hidden">
                  <div className="w-1/2 h-full bg-[#C5A059]"></div>
                </div>
              </div>
              <ChevronRight className="text-[#C5A059] w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Apostolic & Biblical Foundation Banner */}
      <div className="p-5 bg-white border border-[#E5E0D5] rounded-[32px] flex items-start gap-4 shadow-2xs">
        <div className="w-9 h-9 rounded-full bg-[#F9F7F2] border border-[#E5E0D5] flex items-center justify-center text-[#C5A059] shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-[#7A7468] space-y-1 leading-relaxed">
          <span className="font-bold text-[#2D2D2D]">Apostolic Standard & Biblical Foundation:</span> All scriptures, study plans, daily words of encouragement, and AI Spiritual Insight reflections on this platform are strictly rooted in the canonical Word of God under the guiding principles of Worship, Dominion, and Victory.
        </div>
      </div>
    </div>
  );
};
