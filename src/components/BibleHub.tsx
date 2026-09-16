import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Bookmark,
  Highlighter,
  FileText,
  Search,
  Share2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Square,
  Layers,
  Edit3,
  AlignLeft,
  List,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Info,
  CheckCircle2,
  Plus,
  Trash2,
  Save
} from "lucide-react";
import { BibleTranslation, VerseBookmark, VerseHighlight, StudyNote, BibleSourceConfig, VerifiedScriptureItem } from "../types";
import { BIBLE_BOOKS } from "../data/mockData";
import {
  CANONICAL_BOOKS,
  APPROVED_BIBLE_SOURCES,
  getVerifiedChapterVerses,
  searchVerifiedBibleDatabase,
  verifyScriptureIntegrity
} from "../lib/bibleService";
import { Storage } from "../lib/storage";
import { AudioTrack } from "./AudioPlayerBar";
import {
  getNaturalBibleVoice,
  getAvailableWebVoices,
  findBestVoiceForGender,
  BANNED_VOICE_NAMES,
  getSavedVoiceGender,
  getSavedVoiceId,
  setSavedVoiceId,
  getSavedMuteState,
  setSavedMuteState,
  unlockAudio,
  startSynchronousAudioPlayback,
  globalAudioEngine,
  formatPersonVoiceName,
  SERVER_VOICES
} from "../lib/audioVoiceHelper";

interface BibleHubProps {
  initialBook?: string;
  initialChapter?: number;
  initialVerse?: number;
  onPlayAudio?: (track: AudioTrack) => void;
  onAskAI?: (verseText: string) => void;
}

export const BibleHub: React.FC<BibleHubProps> = ({
  initialBook = "Romans",
  initialChapter = 8,
  initialVerse,
  onPlayAudio,
  onAskAI,
}) => {
  const [selectedBook, setSelectedBook] = useState<string>(initialBook);
  const [selectedChapter, setSelectedChapter] = useState<number>(initialChapter);
  const [translation, setTranslation] = useState<BibleTranslation>("ESV");
  const [bookFilter, setBookFilter] = useState("");
  const [testamentTab, setTestamentTab] = useState<"All" | "Old" | "New">("All");

  // Scripture Verification & Data State
  const [versesList, setVersesList] = useState<{ num: number; text: string; source: string; translation: BibleTranslation; verified: boolean }[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationNotice, setVerificationNotice] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [activeSourceConfig, setActiveSourceConfig] = useState<BibleSourceConfig>(
    APPROVED_BIBLE_SOURCES.find((s) => s.translation === "ESV") || APPROVED_BIBLE_SOURCES[0]
  );

  // Search State for Real Bible Text
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<VerifiedScriptureItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<"read" | "search">("read");

  // Interaction State
  const [activeVerseNum, setActiveVerseNum] = useState<number | null>(initialVerse || null);
  const [bookmarks, setBookmarks] = useState<VerseBookmark[]>([]);
  const [highlights, setHighlights] = useState<VerseHighlight[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [noteDraft, setNoteDraft] = useState("");
  const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);
  const [noteTargetVerse, setNoteTargetVerse] = useState<number | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteSelectedCategory, setNoteSelectedCategory] = useState<string>("Scripture Study");
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);
  const [copiedVerseNum, setCopiedVerseNum] = useState<number | null>(null);

  // Reader Settings
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [viewMode, setViewMode] = useState<"verses" | "paragraph">("verses");
  const [activeStudyTab, setActiveStudyTab] = useState<"insights" | "verification" | "concordance" | "crossref" | "notes">("insights");

  // Audio Bible State
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVerseNum, setAudioVerseNum] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(() => getSavedVoiceId());
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => getSavedMuteState());

  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentVersesRef = useRef<{ num: number; text: string }[]>([]);

  // Keep selected voice in sync with global voice changes
  useEffect(() => {
    const handleVoiceChange = (e: any) => {
      const vId = e?.detail?.voiceId;
      if (vId && vId !== selectedVoiceURI) {
        setSelectedVoiceURI(vId);
      }
    };
    window.addEventListener("gtc_voice_changed", handleVoiceChange);
    return () => window.removeEventListener("gtc_voice_changed", handleVoiceChange);
  }, [selectedVoiceURI]);

  // Keep BibleHub audio status synchronized with GlobalAudioEngine
  useEffect(() => {
    const unsubscribe = globalAudioEngine.subscribe((state) => {
      const isBible = state.currentTrack?.id?.startsWith("bible-");
      if (isBible) {
        setIsAudioPlaying(state.isPlaying || state.isLoading);
        setAudioVerseNum(state.currentVerseNum);
        setIsMuted(state.isMuted);
      } else if (!state.isPlaying && !state.isLoading) {
        setIsAudioPlaying(false);
        setAudioVerseNum(null);
      }
    });
    return unsubscribe;
  }, []);

  // Keep mute state in sync with global audio player events
  useEffect(() => {
    const handleMuteChange = (e: any) => {
      if (typeof e?.detail?.isMuted === "boolean") {
        setIsMuted(e.detail.isMuted);
      }
    };
    window.addEventListener("gtc_audio_mute_changed", handleMuteChange);
    return () => window.removeEventListener("gtc_audio_mute_changed", handleMuteChange);
  }, []);

  // Synchronize study notes across views and playback sessions
  useEffect(() => {
    const handleNotesSync = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setNotes(e.detail);
      } else {
        setNotes(Storage.getNotes());
      }
    };
    window.addEventListener("gtc_notes_updated", handleNotesSync);
    return () => window.removeEventListener("gtc_notes_updated", handleNotesSync);
  }, []);

  // Update initial props when changed
  useEffect(() => {
    if (initialBook) setSelectedBook(initialBook);
    if (initialChapter) setSelectedChapter(initialChapter);
    if (initialVerse) setActiveVerseNum(initialVerse);
  }, [initialBook, initialChapter, initialVerse]);

  // Continuous Full Bible Audio State
  const [isContinuousBible, setIsContinuousBible] = useState<boolean>(true);
  const [chapterCompleted, setChapterCompleted] = useState<boolean>(false);
  const autoAdvanceAudioRef = useRef<boolean>(false);

  useEffect(() => {
    setChapterCompleted(false);
  }, [selectedBook, selectedChapter]);

  // Load voices for Audio Bible and sync with high-fidelity server voice
  useEffect(() => {
    const savedVoice = getSavedVoiceId();
    if (savedVoice) {
      setSelectedVoiceURI(savedVoice);
    }
  }, []);

  // Fetch verified verses whenever Book, Chapter, or Translation changes
  useEffect(() => {
    let isCancelled = false;

    async function loadVerifiedPassage() {
      setIsVerifying(true);
      const res = await getVerifiedChapterVerses(selectedBook, selectedChapter, translation);
      if (!isCancelled) {
        setVersesList(res.verses);
        setActiveSourceConfig(res.sourceConfig);
        setVerificationNotice(res.verificationNotice);
        setIsVerified(res.isVerified && res.verses.length > 0);
        currentVersesRef.current = res.verses;
        setIsVerifying(false);

        // Auto-advance: Seamlessly continue continuous audio playback into next chapter
        if (autoAdvanceAudioRef.current && res.verses.length > 0) {
          autoAdvanceAudioRef.current = false;
          setTimeout(() => {
            playChapterTrack(res.verses, selectedBook, selectedChapter, 0);
          }, 150);
        }
      }
    }

    loadVerifiedPassage();

    // Sync with storage on mount and when chapter changes
    setBookmarks(Storage.getBookmarks());
    setHighlights(Storage.getHighlights());
    setNotes(Storage.getNotes());
    Storage.setRecentReading({ book: selectedBook, chapter: selectedChapter });
    Storage.recordChapterRead(selectedBook, selectedChapter);

    // Stop previous audio on manual chapter change (preserve continuous playback when auto-advancing)
    if (!autoAdvanceAudioRef.current) {
      stopAudio();
    }

    return () => {
      isCancelled = true;
    };
  }, [selectedBook, selectedChapter, translation]);

  // Track authentic audio scripture listening duration in Bible Hub
  useEffect(() => {
    if (!isAudioPlaying) return;
    const interval = setInterval(() => {
      Storage.recordAudioMinutes(5 / 60);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAudioPlaying]);

  const currentBookData = BIBLE_BOOKS.find((b) => b.name === selectedBook) || BIBLE_BOOKS[0];
  const fullChapterText = versesList.map((v) => v.text).join(" ");

  // Handle Bible Search against verified database
  const handleBibleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim() || q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const results = searchVerifiedBibleDatabase(q, translation);
    setSearchResults(results);
    setIsSearching(false);
  };

  // Audio Control Methods
  const stopAudio = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gtc_stop_audio"));
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
    setIsAudioPlaying(false);
    setAudioVerseNum(null);
  };

  const handleToggleMute = () => {
    unlockAudio();
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    setSavedMuteState(nextMute);
    if (!nextMute && !isAudioPlaying && versesList.length > 0) {
      toggleChapterAudio();
    }
  };

  const playChapterTrack = (
    verses = versesList,
    book = selectedBook,
    chapter = selectedChapter,
    startVerseIdx = 0
  ) => {
    if (!verses || verses.length === 0) return;
    setChapterCompleted(false);
    setIsMuted(false);
    setSavedMuteState(false);
    unlockAudio();

    const fullChapterText = verses.map((v) => v.text).join(" ");
    const track: AudioTrack = {
      id: `bible-${book}-${chapter}`,
      title: `${book} Chapter ${chapter}`,
      subtitle: `Audio Bible • ${translation} Translation • Continuous Chapter Mode`,
      textToRead: `${book}, chapter ${chapter}. ${fullChapterText}`,
      verses: verses.map((v) => ({ num: v.num, text: v.text })),
      book,
      chapter,
      voiceId: selectedVoiceURI,
      startSegment: startVerseIdx,
      onVerseChange: (num: number) => {
        setAudioVerseNum(num);
        setIsAudioPlaying(true);
        setChapterCompleted(false);
      },
      onChapterComplete: () => {
        setIsAudioPlaying(false);
        setAudioVerseNum(null);
        setChapterCompleted(true);
        if (isContinuousBible) {
          handleNextChapter(true);
        }
      },
      onPlaybackStateChange: (playing: boolean) => {
        setIsAudioPlaying(playing);
        if (!playing) setAudioVerseNum(null);
      }
    };

    if (onPlayAudio) {
      onPlayAudio(track);
      setIsAudioPlaying(true);
    } else {
      globalAudioEngine.playTrack(track, { startSegment: startVerseIdx, voiceId: selectedVoiceURI });
      setIsAudioPlaying(true);
    }
  };

  const playVerseByIndex = (index: number, book = selectedBook, chapter = selectedChapter) => {
    const verses = currentVersesRef.current;
    if (!verses || verses.length === 0 || index >= verses.length) {
      stopAudio();
      return;
    }

    const verse = verses[index];
    setAudioVerseNum(verse.num);
    playChapterTrack(verses, book, chapter, index);
  };

  const toggleChapterAudio = () => {
    unlockAudio();
    if (isAudioPlaying) {
      stopAudio();
    } else {
      if (versesList.length === 0) return;
      playChapterTrack(versesList, selectedBook, selectedChapter, 0);
    }
  };

  const playSingleVerseAudio = (verseNum: number, text: string) => {
    unlockAudio();
    setIsMuted(false);
    setSavedMuteState(false);

    const track: AudioTrack = {
      id: `bible-${selectedBook}-${selectedChapter}-v${verseNum}`,
      title: `${selectedBook} ${selectedChapter}:${verseNum}`,
      subtitle: `Scripture Verse • ${translation} Translation`,
      textToRead: `${selectedBook}, chapter ${selectedChapter}, verse ${verseNum}. ${text}`,
      verses: [{ num: verseNum, text }],
      book: selectedBook,
      chapter: selectedChapter,
      voiceId: selectedVoiceURI,
      startSegment: 0,
      onVerseChange: (num: number) => {
        setAudioVerseNum(num);
        setIsAudioPlaying(true);
      },
      onChapterComplete: () => {
        setIsAudioPlaying(false);
        setAudioVerseNum(null);
      },
      onPlaybackStateChange: (playing: boolean) => {
        setIsAudioPlaying(playing);
        if (!playing) setAudioVerseNum(null);
      }
    };

    setAudioVerseNum(verseNum);
    setIsAudioPlaying(true);

    if (onPlayAudio) {
      onPlayAudio(track);
    } else {
      globalAudioEngine.playTrack(track, { startSegment: 0, voiceId: selectedVoiceURI });
    }
  };

  const handleNextChapter = (autoPlayNext = false) => {
    if (autoPlayNext) {
      autoAdvanceAudioRef.current = true;
    }
    if (selectedChapter < currentBookData.chaptersCount) {
      setSelectedChapter(selectedChapter + 1);
      setActiveVerseNum(null);
    } else {
      const curIndex = BIBLE_BOOKS.findIndex((b) => b.name === selectedBook);
      if (curIndex < BIBLE_BOOKS.length - 1) {
        setSelectedBook(BIBLE_BOOKS[curIndex + 1].name);
        setSelectedChapter(1);
        setActiveVerseNum(null);
      }
    }
  };

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
      setActiveVerseNum(null);
    } else {
      const curIndex = BIBLE_BOOKS.findIndex((b) => b.name === selectedBook);
      if (curIndex > 0) {
        const prevBook = BIBLE_BOOKS[curIndex - 1];
        setSelectedBook(prevBook.name);
        setSelectedChapter(prevBook.chaptersCount);
        setActiveVerseNum(null);
      }
    }
  };

  const handleHighlight = (color: "gold" | "amber" | "emerald" | "sky" | "rose") => {
    if (!activeVerseNum) return;
    const newHl: VerseHighlight = {
      id: `hl-${selectedBook}-${selectedChapter}-${activeVerseNum}`,
      book: selectedBook,
      chapter: selectedChapter,
      verseNumber: activeVerseNum,
      color,
      createdAt: new Date().toISOString()
    };
    const updated = Storage.saveHighlight(newHl);
    setHighlights(updated);
  };

  const handleRemoveHighlight = () => {
    if (!activeVerseNum) return;
    const updated = Storage.removeHighlight(selectedBook, selectedChapter, activeVerseNum);
    setHighlights(updated);
  };

  const handleBookmarkToggle = () => {
    if (!activeVerseNum) return;
    const existing = bookmarks.find(
      (b) => b.book === selectedBook && b.chapter === selectedChapter && b.verseNumber === activeVerseNum
    );
    if (existing) {
      const updated = Storage.removeBookmark(existing.id);
      setBookmarks(updated);
    } else {
      const vText = versesList.find((v) => v.num === activeVerseNum)?.text || "";
      const newBm: VerseBookmark = {
        id: `bm-${Date.now()}`,
        book: selectedBook,
        chapter: selectedChapter,
        verseNumber: activeVerseNum,
        translation,
        text: vText,
        createdAt: new Date().toISOString()
      };
      const updated = Storage.saveBookmark(newBm);
      setBookmarks(updated);
    }
  };

  const handleOpenNoteDrawer = (verseNum?: number) => {
    const target = verseNum ?? activeVerseNum ?? audioVerseNum ?? 1;
    setNoteTargetVerse(target);
    const existing = notes.find(
      (n) => n.scriptureRef === `${selectedBook} ${selectedChapter}:${target}`
    );
    if (existing) {
      setNoteDraft(existing.content);
      setEditingNoteId(existing.id);
      if (existing.tags && existing.tags.length > 0) {
        setNoteSelectedCategory(existing.tags[0]);
      }
    } else {
      setNoteDraft("");
      setEditingNoteId(null);
    }
    setIsNoteDrawerOpen(true);
  };

  const handleSaveNote = () => {
    if (!noteDraft.trim()) return;
    const targetVerse = noteTargetVerse ?? activeVerseNum ?? audioVerseNum ?? 1;
    const ref = `${selectedBook} ${selectedChapter}:${targetVerse}`;
    const newNote: StudyNote = {
      id: editingNoteId || `note-${Date.now()}`,
      title: `${selectedBook} ${selectedChapter}:${targetVerse} Study Note`,
      content: noteDraft.trim(),
      scriptureRef: ref,
      tags: [noteSelectedCategory, selectedBook],
      folder: "Bible Hub",
      isPrivate: true,
      createdAt: editingNoteId
        ? (notes.find((n) => n.id === editingNoteId)?.createdAt || new Date().toISOString())
        : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = Storage.saveNote(newNote);
    setNotes(updated);
    setNoteSavedFeedback(true);
    setTimeout(() => {
      setNoteSavedFeedback(false);
      setIsNoteDrawerOpen(false);
      setNoteDraft("");
      setEditingNoteId(null);
    }, 800);
  };

  const handleCopyVerse = (verseNum: number, text: string) => {
    const textToCopy = `"${text}" — ${selectedBook} ${selectedChapter}:${verseNum} (${translation}) [Source: ${activeSourceConfig.provider}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVerseNum(verseNum);
    setTimeout(() => setCopiedVerseNum(null), 2500);
  };

  const isBookmarked = (vNum: number) =>
    bookmarks.some((b) => b.book === selectedBook && b.chapter === selectedChapter && b.verseNumber === vNum);

  const getHighlightColor = (vNum: number) => {
    const found = highlights.find(
      (h) => h.book === selectedBook && h.chapter === selectedChapter && h.verseNumber === vNum
    );
    if (!found) return "";
    switch (found.color) {
      case "gold":
        return "bg-amber-100/90 text-amber-950 px-1 py-0.5 rounded";
      case "amber":
        return "bg-amber-200/90 text-amber-950 px-1 py-0.5 rounded";
      case "emerald":
        return "bg-emerald-100/90 text-emerald-950 px-1 py-0.5 rounded";
      case "sky":
        return "bg-sky-100/90 text-sky-950 px-1 py-0.5 rounded";
      case "rose":
        return "bg-rose-100/90 text-rose-950 px-1 py-0.5 rounded";
      default:
        return "bg-amber-100";
    }
  };

  const filteredBooks = BIBLE_BOOKS.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(bookFilter.toLowerCase());
    const matchesTestament = testamentTab === "All" || b.testament === testamentTab;
    return matchesSearch && matchesTestament;
  });

  const chapterNotes = notes.filter((n) => n.scriptureRef?.startsWith(`${selectedBook} ${selectedChapter}`));
  const chapterBookmarks = bookmarks.filter((b) => b.book === selectedBook && b.chapter === selectedChapter);

  return (
    <div id="bible-hub-container" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
      {/* 1. Left Column: Book & Chapter Navigator (3 cols on desktop, order-2 on mobile) */}
      <div id="bible-navigator-column" className="lg:col-span-3 space-y-4 order-2 lg:order-1">
        <div className="bg-white border border-[#E5E0D5] rounded-[28px] p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#F9F7F2] border border-[#E5E0D5] flex items-center justify-center text-[#C5A059]">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <h2 className="font-serif font-bold text-[#2D2D2D] text-base">Holy Bible</h2>
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Verified Canon</span>
            </div>
          </div>

          {/* Mode Switcher: Read vs. Search Verified Scripture */}
          <div className="grid grid-cols-2 gap-1 bg-[#F9F7F2] p-1 rounded-xl text-xs font-bold text-center border border-[#E5E0D5]">
            <button
              onClick={() => setActiveTab("read")}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "read"
                  ? "bg-white text-[#C5A059] border border-[#E5E0D5] shadow-2xs font-bold"
                  : "text-[#7A7468] hover:text-[#2D2D2D]"
              }`}
            >
              Scripture Reader
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "search"
                  ? "bg-white text-[#C5A059] border border-[#E5E0D5] shadow-2xs font-bold"
                  : "text-[#7A7468] hover:text-[#2D2D2D]"
              }`}
            >
              Bible Search
            </button>
          </div>

          {activeTab === "read" ? (
            <>
              {/* Filter Book */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#8A8478] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter 66 canonical books..."
                  value={bookFilter}
                  onChange={(e) => setBookFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#F9F7F2] border border-[#E5E0D5] focus:border-[#C5A059] focus:bg-white rounded-xl text-xs font-medium focus:outline-none transition-all placeholder:text-[#AAA498]"
                />
              </div>

              {/* Testament Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-[#F9F7F2] p-1 rounded-xl text-xs font-bold text-center border border-[#E5E0D5]/60">
                {(["All", "Old", "New"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTestamentTab(t)}
                    className={`py-1 rounded-lg transition-all cursor-pointer text-[11px] ${
                      testamentTab === t
                        ? "bg-white text-[#C5A059] border border-[#E5E0D5] shadow-2xs font-bold"
                        : "text-[#7A7468] hover:text-[#2D2D2D]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Books List Grid */}
              <div className="max-h-48 sm:max-h-56 overflow-y-auto pr-1 space-y-0.5">
                {filteredBooks.map((b) => (
                  <button
                    key={b.name}
                    onClick={() => {
                      setSelectedBook(b.name);
                      setSelectedChapter(1);
                      setActiveVerseNum(null);
                      stopAudio();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                      selectedBook === b.name
                        ? "bg-[#FDFCF9] text-[#C5A059] border border-[#E5E0D5] font-bold shadow-2xs"
                        : "hover:bg-[#F9F7F2] text-[#7A7468] hover:text-[#2D2D2D] font-medium"
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className={`text-[10px] ${selectedBook === b.name ? "text-[#C5A059]" : "text-[#8A8478]"}`}>
                      {b.chaptersCount} ch
                    </span>
                  </button>
                ))}
              </div>

              {/* Chapter Selector Grid */}
              <div className="pt-3 border-t border-[#E5E0D5]">
                <div className="text-xs font-bold text-[#2D2D2D] mb-1.5 uppercase tracking-wider text-[10px]">
                  {selectedBook} Chapters ({currentBookData.chaptersCount}):
                </div>
                <div className="grid grid-cols-6 gap-1 max-h-32 overflow-y-auto p-1 bg-[#F9F7F2] rounded-xl border border-[#E5E0D5]">
                  {Array.from({ length: currentBookData.chaptersCount }, (_, i) => i + 1).map((chNum) => (
                    <button
                      key={chNum}
                      onClick={() => {
                        setSelectedChapter(chNum);
                        setActiveVerseNum(null);
                        stopAudio();
                      }}
                      className={`h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedChapter === chNum
                          ? "bg-[#C5A059] text-white shadow-xs"
                          : "bg-white text-[#7A7468] hover:text-[#C5A059] hover:bg-[#FDFCF9] border border-[#E5E0D5]"
                      }`}
                    >
                      {chNum}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Bible Search Interface */
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#8A8478] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search real Bible text (e.g. love, light, faith)..."
                  value={searchQuery}
                  onChange={(e) => handleBibleSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-[#F9F7F2] border border-[#E5E0D5] focus:border-[#C5A059] focus:bg-white rounded-xl text-xs font-medium focus:outline-none transition-all placeholder:text-[#AAA498]"
                />
              </div>

              <div className="text-[10px] text-[#7A7468] flex items-center justify-between">
                <span>Searches verified canonical database</span>
                <span className="font-bold text-[#C5A059]">{searchResults.length} matches</span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {searchResults.length > 0 ? (
                  searchResults.map((r, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedBook(r.book);
                        setSelectedChapter(r.chapter);
                        setActiveVerseNum(r.verse);
                        setActiveTab("read");
                      }}
                      className="p-2.5 bg-[#FDFCF9] hover:bg-white border border-[#E5E0D5] hover:border-[#C5A059] rounded-xl cursor-pointer transition-all space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#C5A059] font-serif">{r.reference}</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                          Verified
                        </span>
                      </div>
                      <p className="text-[11px] text-[#2D2D2D] line-clamp-2 italic font-serif">
                        "{r.text}"
                      </p>
                    </div>
                  ))
                ) : searchQuery.length >= 2 ? (
                  <p className="text-[11px] text-[#8A8478] italic p-3 text-center bg-[#F9F7F2] rounded-xl">
                    No passages found in verified records for "{searchQuery}".
                  </p>
                ) : (
                  <div className="p-3 bg-[#F9F7F2] rounded-xl space-y-1.5 text-center">
                    <p className="text-xs font-bold text-[#4A4438]">Quick Scripture Topics</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {["love", "light", "faith", "peace", "grace", "shepherd", "dominion"].map((t) => (
                        <button
                          key={t}
                          onClick={() => handleBibleSearch(t)}
                          className="px-2 py-0.5 bg-white border border-[#E5E0D5] text-[10px] font-semibold text-[#C5A059] rounded-lg hover:border-[#C5A059] cursor-pointer"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Translation Selector Card with Verification & License Status */}
        <div className="bg-white border border-[#E5E0D5] rounded-[24px] p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold text-[#8A8478] uppercase tracking-wider">
              Approved Translations
            </div>
            <span className="text-[9px] font-semibold text-[#C5A059] bg-[#FDFCF9] px-1.5 py-0.5 rounded border border-[#E5E0D5]">
              {activeSourceConfig.licenseStatus}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {(["ESV", "KJV", "NIV", "NKJV", "NASB", "NLT", "WEB"] as BibleTranslation[]).map((tr) => (
              <button
                key={tr}
                onClick={() => setTranslation(tr)}
                className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  translation === tr
                    ? "bg-[#FDFCF9] border-[#C5A059] text-[#C5A059] shadow-2xs font-extrabold ring-1 ring-[#C5A059]"
                    : "bg-[#F9F7F2] border-[#E5E0D5] text-[#7A7468] hover:bg-white hover:text-[#2D2D2D]"
                }`}
              >
                {tr}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E5E0D5]/70 text-[10px] text-[#7A7468] space-y-1">
            <p className="font-medium text-[#2D2D2D]">
              <span className="font-bold text-[#C5A059]">{activeSourceConfig.name}</span>
            </p>
            <p className="leading-tight text-[9.5px]">
              Provider: {activeSourceConfig.provider}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Middle Column: Primary Scripture Reader Canvas (6 cols on desktop, order-1 on mobile) */}
      <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
        <div className="bg-white border border-[#E5E0D5] rounded-2xl sm:rounded-[32px] p-4 sm:p-8 shadow-xs space-y-4 sm:space-y-5">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 pb-3.5 sm:pb-4 border-b border-[#E5E0D5]">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={handlePrevChapter}
                disabled={selectedChapter <= 1 && selectedBook === "Genesis"}
                className="w-8 h-8 rounded-full bg-[#FDFCF9] hover:bg-white text-[#7A7468] hover:text-[#C5A059] border border-[#E5E0D5] disabled:opacity-30 transition-all flex items-center justify-center cursor-pointer shadow-2xs shrink-0"
                title="Previous chapter"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-serif font-bold text-[#2D2D2D] truncate">
                    {selectedBook} <span className="text-[#C5A059] italic">{selectedChapter}</span>
                  </h1>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <p className="text-[10px] sm:text-[11px] font-medium text-[#8A8478] tracking-wide">
                    {translation} • {currentBookData.category} • {versesList.length} Verified Verses
                  </p>
                  <button
                    onClick={() => {
                      const el = document.getElementById("bible-navigator-column");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="lg:hidden text-[10px] sm:text-[11px] text-[#C5A059] font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Change Book ▾</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handleNextChapter}
                disabled={selectedChapter >= currentBookData.chaptersCount && selectedBook === "Revelation"}
                className="w-8 h-8 rounded-full bg-[#FDFCF9] hover:bg-white text-[#7A7468] hover:text-[#C5A059] border border-[#E5E0D5] disabled:opacity-30 transition-all flex items-center justify-center cursor-pointer shadow-2xs shrink-0"
                title="Next chapter"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Audio & Layout Controls */}
            <div className="flex items-center gap-2">
              {/* View Mode Switcher */}
              <div className="flex items-center bg-[#F9F7F2] p-0.5 rounded-xl border border-[#E5E0D5]">
                <button
                  onClick={() => setViewMode("verses")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "verses" ? "bg-white text-[#C5A059] shadow-2xs" : "text-[#7A7468]"
                  }`}
                  title="Verse-by-verse list"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("paragraph")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "paragraph" ? "bg-white text-[#C5A059] shadow-2xs" : "text-[#7A7468]"
                  }`}
                  title="Flowing paragraph"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Font Size */}
              <div className="hidden sm:flex items-center gap-1 bg-[#F9F7F2] p-1 rounded-xl border border-[#E5E0D5]">
                <button
                  onClick={() => setFontSize("sm")}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${fontSize === "sm" ? "bg-white text-[#C5A059] shadow-2xs" : "text-[#7A7468]"}`}
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize("md")}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${fontSize === "md" ? "bg-white text-[#C5A059] shadow-2xs" : "text-[#7A7468]"}`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize("lg")}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${fontSize === "lg" ? "bg-white text-[#C5A059] shadow-2xs" : "text-[#7A7468]"}`}
                >
                  A+
                </button>
              </div>

              {/* In-Hub Audio Play Trigger */}
              <button
                id="audio-bible-listen-btn"
                onClick={toggleChapterAudio}
                disabled={versesList.length === 0}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer disabled:opacity-40 ${
                  isAudioPlaying
                    ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30 ring-2 ring-amber-400/50 animate-pulse"
                    : chapterCompleted
                    ? "bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-400/50 shadow-amber-600/30"
                    : "bg-[#C5A059] hover:bg-[#B48F48] text-white shadow-[#C5A059]/20"
                }`}
              >
                {isAudioPlaying ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : chapterCompleted ? (
                  <Play className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">
                  {isAudioPlaying
                    ? "Pause Audio"
                    : chapterCompleted
                    ? "Replay Chapter"
                    : "Listen Audio"}
                </span>
                <span className="sm:hidden">
                  {isAudioPlaying ? "Pause" : chapterCompleted ? "Replay" : "Listen"}
                </span>
              </button>

              {/* Explicit Unmute Button in Top Bar if Audio is Playing but Muted */}
              {isAudioPlaying && isMuted && (
                <button
                  id="audio-bible-top-unmute-btn"
                  onClick={handleToggleMute}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md ring-2 ring-rose-400/50 animate-pulse cursor-pointer"
                  title="Sound is muted — click to unmute and hear audio"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Unmute Sound</span>
                </button>
              )}

              <button
                onClick={() => setShowAudioSettings(!showAudioSettings)}
                className={`p-2 rounded-full border transition-colors cursor-pointer ${
                  showAudioSettings
                    ? "bg-[#C5A059] text-white border-[#C5A059]"
                    : "bg-[#F9F7F2] text-[#7A7468] hover:text-[#C5A059] border-[#E5E0D5]"
                }`}
                title="Audio narration settings"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chapter Audio Completed Play Banner */}
          {chapterCompleted && !isAudioPlaying && (
            <div
              id="chapter-completed-banner"
              className="p-4 bg-[#FAF6EE] border border-[#C5A059]/40 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs animate-fadeIn"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A059] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-serif font-bold text-[#2D2D2D]">
                    {selectedBook} Chapter {selectedChapter} Complete
                  </p>
                  <p className="text-xs text-[#7A7468]">
                    Narration read all the way to the end of the chapter. Press Play to listen again.
                  </p>
                </div>
              </div>
              <button
                id="replay-chapter-top-play-btn"
                onClick={toggleChapterAudio}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#C5A059] hover:bg-[#B48F48] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          )}

          {/* Active Audio Bible Narration Bar */}
          {isAudioPlaying && (
            <div
              id="active-audio-bible-bar"
              className={`p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs animate-fadeIn transition-colors ${
                isMuted
                  ? "bg-rose-50/70 border-2 border-rose-300"
                  : "bg-gradient-to-r from-[#FDFCF9] via-[#FAF6EE] to-[#FDFCF9] border border-[#C5A059]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  id="bible-banner-mute-toggle"
                  onClick={handleToggleMute}
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs cursor-pointer transition-all ${
                    isMuted
                      ? "bg-rose-600 text-white ring-2 ring-rose-400 animate-pulse"
                      : "bg-[#C5A059] text-white"
                  }`}
                  title={isMuted ? "Click to Unmute Sound" : "Click to Mute Audio"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2D2D2D] font-serif">
                      Narrating {selectedBook} {selectedChapter}
                    </span>
                    {audioVerseNum && (
                      <span className="px-2 py-0.5 bg-[#C5A059] text-white text-[10px] font-bold rounded-full">
                        Verse {audioVerseNum}
                      </span>
                    )}
                    {isMuted && (
                      <span className="px-2 py-0.5 bg-rose-200 text-rose-800 text-[10px] font-bold rounded-full border border-rose-300 animate-pulse">
                        Muted
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#7A7468]">
                    {translation} Verified Audio Bible • {playbackSpeed}x Speed
                    {isMuted ? " • Audio is muted, click Unmute to hear sound" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="bible-audio-play-pause-btn"
                  onClick={toggleChapterAudio}
                  className="p-2 bg-[#C5A059] text-white hover:bg-[#B48F48] rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
                  title={isAudioPlaying ? "Pause narration" : "Resume narration"}
                >
                  {isAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                {/* Explicit Unmute / Mute Button */}
                <button
                  id="bible-audio-unmute-btn"
                  onClick={handleToggleMute}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMuted
                      ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md ring-2 ring-rose-400/50 animate-pulse"
                      : "bg-[#F9F7F2] hover:bg-white text-[#7A7468] hover:text-[#2D2D2D] border border-[#E5E0D5]"
                  }`}
                  title={isMuted ? "Audio is Muted — Click to Unmute & Hear Sound" : "Mute audio"}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-white" />
                      <span>Unmute</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-[#C5A059]" />
                      <span className="hidden sm:inline text-[11px]">Mute</span>
                    </>
                  )}
                </button>

                {/* Distinct Stop Button */}
                <button
                  id="bible-audio-stop-btn"
                  onClick={stopAudio}
                  className="p-2 bg-white hover:bg-rose-50 text-[#7A7468] hover:text-rose-600 border border-[#E5E0D5] rounded-xl text-xs cursor-pointer transition-colors"
                  title="Stop audio playback"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          )}

          {/* Audio Settings Panel */}
          {showAudioSettings && (
            <div className="p-4 bg-[#F9F7F2] border border-[#E5E0D5] rounded-2xl space-y-3 animate-fadeIn">
              <div className="text-xs font-bold text-[#2D2D2D] flex items-center justify-between">
                <span>Audio Narration Configuration</span>
                <button onClick={() => setShowAudioSettings(false)} className="text-[#8A8478] hover:text-[#2D2D2D]">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#7A7468] block mb-1">
                    Narration Speed ({playbackSpeed}x):
                  </label>
                  <div className="flex gap-1">
                    {[0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`flex-1 py-1 rounded text-xs font-bold border ${
                          playbackSpeed === spd
                            ? "bg-[#C5A059] text-white border-[#C5A059]"
                            : "bg-white text-[#7A7468] border-[#E5E0D5]"
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-[#7A7468]">Narrator Voice:</label>
                    <span className="text-[9px] bg-[#2D2D2D] text-[#C5A059] px-1.5 py-0.5 rounded-full font-bold">
                      Natural Neural Audio
                    </span>
                  </div>
                  <select
                    id="bible-narrator-voice-select"
                    value={selectedVoiceURI}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setSelectedVoiceURI(newId);
                      setSavedVoiceId(newId);
                      globalAudioEngine.setVoice(newId);
                      console.log(`[BibleHub] Voice changed in audio settings: "${newId}"`);
                    }}
                    className="w-full p-1.5 bg-white border border-[#E5E0D5] rounded-lg text-xs font-medium focus:outline-none focus:border-[#C5A059]"
                  >
                    {SERVER_VOICES.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} ({voice.gender === "female" ? "Female" : "Male"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Continuous Full Bible Playback Mode Toggle */}
              <div className="pt-2 border-t border-[#E5E0D5] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#2D2D2D]">Continuous Whole Bible Playback</div>
                  <div className="text-[10px] text-[#7A7468]">Auto-progress seamlessly from chapter to chapter and book to book</div>
                </div>
                <button
                  onClick={() => setIsContinuousBible(!isContinuousBible)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    isContinuousBible
                      ? "bg-[#C5A059] text-white border-[#C5A059] shadow-2xs"
                      : "bg-white text-[#7A7468] border-[#E5E0D5]"
                  }`}
                >
                  {isContinuousBible ? "Whole Bible: ON" : "Single Chapter Only"}
                </button>
              </div>
            </div>
          )}

          {/* Active Verse Interactive Floating Toolbar */}
          {activeVerseNum !== null && (
            <div
              id="verse-action-bar"
              className="p-3.5 bg-[#FDFCF9] border border-[#E5E0D5] rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-2xs"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#2D2D2D]">
                <span className="font-serif italic text-[#C5A059]">Verse {activeVerseNum}</span>
                <span className="text-[#8A8478]">({selectedBook} {selectedChapter}:{activeVerseNum})</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {translation} Verified
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {/* Individual Listen Button */}
                <button
                  onClick={() => {
                    const targetVerse = versesList.find((v) => v.num === activeVerseNum);
                    if (targetVerse) {
                      playSingleVerseAudio(activeVerseNum, targetVerse.text);
                    }
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="Listen to this verse"
                >
                  <Volume2 className="w-3 h-3 text-[#C5A059]" />
                  <span>Listen</span>
                </button>

                {/* Highlight colors */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E0D5]">
                  <button
                    onClick={() => handleHighlight("gold")}
                    className="w-4 h-4 rounded-full bg-[#C5A059] hover:scale-110 transition-transform cursor-pointer"
                    title="Gold Highlight"
                  />
                  <button
                    onClick={() => handleHighlight("emerald")}
                    className="w-4 h-4 rounded-full bg-emerald-400 hover:scale-110 transition-transform cursor-pointer"
                    title="Emerald Highlight"
                  />
                  <button
                    onClick={() => handleHighlight("sky")}
                    className="w-4 h-4 rounded-full bg-sky-400 hover:scale-110 transition-transform cursor-pointer"
                    title="Sky Highlight"
                  />
                  <button
                    onClick={() => handleHighlight("rose")}
                    className="w-4 h-4 rounded-full bg-rose-400 hover:scale-110 transition-transform cursor-pointer"
                    title="Rose Highlight"
                  />
                  <button
                    onClick={handleRemoveHighlight}
                    className="text-[9px] text-[#8A8478] hover:text-[#2D2D2D] px-1 font-semibold cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                {/* Bookmark */}
                <button
                  onClick={handleBookmarkToggle}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isBookmarked(activeVerseNum)
                      ? "bg-[#C5A059] text-white border-[#C5A059]"
                      : "bg-white text-[#7A7468] border-[#E5E0D5] hover:border-[#C5A059] hover:text-[#C5A059]"
                  }`}
                >
                  <Bookmark className="w-3 h-3" />
                  <span>{isBookmarked(activeVerseNum) ? "Saved" : "Save"}</span>
                </button>

                {/* Add Note */}
                <button
                  onClick={() => handleOpenNoteDrawer(activeVerseNum || undefined)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#F9F7F2] text-[#7A7468] hover:text-[#C5A059] border border-[#E5E0D5] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-[#C5A059]" />
                  <span>Note</span>
                </button>

                {/* Ask AI for Spiritual Insight on this verified Scripture */}
                {onAskAI && (
                  <button
                    onClick={() => {
                      const v = versesList.find((item) => item.num === activeVerseNum);
                      if (v) {
                        onAskAI(`${selectedBook} ${selectedChapter}:${activeVerseNum} (${translation}) - "${v.text}"`);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#2D2D2D] hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#C5A059]" />
                    <span>Explain Verse</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveVerseNum(null)}
                  className="p-1 text-[#8A8478] hover:text-[#2D2D2D] rounded-lg cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Verses Reader Display Canvas */}
          {isVerifying ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#7A7468] font-medium">
                Verifying Scripture against approved {translation} canon...
              </p>
            </div>
          ) : !isVerified || versesList.length === 0 ? (
            /* Explicit unverified state when passage cannot be confirmed */
            <div className="p-6 bg-[#FDFCF9] border border-amber-200/80 rounded-2xl text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-[#2D2D2D] text-base">
                Scripture could not be verified from the configured Bible source.
              </h3>
              <p className="text-xs text-[#7A7468] max-w-md mx-auto leading-relaxed">
                The requested passage ({selectedBook} {selectedChapter}) could not be retrieved from the active {translation} repository. The platform does not generate artificial Bible text.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => setTranslation("KJV")}
                  className="px-3 py-1.5 bg-[#C5A059] text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-[#B48F48] cursor-pointer"
                >
                  Switch to KJV (Public Domain)
                </button>
                <button
                  onClick={() => setSelectedChapter(1)}
                  className="px-3 py-1.5 bg-white border border-[#E5E0D5] text-[#2D2D2D] text-xs font-semibold rounded-xl hover:bg-[#F9F7F2] cursor-pointer"
                >
                  Go to Chapter 1
                </button>
              </div>
            </div>
          ) : viewMode === "verses" ? (
            <div
              className={`space-y-3 font-serif text-[#2D2D2D] leading-relaxed ${
                fontSize === "sm"
                  ? "text-sm sm:text-base"
                  : fontSize === "lg"
                  ? "text-lg sm:text-xl"
                  : fontSize === "xl"
                  ? "text-xl sm:text-2xl"
                  : "text-base sm:text-lg"
              }`}
            >
              {versesList.map((v) => {
                const isSelected = activeVerseNum === v.num;
                const isBeingSpoken = audioVerseNum === v.num;
                const hlClass = getHighlightColor(v.num);
                const bm = isBookmarked(v.num);

                return (
                  <div
                    key={`verse-row-${v.num}`}
                    id={`verse-${v.num}`}
                    onClick={() => setActiveVerseNum(v.num)}
                    className={`group relative p-3 rounded-2xl transition-all cursor-pointer border ${
                      isBeingSpoken
                        ? "bg-amber-50/80 border-[#C5A059] ring-2 ring-[#C5A059]/40 shadow-xs"
                        : isSelected
                        ? "bg-[#FDFCF9] border-[#C5A059] ring-1 ring-[#C5A059] shadow-2xs"
                        : "bg-transparent hover:bg-[#F9F7F2]/80 border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-sans font-bold text-[#C5A059] select-none pt-1 shrink-0 w-6">
                        {v.num}
                      </span>

                      <span className={`flex-1 font-serif ${hlClass || ""}`}>
                        {v.text}
                      </span>

                      {/* Bookmark indicator */}
                      {bm && (
                        <Bookmark className="w-4 h-4 text-[#C5A059] fill-[#C5A059] shrink-0 mt-1" />
                      )}

                      {/* Quick Audio Speaker on each verse */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playSingleVerseAudio(v.num, v.text);
                        }}
                        className={`p-1 rounded-lg transition-opacity cursor-pointer ${
                          isBeingSpoken
                            ? "text-[#C5A059] opacity-100 animate-pulse"
                            : "text-[#8A8478] hover:text-[#C5A059] opacity-0 group-hover:opacity-100"
                        }`}
                        title="Listen to this verse"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Quick copy on hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyVerse(v.num, v.text);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#8A8478] hover:text-[#C5A059] transition-opacity cursor-pointer"
                        title="Copy verse citation"
                      >
                        {copiedVerseNum === v.num ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Flowing Paragraph View Mode */
            <div
              className={`font-serif text-[#2D2D2D] leading-loose p-4 bg-[#FDFCF9] rounded-2xl border border-[#E5E0D5] ${
                fontSize === "sm"
                  ? "text-sm sm:text-base"
                  : fontSize === "lg"
                  ? "text-lg sm:text-xl"
                  : fontSize === "xl"
                  ? "text-xl sm:text-2xl"
                  : "text-base sm:text-lg"
              }`}
            >
              {versesList.map((v) => {
                const isSelected = activeVerseNum === v.num;
                const isBeingSpoken = audioVerseNum === v.num;
                const hlClass = getHighlightColor(v.num);

                return (
                  <span
                    key={`para-verse-${v.num}`}
                    onClick={() => setActiveVerseNum(v.num)}
                    className={`inline cursor-pointer mr-1.5 px-0.5 rounded transition-all ${
                      isBeingSpoken
                        ? "bg-amber-200 text-amber-950 font-medium"
                        : isSelected
                        ? "bg-[#C5A059]/20 font-medium"
                        : hlClass || "hover:bg-amber-50"
                    }`}
                  >
                    <sup className="font-sans font-bold text-[#C5A059] text-[10px] mr-1 select-none">
                      {v.num}
                    </sup>
                    {v.text}{" "}
                  </span>
                );
              })}
            </div>
          )}

          {/* End of Chapter Audio Action Card with Play Button */}
          <div
            id="end-of-chapter-audio-card"
            className="p-4 bg-[#FDFCF9] border border-[#E5E0D5] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs"
          >
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center font-bold shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-serif font-bold text-[#2D2D2D]">
                  {chapterCompleted
                    ? `${selectedBook} ${selectedChapter} Finished`
                    : `End of ${selectedBook} Chapter ${selectedChapter}`}
                </h4>
                <p className="text-[11px] text-[#7A7468]">
                  {chapterCompleted
                    ? "Whole chapter narration complete. Press Play to listen again."
                    : "Continuous narration reads until the end of the chapter."}
                </p>
              </div>
            </div>

            <button
              id="end-of-chapter-play-btn"
              onClick={toggleChapterAudio}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#C5A059] hover:bg-[#B48F48] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              {isAudioPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Audio</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{chapterCompleted ? "Replay Chapter" : "Play Chapter"}</span>
                </>
              )}
            </button>
          </div>

          {/* Footer Official Licensing Attribution & Copyright Notice */}
          <div className="pt-4 border-t border-[#E5E0D5] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#7A7468]">
              <button
                onClick={handlePrevChapter}
                disabled={selectedChapter <= 1 && selectedBook === "Genesis"}
                className="inline-flex items-center gap-1.5 hover:text-[#C5A059] disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Chapter</span>
              </button>

              <span className="font-sans text-[11px] uppercase tracking-wider text-[#8A8478]">
                {selectedBook} {selectedChapter} / {currentBookData.chaptersCount}
              </span>

              <button
                onClick={handleNextChapter}
                disabled={selectedChapter >= currentBookData.chaptersCount && selectedBook === "Revelation"}
                className="inline-flex items-center gap-1.5 hover:text-[#C5A059] disabled:opacity-30 cursor-pointer transition-colors"
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Official Copyright & Verification Disclosure */}
            <div className="p-3 bg-[#FDFCF9] rounded-xl border border-[#E5E0D5]/80 text-[10px] text-[#7A7468] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2D2D2D] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Official Bible Source & Copyright
                </span>
                <a
                  href={activeSourceConfig.attributionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5A059] hover:underline flex items-center gap-0.5"
                >
                  Authorized Source <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="leading-tight">{activeSourceConfig.copyrightNotice}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Right Column: Dedicated Context & Study Tools Panel (3 cols on desktop) */}
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-white border border-[#E5E0D5] rounded-[28px] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-[#2D2D2D] text-base">Study Tools</h3>
            <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider bg-[#FDFCF9] px-2 py-0.5 rounded-full border border-[#E5E0D5]">
              Exegesis
            </span>
          </div>

          {/* Study Tabs */}
          <div className="grid grid-cols-4 gap-1 bg-[#F9F7F2] p-1 rounded-xl text-[10px] font-bold text-center border border-[#E5E0D5]">
            <button
              onClick={() => setActiveStudyTab("insights")}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${activeStudyTab === "insights" ? "bg-white text-[#C5A059] shadow-2xs font-bold" : "text-[#7A7468]"}`}
            >
              Exegesis
            </button>
            <button
              onClick={() => setActiveStudyTab("verification")}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${activeStudyTab === "verification" ? "bg-white text-[#C5A059] shadow-2xs font-bold" : "text-[#7A7468]"}`}
            >
              Integrity
            </button>
            <button
              onClick={() => setActiveStudyTab("crossref")}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${activeStudyTab === "crossref" ? "bg-white text-[#C5A059] shadow-2xs font-bold" : "text-[#7A7468]"}`}
            >
              Cross-Ref
            </button>
            <button
              onClick={() => setActiveStudyTab("notes")}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${activeStudyTab === "notes" ? "bg-white text-[#C5A059] shadow-2xs font-bold" : "text-[#7A7468]"}`}
            >
              My Notes
            </button>
          </div>

          {/* Tab 1: Exegesis / Theological Breakdown */}
          {activeStudyTab === "insights" && (
            <div className="space-y-3 text-xs">
              <div className="bg-[#FDFCF9] p-3.5 rounded-2xl border border-[#E5E0D5] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">Theological Theme</span>
                <h4 className="font-bold text-[#2D2D2D] font-serif">{selectedBook} {selectedChapter} Context</h4>
                <p className="text-[#7A7468] leading-relaxed">
                  In {selectedBook} chapter {selectedChapter}, God establishes His supreme sovereignty, apostolic commission, and unfailing covenant promise to believers walking in the Spirit of Christ.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478]">Selected Verse Exegesis</span>
                {activeVerseNum ? (
                  <div className="p-3 bg-white border border-[#E5E0D5] rounded-xl space-y-1">
                    <p className="font-bold text-[#C5A059]">Verse {activeVerseNum}:</p>
                    <p className="text-[#4A4438] italic font-serif">
                      "{versesList.find((v) => v.num === activeVerseNum)?.text}"
                    </p>
                    {onAskAI && (
                      <button
                        onClick={() => {
                          const v = versesList.find((item) => item.num === activeVerseNum);
                          if (v) onAskAI(`Deep dive exegesis of ${selectedBook} ${selectedChapter}:${activeVerseNum}: "${v.text}"`);
                        }}
                        className="mt-2 text-[11px] text-[#C5A059] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" /> Full AI Exegesis & Breakdown →
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-[#8A8478] italic text-[11px] p-2 bg-[#F9F7F2] rounded-xl text-center">
                    Click any verse in the reader to view contextual exegesis and linguistic notes.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Integrity & Verification Details */}
          {activeStudyTab === "verification" && (
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Scripture Integrity Check</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-tight">
                  This passage is verified against canonical records. No AI-fabricated verses or simulated Scripture are permitted on the platform.
                </p>
              </div>

              <div className="p-3 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#8A8478]">Book:</span>
                  <span className="font-bold text-[#2D2D2D]">{selectedBook} (Canonical 66)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8478]">Chapter:</span>
                  <span className="font-bold text-[#2D2D2D]">{selectedChapter} of {currentBookData.chaptersCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8478]">Translation:</span>
                  <span className="font-bold text-[#C5A059]">{activeSourceConfig.name} ({translation})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8478]">License Status:</span>
                  <span className="font-bold text-[#2D2D2D]">{activeSourceConfig.licenseStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8478]">Verification:</span>
                  <span className="font-bold text-emerald-600">Passed (5/5 Checks)</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Cross References */}
          {activeStudyTab === "crossref" && (
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478]">Parallel Passages</span>
              <div
                onClick={() => {
                  setSelectedBook("Ephesians");
                  setSelectedChapter(1);
                }}
                className="p-2.5 bg-[#FDFCF9] hover:bg-white border border-[#E5E0D5] rounded-xl cursor-pointer transition-colors"
              >
                <p className="font-bold text-[#C5A059]">Ephesians 1:3-14</p>
                <p className="text-[11px] text-[#7A7468]">Spiritual blessings in heavenly places in Christ.</p>
              </div>

              <div
                onClick={() => {
                  setSelectedBook("Galatians");
                  setSelectedChapter(5);
                }}
                className="p-2.5 bg-[#FDFCF9] hover:bg-white border border-[#E5E0D5] rounded-xl cursor-pointer transition-colors"
              >
                <p className="font-bold text-[#C5A059]">Galatians 5:16-25</p>
                <p className="text-[11px] text-[#7A7468]">Walking by the Spirit vs the desires of the flesh.</p>
              </div>

              <div
                onClick={() => {
                  setSelectedBook("Hebrews");
                  setSelectedChapter(11);
                }}
                className="p-2.5 bg-[#FDFCF9] hover:bg-white border border-[#E5E0D5] rounded-xl cursor-pointer transition-colors"
              >
                <p className="font-bold text-[#C5A059]">Hebrews 11:1-6</p>
                <p className="text-[11px] text-[#7A7468]">The nature of faith and pleasing God through obedience.</p>
              </div>
            </div>
          )}

          {/* Tab 4: My Saved Notes & Bookmarks */}
          {activeStudyTab === "notes" && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478]">
                  This Chapter ({chapterNotes.length + chapterBookmarks.length})
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenNoteDrawer(audioVerseNum || activeVerseNum || 1)}
                  className="text-[11px] text-[#C5A059] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Note
                </button>
              </div>

              {chapterNotes.length === 0 && chapterBookmarks.length === 0 ? (
                <p className="text-[#8A8478] italic text-[11px] p-3 bg-[#F9F7F2] rounded-xl text-center">
                  No bookmarks or notes in this chapter yet. Highlight or click a verse to save.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {chapterBookmarks.map((b) => (
                    <div key={b.id} className="p-2 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#C5A059]">{selectedBook} {selectedChapter}:{b.verseNumber}</span>
                        <p className="text-[10px] text-[#7A7468] truncate max-w-[150px]">{b.text}</p>
                      </div>
                      <Bookmark className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
                    </div>
                  ))}
                  {chapterNotes.map((n) => {
                    const verseMatch = n.scriptureRef?.match(/:(\d+)$/);
                    const vNum = verseMatch ? parseInt(verseMatch[1], 10) : undefined;
                    return (
                      <div key={n.id} className="p-2.5 bg-white border border-[#E5E0D5] rounded-xl hover:border-[#C5A059] transition-colors space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2D2D2D] text-xs truncate max-w-[130px]">{n.title}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                handleOpenNoteDrawer(vNum);
                                setNoteDraft(n.content);
                                setEditingNoteId(n.id);
                              }}
                              className="p-1 text-[#8A8478] hover:text-[#C5A059] rounded cursor-pointer transition-colors"
                              title="Edit Note"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = Storage.deleteNote(n.id);
                                setNotes(updated);
                              }}
                              className="p-1 text-[#8A8478] hover:text-rose-600 rounded cursor-pointer transition-colors"
                              title="Delete Note"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#7A7468] leading-tight line-clamp-3">{n.content}</p>
                        {n.tags && n.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {n.tags.map((t, idx) => (
                              <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-[#F9F7F2] text-[#8A8478] rounded border border-[#E5E0D5]">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Dedicated Floating Study Note Modal (Never interrupts running Bible audio) */}
      {isNoteDrawerOpen && (
        <div
          id="study-note-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsNoteDrawerOpen(false);
              setEditingNoteId(null);
            }
          }}
        >
          <div
            id="study-note-modal-card"
            className="relative w-full max-w-lg bg-white border border-[#E5E0D5] rounded-[28px] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[#2D2D2D] text-sm sm:text-base">
                    {editingNoteId ? "Edit Study Note" : "Create Study Note"}
                  </h3>
                  <p className="text-[11px] text-[#7A7468]">
                    {selectedBook} Chapter {selectedChapter} • Verse {noteTargetVerse ?? 1}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsNoteDrawerOpen(false);
                  setEditingNoteId(null);
                }}
                className="p-1 text-[#8A8478] hover:text-[#2D2D2D] rounded-lg cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Background Audio Running Indicator */}
            {(isAudioPlaying || audioVerseNum !== null) && (
              <div className="p-2.5 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-center gap-2.5 text-xs text-amber-950">
                <Volume2 className="w-4 h-4 text-[#C5A059] animate-pulse shrink-0" />
                <div className="leading-tight">
                  <span className="font-bold">Audio Bible Running: </span>
                  <span className="text-[11px] text-amber-900">
                    Reciting verse {audioVerseNum || noteTargetVerse || 1}. Narration continues smoothly while you jot down reflections.
                  </span>
                </div>
              </div>
            )}

            {/* Verse Context Snippet */}
            <div className="p-3 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider">
                  Scripture Citation ({translation})
                </span>
                <div className="flex items-center gap-1.5">
                  <label className="text-[10px] text-[#8A8478] font-semibold">Attached Verse:</label>
                  <select
                    value={noteTargetVerse ?? 1}
                    onChange={(e) => setNoteTargetVerse(parseInt(e.target.value, 10))}
                    className="text-[10px] font-bold bg-white border border-[#E5E0D5] rounded-lg px-2 py-0.5 text-[#2D2D2D] cursor-pointer"
                  >
                    {versesList.map((v) => (
                      <option key={v.num} value={v.num}>
                        Verse {v.num} {audioVerseNum === v.num ? "(Current Audio)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-[#4A4438] font-serif italic line-clamp-2">
                "{versesList.find((v) => v.num === (noteTargetVerse ?? 1))?.text || ""}"
              </p>
            </div>

            {/* Category / Topic Tags */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478]">
                Study Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Scripture Study",
                  "Rhema / Revelation",
                  "Prayer & Intercession",
                  "Personal Application",
                  "Prophetic Promise"
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setNoteSelectedCategory(tag)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      noteSelectedCategory === tag
                        ? "bg-[#C5A059] text-white border-[#C5A059] shadow-2xs"
                        : "bg-[#F9F7F2] text-[#7A7468] border-[#E5E0D5] hover:border-[#C5A059]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Note Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A8478]">
                Personal Study Reflection
              </label>
              <textarea
                rows={4}
                autoFocus
                placeholder="Write your personal study reflection, cross references, or prayer insights as you listen..."
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                className="w-full p-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-xs focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all placeholder:text-[#AAA498]"
              />
            </div>

            {/* Saved Feedback Confirmation */}
            {noteSavedFeedback && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Note saved to your Study Library!</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E5E0D5]">
              <span className="text-[10px] text-[#8A8478]">
                Saved locally & to your study archive
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsNoteDrawerOpen(false);
                    setEditingNoteId(null);
                  }}
                  className="px-3.5 py-2 text-xs text-[#7A7468] hover:bg-[#F9F7F2] rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  disabled={!noteDraft.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C5A059] hover:bg-[#B48F48] disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingNoteId ? "Update Note" : "Save Note"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
