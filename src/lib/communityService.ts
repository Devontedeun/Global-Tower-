// Community Service for Dreams and Prayer Support
// Supports anonymous posting with system identifiers (e.g. "Seeker #A8492")
// where regular users see the anonymous ID, while ministry admins/moderators can view the linked account for safety and pastoral care.

import { CommunityPost, CommunityPostType, CommunityPrayerResponse, UserProfile, UserRole } from "../types";
import { Storage } from "./storage";
import { db, auth } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  increment,
  arrayUnion
} from "firebase/firestore";

const COMMUNITY_POSTS_COLLECTION = "communityPosts";

// Generate a reverent anonymous system identifier
export function generateAnonymousIdentifier(type: CommunityPostType): string {
  const prefix = type === "worry" ? "Seeker" : type === "dream" ? "Pilgrim" : "Believer";
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${prefix} #${letter}${randomNum}`;
}

const INITIAL_COMMUNITY_ITEMS: CommunityPost[] = [
  {
    id: "cp-1",
    authorId: "u-founder-richard",
    authorName: "Richard Sango",
    authorRole: "super_admin",
    isAnonymous: false,
    anonymousSystemId: "Minister #A1001",
    postType: "prayer_request",
    title: "Global Evangelism & Spiritual Awakening",
    description: "Please join our ministry team in prayer as we prepare to reach millions across Africa, Europe, and the Americas through the Word of God and the power of the Holy Spirit.",
    category: "Ministry & Missions",
    pleasePrayForMe: true,
    prayedCount: 124,
    hasUserPrayed: false,
    createdAt: "2026-08-20T10:00:00Z",
    prayerResponses: [
      {
        id: "pr-1",
        authorId: "u-member-1",
        authorName: "Sister Grace",
        authorRole: "moderator",
        message: "Amen! Standing with you in the authority of Matthew 28:19-20. The harvest is plentiful!",
        scriptureRef: "Matthew 28:19-20",
        createdAt: "2026-08-20T11:15:00Z",
        isStaffResponse: true
      }
    ]
  },
  {
    id: "cp-2",
    authorId: "u-anon-8821",
    authorName: "Sister Hannah K.",
    isAnonymous: true,
    anonymousSystemId: "Seeker #K7419",
    postType: "worry",
    title: "Overcoming Anxiety Regarding Family Health",
    description: "I've been carrying a heavy weight on my chest lately regarding my mother's sudden medical reports. I struggle to sleep at night. Please pray for peace that surpasses all understanding and healing in her body.",
    category: "Family & Health",
    pleasePrayForMe: true,
    prayedCount: 89,
    hasUserPrayed: false,
    createdAt: "2026-08-21T14:30:00Z",
    prayerResponses: [
      {
        id: "pr-2",
        authorId: "u-pastor-david",
        authorName: "Pastor David",
        authorRole: "teacher",
        message: "Dear sister, you are not alone. Jesus said, 'Come to me, all who labor and are heavy laden, and I will give you rest.' Praying over your mother right now.",
        scriptureRef: "Philippians 4:6-7",
        scriptureText: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.",
        createdAt: "2026-08-21T15:00:00Z",
        isStaffResponse: true
      }
    ]
  },
  {
    id: "cp-3",
    authorId: "u-anon-3920",
    authorName: "Brother Michael O.",
    isAnonymous: true,
    anonymousSystemId: "Pilgrim #M4022",
    postType: "dream",
    title: "Dream of a Lamp on an Open Highway at Twilight",
    description: "In the dream, I was walking along a dim, winding highway at dusk. Suddenly a bright bronze lamp appeared suspended right above the road, showing every step clearly. Please pray that God grants me wisdom and discernment for what this means for my upcoming career choice.",
    category: "Direction & Wisdom",
    pleasePrayForMe: true,
    prayedCount: 65,
    hasUserPrayed: false,
    createdAt: "2026-08-22T08:15:00Z",
    prayerResponses: [
      {
        id: "pr-3",
        authorId: "u-deacon-paul",
        authorName: "Deacon Paul",
        authorRole: "moderator",
        message: "Psalm 119:105 tells us, 'Your word is a lamp to my feet and a light to my path.' Trust the written Word of God to illuminate each step as you walk in faith.",
        scriptureRef: "Psalm 119:105",
        createdAt: "2026-08-22T09:40:00Z",
        isStaffResponse: true
      }
    ]
  }
];

export const CommunityService = {
  getPosts(): CommunityPost[] {
    try {
      const stored = localStorage.getItem("gtc_community_posts_v2");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read community posts from localStorage:", e);
    }
    return INITIAL_COMMUNITY_ITEMS;
  },

  async fetchRemotePosts(): Promise<CommunityPost[]> {
    const local = this.getPosts();
    if (!db) return local;

    try {
      const q = query(collection(db, COMMUNITY_POSTS_COLLECTION), orderBy("createdAt", "desc"), limit(50));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const remotePosts: CommunityPost[] = [];
        snapshot.forEach((docSnap) => {
          remotePosts.push({ id: docSnap.id, ...docSnap.data() } as CommunityPost);
        });
        localStorage.setItem("gtc_community_posts_v2", JSON.stringify(remotePosts));
        return remotePosts;
      }
    } catch (err) {
      console.warn("Firestore community query error (using local):", err);
    }
    return local;
  },

  async createPost(
    postData: {
      title: string;
      description: string;
      postType: CommunityPostType;
      category: string;
      pleasePrayForMe: boolean;
      isAnonymous: boolean;
    },
    user: UserProfile
  ): Promise<CommunityPost> {
    const id = `cp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const anonymousSystemId = generateAnonymousIdentifier(postData.postType);

    const newPost: CommunityPost = {
      id,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      isAnonymous: postData.isAnonymous,
      anonymousSystemId,
      postType: postData.postType,
      title: postData.title.trim(),
      description: postData.description.trim(),
      category: postData.category || "General",
      pleasePrayForMe: postData.pleasePrayForMe,
      prayedCount: 0,
      hasUserPrayed: false,
      prayerResponses: [],
      createdAt: new Date().toISOString()
    };

    // Save locally
    const current = this.getPosts();
    const updated = [newPost, ...current];
    try {
      localStorage.setItem("gtc_community_posts_v2", JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    Storage.recordActivity(`Offered Community Prayer: ${newPost.title || "Prayer Request"}`);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gtc_metrics_updated"));
    }

    // Attempt to persist to Firestore
    if (db) {
      try {
        await setDoc(doc(db, COMMUNITY_POSTS_COLLECTION, id), newPost);
      } catch (err) {
        console.warn("Could not write community post to Firestore:", err);
      }
    }

    return newPost;
  },

  async prayForPost(postId: string): Promise<CommunityPost[]> {
    const current = this.getPosts();
    let targetTitle = "Intercessory Prayer";
    const updated = current.map((p) => {
      if (p.id === postId) {
        targetTitle = p.title || targetTitle;
        const hasPrayed = p.hasUserPrayed;
        return {
          ...p,
          prayedCount: (p.prayedCount || 0) + (hasPrayed ? 0 : 1),
          hasUserPrayed: true
        };
      }
      return p;
    });

    try {
      localStorage.setItem("gtc_community_posts_v2", JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    Storage.recordActivity(`Prayed with the Saints: ${targetTitle}`);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gtc_metrics_updated"));
    }

    if (db) {
      try {
        await updateDoc(doc(db, COMMUNITY_POSTS_COLLECTION, postId), {
          prayedCount: increment(1)
        });
      } catch (e) {
        // silent fallback
      }
    }

    return updated;
  },

  async addPrayerResponse(
    postId: string,
    message: string,
    scriptureRef: string,
    user: UserProfile
  ): Promise<CommunityPost[]> {
    const responseItem: CommunityPrayerResponse = {
      id: `resp-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      message: message.trim(),
      scriptureRef: scriptureRef.trim() || undefined,
      createdAt: new Date().toISOString(),
      isStaffResponse: ["super_admin", "ministry_admin", "teacher", "moderator"].includes(user.role)
    };

    const current = this.getPosts();
    const updated = current.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          prayerResponses: [...(p.prayerResponses || []), responseItem]
        };
      }
      return p;
    });

    try {
      localStorage.setItem("gtc_community_posts_v2", JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    Storage.recordActivity(`Offered Prayer Response to the Saints`);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gtc_metrics_updated"));
    }

    if (db) {
      try {
        await updateDoc(doc(db, COMMUNITY_POSTS_COLLECTION, postId), {
          prayerResponses: arrayUnion(responseItem)
        });
      } catch (e) {
        // silent fallback
      }
    }

    return updated;
  }
};
