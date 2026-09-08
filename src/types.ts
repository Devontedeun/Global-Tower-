export type UserRole =
  | "super_admin"
  | "ministry_admin"
  | "content_manager"
  | "teacher"
  | "moderator"
  | "event_manager"
  | "user";

export type BibleTranslation = "ESV" | "NIV" | "KJV" | "NKJV" | "NASB" | "NLT" | "WEB";

export interface BibleSourceConfig {
  id: string;
  translation: BibleTranslation;
  name: string;
  provider: string;
  apiSource: string;
  licenseStatus: "Public Domain" | "Authorized Educational Quotation" | "Licensed Cloud API";
  copyrightNotice: string;
  attributionUrl: string;
  isPublicDomain: boolean;
  enabled: boolean;
  lastVerification: string;
  status: "verified" | "warning" | "offline";
  latencyMs: number;
}

export interface ScriptureVerification {
  isValid: boolean;
  book: string;
  chapter: number;
  verse?: number;
  endVerse?: number;
  translation: BibleTranslation;
  source: string;
  license: string;
  verifiedAt: string;
  text?: string;
  errorMessage?: string;
}

export interface VerifiedScriptureItem {
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: BibleTranslation;
  source: string;
  license: string;
  verified: boolean;
  context: string;
}

export interface UserProfile {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  country?: string;
  role: UserRole;
  avatarUrl?: string;
  interests: string[];
  favoriteTeachers: string[];
  notificationPrefs: {
    dailyScripture: boolean;
    newSermons: boolean;
    bibleStudyReminders: boolean;
    liveEvents: boolean;
    prayerReminders: boolean;
    announcements: boolean;
  };
  privacyPrefs: {
    profilePublic: boolean;
    shareActivity: boolean;
    allowDirectMessages: boolean;
  };
  createdAt: string;
  isEarlyAccess?: boolean;
}

export interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verseNumber: number;
  text: string;
  translation: BibleTranslation;
}

export interface BibleBook {
  name: string;
  testament: "Old" | "New";
  chaptersCount: number;
  category: "Gospels" | "Epistles" | "Wisdom" | "Prophets" | "Pentateuch" | "History" | "Revelation";
}

export interface VerseHighlight {
  id: string;
  book: string;
  chapter: number;
  verseNumber: number;
  color: "gold" | "amber" | "emerald" | "sky" | "rose";
  createdAt: string;
}

export interface VerseBookmark {
  id: string;
  book: string;
  chapter: number;
  verseNumber: number;
  translation: BibleTranslation;
  text: string;
  collection?: string;
  createdAt: string;
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  scriptureRef?: string;
  tags: string[];
  folder: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export type VideoStorageCategory =
  | "sermons"
  | "bible-studies"
  | "interviews"
  | "worship"
  | "live-recordings"
  | "healing"
  | "finance"
  | "youth"
  | "leadership"
  | "prayer"
  | "prophecy"
  | "conferences";

export type VideoStatus = "uploading" | "processing" | "ready" | "published" | "archived";

export interface VideoQualityOption {
  label: "1080p" | "720p" | "480p" | "360p" | "auto";
  url: string;
  bitrate?: string;
}

export interface MinistryVideo {
  id: string;
  title: string;
  description: string;
  speakerId?: string;
  speaker: string;
  speakerRole: string;
  speakerAvatar: string;
  category: VideoStorageCategory | string;
  storagePath: string; // e.g. /videos/sermons/sermon_173000.mp4
  playbackUrl: string; // Internal native video stream URL
  qualities?: Record<string, string>; // { "1080p": url, "720p": url, "480p": url, "360p": url }
  thumbnailUrl: string;
  duration: string;
  durationSeconds: number;
  fileSize: number; // in bytes
  fileSizeFormatted: string; // e.g. "485 MB"
  mimeType: string;
  createdAt: string;
  publishedAt: string;
  visibility: "public" | "private" | "unlisted";
  status: VideoStatus;
  eventId?: string; // For live stream recordings attached to the event
  viewsCount: number;
  savesCount: number;
  scriptureReferences?: string[];
  takeaways?: string[];
  transcript?: string;
  captionsUrl?: string;
  downloadPermitted?: boolean;
  externalYouTubeUrl?: string; // Optional external distribution link only
}

export interface VideoWatchProgress {
  videoId: string;
  currentTime: number; // in seconds
  duration: number;
  percentage: number;
  lastWatchedAt: string;
  completed: boolean;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  speakerRole: string;
  speakerAvatar: string;
  category: string;
  duration: string;
  durationSeconds?: number;
  videoUrl?: string;
  playbackUrl?: string; // Native internal video stream
  storagePath?: string; // Internal storage path e.g. /videos/sermons/...
  thumbnailUrl?: string;
  qualities?: Record<string, string>;
  youtubeId?: string; // Deprecated / optional external link only
  externalYouTubeUrl?: string;
  audioUrl?: string;
  transcript: string;
  description: string;
  scriptureReferences: string[];
  takeaways: string[];
  publishedDate: string;
  viewsCount: number;
  savesCount: number;
  approvalStatus: "draft" | "review" | "approved" | "published" | "archived";
}

export type ScriptureRelevanceCategory = "direct_biblical_theme" | "related_biblical_theme" | "general_discernment";

export interface RankedScripture {
  reference: string;
  book?: string;
  chapter?: number;
  verse?: number;
  text: string;
  context: string;
  whyRelevant?: string;
  relevanceScore?: number; // 1 to 5 (5 = Direct, 4 = Strong, 3 = Related, 2 = General, 1 = Generic)
  relevanceCategory?: ScriptureRelevanceCategory;
  translation?: BibleTranslation;
  source?: string;
  license?: string;
  verified?: boolean;
  verificationNotice?: string;
}

export interface ThematicExploration {
  themeName: string;
  biblicalTeaching: string;
  crossReferences?: string[];
}

export interface HostVersionComparisonItem {
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  translations: {
    translation: BibleTranslation;
    name: string;
    text: string;
    note?: string;
  }[];
}

export interface HumanTheologicalPerspective {
  perspective: string;
  proponentOrTradition: string;
  biblicalComparison: string;
}

export interface PracticalTheologicalGuidance {
  prayerPrompt: string;
  reflectionQuestion: string;
  wiseCounselConsideration: string;
  actionStep: string;
}

export interface SpiritualInsightResult {
  summary: string;
  biblicalThemes: string[];
  extractedEventsAndSymbols?: {
    events: string[];
    symbols: string[];
    emotions: string[];
    keyContext: string;
  };
  detectedElements?: {
    objects: string[];
    actions: string[];
    places: string[];
    emotions: string[];
    colors: string[];
    context: string;
  };
  searchConcepts?: string[];
  thematicExplorations?: ThematicExploration[];
  // 4 Biblical Discernment Pillars
  explicitScriptureTeaching?: string[]; // 1. What the Bible explicitly says
  supportingScriptures?: RankedScripture[]; // 2. Supporting Scripture across OT & NT
  humanInterpretations?: HumanTheologicalPerspective[]; // 3. Interpretations / perspectives from other people (compared with Scripture)
  uncertainOrSpeculative?: string[]; // 4. What is uncertain or speculative
  practicalGuidance?: PracticalTheologicalGuidance; // Practical guidance: prayer, reflection, wise counsel
  relevantScriptures: RankedScripture[];
  otherRelevantScriptures?: RankedScripture[];
  generalDiscernmentScriptures?: RankedScripture[];
  hostVersionComparison?: HostVersionComparisonItem[];
  isDisturbingDream?: boolean;
  pastoralComfortMessage?: string;
  biblicalContextExplanation?: {
    historicalSetting: string;
    originalAudience: string;
    theologicalTheme: string;
  };
  possibleInterpretations: {
    angle: string;
    explanation: string;
    symbolicMeaning?: string;
    scripturalBasis?: string;
  }[];
  questionsForReflection: string[];
  relatedTeachings: string[];
  disclaimer: string;
  timestamp?: string;
  sourcesUsed?: {
    name: string;
    url?: string;
    type: string;
  }[];
}

export type CommunityPostType = "dream" | "worry" | "prayer_request";

export interface CommunityPrayerResponse {
  id: string;
  authorId: string;
  authorName: string;
  authorRole?: UserRole;
  message: string;
  scriptureRef?: string;
  scriptureText?: string;
  createdAt: string;
  isStaffResponse?: boolean;
}

export interface CommunityPost {
  id: string;
  authorId?: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: UserRole | string;
  isAnonymous?: boolean;
  anonymousSystemId?: string; // e.g. "Seeker #A8492" or "Member #7291"
  postType?: CommunityPostType;
  title: string;
  description?: string;
  content?: string;
  category: string;
  pleasePrayForMe?: boolean;
  prayedCount?: number;
  hasUserPrayed?: boolean;
  prayerResponses?: CommunityPrayerResponse[];
  comments?: {
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
  }[];
  likesCount?: number;
  commentsCount?: number;
  isPinned?: boolean;
  isReported?: boolean;
  isLiked?: boolean;
  createdAt: string;
  updatedAt?: string;
  isAnswered?: boolean;
  praiseReport?: string;
}

export type VoiceGender = "male" | "female";

export interface EncouragementMessage {
  id: string;
  title: string;
  message: string;
  scriptureRef: string;
  scriptureText: string;
  meaning?: string;
  prayer?: string;
  theme: "faith" | "peace" | "healing" | "victory" | "wisdom" | "hope" | "provision" | "strength" | "love" | "general";
  authorName?: string;
  authorRole?: string;
  authorId?: string;
  date: string;
  createdAt: string;
  likesCount: number;
  hasLiked?: boolean;
  sharesCount?: number;
  audioText?: string;
  pinned?: boolean;
  tags?: string[];
}

export interface DreamEntry {
  id: string;
  title: string;
  date: string;
  description: string;
  context?: string;
  emotions: string[];
  symbols: string[];
  people: string[];
  isPrivate: boolean;
  aiInsight?: SpiritualInsightResult;
  notes: string;
  createdAt: string;
}

export interface VisionEntry {
  id: string;
  title: string;
  date: string;
  description: string;
  context: string;
  scriptures: string[];
  personalReflections: string;
  isPrivate: boolean;
  aiInsight?: SpiritualInsightResult;
  followUpNotes: string;
  createdAt: string;
}

export interface PrayerItem {
  id: string;
  title: string;
  description: string;
  category: string;
  isAnswered: boolean;
  answeredDate?: string;
  testimony?: string;
  isPrivate: boolean;
  scriptures: string[];
  prayedCount: number;
  hasUserPrayed?: boolean;
  authorName?: string;
  createdAt: string;
}

export interface Devotional {
  id: string;
  title: string;
  date: string;
  author: string;
  theme: string;
  scriptureRef: string;
  scriptureText: string;
  reflection: string;
  prayer: string;
  practicalApplication: string;
  isCompleted?: boolean;
}

export interface StudyPlanDay {
  day?: number;
  dayNumber?: number;
  title: string;
  scriptureRef?: string;
  scriptureText?: string;
  assignedPassages?: string[];
  teaching?: string;
  devotionalText?: string;
  reflectionQuestions: string[];
  prayer?: string;
  isCompleted?: boolean;
}

export interface BibleStudyPlan {
  id: string;
  title: string;
  description: string;
  category: string;
  totalDays: number;
  completedDays?: number;
  author: string;
  imageGradient: string;
  days: StudyPlanDay[];
  currentDay?: number;
  isEnrolled?: boolean;
}

export interface LiveChatMessage {
  id: string;
  user: string;
  role?: string;
  avatar?: string;
  text: string;
  time: string;
  isHost?: boolean;
  pinned?: boolean;
}

export interface LiveQuestion {
  id: string;
  user: string;
  avatar?: string;
  question: string;
  votes: number;
  isAnswered: boolean;
  answeredBy?: string;
  time: string;
  hasVoted?: boolean;
}

export interface LiveRoomParticipant {
  id: string;
  name: string;
  role: "host" | "co_host" | "speaker" | "member";
  avatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  isSpeaking: boolean;
  joinedAt: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  speaker: string;
  speakerRole: string;
  speakerAvatar: string;
  type: "sermon" | "bible_study" | "interview" | "conference" | "qa" | "prayer_meeting" | "worship";
  date: string;
  time: string;
  status: "live_now" | "upcoming" | "completed";
  attendeesCount: number;
  streamUrl?: string;
  youtubeId?: string;
  description: string;
  isRegistered?: boolean;

  // Seamless Recording & Replay Pipeline
  recordingStatus?: "none" | "recording" | "processing" | "ready" | "failed";
  recordingUrl?: string;
  audioRecordingUrl?: string;
  recordingDuration?: string;
  recordingDurationSeconds?: number;
  recordedAt?: string;
  replayApproved?: boolean;
  requiresAdminReview?: boolean;
  scriptureReferences?: string[];
  category?: string;
  tags?: string[];
  chatArchive?: LiveChatMessage[];
  qaArchive?: LiveQuestion[];
  reactionsCount?: {
    amen: number;
    pray: number;
    fire: number;
    love: number;
    worship: number;
    praise: number;
  };
}

export interface TeacherProfile {
  id: string;
  name: string;
  title: string;
  ministry: string;
  bio: string;
  avatarUrl: string;
  verified: boolean;
  socialLinks?: {
    youtube?: string;
    website?: string;
    twitter?: string;
  };
  totalTeachings: number;
  totalSermons: number;
}

export interface Endorsement {
  id: string;
  name: string;
  title: string;
  ministry: string;
  photoUrl: string;
  quote: string;
  verified: boolean;
  approvalStatus: "approved" | "pending";
}

export interface AISource {
  id: string;
  name: string;
  url: string;
  description: string;
  category: "scripture" | "doctrine" | "sermons" | "commentary";
  isApproved: boolean;
  lastChecked: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  scriptureRef: string;
  explanation: string;
  category: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  scriptureRef: string;
  category: string;
}

export interface FeedbackItem {
  id: string;
  type: "bug" | "feature" | "content" | "general";
  title: string;
  description: string;
  userEmail: string;
  status: "new" | "reviewed" | "in_progress" | "resolved";
  date: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface PlatformAnalytics {
  totalUsers: number;
  activeUsersToday: number;
  newRegistrationsWeek: number;
  sermonPlaysTotal: number;
  bibleSearchesTotal: number;
  aiSearchesTotal: number;
  liveAttendeesTotal: number;
  first20UsersList: {
    id: string;
    name: string;
    email: string;
    date: string;
    lastActive: string;
    totalActivity: number;
  }[];
}
