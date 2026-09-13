import { LucideIcon } from "lucide-react";
import { SpiritualJourneyMetrics } from "../types";

export type AchievementCategory =
  | "all"
  | "scripture"
  | "streak"
  | "prayer"
  | "notes"
  | "audio"
  | "fellowship";

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: "scripture" | "streak" | "prayer" | "notes" | "audio" | "fellowship";
  verseReference: string;
  verseQuote: string;
  iconName: string;
  // Jewel-tone color palette for rich colorful UI
  badgeColor: {
    bg: string;
    border: string;
    text: string;
    gradient: string;
    glow: string;
    accent: string;
  };
  tier: "bronze" | "silver" | "gold" | "diamond" | "celestial";
  targetCount: number;
  points: number;
  checkUnlocked: (metrics: SpiritualJourneyMetrics, customStats?: any) => {
    isUnlocked: boolean;
    currentProgress: number;
  };
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  // -------------------------------------------------------------
  // SCRIPTURE & BIBLE STUDY ACHIEVEMENTS (Vibrant Sapphire & Blue)
  // -------------------------------------------------------------
  {
    id: "first_light",
    title: "First Light of Truth",
    subtitle: "Read your first Chapter of Scripture",
    description: "Opened the Sacred Scriptures and took the first step in walking in Divine Truth.",
    category: "scripture",
    verseReference: "Psalm 119:105",
    verseQuote: "Thy word is a lamp unto my feet, and a light unto my path.",
    iconName: "BookOpen",
    tier: "bronze",
    targetCount: 1,
    points: 50,
    badgeColor: {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-300 dark:border-blue-700",
      text: "text-blue-700 dark:text-blue-300",
      gradient: "from-blue-500 to-indigo-600",
      glow: "shadow-blue-500/25",
      accent: "#2563EB"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.totalChaptersRead >= 1,
      currentProgress: Math.min(1, m.totalChaptersRead)
    })
  },
  {
    id: "word_in_heart",
    title: "Word in My Heart",
    subtitle: "Read 5 Bible Chapters",
    description: "Concealed the living Word in your heart to fortify the mind against doubt and fear.",
    category: "scripture",
    verseReference: "Psalm 119:11",
    verseQuote: "Thy word have I hid in mine heart, that I might not sin against thee.",
    iconName: "Heart",
    tier: "bronze",
    targetCount: 5,
    points: 100,
    badgeColor: {
      bg: "bg-sky-50 dark:bg-sky-950/40",
      border: "border-sky-300 dark:border-sky-700",
      text: "text-sky-700 dark:text-sky-300",
      gradient: "from-sky-500 to-cyan-600",
      glow: "shadow-sky-500/25",
      accent: "#0284C7"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.totalChaptersRead >= 5,
      currentProgress: Math.min(5, m.totalChaptersRead)
    })
  },
  {
    id: "berean_noble",
    title: "Noble Berean Scholar",
    subtitle: "Read 15 Bible Chapters",
    description: "Examined the holy writings with daily readiness of mind to prove all doctrine.",
    category: "scripture",
    verseReference: "Acts 17:11",
    verseQuote: "They received the word with all readiness of mind, and searched the scriptures daily.",
    iconName: "Search",
    tier: "silver",
    targetCount: 15,
    points: 200,
    badgeColor: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-300 dark:border-indigo-700",
      text: "text-indigo-700 dark:text-indigo-300",
      gradient: "from-indigo-600 to-blue-700",
      glow: "shadow-indigo-500/25",
      accent: "#4F46E5"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.totalChaptersRead >= 15,
      currentProgress: Math.min(15, m.totalChaptersRead)
    })
  },
  {
    id: "pillar_of_truth",
    title: "Pillar of Truth",
    subtitle: "Read 30 Bible Chapters",
    description: "Steadfast grounding in the truth that upholds the household of faith.",
    category: "scripture",
    verseReference: "1 Timothy 3:15",
    verseQuote: "The church of the living God, the pillar and ground of the truth.",
    iconName: "ShieldCheck",
    tier: "gold",
    targetCount: 30,
    points: 350,
    badgeColor: {
      bg: "bg-violet-50 dark:bg-violet-950/40",
      border: "border-violet-300 dark:border-violet-700",
      text: "text-violet-700 dark:text-violet-300",
      gradient: "from-violet-600 to-purple-700",
      glow: "shadow-violet-500/25",
      accent: "#7C3AED"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.totalChaptersRead >= 30,
      currentProgress: Math.min(30, m.totalChaptersRead)
    })
  },
  {
    id: "canonical_scholar",
    title: "Canonical Scholar",
    subtitle: "Read 60 Bible Chapters",
    description: "Immersed deep into the 66 inspired books of the Old and New Testaments.",
    category: "scripture",
    verseReference: "2 Timothy 3:16",
    verseQuote: "All scripture is given by inspiration of God, and is profitable for doctrine.",
    iconName: "Award",
    tier: "diamond",
    targetCount: 60,
    points: 600,
    badgeColor: {
      bg: "bg-purple-50 dark:bg-purple-950/40",
      border: "border-purple-300 dark:border-purple-700",
      text: "text-purple-700 dark:text-purple-300",
      gradient: "from-purple-600 to-pink-600",
      glow: "shadow-purple-500/25",
      accent: "#9333EA"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.totalChaptersRead >= 60,
      currentProgress: Math.min(60, m.totalChaptersRead)
    })
  },

  // -------------------------------------------------------------
  // STREAKS & DAILY WALK ACHIEVEMENTS (Vibrant Amber & Gold)
  // -------------------------------------------------------------
  {
    id: "faithful_dawn",
    title: "Faithful Dawn",
    subtitle: "Active Walk Session",
    description: "Greeted the day in fellowship with the Lord, receiving fresh morning compassions.",
    category: "streak",
    verseReference: "Lamentations 3:22-23",
    verseQuote: "His compassions fail not. They are new every morning: great is thy faithfulness.",
    iconName: "Sun",
    tier: "bronze",
    targetCount: 1,
    points: 50,
    badgeColor: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-300 dark:border-amber-700",
      text: "text-amber-700 dark:text-amber-300",
      gradient: "from-amber-500 to-yellow-500",
      glow: "shadow-amber-500/25",
      accent: "#F59E0B"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.currentStreakDays >= 1 || m.longestStreakDays >= 1,
      currentProgress: Math.max(m.currentStreakDays, m.longestStreakDays, 1)
    })
  },
  {
    id: "threefold_cord",
    title: "Threefold Cord",
    subtitle: "3-Day Unbroken Streak",
    description: "A consecrated habit taking root in your daily walk that cannot be easily broken.",
    category: "streak",
    verseReference: "Ecclesiastes 4:12",
    verseQuote: "And a threefold cord is not quickly broken.",
    iconName: "Flame",
    tier: "silver",
    targetCount: 3,
    points: 150,
    badgeColor: {
      bg: "bg-orange-50 dark:bg-orange-950/40",
      border: "border-orange-300 dark:border-orange-700",
      text: "text-orange-700 dark:text-orange-300",
      gradient: "from-orange-500 to-amber-600",
      glow: "shadow-orange-500/25",
      accent: "#F97316"
    },
    checkUnlocked: (m) => ({
      isUnlocked: Math.max(m.currentStreakDays, m.longestStreakDays) >= 3,
      currentProgress: Math.min(3, Math.max(m.currentStreakDays, m.longestStreakDays))
    })
  },
  {
    id: "sevenfold_praise",
    title: "Sevenfold Praise",
    subtitle: "7-Day Perfect Week Streak",
    description: "A full week of consecrated devotion, walking with God from Sabbath to Sabbath.",
    category: "streak",
    verseReference: "Psalm 119:164",
    verseQuote: "Seven times a day do I praise thee because of thy righteous judgments.",
    iconName: "Sparkles",
    tier: "gold",
    targetCount: 7,
    points: 300,
    badgeColor: {
      bg: "bg-yellow-50 dark:bg-yellow-950/40",
      border: "border-yellow-300 dark:border-yellow-700",
      text: "text-yellow-700 dark:text-yellow-300",
      gradient: "from-yellow-500 to-amber-600",
      glow: "shadow-yellow-500/25",
      accent: "#EAB308"
    },
    checkUnlocked: (m) => ({
      isUnlocked: Math.max(m.currentStreakDays, m.longestStreakDays) >= 7,
      currentProgress: Math.min(7, Math.max(m.currentStreakDays, m.longestStreakDays))
    })
  },
  {
    id: "fortnight_of_grace",
    title: "Fortnight of Grace",
    subtitle: "14-Day Devotion Streak",
    description: "Two straight weeks of unbroken communion with the Holy Spirit.",
    category: "streak",
    verseReference: "1 Corinthians 16:13",
    verseQuote: "Watch ye, stand fast in the faith, quit you like men, be strong.",
    iconName: "Shield",
    tier: "diamond",
    targetCount: 14,
    points: 500,
    badgeColor: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-[#C5A059] dark:border-[#C5A059]/70",
      text: "text-[#8C6B2D] dark:text-[#E5B869]",
      gradient: "from-[#C5A059] to-[#E5B869]",
      glow: "shadow-[#C5A059]/30",
      accent: "#C5A059"
    },
    checkUnlocked: (m) => ({
      isUnlocked: Math.max(m.currentStreakDays, m.longestStreakDays) >= 14,
      currentProgress: Math.min(14, Math.max(m.currentStreakDays, m.longestStreakDays))
    })
  },
  {
    id: "enochs_fellowship",
    title: "Enoch's Fellowship",
    subtitle: "30-Day Transformed Walk",
    description: "An entire month consecrated to walking closely with God in sweet communion.",
    category: "streak",
    verseReference: "Genesis 5:24",
    verseQuote: "And Enoch walked with God: and he was not; for God took him.",
    iconName: "Crown",
    tier: "celestial",
    targetCount: 30,
    points: 1000,
    badgeColor: {
      bg: "bg-yellow-50 dark:bg-yellow-950/50",
      border: "border-yellow-400 dark:border-yellow-600",
      text: "text-amber-800 dark:text-yellow-200",
      gradient: "from-amber-400 via-yellow-500 to-amber-600",
      glow: "shadow-amber-500/40",
      accent: "#D97706"
    },
    checkUnlocked: (m) => ({
      isUnlocked: Math.max(m.currentStreakDays, m.longestStreakDays) >= 30,
      currentProgress: Math.min(30, Math.max(m.currentStreakDays, m.longestStreakDays))
    })
  },

  // -------------------------------------------------------------
  // PRAYER & INTERCESSION ACHIEVEMENTS (Vibrant Crimson & Rose)
  // -------------------------------------------------------------
  {
    id: "secret_place",
    title: "The Secret Place",
    subtitle: "Offered First Prayer",
    description: "Shut the door to the world and knelt before the Almighty Father in secret.",
    category: "prayer",
    verseReference: "Psalm 91:1",
    verseQuote: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.",
    iconName: "Heart",
    tier: "bronze",
    targetCount: 1,
    points: 50,
    badgeColor: {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-300 dark:border-rose-700",
      text: "text-rose-700 dark:text-rose-300",
      gradient: "from-rose-500 to-pink-600",
      glow: "shadow-rose-500/25",
      accent: "#E11D48"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.prayersOfferedCount >= 1,
      currentProgress: Math.min(1, m.prayersOfferedCount)
    })
  },
  {
    id: "watchman_on_wall",
    title: "Watchman on the Wall",
    subtitle: "5 Prayers Offered",
    description: "Vigilant intercession lifting up the church, the city, and the brethren.",
    category: "prayer",
    verseReference: "Isaiah 62:6",
    verseQuote: "I have set watchmen upon thy walls, O Jerusalem, which shall never hold their peace day nor night.",
    iconName: "ShieldAlert",
    tier: "silver",
    targetCount: 5,
    points: 150,
    badgeColor: {
      bg: "bg-red-50 dark:bg-red-950/40",
      border: "border-red-300 dark:border-red-700",
      text: "text-red-700 dark:text-red-300",
      gradient: "from-red-500 to-rose-600",
      glow: "shadow-red-500/25",
      accent: "#DC2626"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.prayersOfferedCount >= 5,
      currentProgress: Math.min(5, m.prayersOfferedCount)
    })
  },
  {
    id: "shield_of_faith_prayer",
    title: "Shield of Faith",
    subtitle: "15 Prayers Offered",
    description: "Quenching all the fiery darts of the wicked with relentless, fervent prayer.",
    category: "prayer",
    verseReference: "Ephesians 6:16",
    verseQuote: "Above all, taking the shield of faith, wherewith ye shall be able to quench all the fiery darts of the wicked.",
    iconName: "Shield",
    tier: "gold",
    targetCount: 15,
    points: 300,
    badgeColor: {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-400 dark:border-rose-600",
      text: "text-rose-800 dark:text-rose-200",
      gradient: "from-rose-600 to-red-700",
      glow: "shadow-rose-600/30",
      accent: "#BE123C"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.prayersOfferedCount >= 15,
      currentProgress: Math.min(15, m.prayersOfferedCount)
    })
  },
  {
    id: "unceasing_intercessor",
    title: "Unceasing Intercessor",
    subtitle: "30 Prayers Offered",
    description: "Cultivating a lifestyle of prayer that bridges heaven and earth continuously.",
    category: "prayer",
    verseReference: "1 Thessalonians 5:17",
    verseQuote: "Pray without ceasing. In every thing give thanks.",
    iconName: "Sparkles",
    tier: "diamond",
    targetCount: 30,
    points: 600,
    badgeColor: {
      bg: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
      border: "border-fuchsia-300 dark:border-fuchsia-700",
      text: "text-fuchsia-700 dark:text-fuchsia-300",
      gradient: "from-fuchsia-600 to-rose-700",
      glow: "shadow-fuchsia-500/25",
      accent: "#C026D3"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.prayersOfferedCount >= 30,
      currentProgress: Math.min(30, m.prayersOfferedCount)
    })
  },

  // -------------------------------------------------------------
  // SCRIBING & STUDY NOTES (Vibrant Emerald & Mint)
  // -------------------------------------------------------------
  {
    id: "faithful_scribe",
    title: "Faithful Scribe",
    subtitle: "Saved First Study Note",
    description: "Inscribed heavenly revelations and personal reflections on the tablets of memory.",
    category: "notes",
    verseReference: "Psalm 45:1",
    verseQuote: "My heart is inditing a good matter... my tongue is the pen of a ready writer.",
    iconName: "FileText",
    tier: "bronze",
    targetCount: 1,
    points: 50,
    badgeColor: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-300 dark:border-emerald-700",
      text: "text-emerald-700 dark:text-emerald-300",
      gradient: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-500/25",
      accent: "#10B981"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.studyNotesCount >= 1,
      currentProgress: Math.min(1, m.studyNotesCount)
    })
  },
  {
    id: "tablets_of_stone",
    title: "Tablets of the Heart",
    subtitle: "5 Study Notes Saved",
    description: "Treasuring God's precepts with deep written reflections and cross-references.",
    category: "notes",
    verseReference: "Proverbs 3:3",
    verseQuote: "Bind them about thy neck; write them upon the table of thine heart.",
    iconName: "Bookmark",
    tier: "silver",
    targetCount: 5,
    points: 150,
    badgeColor: {
      bg: "bg-teal-50 dark:bg-teal-950/40",
      border: "border-teal-300 dark:border-teal-700",
      text: "text-teal-700 dark:text-teal-300",
      gradient: "from-teal-500 to-emerald-600",
      glow: "shadow-teal-500/25",
      accent: "#14B8A6"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.studyNotesCount >= 5,
      currentProgress: Math.min(5, m.studyNotesCount)
    })
  },
  {
    id: "theological_journal",
    title: "Theological Scribe",
    subtitle: "15 Study Notes Saved",
    description: "Building an illuminated personal archive of theological revelations and study guides.",
    category: "notes",
    verseReference: "1 Timothy 4:13",
    verseQuote: "Give attendance to reading, to exhortation, to doctrine.",
    iconName: "BookMarked",
    tier: "gold",
    targetCount: 15,
    points: 350,
    badgeColor: {
      bg: "bg-green-50 dark:bg-green-950/40",
      border: "border-green-300 dark:border-green-700",
      text: "text-green-700 dark:text-green-300",
      gradient: "from-green-600 to-emerald-700",
      glow: "shadow-green-500/25",
      accent: "#16A34A"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.studyNotesCount >= 15,
      currentProgress: Math.min(15, m.studyNotesCount)
    })
  },

  // -------------------------------------------------------------
  // AUDIO & VOICE NARRATION (Vibrant Royal Purple & Violet)
  // -------------------------------------------------------------
  {
    id: "hearer_of_word",
    title: "Hearer of the Word",
    subtitle: "Listen to Audio Scripture",
    description: "Tuned the ears of your spirit to hearing the living spoken Word of God.",
    category: "audio",
    verseReference: "Matthew 11:15",
    verseQuote: "He that hath ears to hear, let him hear.",
    iconName: "Volume2",
    tier: "bronze",
    targetCount: 1,
    points: 50,
    badgeColor: {
      bg: "bg-violet-50 dark:bg-violet-950/40",
      border: "border-violet-300 dark:border-violet-700",
      text: "text-violet-700 dark:text-violet-300",
      gradient: "from-violet-500 to-purple-600",
      glow: "shadow-violet-500/25",
      accent: "#8B5CF6"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.audioListeningMinutes >= 1,
      currentProgress: Math.min(1, m.audioListeningMinutes)
    })
  },
  {
    id: "cathedral_reverence",
    title: "Cathedral Cadence",
    subtitle: "5 Minutes Audio Scripture",
    description: "Immersed in reverent spoken audio scripture narration with natural cathedral timbre.",
    category: "audio",
    verseReference: "Romans 10:17",
    verseQuote: "So then faith cometh by hearing, and hearing by the word of God.",
    iconName: "Headphones",
    tier: "silver",
    targetCount: 5,
    points: 150,
    badgeColor: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-300 dark:border-indigo-700",
      text: "text-indigo-700 dark:text-indigo-300",
      gradient: "from-indigo-600 to-violet-600",
      glow: "shadow-indigo-500/25",
      accent: "#6366F1"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.audioListeningMinutes >= 5,
      currentProgress: Math.min(5, m.audioListeningMinutes)
    })
  },
  {
    id: "trumpet_of_zion",
    title: "Trumpet of Zion",
    subtitle: "15 Minutes Audio Scripture",
    description: "Filled your atmosphere with the sound of the Word of the Lord echoing unhindered.",
    category: "audio",
    verseReference: "Joel 2:1",
    verseQuote: "Blow ye the trumpet in Zion, and sound an alarm in my holy mountain.",
    iconName: "Music",
    tier: "gold",
    targetCount: 15,
    points: 300,
    badgeColor: {
      bg: "bg-purple-50 dark:bg-purple-950/40",
      border: "border-purple-300 dark:border-purple-700",
      text: "text-purple-700 dark:text-purple-300",
      gradient: "from-purple-600 to-indigo-700",
      glow: "shadow-purple-500/25",
      accent: "#9333EA"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.audioListeningMinutes >= 15,
      currentProgress: Math.min(15, m.audioListeningMinutes)
    })
  },

  // -------------------------------------------------------------
  // FELLOWSHIP & STUDY PLANS (Vibrant Cyan & Coral)
  // -------------------------------------------------------------
  {
    id: "kingdom_citizen",
    title: "Kingdom Citizen",
    subtitle: "Registered Believer Profile",
    description: "Identified with the Body of Christ and inscribed your name among the fellowship of saints.",
    category: "fellowship",
    verseReference: "Ephesians 2:19",
    verseQuote: "Now therefore ye are no more strangers and foreigners, but fellowcitizens with the saints.",
    iconName: "UserCheck",
    tier: "bronze",
    targetCount: 1,
    points: 100,
    badgeColor: {
      bg: "bg-cyan-50 dark:bg-cyan-950/40",
      border: "border-cyan-300 dark:border-cyan-700",
      text: "text-cyan-700 dark:text-cyan-300",
      gradient: "from-cyan-500 to-blue-600",
      glow: "shadow-cyan-500/25",
      accent: "#06B6D4"
    },
    checkUnlocked: (_m, custom) => ({
      isUnlocked: !!custom?.isRegisteredUser,
      currentProgress: custom?.isRegisteredUser ? 1 : 0
    })
  },
  {
    id: "guided_steps",
    title: "Guided Steps",
    subtitle: "Complete Study Plan Day",
    description: "Undertook structured spiritual curriculum to build systematic biblical wisdom.",
    category: "fellowship",
    verseReference: "Psalm 37:23",
    verseQuote: "The steps of a good man are ordered by the Lord: and he delighteth in his way.",
    iconName: "Compass",
    tier: "silver",
    targetCount: 1,
    points: 150,
    badgeColor: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-300 dark:border-emerald-700",
      text: "text-emerald-700 dark:text-emerald-300",
      gradient: "from-emerald-500 to-green-600",
      glow: "shadow-emerald-500/25",
      accent: "#10B981"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.studyPlanDaysCompleted >= 1,
      currentProgress: Math.min(1, m.studyPlanDaysCompleted)
    })
  },
  {
    id: "spiritual_watcher",
    title: "Spiritual Watcher",
    subtitle: "Log a Dream or Vision",
    description: "Recorded God's nightly instructions and prophetic whispers for testing by the Word.",
    category: "fellowship",
    verseReference: "Acts 2:17",
    verseQuote: "Your young men shall see visions, and your old men shall dream dreams.",
    iconName: "Moon",
    tier: "silver",
    targetCount: 1,
    points: 150,
    badgeColor: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-300 dark:border-indigo-700",
      text: "text-indigo-700 dark:text-indigo-300",
      gradient: "from-indigo-600 to-purple-600",
      glow: "shadow-indigo-500/25",
      accent: "#4F46E5"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.dreamsVisionsLoggedCount >= 1,
      currentProgress: Math.min(1, m.dreamsVisionsLoggedCount)
    })
  },
  {
    id: "holy_disciple",
    title: "Disciple of Christ",
    subtitle: "Complete 5 Study Plan Days",
    description: "Faithful continuance in Christ's teaching, bearing the fruit of true discipleship.",
    category: "fellowship",
    verseReference: "John 8:31",
    verseQuote: "If ye continue in my word, then are ye my disciples indeed.",
    iconName: "Crown",
    tier: "gold",
    targetCount: 5,
    points: 350,
    badgeColor: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-300 dark:border-amber-700",
      text: "text-amber-700 dark:text-amber-300",
      gradient: "from-amber-500 to-yellow-600",
      glow: "shadow-amber-500/25",
      accent: "#F59E0B"
    },
    checkUnlocked: (m) => ({
      isUnlocked: m.studyPlanDaysCompleted >= 5,
      currentProgress: Math.min(5, m.studyPlanDaysCompleted)
    })
  }
];

export function calculateAchievementsSummary(metrics: SpiritualJourneyMetrics, isRegistered = false) {
  let unlockedCount = 0;
  let totalScore = 0;
  let earnedScore = 0;

  const results = ACHIEVEMENTS_LIST.map((ach) => {
    const check = ach.checkUnlocked(metrics, { isRegisteredUser: isRegistered });
    totalScore += ach.points;
    if (check.isUnlocked) {
      unlockedCount++;
      earnedScore += ach.points;
    }
    const percent = Math.min(100, Math.round((check.currentProgress / ach.targetCount) * 100));
    return {
      achievement: ach,
      isUnlocked: check.isUnlocked,
      currentProgress: check.currentProgress,
      targetCount: ach.targetCount,
      percent
    };
  });

  const overallPercent = Math.round((unlockedCount / ACHIEVEMENTS_LIST.length) * 100);

  return {
    results,
    unlockedCount,
    totalCount: ACHIEVEMENTS_LIST.length,
    earnedScore,
    totalScore,
    overallPercent
  };
}
