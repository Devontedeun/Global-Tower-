import {
  UserProfile,
  UserRole,
  VerseBookmark,
  VerseHighlight,
  StudyNote,
  DreamEntry,
  VisionEntry,
  PrayerItem,
  FeedbackItem,
  Sermon,
  MinistryVideo,
  VideoWatchProgress,
  BibleStudyPlan,
  LiveEvent,
  CommunityPost,
  SpiritualJourneyMetrics,
  DayActivityStatus
} from "../types";
import {
  SERMONS_DATABASE,
  MINISTRY_VIDEOS_DATABASE,
  BIBLE_STUDY_PLANS,
  LIVE_EVENTS_DATABASE,
  COMMUNITY_POSTS_INITIAL,
  PRAYER_ITEMS_INITIAL
} from "../data/mockData";

export const FOUNDER_SUPERADMIN_EMAILS = [
  "info@globaltowerofchrist.com",
  "sangorichard@gmail.com",
  "sangodeyvin@gmail.com",
  "tmsamuralogistics@gmail.com",
  "samuraholdingsltd@gmail.com"
];

export function isSuperAdminEmail(email?: string): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  if (FOUNDER_SUPERADMIN_EMAILS.includes(clean)) return true;
  try {
    const raw = localStorage.getItem("gtc_local_user_accounts");
    if (raw) {
      const accounts = JSON.parse(raw);
      if (accounts[clean]?.profile?.role === "super_admin") return true;
    }
    const crmRaw = localStorage.getItem("gtc_crm_users");
    if (crmRaw) {
      const crm: UserProfile[] = JSON.parse(crmRaw);
      const found = crm.find((u) => u.email?.toLowerCase().trim() === clean);
      if (found?.role === "super_admin") return true;
    }
    const active = localStorage.getItem("gtc_active_session");
    if (active) {
      const parsed = JSON.parse(active);
      if (parsed?.profile?.email?.toLowerCase().trim() === clean && parsed?.profile?.role === "super_admin") return true;
    }
  } catch {}
  return false;
}

/**
 * Checks if the current browser session belongs to an authorized Admin / Super Admin.
 * Used to ensure Watchdog visual alerts, audio chimes, thunder haptics, and telemetry
 * are ONLY ever active for Super Admin accounts and NEVER visible or audible to regular users.
 */
export function isCurrentAdminUser(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const rawProfile = localStorage.getItem("gtc_user_profile") || localStorage.getItem("gtc_user");
    if (rawProfile) {
      const u = JSON.parse(rawProfile);
      if (
        u?.role === "super_admin" ||
        u?.role === "ministry_admin" ||
        u?.role === "admin" ||
        isSuperAdminEmail(u?.email)
      ) {
        return true;
      }
    }
    const session = localStorage.getItem("gtc_active_session") || localStorage.getItem("gtc_auth_session");
    if (session) {
      const s = JSON.parse(session);
      if (
        s?.profile?.role === "super_admin" ||
        s?.profile?.role === "ministry_admin" ||
        s?.profile?.role === "admin" ||
        s?.user?.role === "super_admin" ||
        isSuperAdminEmail(s?.profile?.email || s?.user?.email)
      ) {
        return true;
      }
    }
  } catch {}
  return false;
}

export const APOSTLE_SANGO_ADMIN: UserProfile = {
  id: "u-apostle-sango-admin",
  name: "Apostle R.Sango",
  username: "apostle_sango",
  firstName: "Apostle",
  lastName: "R.Sango",
  email: "info@globaltowerofchrist.com",
  role: "super_admin",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  interests: ["Bible Study", "Sermons", "Prayer", "Worship", "Dominion", "Victory", "Prophecy", "Dreams & Visions Interpretation", "Biblical Doctrine"],
  favoriteTeachers: ["Apostle R.Sango"],
  notificationPrefs: {
    dailyScripture: true,
    newSermons: true,
    bibleStudyReminders: true,
    liveEvents: true,
    prayerReminders: true,
    announcements: true,
  },
  privacyPrefs: {
    profilePublic: true,
    shareActivity: false,
    allowDirectMessages: true,
  },
  createdAt: "2026-08-01T00:00:00Z",
  isEarlyAccess: true,
};

export const BELOVED_BRETHREN_USER: UserProfile = {
  id: "u-beloved-brethren",
  name: "Beloved Brethren",
  username: "beloved_brethren",
  firstName: "Beloved",
  lastName: "Brethren",
  email: "brethren@globaltowerofchrist.org",
  role: "user",
  avatarUrl: "bg-[#C5A059]",
  interests: [],
  favoriteTeachers: [],
  notificationPrefs: {
    dailyScripture: true,
    newSermons: true,
    bibleStudyReminders: true,
    liveEvents: true,
    prayerReminders: true,
    announcements: true,
  },
  privacyPrefs: {
    profilePublic: false,
    shareActivity: false,
    allowDirectMessages: true,
  },
  createdAt: "2026-08-01T00:00:00Z",
  isEarlyAccess: true,
};

export const DEFAULT_USER: UserProfile = BELOVED_BRETHREN_USER;

const STORAGE_KEYS = {
  USER: "gtc_user_profile",
  BOOKMARKS: "gtc_verse_bookmarks",
  HIGHLIGHTS: "gtc_verse_highlights",
  NOTES: "gtc_study_notes",
  DREAMS: "gtc_dream_journal",
  VISIONS: "gtc_vision_journal",
  PRAYERS: "gtc_prayer_items",
  STUDY_PLANS: "gtc_study_plans",
  EVENTS: "gtc_live_events",
  SAVED_SERMONS: "gtc_saved_sermon_ids",
  FEEDBACK: "gtc_feedback_items",
  COMMUNITY: "gtc_community_posts",
  ONBOARDED: "gtc_has_onboarded",
  FONT_SIZE: "gtc_font_size",
  HIGH_CONTRAST: "gtc_high_contrast",
  LANGUAGE: "gtc_app_language",
  RECENT_READ: "gtc_recent_reading",
  VIDEOS: "gtc_ministry_videos",
  WATCH_PROGRESS: "gtc_watch_progress",
};

const defaultBookmarks = (): VerseBookmark[] => [];
const defaultHighlights = (): VerseHighlight[] => [];
const defaultNotes = (): StudyNote[] => [];
const defaultDreams = (): DreamEntry[] => [];
const defaultVisions = (): VisionEntry[] => [];
const defaultFeedback = (): FeedbackItem[] => [];

export const Storage = {
  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) return DEFAULT_USER;
      const parsed = JSON.parse(data);
      if (parsed) {
        const isFounder =
          parsed.email === "sangorichard@gmail.com" ||
          parsed.email === "info@globaltowerofchrist.com";
        if (isFounder) {
          parsed.role = "super_admin";
          if (!parsed.name || parsed.name === "Richard Sango" || parsed.name === "Deyvin Richard Jnr Sango") {
            parsed.name = "Apostle R.Sango";
            parsed.firstName = "Apostle";
            parsed.lastName = "R.Sango";
          }
        } else {
          parsed.role = "user";
        }
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return DEFAULT_USER;
    }
  },
  setUser(user: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  },

  hasOnboarded(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === "true";
    } catch {
      return true;
    }
  },
  setOnboarded(value: boolean) {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDED, value ? "true" : "false");
    } catch (e) {
      console.error(e);
    }
  },

  isMockDataCleared(): boolean {
    try {
      return localStorage.getItem("gtc_mock_data_cleared") === "true";
    } catch {
      return false;
    }
  },

  clearAllMockData(): void {
    this.initNewUserAccount();
  },

  /**
   * Initializes a completely pristine, empty slate for new accounts:
   * 0 bookmarks, 0 highlights, 0 notes, 0 dreams, 0 visions, 0 prayers,
   * 0 saved sermons, 0 chapters read, 0 audio minutes, 0 streak, 0 achievements.
   */
  initNewUserAccount(_uid?: string): void {
    try {
      localStorage.setItem("gtc_mock_data_cleared", "true");
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.VISIONS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.SAVED_SERMONS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.WATCH_PROGRESS, JSON.stringify({}));
      localStorage.setItem("gtc_chapters_read_set", JSON.stringify([]));
      localStorage.setItem("gtc_audio_minutes_total", "0");
      localStorage.setItem("gtc_activity_days_log", JSON.stringify({}));
      localStorage.setItem("gtc_reading_streaks", "0");
      localStorage.setItem("gtc_celebrated_achievements_v1", JSON.stringify([]));
      localStorage.removeItem(STORAGE_KEYS.RECENT_READ);
      localStorage.removeItem("gtc_recent_dream_scriptures");

      // Reset study plans to pristine 0% progress
      const pristinePlans = BIBLE_STUDY_PLANS.map((plan) => ({
        ...plan,
        isEnrolled: false,
        completedDays: 0,
        currentDay: 1,
        days: (plan.days || []).map((d) => ({
          ...d,
          isCompleted: false,
        })),
      }));
      localStorage.setItem(STORAGE_KEYS.STUDY_PLANS, JSON.stringify(pristinePlans));

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("gtc_data_cleared"));
        window.dispatchEvent(new CustomEvent("gtc_study_plans_updated"));
        window.dispatchEvent(new CustomEvent("gtc_notes_updated", { detail: [] }));
        window.dispatchEvent(new CustomEvent("gtc_dreams_updated", { detail: [] }));
        window.dispatchEvent(new CustomEvent("gtc_visions_updated", { detail: [] }));
        window.dispatchEvent(new CustomEvent("gtc_metrics_updated"));
      }
    } catch (e) {
      console.error("Error initializing clean new user account:", e);
    }
  },

  getBookmarks(): VerseBookmark[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (this.isMockDataCleared()) {
        if (!data) return [];
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      }
      if (!data) return defaultBookmarks();
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : defaultBookmarks();
    } catch {
      return this.isMockDataCleared() ? [] : defaultBookmarks();
    }
  },
  saveBookmark(bookmark: VerseBookmark) {
    const list = this.getBookmarks();
    const updated = [bookmark, ...(Array.isArray(list) ? list.filter(b => b && b.id !== bookmark.id) : [])];
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    this.recordActivity(`Bookmarked ${bookmark.book} ${bookmark.chapter}:${bookmark.verseNumber}`);
    return updated;
  },
  removeBookmark(id: string) {
    const list = this.getBookmarks();
    const updated = Array.isArray(list) ? list.filter(b => b && b.id !== id) : [];
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  },

  getHighlights(): VerseHighlight[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
      if (this.isMockDataCleared()) {
        if (!data) return [];
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      }
      if (!data) return defaultHighlights();
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : defaultHighlights();
    } catch {
      return this.isMockDataCleared() ? [] : defaultHighlights();
    }
  },
  saveHighlight(highlight: VerseHighlight) {
    const list = this.getHighlights();
    const updated = [highlight, ...(Array.isArray(list) ? list.filter(h => !(h && h.book === highlight.book && h.chapter === highlight.chapter && h.verseNumber === highlight.verseNumber)) : [])];
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(updated));
    this.recordActivity(`Highlighted ${highlight.book} ${highlight.chapter}:${highlight.verseNumber}`);
    return updated;
  },
  removeHighlight(book: string, chapter: number, verseNumber: number) {
    const list = this.getHighlights();
    const updated = Array.isArray(list) ? list.filter(h => !(h && h.book === book && h.chapter === chapter && h.verseNumber === verseNumber)) : [];
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(updated));
    return updated;
  },

  getNotes(): StudyNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (this.isMockDataCleared()) {
        if (!data) return [];
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      }
      if (!data) return defaultNotes();
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : defaultNotes();
    } catch {
      return this.isMockDataCleared() ? [] : defaultNotes();
    }
  },
  saveNote(note: StudyNote) {
    const list = this.getNotes();
    const updated = [note, ...(Array.isArray(list) ? list.filter(n => n && n.id !== note.id) : [])];
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));
    this.recordActivity(`Saved Scripture Note: ${note.title || "Study Note"}`);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gtc_notes_updated", { detail: updated }));
    }
    return updated;
  },
  deleteNote(id: string) {
    const list = this.getNotes();
    const updated = Array.isArray(list) ? list.filter(n => n && n.id !== id) : [];
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gtc_notes_updated", { detail: updated }));
    }
    return updated;
  },

  getDreams(): DreamEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DREAMS);
      const parsed = data ? JSON.parse(data) : null;
      const list = Array.isArray(parsed) ? parsed : (this.isMockDataCleared() ? [] : defaultDreams());
      return list.map(d => ({
        ...d,
        symbols: Array.isArray(d.symbols) ? d.symbols : [],
        emotions: Array.isArray(d.emotions) ? d.emotions : [],
        people: Array.isArray(d.people) ? d.people : []
      }));
    } catch {
      return this.isMockDataCleared() ? [] : defaultDreams();
    }
  },
  saveDream(dream: DreamEntry) {
    const list = this.getDreams();
    const updated = [dream, ...(Array.isArray(list) ? list.filter(d => d && d.id !== dream.id) : [])];
    localStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(updated));
    this.recordActivity(`Logged Spiritual Dream: ${dream.title || "Spiritual Dream"}`);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gtc_dreams_updated", { detail: updated }));
    }
    return updated;
  },
  deleteDream(id: string) {
    const list = this.getDreams();
    const updated = Array.isArray(list) ? list.filter(d => d && d.id !== id) : [];
    localStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(updated));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gtc_dreams_updated", { detail: updated }));
      window.dispatchEvent(new CustomEvent("gtc_metrics_updated"));
    }
    return updated;
  },

  getVisions(): VisionEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VISIONS);
      const parsed = data ? JSON.parse(data) : null;
      const list = Array.isArray(parsed) ? parsed : (this.isMockDataCleared() ? [] : defaultVisions());
      return list.map(v => ({
        ...v,
        scriptures: Array.isArray(v.scriptures) ? v.scriptures : []
      }));
    } catch {
      return this.isMockDataCleared() ? [] : defaultVisions();
    }
  },
  saveVision(vision: VisionEntry) {
    const list = this.getVisions();
    const updated = [vision, ...(Array.isArray(list) ? list.filter(v => v && v.id !== vision.id) : [])];
    localStorage.setItem(STORAGE_KEYS.VISIONS, JSON.stringify(updated));
    this.recordActivity(`Logged Prophetic Vision: ${vision.title || "Prophetic Vision"}`);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gtc_visions_updated", { detail: updated }));
    }
    return updated;
  },
  deleteVision(id: string) {
    const list = this.getVisions();
    const updated = Array.isArray(list) ? list.filter(v => v && v.id !== id) : [];
    localStorage.setItem(STORAGE_KEYS.VISIONS, JSON.stringify(updated));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gtc_visions_updated", { detail: updated }));
      window.dispatchEvent(new CustomEvent("gtc_metrics_updated"));
    }
    return updated;
  },

  getPrayers(): PrayerItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRAYERS);
      const parsed = data ? JSON.parse(data) : null;
      return Array.isArray(parsed) ? parsed : (this.isMockDataCleared() ? [] : PRAYER_ITEMS_INITIAL);
    } catch {
      return this.isMockDataCleared() ? [] : PRAYER_ITEMS_INITIAL;
    }
  },
  savePrayer(item: PrayerItem) {
    const list = this.getPrayers();
    const updated = [item, ...(Array.isArray(list) ? list.filter(p => p && p.id !== item.id) : [])];
    localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(updated));
    this.recordActivity(`Offered Prayer: ${item.title || "Intercessory Prayer"}`);
    return updated;
  },
  incrementPrayerCount(id: string) {
    const list = this.getPrayers();
    let prayerTitle = "Intercessory Prayer";
    const updated = (Array.isArray(list) ? list : []).map(p => {
      if (p && p.id === id) {
        prayerTitle = p.title || prayerTitle;
        const nextCount = (p.prayedCount || 0) + 1;
        return { ...p, prayedCount: nextCount, hasUserPrayed: true };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(updated));
    this.recordActivity(`Prayed with the Saints: ${prayerTitle}`);
    return updated;
  },

  getStudyPlans(): BibleStudyPlan[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_PLANS);
      const parsed = data ? JSON.parse(data) : null;
      if (!Array.isArray(parsed)) {
        return BIBLE_STUDY_PLANS;
      }

      // Reconcile cached progress with full canonical days so all 30 days and 14 days are always available
      const reconciled = BIBLE_STUDY_PLANS.map((canonicalPlan) => {
        const cachedPlan = parsed.find((p: any) => p.id === canonicalPlan.id);
        if (!cachedPlan) return canonicalPlan;

        // Map cached completion flags
        const completedDayNums = new Set<number>();
        if (Array.isArray(cachedPlan.days)) {
          cachedPlan.days.forEach((d: any) => {
            const num = d.dayNumber ?? d.day;
            if (d.isCompleted && num) completedDayNums.add(num);
          });
        }

        const days = canonicalPlan.days.map((d) => {
          const num = d.dayNumber ?? d.day;
          return {
            ...d,
            isCompleted: num ? completedDayNums.has(num) || !!d.isCompleted : !!d.isCompleted,
            assignedPassages: Array.isArray(d.assignedPassages) ? d.assignedPassages : d.scriptureRef ? [d.scriptureRef] : [],
            reflectionQuestions: Array.isArray(d.reflectionQuestions) ? d.reflectionQuestions : []
          };
        });

        const completedCount = days.filter((d) => d.isCompleted).length;

        return {
          ...canonicalPlan,
          isEnrolled: cachedPlan.isEnrolled !== undefined ? cachedPlan.isEnrolled : canonicalPlan.isEnrolled,
          currentDay: cachedPlan.currentDay || canonicalPlan.currentDay || 1,
          completedDays: completedCount,
          days
        };
      });

      localStorage.setItem(STORAGE_KEYS.STUDY_PLANS, JSON.stringify(reconciled));
      return reconciled;
    } catch {
      return BIBLE_STUDY_PLANS;
    }
  },
  saveStudyPlans(plans: BibleStudyPlan[]) {
    localStorage.setItem(STORAGE_KEYS.STUDY_PLANS, JSON.stringify(plans));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gtc_study_plans_updated", { detail: plans }));
      window.dispatchEvent(new CustomEvent("gtc_metrics_updated"));
    }
  },

  getEvents(): LiveEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const parsed = data ? JSON.parse(data) : null;
      return Array.isArray(parsed) ? parsed : LIVE_EVENTS_DATABASE;
    } catch {
      return LIVE_EVENTS_DATABASE;
    }
  },
  saveEvent(event: LiveEvent): LiveEvent[] {
    const list = this.getEvents();
    const updated = [event, ...(Array.isArray(list) ? list.filter(e => e && e.id !== event.id) : [])];
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updated));
    return updated;
  },
  updateEvent(id: string, updates: Partial<LiveEvent>): LiveEvent[] {
    const list = this.getEvents();
    const updated = (Array.isArray(list) ? list : []).map(e => {
      if (e && e.id === id) {
        return { ...e, ...updates };
      }
      return e;
    });
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updated));
    return updated;
  },
  convertLiveEventToReplay(eventId: string): { updatedEvents: LiveEvent[]; newSermon: Sermon } {
    const list = this.getEvents();
    const targetEvent = list.find(e => e.id === eventId);
    
    const now = new Date().toISOString();
    const updatedEvents = list.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          status: "completed" as const,
          recordingStatus: "ready" as const,
          recordedAt: now,
          replayApproved: true,
          requiresAdminReview: false,
          recordingDuration: e.recordingDuration || "45 mins",
        };
      }
      return e;
    });
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents));

    // Automatically create matching Sermon in Sermon Library if not exists
    const sermons = this.getSermons();
    const sermonId = `sermon-rec-${eventId}`;
    let newSermon: Sermon;
    
    const existing = sermons.find(s => s.id === sermonId);
    if (existing) {
      newSermon = existing;
    } else {
      newSermon = {
        id: sermonId,
        title: targetEvent ? targetEvent.title : "Live Ministry Replay",
        speaker: targetEvent ? targetEvent.speaker : "Richard Sango",
        speakerRole: targetEvent ? targetEvent.speakerRole : "Lead Minister",
        speakerAvatar: targetEvent?.speakerAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        category: targetEvent?.category || "Worship",
        duration: targetEvent?.recordingDuration || "45 mins",
        youtubeId: targetEvent?.youtubeId || "dQw4w9WgXcQ",
        description: targetEvent ? targetEvent.description : "Full unedited recording from live ministry fellowship.",
        scriptureReferences: targetEvent?.scriptureReferences || ["Romans 8:37"],
        takeaways: [
          "Standing firm in covenant dominion through Christ Jesus.",
          "Worship as our primary spiritual weapon and response of faith.",
          "Prayerful alignment with God's written Scripture."
        ],
        transcript: `Live ministry session streamed on ${new Date().toLocaleDateString()}. Speaker: ${targetEvent?.speaker}.`,
        publishedDate: now.split("T")[0],
        viewsCount: targetEvent?.attendeesCount || 350,
        savesCount: 45,
        approvalStatus: "published"
      };
      this.saveSermon(newSermon);
    }

    return { updatedEvents, newSermon };
  },
  toggleEventRegistration(id: string) {
    const list = this.getEvents();
    const updated = (Array.isArray(list) ? list : []).map(e => {
      if (e && e.id === id) {
        return {
          ...e,
          isRegistered: !e.isRegistered,
          attendeesCount: e.isRegistered ? (e.attendeesCount || 1) - 1 : (e.attendeesCount || 0) + 1
        };
      }
      return e;
    });
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updated));
    return updated;
  },

  getSermons(): Sermon[] {
    try {
      const data = localStorage.getItem("gtc_sermons_list");
      const parsed = data ? JSON.parse(data) : null;
      return Array.isArray(parsed) ? parsed : SERMONS_DATABASE;
    } catch {
      return SERMONS_DATABASE;
    }
  },
  saveSermon(sermon: Sermon): Sermon[] {
    const list = this.getSermons();
    const updated = [sermon, ...(Array.isArray(list) ? list.filter(s => s.id !== sermon.id) : [])];
    localStorage.setItem("gtc_sermons_list", JSON.stringify(updated));
    return updated;
  },

  getRecentDreamScriptures(): string[] {
    try {
      const data = localStorage.getItem("gtc_recent_dream_scriptures");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  recordDreamScriptures(references: string[]) {
    try {
      const current = this.getRecentDreamScriptures();
      const set = new Set([...references, ...current]);
      const trimmed = Array.from(set).slice(0, 50);
      localStorage.setItem("gtc_recent_dream_scriptures", JSON.stringify(trimmed));
    } catch (e) {
      console.error(e);
    }
  },

  getSavedSermonIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_SERMONS);
      const parsed = data ? JSON.parse(data) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  toggleSaveSermon(sermonId: string): string[] {
    const current = this.getSavedSermonIds();
    const safeCurrent = Array.isArray(current) ? current : [];
    const updated = safeCurrent.includes(sermonId)
      ? safeCurrent.filter(id => id !== sermonId)
      : [...safeCurrent, sermonId];
    localStorage.setItem(STORAGE_KEYS.SAVED_SERMONS, JSON.stringify(updated));
    return updated;
  },

  getFeedback(): FeedbackItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
      const parsed = data ? JSON.parse(data) : null;
      return Array.isArray(parsed) ? parsed : defaultFeedback();
    } catch {
      return defaultFeedback();
    }
  },
  addFeedback(item: FeedbackItem) {
    const list = this.getFeedback();
    const updated = [item, ...(Array.isArray(list) ? list : [])];
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(updated));
    return updated;
  },

  getCommunityPosts(): CommunityPost[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMMUNITY);
      const parsed = data ? JSON.parse(data) : null;
      return Array.isArray(parsed) ? parsed : COMMUNITY_POSTS_INITIAL;
    } catch {
      return COMMUNITY_POSTS_INITIAL;
    }
  },
  saveCommunityPost(post: CommunityPost) {
    const list = this.getCommunityPosts();
    const updated = [post, ...(Array.isArray(list) ? list.filter(p => p && p.id !== post.id) : [])];
    localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(updated));
    return updated;
  },

  getRecentReading(): { book: string; chapter: number; verse?: number } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_READ);
      return data ? JSON.parse(data) : { book: "Romans", chapter: 8, verse: 37 };
    } catch {
      return { book: "Romans", chapter: 8, verse: 37 };
    }
  },
  setRecentReading(reading: { book: string; chapter: number; verse?: number }) {
    localStorage.setItem(STORAGE_KEYS.RECENT_READ, JSON.stringify(reading));
  },

  // First-Party Ministry Videos
  getVideos(): MinistryVideo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      const parsed = data ? JSON.parse(data) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return MINISTRY_VIDEOS_DATABASE;
    } catch {
      return MINISTRY_VIDEOS_DATABASE;
    }
  },
  saveVideo(video: MinistryVideo): MinistryVideo[] {
    const list = this.getVideos();
    const updated = [video, ...list.filter((v) => v.id !== video.id)];
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated));
    return updated;
  },
  deleteVideo(videoId: string): MinistryVideo[] {
    const list = this.getVideos();
    const updated = list.filter((v) => v.id !== videoId);
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated));
    return updated;
  },

  // Video Watch Progress Tracking
  getAllWatchProgress(): Record<string, VideoWatchProgress> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCH_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },
  getWatchProgress(videoId: string): VideoWatchProgress | null {
    const all = this.getAllWatchProgress();
    return all[videoId] || null;
  },
  saveWatchProgress(progress: VideoWatchProgress) {
    try {
      const all = this.getAllWatchProgress();
      all[progress.videoId] = progress;
      localStorage.setItem(STORAGE_KEYS.WATCH_PROGRESS, JSON.stringify(all));
    } catch (e) {
      console.error("Failed to save video progress:", e);
    }
  },
  clearWatchProgress(videoId: string) {
    try {
      const all = this.getAllWatchProgress();
      delete all[videoId];
      localStorage.setItem(STORAGE_KEYS.WATCH_PROGRESS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },
  getContinueWatchingList(): { video: MinistryVideo; progress: VideoWatchProgress }[] {
    const videos = this.getVideos();
    const allProgress: Record<string, VideoWatchProgress> = this.getAllWatchProgress();
    const results: { video: MinistryVideo; progress: VideoWatchProgress }[] = [];

    (Object.values(allProgress) as VideoWatchProgress[]).forEach((prog) => {
      if (prog && prog.percentage > 2 && prog.percentage < 95 && !prog.completed) {
        const found = videos.find((v) => v.id === prog.videoId);
        if (found) {
          results.push({ video: found, progress: prog });
        }
      }
    });

    // Sort by most recently watched
    return results.sort(
      (a, b) => new Date(b.progress.lastWatchedAt).getTime() - new Date(a.progress.lastWatchedAt).getTime()
    );
  },
  getJoinedMembers(): UserProfile[] {
    try {
      const raw = localStorage.getItem("gtc_crm_users");
      const list: UserProfile[] = raw ? JSON.parse(raw) : [];
      // Add Apostle R.Sango to member list only if not explicitly revoked/deleted
      const hasAdmin = list.some(
        (u) =>
          u.email.toLowerCase() === "info@globaltowerofchrist.com" ||
          u.email.toLowerCase() === "sangorichard@gmail.com"
      );
      const isRevoked = this.isUserRevoked(APOSTLE_SANGO_ADMIN.id, APOSTLE_SANGO_ADMIN.email);
      if (!hasAdmin && !isRevoked) {
        list.unshift(APOSTLE_SANGO_ADMIN);
      }
      return list.filter((u) => !this.isUserRevoked(u.id, u.email));
    } catch {
      return this.isUserRevoked(APOSTLE_SANGO_ADMIN.id, APOSTLE_SANGO_ADMIN.email) ? [] : [APOSTLE_SANGO_ADMIN];
    }
  },
  isUsernameTaken(rawUsername: string, excludeUserId?: string): boolean {
    if (!rawUsername) return false;
    const clean = rawUsername.trim().toLowerCase().replace(/^@/, "");
    if (!clean) return false;

    // 1. Check CRM members
    const members = this.getJoinedMembers();
    const takenInCrm = members.some((m) => {
      if (excludeUserId && m.id === excludeUserId) return false;
      const mUser = (m.username || "").trim().toLowerCase().replace(/^@/, "");
      const mName = (m.name || "").trim().toLowerCase();
      return mUser === clean || mName === clean;
    });
    if (takenInCrm) return true;

    // 2. Check local user accounts
    try {
      const raw = localStorage.getItem("gtc_local_user_accounts");
      if (raw) {
        const accounts = JSON.parse(raw);
        for (const email of Object.keys(accounts)) {
          const acc = accounts[email];
          const accProfile = acc?.profile;
          if (accProfile) {
            if (excludeUserId && (accProfile.id === excludeUserId || acc?.user?.uid === excludeUserId)) continue;
            const uName = (accProfile.username || "").trim().toLowerCase().replace(/^@/, "");
            const fName = (accProfile.name || "").trim().toLowerCase();
            if (uName === clean || fName === clean) return true;
          }
        }
      }
    } catch {}

    // 3. Check active user
    const currentUser = this.getUser();
    if (currentUser && (!excludeUserId || currentUser.id !== excludeUserId)) {
      const curUser = (currentUser.username || "").trim().toLowerCase().replace(/^@/, "");
      if (curUser === clean) return true;
    }

    return false;
  },
  saveJoinedMember(member: UserProfile): UserProfile[] {
    try {
      const members = this.getJoinedMembers();
      const existingIdx = members.findIndex((m) => m.id === member.id || m.email.toLowerCase() === member.email.toLowerCase());
      if (existingIdx >= 0) {
        members[existingIdx] = { ...members[existingIdx], ...member };
      } else {
        members.unshift(member);
      }
      localStorage.setItem("gtc_crm_users", JSON.stringify(members));
      return members;
    } catch (e) {
      console.error("Could not save member to CRM list:", e);
      return [];
    }
  },
  deleteJoinedMember(idOrEmail: string): UserProfile[] {
    try {
      const target = (idOrEmail || "").toLowerCase().trim();
      const members = this.getJoinedMembers();
      const filtered = members.filter(
        (m) => m.id !== idOrEmail && m.email.toLowerCase().trim() !== target
      );
      localStorage.setItem("gtc_crm_users", JSON.stringify(filtered));
      return filtered;
    } catch (e) {
      console.error("Could not delete member from CRM list:", e);
      return [];
    }
  },
  revokeUser(id: string, email: string): void {
    try {
      const cleanEmail = (email || "").toLowerCase().trim();
      // Super admin / founder accounts can never be revoked or blocked
      if (isSuperAdminEmail(cleanEmail) || id === APOSTLE_SANGO_ADMIN.id) {
        return;
      }
      const revokedRaw = localStorage.getItem("gtc_revoked_users") || "[]";
      const revokedList: { id: string; email: string; revokedAt: string }[] = JSON.parse(revokedRaw);
      if (!revokedList.some((r) => (r.id && r.id === id) || (r.email && r.email === cleanEmail))) {
        revokedList.push({ id, email: cleanEmail, revokedAt: new Date().toISOString() });
        localStorage.setItem("gtc_revoked_users", JSON.stringify(revokedList));
      }
      this.deleteJoinedMember(id);
      if (cleanEmail) this.deleteJoinedMember(cleanEmail);
    } catch (e) {
      console.error("Error revoking user:", e);
    }
  },
  unrevokeUser(id?: string, email?: string): void {
    try {
      const revokedRaw = localStorage.getItem("gtc_revoked_users");
      if (!revokedRaw) return;
      const list: { id: string; email: string; revokedAt?: string }[] = JSON.parse(revokedRaw);
      const cleanEmail = (email || "").toLowerCase().trim();
      const filtered = list.filter(
        (r) => !(id && r.id === id) && !(cleanEmail && r.email?.toLowerCase().trim() === cleanEmail)
      );
      localStorage.setItem("gtc_revoked_users", JSON.stringify(filtered));
    } catch (e) {
      console.error("Error unrevoking user:", e);
    }
  },
  isUserRevoked(id?: string, email?: string): boolean {
    const cleanEmail = (email || "").toLowerCase().trim();
    // Super admins are NEVER revoked, even if their account was previously deleted
    if (isSuperAdminEmail(cleanEmail) || id === APOSTLE_SANGO_ADMIN.id) {
      this.unrevokeUser(id, cleanEmail);
      return false;
    }
    try {
      const revokedRaw = localStorage.getItem("gtc_revoked_users");
      if (!revokedRaw) return false;
      const list: { id: string; email: string }[] = JSON.parse(revokedRaw);
      return list.some(
        (r) => (id && r.id === id) || (cleanEmail && r.email?.toLowerCase().trim() === cleanEmail)
      );
    } catch {
      return false;
    }
  },
  clearNotes(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.NOTES);
    } catch (e) {
      console.error(e);
    }
  },
  clearDreams(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.DREAMS);
    } catch (e) {
      console.error(e);
    }
  },
  clearVisions(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.VISIONS);
    } catch (e) {
      console.error(e);
    }
  },
  clearBookmarks(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    } catch (e) {
      console.error(e);
    }
  },
  clearHighlights(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HIGHLIGHTS);
    } catch (e) {
      console.error(e);
    }
  },
  clearStudyProgress(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.STUDY_PLANS);
      localStorage.removeItem(STORAGE_KEYS.RECENT_READ);
      localStorage.removeItem("gtc_reading_streaks");
    } catch (e) {
      console.error(e);
    }
  },
  clearUserPrayers(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PRAYERS);
    } catch (e) {
      console.error(e);
    }
  },
  updateJoinedMemberRole(idOrEmail: string, newRole: UserRole): UserProfile[] {
    try {
      const target = (idOrEmail || "").toLowerCase().trim();
      const members = this.getJoinedMembers();
      const updated = members.map((m) => {
        if (m.id === idOrEmail || m.email.toLowerCase().trim() === target) {
          return { ...m, role: newRole };
        }
        return m;
      });
      localStorage.setItem("gtc_crm_users", JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error("Could not update member role in CRM:", e);
      return [];
    }
  },
  clearUser(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem("gtc_auth_session");
      localStorage.removeItem("gtc_active_session");
    } catch (e) {
      console.error(e);
    }
  },

  recordActivity(activity: string): void {
    try {
      const today = new Date().toISOString().split("T")[0];
      const raw = localStorage.getItem("gtc_activity_days_log");
      const log: Record<string, string[]> = raw ? JSON.parse(raw) : {};
      
      if (!log[today]) {
        log[today] = [];
      }
      if (!log[today].includes(activity)) {
        log[today].unshift(activity);
      }
      localStorage.setItem("gtc_activity_days_log", JSON.stringify(log));

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("gtc_metrics_updated"));
      }
    } catch (e) {
      console.error("Error recording daily activity:", e);
    }
  },

  recordChapterRead(book: string, chapter: number): void {
    try {
      const key = `${book} ${chapter}`;
      const raw = localStorage.getItem("gtc_chapters_read_set");
      const chapters: string[] = raw ? JSON.parse(raw) : [];
      if (!chapters.includes(key)) {
        chapters.push(key);
        localStorage.setItem("gtc_chapters_read_set", JSON.stringify(chapters));
      }
      this.recordActivity(`Read ${key}`);
    } catch (e) {
      console.error("Error recording chapter read:", e);
    }
  },

  recordAudioMinutes(additionalMinutes: number): void {
    try {
      const current = parseFloat(localStorage.getItem("gtc_audio_minutes_total") || "0");
      const updated = Math.round((current + additionalMinutes) * 10) / 10;
      localStorage.setItem("gtc_audio_minutes_total", updated.toString());
      this.recordActivity(`Listened to Scripture Audio (${additionalMinutes}m)`);
    } catch (e) {
      console.error("Error recording audio minutes:", e);
    }
  },

  getSpiritualMetrics(): SpiritualJourneyMetrics {
    const currentUser = this.getUser();

    // 1. Chapters Read - Comprehensive Entire App Scan
    // Aggregates: BibleHub reads, bookmarks, highlights, study notes, completed study plan scripture assignments
    const chaptersReadSet = new Set<string>();
    try {
      const raw = localStorage.getItem("gtc_chapters_read_set");
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          list.forEach((item) => {
            if (typeof item === "string" && item.trim()) chaptersReadSet.add(item.trim());
          });
        }
      }
    } catch {}

    // Scan bookmarks across the app
    const bookmarks = this.getBookmarks();
    bookmarks.forEach((bm) => {
      if (bm.book && bm.chapter) {
        chaptersReadSet.add(`${bm.book} ${bm.chapter}`.trim());
      }
    });

    // Scan highlights across the app
    const highlights = this.getHighlights();
    highlights.forEach((hl) => {
      if (hl.book && hl.chapter) {
        chaptersReadSet.add(`${hl.book} ${hl.chapter}`.trim());
      }
    });

    // Scan notes across the app
    const notes = this.getNotes();
    notes.forEach((nt) => {
      if (nt.book && nt.chapter) {
        chaptersReadSet.add(`${nt.book} ${nt.chapter}`.trim());
      }
    });

    // Scan completed study plan passages
    const studyPlans = this.getStudyPlans();
    studyPlans.forEach((plan) => {
      (plan.days || []).forEach((day) => {
        if (day.isCompleted) {
          const refs: string[] = [];
          if (Array.isArray(day.assignedPassages)) refs.push(...day.assignedPassages);
          if (day.scriptureRef) refs.push(day.scriptureRef);
          refs.forEach((ref) => {
            const match = ref.match(/^([0-9]?[a-zA-Z\s]+?)\s+([0-9]+)/);
            if (match) {
              const bookPart = match[1].trim();
              const chapPart = match[2].trim();
              chaptersReadSet.add(`${bookPart} ${chapPart}`);
            }
          });
        }
      });
    });

    // Persist verified unified set
    try {
      localStorage.setItem("gtc_chapters_read_set", JSON.stringify(Array.from(chaptersReadSet)));
    } catch {}

    const totalChaptersRead = chaptersReadSet.size;

    // 2. Audio Minutes - Authentic tracked listening duration across AudioPlayerBar and BibleHub
    let audioListeningMinutes = 0;
    try {
      const raw = localStorage.getItem("gtc_audio_minutes_total");
      if (raw) {
        audioListeningMinutes = Math.round(parseFloat(raw));
      }
    } catch {
      audioListeningMinutes = 0;
    }

    // 3. User Notes, Bookmarks, Highlights, Dreams & Visions
    const dreams = this.getDreams();
    const visions = this.getVisions();
    const prayers = this.getPrayers();

    const studyNotesCount = notes.length;
    const bookmarksCount = bookmarks.length;
    const highlightsCount = highlights.length;
    const dreamsVisionsLoggedCount = dreams.length + visions.length;

    // 4. Intercessory & Personal Prayers Offered - Full App Verification
    // Checks personal prayers, community posts prayed for, prayer responses, and activity log prayer entries
    let prayersOfferedCount = 0;
    const countedPrayerIds = new Set<string>();

    // Personal prayers
    prayers.forEach((p) => {
      if (p.hasUserPrayed) {
        prayersOfferedCount++;
        countedPrayerIds.add(p.id);
      }
      if (p.isUserCreated && !countedPrayerIds.has(p.id)) {
        prayersOfferedCount++;
        countedPrayerIds.add(p.id);
      }
    });

    // Community prayers in Prayer Hub
    try {
      const rawComm = localStorage.getItem("gtc_community_posts_v2");
      if (rawComm) {
        const commPosts: CommunityPost[] = JSON.parse(rawComm);
        if (Array.isArray(commPosts)) {
          commPosts.forEach((post) => {
            if (post.hasUserPrayed && !countedPrayerIds.has(post.id)) {
              prayersOfferedCount++;
              countedPrayerIds.add(post.id);
            }
            if (currentUser?.id && post.authorId === currentUser.id && !countedPrayerIds.has(post.id)) {
              prayersOfferedCount++;
              countedPrayerIds.add(post.id);
            }
            if (currentUser?.id && Array.isArray(post.prayerResponses)) {
              const myResponses = post.prayerResponses.filter((r) => r.authorId === currentUser.id);
              prayersOfferedCount += myResponses.length;
            }
          });
        }
      }
    } catch {}

    // 5. Study Plans Progress - Authentic count of completed curriculum days
    const enrolledPlans = studyPlans.filter((p) => p.isEnrolled || (p.completedDays && p.completedDays > 0));
    const studyPlansEnrolledCount = enrolledPlans.length;
    const studyPlanDaysCompleted = studyPlans.reduce((acc, p) => acc + (p.completedDays || 0), 0);

    // 6. Activity log & Authentic Streak calculation
    let activityLog: Record<string, string[]> = {};
    try {
      const raw = localStorage.getItem("gtc_activity_days_log");
      if (raw) {
        activityLog = JSON.parse(raw);
      }
    } catch {}

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyRhythm: DayActivityStatus[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const isToday = i === 0;
      const acts = activityLog[dateStr] || [];
      const hasActs = acts.length > 0;

      weeklyRhythm.push({
        dayName: dayNames[d.getDay()],
        dayLetter: dayNames[d.getDay()].charAt(0),
        dateString: dateStr,
        isToday,
        hasActivity: hasActs,
        activities: acts
      });
    }

    // Accurate calculation of current streak
    const isTodayActive = (activityLog[todayStr] || []).length > 0;
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const isYesterdayActive = (activityLog[yesterdayStr] || []).length > 0;

    let currentStreakDays = 0;
    if (isTodayActive || isYesterdayActive) {
      // Start counting from today if active, else from yesterday
      const startOffset = isTodayActive ? 0 : 1;
      for (let i = startOffset; i < 365; i++) {
        const checkDate = new Date(now);
        checkDate.setDate(checkDate.getDate() - i);
        const checkStr = checkDate.toISOString().split("T")[0];
        if (activityLog[checkStr] && activityLog[checkStr].length > 0) {
          currentStreakDays++;
        } else {
          break;
        }
      }
    }

    // Longest streak calculation
    let longestStreakDays = currentStreakDays;
    try {
      const activeDates = Object.keys(activityLog)
        .filter((k) => activityLog[k] && activityLog[k].length > 0)
        .sort();

      let tempStreak = 0;
      let prevDate: Date | null = null;
      activeDates.forEach((dateStr) => {
        const curDate = new Date(dateStr);
        if (prevDate) {
          const diffDays = Math.round((curDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            tempStreak++;
          } else if (diffDays > 1) {
            tempStreak = 1;
          }
        } else {
          tempStreak = 1;
        }
        prevDate = curDate;
        if (tempStreak > longestStreakDays) {
          longestStreakDays = tempStreak;
        }
      });
    } catch {}

    // 7. Overall Spiritual Milestone
    const totalEngagementScore =
      totalChaptersRead * 3 +
      studyNotesCount * 2 +
      prayersOfferedCount * 2 +
      studyPlanDaysCompleted * 4 +
      currentStreakDays * 2;

    let milestoneTitle = "Spiritual Disciple (Tier I)";
    let milestoneProgressPercent = 0;
    let nextMilestoneGoal = "Read scripture, pray, or listen to audio to begin your walk";

    if (totalEngagementScore >= 80) {
      milestoneTitle = "Kingdom Conqueror (Dominion & Victory)";
      milestoneProgressPercent = Math.min(100, Math.round((totalEngagementScore / 120) * 100));
      nextMilestoneGoal = "Maintaining spiritual authority & discipling the brethren";
    } else if (totalEngagementScore >= 45) {
      milestoneTitle = "Watchman on the Wall (Tier III)";
      milestoneProgressPercent = Math.min(95, Math.round(((totalEngagementScore - 45) / 35) * 100));
      nextMilestoneGoal = "Log 3 more study notes to achieve Kingdom Conqueror";
    } else if (totalEngagementScore >= 20) {
      milestoneTitle = "Scripture Scribe (Tier II)";
      milestoneProgressPercent = Math.min(95, Math.round(((totalEngagementScore - 20) / 25) * 100));
      nextMilestoneGoal = "Reach 7-day reading streak to reach Watchman on the Wall";
    } else if (totalEngagementScore > 0) {
      milestoneTitle = "Spiritual Disciple (Tier I)";
      milestoneProgressPercent = Math.min(95, Math.round((totalEngagementScore / 20) * 100));
      nextMilestoneGoal = "Earn 20 points through prayer and scripture study to reach Tier II";
    }

    return {
      currentStreakDays,
      longestStreakDays,
      totalChaptersRead,
      audioListeningMinutes,
      studyNotesCount,
      bookmarksCount,
      highlightsCount,
      prayersOfferedCount,
      studyPlansEnrolledCount,
      studyPlanDaysCompleted,
      dreamsVisionsLoggedCount,
      weeklyRhythm,
      milestoneTitle,
      milestoneProgressPercent,
      nextMilestoneGoal,
      lastActiveFormatted: isTodayActive ? "Today, Active" : "In Progress"
    };
  }
};
