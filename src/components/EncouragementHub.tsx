import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Volume2,
  Send,
  Plus,
  Bookmark,
  Check,
  Search,
  BookOpen,
  Pin,
  Calendar,
  User,
  Sliders,
  X,
  ShieldCheck,
  Copy
} from "lucide-react";
import { EncouragementMessage, UserProfile } from "../types";
import { INITIAL_ENCOURAGEMENTS } from "../data/encouragementsData";
import { AudioTrack } from "./AudioPlayerBar";
import { startSynchronousAudioPlayback, unlockAudio } from "../lib/audioVoiceHelper";
import { db } from "../lib/firebase";
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";

interface EncouragementHubProps {
  user: UserProfile;
  onPlayAudio?: (track: AudioTrack) => void;
  onNavigateToBible?: (book: string, chapter: number, verse?: number) => void;
  onAskAI?: (prompt: string) => void;
}

export const EncouragementHub: React.FC<EncouragementHubProps> = ({
  user,
  onPlayAudio,
  onNavigateToBible,
  onAskAI,
}) => {
  const [messages, setMessages] = useState<EncouragementMessage[]>(INITIAL_ENCOURAGEMENTS);
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [prayedIds, setPrayedIds] = useState<string[]>([]);

  // Compose form states
  const [title, setTitle] = useState("");
  const [messageText, setMessageText] = useState("");
  const [scriptureRef, setScriptureRef] = useState("");
  const [scriptureText, setScriptureText] = useState("");
  const [meaningText, setMeaningText] = useState("");
  const [prayerText, setPrayerText] = useState("");
  const [theme, setTheme] = useState<EncouragementMessage["theme"]>("faith");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Load from Firestore if available, fallback to local state
  useEffect(() => {
    try {
      const q = query(collection(db, "encouragements"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: EncouragementMessage[] = [];
            snapshot.forEach((docSnap) => {
              const d = docSnap.data();
              fetched.push({
                id: docSnap.id,
                title: d.title || "Daily Word of Life",
                message: d.message || "",
                scriptureRef: d.scriptureRef || "",
                scriptureText: d.scriptureText || "",
                meaning: d.meaning || "",
                prayer: d.prayer || "",
                theme: d.theme || "faith",
                authorName: d.authorName,
                authorRole: d.authorRole,
                authorId: d.authorId,
                date: d.date || new Date().toISOString().split("T")[0],
                createdAt: d.createdAt || new Date().toISOString(),
                likesCount: d.likesCount || 0,
                sharesCount: d.sharesCount || 0,
                pinned: d.pinned || false,
                audioText: d.audioText || d.message,
                tags: d.tags || []
              });
            });
            // Combine pinned and sorted messages
            const combined = [...fetched];
            // Merge with initials if needed
            INITIAL_ENCOURAGEMENTS.forEach((initMsg) => {
              if (!combined.some((m) => m.id === initMsg.id)) {
                combined.push(initMsg);
              }
            });
            setMessages(combined);
          }
        },
        (err) => {
          console.warn("Using offline encouragement messages data:", err.message);
        }
      );
      return () => unsubscribe();
    } catch {
      // Local fallback
    }
  }, []);

  const handleLike = async (id: string) => {
    const isLiked = likedIds.includes(id);
    const newLiked = isLiked ? likedIds.filter((x) => x !== id) : [...likedIds, id];
    setLikedIds(newLiked);

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === id) {
          return {
            ...msg,
            likesCount: Math.max(0, msg.likesCount + (isLiked ? -1 : 1)),
            hasLiked: !isLiked
          };
        }
        return msg;
      })
    );

    try {
      const msgDoc = doc(db, "encouragements", id);
      const target = messages.find((m) => m.id === id);
      if (target) {
        await updateDoc(msgDoc, {
          likesCount: Math.max(0, target.likesCount + (isLiked ? -1 : 1))
        });
      }
    } catch {
      // Firestore optional update
    }
  };

  const handlePrayAmen = (id: string) => {
    const isPrayed = prayedIds.includes(id);
    const newPrayed = isPrayed ? prayedIds.filter((x) => x !== id) : [...prayedIds, id];
    setPrayedIds(newPrayed);
    if (!isPrayed) {
      setNotificationMsg("Amen! Your prayer agreement has been lifted up in faith.");
    } else {
      setNotificationMsg("Prayer agreement updated.");
    }
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleCopyPrayer = (msg: EncouragementMessage) => {
    const prayerToCopy = msg.prayer || msg.message;
    const text = `🙏 Daily Prayer (${msg.scriptureRef}):\n\n"${prayerToCopy}"\n\n— Global Tower of Christ`;
    navigator.clipboard?.writeText(text);
    setNotificationMsg("Daily prayer copied to clipboard!");
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handlePlayPrayerAudio = (msg: EncouragementMessage) => {
    unlockAudio();
    const prayerTextToRead = msg.prayer || msg.message;
    const track: AudioTrack = {
      id: `prayer-${msg.id}`,
      title: `Prayer: ${msg.title}`,
      subtitle: `Guided Daily Prayer • ${msg.scriptureRef}`,
      textToRead: `Let us come before the Lord in prayer. ${prayerTextToRead}. In Jesus' mighty name, Amen.`
    };
    if (onPlayAudio) {
      onPlayAudio(track);
    } else {
      startSynchronousAudioPlayback(track);
    }
  };

  const handleCopy = (msg: EncouragementMessage) => {
    const shareText = `🕊️ "${msg.title}"\n\n📖 Scripture: ${msg.scriptureRef}\n"${msg.scriptureText}"\n\n💡 Biblical Meaning:\n${msg.meaning || msg.message}\n\n🙏 Daily Prayer:\n"${msg.prayer || ""}"\n\n— Daily Scripture & Prayer • Global Tower of Christ`;
    navigator.clipboard?.writeText(shareText);
    setCopiedId(msg.id);
    setNotificationMsg("Word of encouragement copied to clipboard!");
    setTimeout(() => {
      setCopiedId(null);
      setNotificationMsg(null);
    }, 3000);
  };

  const handleSaveToggle = (id: string) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((x) => x !== id));
      setNotificationMsg("Removed from saved reflections.");
    } else {
      setSavedIds([...savedIds, id]);
      setNotificationMsg("Saved to your personal reflection bookmarks.");
    }
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handlePlayMessageAudio = (msg: EncouragementMessage) => {
    unlockAudio();
    const narrationText = `${msg.title}. Scripture Promise from ${msg.scriptureRef}: "${msg.scriptureText}". Biblical Meaning: ${msg.meaning || msg.message}. Daily Prayer: ${msg.prayer || ""}`;
    const track: AudioTrack = {
      id: `enc-${msg.id}`,
      title: msg.title,
      subtitle: `Daily Promise • ${msg.scriptureRef}`,
      textToRead: narrationText
    };
    if (onPlayAudio) {
      onPlayAudio(track);
    } else {
      startSynchronousAudioPlayback(track);
    }
  };

  const handlePublishMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !scriptureRef.trim()) return;

    setIsSubmitting(true);
    const newMsg: EncouragementMessage = {
      id: `enc-${Date.now()}`,
      title: title.trim(),
      message: messageText.trim() || "Stand firm in the promises of God today.",
      scriptureRef: scriptureRef.trim(),
      scriptureText: scriptureText.trim() || "The Lord is faithful to all His promises.",
      meaning: meaningText.trim() || undefined,
      prayer: prayerText.trim() || undefined,
      theme,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      likesCount: 1,
      sharesCount: 0,
      pinned: user.role === "super_admin",
      audioText: `${title}. ${scriptureRef}: ${scriptureText}. Meaning: ${meaningText}. Prayer: ${prayerText}`,
      tags: [theme.toUpperCase(), "Scripture", "Daily Prayer"]
    };

    try {
      await addDoc(collection(db, "encouragements"), newMsg);
    } catch {
      // Local fallback
    }

    setMessages([newMsg, ...messages]);
    setIsSubmitting(false);
    setIsComposeOpen(false);
    setTitle("");
    setMessageText("");
    setScriptureRef("");
    setScriptureText("");
    setMeaningText("");
    setPrayerText("");
    setNotificationMsg("Daily scripture, meaning, and prayer published successfully!");
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Filter messages safely without relying on author names
  const filteredMessages = messages.filter((msg) => {
    const matchesTheme = selectedTheme === "all" || msg.theme === selectedTheme;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (msg.title && msg.title.toLowerCase().includes(q)) ||
      (msg.message && msg.message.toLowerCase().includes(q)) ||
      (msg.scriptureRef && msg.scriptureRef.toLowerCase().includes(q)) ||
      (msg.scriptureText && msg.scriptureText.toLowerCase().includes(q)) ||
      (msg.meaning && msg.meaning.toLowerCase().includes(q)) ||
      (msg.prayer && msg.prayer.toLowerCase().includes(q));
    return matchesTheme && matchesSearch;
  });

  const themesList = [
    { id: "all", label: "All Words" },
    { id: "victory", label: "Victory & Triumph" },
    { id: "peace", label: "Peace & Comfort" },
    { id: "strength", label: "Strength & Endurance" },
    { id: "faith", label: "Faith & Trust" },
    { id: "provision", label: "Provision & Favor" },
    { id: "healing", label: "Healing & Wholeness" }
  ];

  return (
    <div id="encouragement-hub" className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#2D2D2D] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-slideDown border border-[#C5A059]/40">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF6EE] rounded-bl-[160px] opacity-70 pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FDFCF9] border border-[#E5E0D5] text-xs font-bold text-[#C5A059] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Daily Rhema & Fellowship</span>
            </div>

            <span className="text-xs text-[#8A8478] font-medium font-serif italic">
              "Encourage one another daily, as long as it is called 'Today'" — Heb 3:13
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#2D2D2D] leading-tight">
            Words of Encouragement
          </h1>

          <p className="text-xs sm:text-sm text-[#7A7468] leading-relaxed font-sans max-w-3xl">
            A daily sanctuary where pastors, teachers, and brothers and sisters in Christ share uplifting text messages, biblical promises, and apostolic comfort to strengthen your walk every morning.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsComposeOpen(true)}
              className="bg-[#C5A059] hover:bg-[#B48F48] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md shadow-[#C5A059]/20 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Post Word of Encouragement</span>
            </button>

            {messages.length > 0 && onPlayAudio && (
              <button
                onClick={() => handlePlayMessageAudio(messages[0])}
                className="bg-[#FDFCF9] hover:bg-white text-[#2D2D2D] hover:text-[#C5A059] border border-[#E5E0D5] hover:border-[#C5A059] px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-2 shadow-2xs"
              >
                <Volume2 className="w-4 h-4 text-[#C5A059]" />
                <span>Listen Today's Rhema</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Compose Word of Encouragement Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1B18]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#FDFCF9] w-full max-w-2xl rounded-[32px] border border-[#E5E0D5] p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C5A059] text-white flex items-center justify-center font-bold">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#2D2D2D]">
                    Post a Word of Encouragement
                  </h3>
                  <p className="text-xs text-[#8A8478]">
                    Send an uplifting scripture message to bless the body of Christ today
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-2 rounded-full border border-[#E5E0D5] text-[#7A7468] hover:text-[#2D2D2D] hover:bg-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishMessage} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#4A4438] block mb-1.5">
                  Message Title / Theme Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Walking in Divine Peace During the Storm..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#E5E0D5] focus:border-[#C5A059] rounded-2xl text-xs sm:text-sm font-medium focus:outline-none transition-all placeholder:text-[#AAA498]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#4A4438] block mb-1.5">
                    Category Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E0D5] focus:border-[#C5A059] rounded-2xl text-xs font-medium focus:outline-none"
                  >
                    <option value="victory">Victory & Triumph</option>
                    <option value="peace">Peace & Comfort</option>
                    <option value="strength">Strength & Endurance</option>
                    <option value="faith">Faith & Trust</option>
                    <option value="provision">Provision & Favor</option>
                    <option value="healing">Healing & Wholeness</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#4A4438] block mb-1.5">
                    Single Scripture Reference *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Romans 8:37 or Isaiah 40:31"
                    value={scriptureRef}
                    onChange={(e) => setScriptureRef(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#E5E0D5] focus:border-[#C5A059] rounded-2xl text-xs sm:text-sm font-medium focus:outline-none transition-all placeholder:text-[#AAA498]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#4A4438] block mb-1.5">
                  The Scripture Verse Text *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 'No, in all these things we are more than conquerors through him who loved us.'"
                  value={scriptureText}
                  onChange={(e) => setScriptureText(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-[#E5E0D5] focus:border-[#C5A059] rounded-2xl text-xs font-medium focus:outline-none transition-all placeholder:text-[#AAA498]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#4A4438] block mb-1.5">
                  Biblical Meaning & Spiritual Reflection
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain the biblical context, spiritual meaning, and how to apply this truth today..."
                  value={meaningText}
                  onChange={(e) => setMeaningText(e.target.value)}
                  className="w-full p-3.5 bg-white border border-[#E5E0D5] focus:border-[#C5A059] rounded-2xl text-xs sm:text-sm leading-relaxed font-sans focus:outline-none transition-all resize-none placeholder:text-[#AAA498]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#4A4438] block mb-1.5 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>A Prayer People Can Pray *</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Write a heartfelt guided prayer that believers can pray out loud..."
                  value={prayerText}
                  onChange={(e) => setPrayerText(e.target.value)}
                  className="w-full p-3.5 bg-white border border-[#E5E0D5] focus:border-[#C5A059] rounded-2xl text-xs sm:text-sm leading-relaxed font-sans focus:outline-none transition-all resize-none placeholder:text-[#AAA498]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#4A4438] block mb-1.5">
                  Additional Daily Encouragement Word (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any additional pastoral words of encouragement..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full p-3.5 bg-white border border-[#E5E0D5] focus:border-[#C5A059] rounded-2xl text-xs sm:text-sm leading-relaxed font-sans focus:outline-none transition-all resize-none placeholder:text-[#AAA498]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D5]">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-5 py-2.5 bg-white border border-[#E5E0D5] text-[#7A7468] hover:text-[#2D2D2D] rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !scriptureRef.trim()}
                  className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#B48F48] disabled:opacity-50 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md shadow-[#C5A059]/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Posting..." : "Publish Daily Word"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-[24px] border border-[#E5E0D5] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by scripture, meaning, prayer, or theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F9F7F2] border border-[#E5E0D5] focus:border-[#C5A059] focus:bg-white rounded-full text-xs font-medium focus:outline-none transition-all placeholder:text-[#AAA498]"
            />
          </div>

          {/* Theme Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {themesList.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTheme(t.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTheme === t.id
                    ? "bg-[#C5A059] text-white shadow-xs"
                    : "bg-[#F9F7F2] text-[#7A7468] hover:bg-white hover:text-[#2D2D2D] border border-[#E5E0D5]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Encouragement Messages Stream */}
      <div className="space-y-6">
        {filteredMessages.length === 0 ? (
          <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-12 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF6EE] border border-[#E5E0D5] text-[#C5A059] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2D2D2D]">No Daily Words Found</h3>
            <p className="text-xs text-[#7A7468] max-w-md mx-auto">
              Be the first to post a daily scripture verse, meaning, and prayer for the saints today!
            </p>
            <button
              onClick={() => setIsComposeOpen(true)}
              className="mt-2 px-5 py-2 bg-[#C5A059] text-white text-xs font-bold rounded-full cursor-pointer hover:bg-[#B48F48] transition-colors"
            >
              Post Daily Word
            </button>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isLiked = likedIds.includes(msg.id) || msg.hasLiked;
            const isSaved = savedIds.includes(msg.id);
            const isPrayed = prayedIds.includes(msg.id);

            return (
              <div
                key={msg.id}
                id={`encouragement-${msg.id}`}
                className={`bg-white border rounded-[28px] p-6 sm:p-8 shadow-xs space-y-5 transition-all hover:border-[#C5A059]/60 ${
                  msg.pinned ? "border-[#C5A059]/50 bg-[#FDFCF9]" : "border-[#E5E0D5]"
                }`}
              >
                {/* Header: Sacred Badge & Date (No personal names) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E0D5]/70">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FAF6EE] border border-[#E5E0D5] flex items-center justify-center text-[#C5A059] shadow-2xs">
                      <Sparkles className="w-5 h-5 text-[#C5A059]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-[#2D2D2D] font-serif">
                          Daily Scripture Promise
                        </span>
                        {msg.pinned && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-[#2D2D2D] text-[#C5A059] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            <Pin className="w-3 h-3 text-[#C5A059]" /> Pinned Promise
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#8A8478] font-sans mt-0.5">
                        <Calendar className="w-3 h-3 text-[#C5A059]" />
                        <span>Daily Word • {msg.date}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider bg-[#FAF6EE] px-3 py-1 rounded-full border border-[#C5A059]/30">
                    Theme: {msg.theme}
                  </span>
                </div>

                {/* Title & Core Message */}
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-lg sm:text-2xl text-[#2D2D2D] leading-snug">
                    {msg.title}
                  </h3>

                  {msg.message && (
                    <p className="text-xs sm:text-sm text-[#4A4438] leading-relaxed font-sans whitespace-pre-line">
                      {msg.message}
                    </p>
                  )}

                  {/* 1. SINGLE SCRIPTURE VERSE */}
                  {msg.scriptureRef && (
                    <div className="p-5 bg-[#FAF6EE]/90 border border-[#C5A059]/40 rounded-2xl space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#C5A059] font-serif uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-[#C5A059]" />
                          Scripture Promise • {msg.scriptureRef}
                        </span>
                        {onNavigateToBible && (
                          <button
                            onClick={() => {
                              const parts = msg.scriptureRef.split(/[\s:]+/);
                              if (parts.length >= 2) {
                                const b = parts[0];
                                const c = parseInt(parts[1], 10) || 1;
                                onNavigateToBible(b, c);
                              }
                            }}
                            className="text-[11px] text-[#C5A059] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Open in Bible Hub</span>
                          </button>
                        )}
                      </div>
                      <p className="text-sm sm:text-base font-serif italic text-[#2D2D2D] leading-relaxed pl-3 border-l-2 border-[#C5A059]">
                        "{msg.scriptureText}"
                      </p>
                    </div>
                  )}

                  {/* 2. BIBLICAL MEANING & SPIRITUAL INSIGHT */}
                  {msg.meaning && (
                    <div className="p-5 bg-white border border-[#E5E0D5] rounded-2xl space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5 font-serif">
                          <Sparkles className="w-3.5 h-3.5" /> Biblical Meaning & Spiritual Reflection
                        </h4>
                        <span className="text-[10px] text-[#8A8478] font-medium bg-[#F9F7F2] px-2 py-0.5 rounded-full border border-[#E5E0D5]">
                          Scriptural Insight
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#4A4438] leading-relaxed font-sans">
                        {msg.meaning}
                      </p>
                    </div>
                  )}

                  {/* 3. A PRAYER PEOPLE CAN DO */}
                  {msg.prayer && (
                    <div className="p-5 bg-gradient-to-br from-[#FDFCF9] to-[#F9F7F2] rounded-2xl border border-[#E5E0D5] space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D] flex items-center gap-1.5 font-serif">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> A Prayer You Can Pray Today
                        </h4>
                        <span className="text-[10px] text-[#8A8478] font-medium italic">
                          Pray in Agreement
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-serif italic text-[#3A352C] leading-relaxed pl-3 border-l-2 border-[#C5A059]">
                        "{msg.prayer}"
                      </p>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#E5E0D5]/80">
                        <button
                          onClick={() => handlePrayAmen(msg.id)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                            isPrayed
                              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                              : "bg-white border-[#E5E0D5] text-[#2D2D2D] hover:border-[#C5A059] hover:text-[#C5A059]"
                          }`}
                        >
                          <Check className={`w-3.5 h-3.5 ${isPrayed ? "text-emerald-600 font-bold" : "text-[#C5A059]"}`} />
                          <span>{isPrayed ? "Amen! Prayed in Faith" : "Say Amen (Prayed This)"}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {onPlayAudio && (
                            <button
                              onClick={() => handlePlayPrayerAudio(msg)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E0D5] hover:border-[#C5A059] text-xs text-[#7A7468] hover:text-[#C5A059] font-medium transition-all cursor-pointer shadow-2xs"
                              title="Listen to this prayer read aloud"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                              <span>Listen Prayer</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleCopyPrayer(msg)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E0D5] hover:border-[#2D2D2D] text-xs text-[#7A7468] hover:text-[#2D2D2D] font-medium transition-all cursor-pointer shadow-2xs"
                            title="Copy prayer to pray or share"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Prayer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions: Like, Audio Listen, Copy, AI Insight */}
                <div className="pt-3 border-t border-[#E5E0D5]/70 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Like button */}
                    <button
                      onClick={() => handleLike(msg.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer font-semibold text-xs ${
                        isLiked
                          ? "bg-rose-50 border-rose-200 text-rose-700 font-bold"
                          : "bg-[#F9F7F2] border-[#E5E0D5] text-[#7A7468] hover:text-rose-600 hover:bg-white"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-600 text-rose-600" : ""}`} />
                      <span>{msg.likesCount} {msg.likesCount === 1 ? "Amen" : "Amens"}</span>
                    </button>

                    {/* Audio Narration */}
                    {onPlayAudio && (
                      <button
                        onClick={() => handlePlayMessageAudio(msg)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F9F7F2] hover:bg-white border border-[#E5E0D5] hover:border-[#C5A059] text-[#7A7468] hover:text-[#C5A059] font-medium transition-all cursor-pointer"
                        title="Listen to scripture, meaning, and prayer read aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span className="hidden sm:inline">Listen Word</span>
                      </button>
                    )}

                    {/* Save to bookmarks */}
                    <button
                      onClick={() => handleSaveToggle(msg.id)}
                      className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                        isSaved
                          ? "bg-[#C5A059] text-white border-[#C5A059]"
                          : "bg-[#F9F7F2] text-[#7A7468] hover:text-[#C5A059] border-[#E5E0D5]"
                      }`}
                      title={isSaved ? "Saved in bookmarks" : "Save reflection"}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>

                    {/* Share / Copy */}
                    <button
                      onClick={() => handleCopy(msg)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F9F7F2] hover:bg-white border border-[#E5E0D5] text-[#7A7468] hover:text-[#2D2D2D] font-medium transition-all cursor-pointer"
                      title="Copy complete word, scripture, meaning, and prayer"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{copiedId === msg.id ? "Copied" : "Copy Word"}</span>
                    </button>
                  </div>

                  {/* Ask AI Spiritual Insight on this word */}
                  {onAskAI && (
                    <button
                      onClick={() =>
                        onAskAI(
                          `Please explain the deeper biblical encouragement and spiritual application of this daily word: "${msg.title}" based on scripture ${msg.scriptureRef}: "${msg.scriptureText}".`
                        )
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] hover:text-[#B48F48] cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Ask AI Spiritual Insight →</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
