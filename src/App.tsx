import React, { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  Sparkles,
  Moon,
  Heart,
  BookMarked,
  Award,
  Bookmark,
  ShieldCheck,
  Search,
  MessageSquare,
  User,
  Menu,
  X,
  Globe,
  MessageCircle,
  UserCheck
} from "lucide-react";
import { Logo } from "./components/Logo";
import { HomeDashboard } from "./components/HomeDashboard";
import { BibleHub } from "./components/BibleHub";
import { EncouragementHub } from "./components/EncouragementHub";
import { SpiritualInsightEngine } from "./components/SpiritualInsightEngine";
import { DreamVisionJournal } from "./components/DreamVisionJournal";
import { PrayerHub } from "./components/PrayerHub";
import { StudyPlansHub } from "./components/StudyPlansHub";
import { YouthAndQuizzes } from "./components/YouthAndQuizzes";
import { MyLibrary } from "./components/MyLibrary";
import { AdminPortal } from "./components/AdminPortal";
import { SignUpPortal } from "./components/SignUpPortal";
import { AudioPlayerBar, AudioTrack } from "./components/AudioPlayerBar";
import { GlobalSearchModal } from "./components/GlobalSearchModal";
import { ProfileModal } from "./components/ProfileModal";
import { FeedbackModal } from "./components/FeedbackModal";
import { Storage, DEFAULT_USER } from "./lib/storage";
import { UserProfile, UserRole } from "./types";
import { translations, Language } from "./lib/translations";
import { useAuth } from "./lib/AuthContext";
import { UserAvatar } from "./components/UserAvatar";

export default function App() {
  const { currentUser, userProfile, loading, updateProfileData } = useAuth();

  const [currentView, setCurrentView] = useState<string>("home");
  const [viewParams, setViewParams] = useState<any>(null);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [language, setLanguage] = useState<Language>("en");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentAudioTrack, setCurrentAudioTrack] = useState<AudioTrack | null>(null);

  // Sync user from AuthContext or Storage
  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
    } else {
      setUser(Storage.getUser());
    }
  }, [userProfile]);

  const t = translations[language];

  const handleNavigate = (view: string, data?: any) => {
    setCurrentView(view);
    setViewParams(data || null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSpiritualInsightQuery = (query: string) => {
    setCurrentView("spiritual-insight");
    setViewParams({ initialQuery: query });
  };

  const handleSwitchRole = (newRole: UserRole) => {
    const updated = { ...user, role: newRole };
    setUser(updated);
    Storage.setUser(updated);
    if (userProfile) {
      updateProfileData({ role: newRole });
    }
  };

  // 1. Initial Loading Spinner while Firebase Auth initializes
  if (loading) {
    return (
      <div className="w-full min-h-screen min-h-[100dvh] bg-[#F9F7F2] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <Logo size="lg" />
          <div className="flex items-center gap-2 text-[#C5A059] font-serif text-sm font-semibold tracking-wider">
            <span className="w-4 h-4 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
            <span>Entering the Sanctuary...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authentication Gate: If user is not authenticated, show the Login/Registration Portal before the main app
  if (!currentUser) {
    return (
      <div className="w-full min-h-screen min-h-[100dvh] bg-[#F9F7F2] text-[#2D2D2D] font-sans flex flex-col selection:bg-[#C5A059] selection:text-white">
        {/* Simplified Header for Login Portal */}
        <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#E5E0D5] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#C5A059] px-3 py-1 bg-[#FDFCF9] rounded-full border border-[#E5E0D5]">
              <span>Worship</span>
              <span className="opacity-40">•</span>
              <span>Dominion</span>
              <span className="opacity-40">•</span>
              <span>Victory</span>
            </div>
            <button
              onClick={() => setLanguage(language === "en" ? "fr" : "en")}
              className="px-3 py-1.5 text-xs font-semibold text-[#7A7468] hover:text-[#C5A059] bg-white border border-[#E5E0D5] rounded-full flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{language.toUpperCase()}</span>
            </button>
          </div>
        </header>

        {/* Centered Login / Sign-up Card */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <SignUpPortal
            onSuccess={() => {
              setCurrentView("home");
            }}
          />
        </main>

        {/* Minimal Footer */}
        <footer className="w-full bg-white border-t border-[#E5E0D5] px-4 sm:px-8 py-3.5 text-center text-[11px] font-medium tracking-wider text-[#8A8478] uppercase">
          &copy; {new Date().getFullYear()} Global Tower of Christ • Worship • Dominion • Victory
        </footer>
      </div>
    );
  }

  // 3. Authenticated App Flow
  const navItems = [
    { id: "home", label: t.home, icon: Home },
    { id: "journal", label: "Interpret Your Dreams & Visions", icon: Moon, badge: "Biblical AI" },
    { id: "spiritual-insight", label: "Scripture Inquiry & Doctrine", icon: Sparkles, badge: "Doctrine" },
    { id: "bible", label: "Biblical Doctrine & Scripture", icon: BookOpen },
    { id: "encouragements", label: t.encouragements || "Words of Encouragement", icon: MessageCircle, badge: "Daily" },
    { id: "prayers", label: t.prayerHub, icon: Heart },
    { id: "study-plans", label: t.studyPlans, icon: BookMarked },
    { id: "youth", label: t.youth, icon: Award, badge: "20 Quizzes" },
    { id: "library", label: t.myLibrary, icon: Bookmark },
    { id: "admin", label: "Apostle R.Sango CRM & Governance", icon: ShieldCheck, badge: "CRM" },
  ];

  return (
    <div className="w-full min-h-screen min-h-[100dvh] bg-[#F9F7F2] text-[#2D2D2D] font-sans flex flex-col selection:bg-[#C5A059] selection:text-white">
      {/* Top Full-Width Header */}
      <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-[#E5E0D5] shadow-xs">
        <div className="w-full px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Personal Greeting */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div
              onClick={() => handleNavigate("home")}
              className="cursor-pointer transition-transform hover:scale-102 shrink-0"
            >
              <Logo size="md" />
            </div>

            <div className="hidden sm:block h-6 w-px bg-[#E5E0D5]"></div>

            <div className="hidden sm:block">
              <span className="font-serif text-base sm:text-lg text-[#2D2D2D]">
                Peace be with you, <span className="text-[#C5A059] italic font-semibold">{user.name.split(" ")[0]}</span>
              </span>
            </div>
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Interpret Your Dreams & Visions Header Action */}
            <button
              id="header-interpret-dreams-btn"
              onClick={() => handleNavigate("journal")}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#C5A059] to-[#9E7B35] hover:from-[#B48F48] hover:to-[#8C6B2D] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs shadow-[#C5A059]/25 hover:shadow-md hover:scale-102 shrink-0"
              title="Interpret Your Dreams & Visions with Biblical AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />
              <span className="hidden md:inline">Interpret Dreams & Visions</span>
              <span className="md:hidden">Dreams AI</span>
            </button>

            {/* Universal Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border border-[#E5E0D5] bg-white rounded-full text-xs text-[#7A7468] hover:text-[#C5A059] hover:border-[#C5A059] transition-all cursor-pointer shadow-2xs"
              title="Search Scriptures, Words & Insights (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden lg:inline text-xs font-medium">Search scriptures...</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === "en" ? "fr" : "en")}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[#7A7468] hover:text-[#C5A059] bg-white border border-[#E5E0D5] hover:border-[#C5A059] rounded-full flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="Toggle English / Français"
            >
              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 p-1 hover:bg-white rounded-full transition-all border border-transparent hover:border-[#E5E0D5] cursor-pointer"
              title="User Profile & Settings"
            >
              <UserAvatar
                name={user.name}
                size="sm"
                bgColor={user.avatarUrl && user.avatarUrl.startsWith("bg-") ? user.avatarUrl : undefined}
                className="border border-[#C5A059] shadow-xs"
              />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#7A7468] hover:bg-white rounded-xl border border-[#E5E0D5] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Width Application Shell */}
      <div className="flex-1 w-full flex min-h-0">
        {/* Desktop Persistent Left Navigation Sidebar */}
        <aside
          className={`hidden lg:flex flex-col shrink-0 border-r border-[#E5E0D5] bg-white/80 backdrop-blur-xs transition-all duration-300 h-[calc(100vh-65px)] sticky top-[65px] ${
            isSidebarCollapsed ? "w-20 p-2.5" : "w-64 xl:w-72 p-3.5 xl:p-4"
          }`}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-between space-y-2">
            <div className="flex-1 min-h-0 flex flex-col space-y-2">
              <div className="flex items-center justify-between px-3 py-1">
                {!isSidebarCollapsed && (
                  <span className="text-[10px] font-bold text-[#8A8478] uppercase tracking-widest font-serif">
                    Ministry Sanctuary
                  </span>
                )}
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-1 rounded-lg hover:bg-[#F9F7F2] text-[#8A8478] hover:text-[#C5A059] transition-colors cursor-pointer ml-auto"
                  title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  <Menu className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Nav Container ensuring all links are always visible */}
              <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center ${
                        isSidebarCollapsed ? "justify-center px-2 py-2.5" : "justify-between px-3.5 py-2"
                      } rounded-2xl text-xs transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#FDFCF9] text-[#C5A059] font-bold border border-[#E5E0D5] shadow-2xs ring-1 ring-[#C5A059]/20"
                          : "text-[#7A7468] hover:bg-[#F9F7F2] hover:text-[#2D2D2D] font-medium border border-transparent"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#C5A059]" : "text-[#8A8478]"}`} />
                        {!isSidebarCollapsed && <span>{item.label}</span>}
                      </span>

                      {!isSidebarCollapsed && item.badge && (
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                            item.badge === "Daily"
                              ? "bg-[#C5A059]/15 text-[#8C6B2D] border border-[#C5A059]/40"
                              : item.badge === "AI Discernment" || item.badge === "AI"
                              ? "bg-[#FAF6EE] text-[#8C6B2D] border border-[#C5A059]/40 font-bold"
                              : isActive
                              ? "bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30"
                              : "bg-[#F9F7F2] text-[#8A8478] border border-[#E5E0D5]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Bottom: User Card & Founder Attribution */}
            <div className="pt-2.5 border-t border-[#E5E0D5] space-y-2 shrink-0">
              {!isSidebarCollapsed ? (
                <>
                  <div
                    onClick={() => setIsProfileOpen(true)}
                    className="flex items-center gap-2.5 bg-[#FDFCF9] p-2.5 rounded-2xl border border-[#E5E0D5] hover:border-[#C5A059] transition-all cursor-pointer shadow-2xs"
                  >
                    <UserAvatar
                      name={user.name}
                      size="sm"
                      bgColor={user.avatarUrl && user.avatarUrl.startsWith("bg-") ? user.avatarUrl : undefined}
                      className="border border-[#C5A059]"
                    />
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-bold text-[#2D2D2D] truncate font-serif">{user.name}</p>
                      <p className="text-[10px] text-[#8A8478] capitalize truncate font-sans">
                        {user.role.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="px-2 text-[10px] text-[#8A8478] space-y-0.5 leading-tight font-sans">
                    <span className="font-semibold text-[#4A4438] block">Founder:</span>
                    <div className="text-[#2D2D2D] font-medium font-serif">Apostle R.Sango</div>
                    <a
                      href="mailto:info@globaltowerofchrist.com"
                      className="text-[#C5A059] hover:underline"
                    >
                      info@globaltowerofchrist.com
                    </a>
                  </div>
                </>
              ) : (
                <div
                  onClick={() => setIsProfileOpen(true)}
                  className="flex justify-center p-2 bg-[#FDFCF9] rounded-2xl border border-[#E5E0D5] cursor-pointer"
                  title={`${user.name} (${user.role})`}
                >
                  <UserAvatar
                    name={user.name}
                    size="sm"
                    bgColor={user.avatarUrl && user.avatarUrl.startsWith("bg-") ? user.avatarUrl : undefined}
                    className="border border-[#C5A059]"
                  />
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Fullscreen Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-[#1C1B18]/60 backdrop-blur-xs flex justify-end animate-fadeIn">
            <div className="w-4/5 max-w-sm bg-[#F9F7F2] h-full p-6 shadow-2xl space-y-5 overflow-y-auto border-l border-[#E5E0D5]">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D5]">
                <Logo size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full border border-[#E5E0D5] text-[#7A7468] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold cursor-pointer ${
                        isActive
                          ? "bg-white text-[#C5A059] border border-[#E5E0D5] shadow-xs"
                          : "text-[#7A7468] hover:bg-white"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-[#C5A059]" : "text-[#8A8478]"}`} />
                        <span>{item.label}</span>
                      </span>

                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#C5A059]/10 text-[#C5A059] rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#E5E0D5]">
                <div
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsProfileOpen(true);
                  }}
                  className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-[#E5E0D5] cursor-pointer"
                >
                  <UserAvatar
                    name={user.name}
                    size="md"
                    bgColor={user.avatarUrl && user.avatarUrl.startsWith("bg-") ? user.avatarUrl : undefined}
                    className="border border-[#C5A059]"
                  />
                  <div>
                    <h4 className="text-xs font-bold font-serif text-[#2D2D2D]">{user.name}</h4>
                    <p className="text-[10px] text-[#8A8478] capitalize">{user.role.replace("_", " ")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Primary Workspace Canvas (Full Viewport Width) */}
        <main className="flex-1 w-full min-w-0 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 lg:pb-12 overflow-y-auto">
          <div className="w-full h-full">
            {currentView === "home" && (
              <HomeDashboard
                user={user}
                onNavigate={handleNavigate}
                onPlayAudio={(track) => setCurrentAudioTrack(track)}
                onAskAI={(query) => handleSpiritualInsightQuery(query)}
              />
            )}

            {currentView === "bible" && (
              <BibleHub
                initialBook={viewParams?.book || "Romans"}
                initialChapter={viewParams?.chapter || 8}
                initialVerse={viewParams?.verse}
                onPlayAudio={(track) => setCurrentAudioTrack(track)}
                onAskAI={(verseText) => handleSpiritualInsightQuery(verseText)}
              />
            )}

            {currentView === "encouragements" && (
              <EncouragementHub
                user={user}
                onPlayAudio={(track) => setCurrentAudioTrack(track)}
                onNavigateToBible={(book, ch, v) => handleNavigate("bible", { book, chapter: ch, verse: v })}
                onAskAI={(prompt) => handleSpiritualInsightQuery(prompt)}
              />
            )}

            {currentView === "spiritual-insight" && (
              <SpiritualInsightEngine
                initialQuery={viewParams?.initialQuery || ""}
                onNavigateToBible={(book, ch) => handleNavigate("bible", { book, chapter: ch })}
              />
            )}

            {currentView === "journal" && (
              <DreamVisionJournal
                onAnalyzeWithAI={(text) => handleSpiritualInsightQuery(text)}
                onNavigateToBible={(book, ch) => handleNavigate("bible", { book, chapter: ch })}
              />
            )}

            {currentView === "prayers" && <PrayerHub user={user} />}

            {currentView === "study-plans" && (
              <StudyPlansHub
                initialPlanId={viewParams?.planId}
                onNavigateToBible={(book, ch) => handleNavigate("bible", { book, chapter: ch })}
                onAskAI={(prompt) => handleSpiritualInsightQuery(prompt)}
              />
            )}

            {currentView === "youth" && <YouthAndQuizzes />}

            {currentView === "library" && (
              <MyLibrary
                onNavigateToBible={(book, ch) => handleNavigate("bible", { book, chapter: ch })}
                onNavigateToEncouragement={() => handleNavigate("encouragements")}
              />
            )}

            {currentView === "admin" && (
              <AdminPortal currentRole={user.role} onSwitchRole={handleSwitchRole} />
            )}
          </div>
        </main>
      </div>

      {/* Full-Width Artistic Flair Footer */}
      <footer className="mt-auto w-full bg-white border-t border-[#E5E0D5] px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium tracking-wider text-[#8A8478] uppercase gap-2">
        <div>&copy; {new Date().getFullYear()} Global Tower of Christ • Worship • Dominion • Victory</div>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <button onClick={() => handleNavigate("bible")} className="hover:text-[#C5A059] transition-colors cursor-pointer">Scripture Hub</button>
          <button onClick={() => handleNavigate("encouragements")} className="hover:text-[#C5A059] transition-colors cursor-pointer">Words of Encouragement</button>
          <button onClick={() => handleNavigate("spiritual-insight")} className="hover:text-[#C5A059] transition-colors cursor-pointer">Spiritual Insight AI</button>
          <button onClick={() => setIsFeedbackOpen(true)} className="hover:text-[#C5A059] transition-colors cursor-pointer">Ministry Support</button>
        </div>
      </footer>

      {/* Persistent Audio Player Bar */}
      <AudioPlayerBar
        currentTrack={currentAudioTrack}
        onClose={() => setCurrentAudioTrack(null)}
        onAnalyzeWithAI={(text) => handleSpiritualInsightQuery(text)}
      />

      {/* Universal Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        onSpiritualInsightQuery={handleSpiritualInsightQuery}
      />

      {/* Profile & Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUser={(updated) => setUser(updated)}
      />

      {/* Feedback Modal */}
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5E0D5] px-2 py-1.5 flex items-center justify-around shadow-md">
        {[
          { id: "home", label: "Home", icon: Home },
          { id: "bible", label: "Bible", icon: BookOpen },
          { id: "journal", label: "Dreams AI", icon: Moon },
          { id: "spiritual-insight", label: "Doctrine", icon: Sparkles },
          { id: "encouragements", label: "Encourage", icon: MessageCircle },
          { id: "prayers", label: "Prayer", icon: Heart }
        ].map((btn) => {
          const Icon = btn.icon;
          const isActive = currentView === btn.id;

          return (
            <button
              key={btn.id}
              onClick={() => handleNavigate(btn.id)}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                isActive ? "text-[#C5A059]" : "text-[#8A8478] hover:text-[#2D2D2D]"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#C5A059]" : ""}`} />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
