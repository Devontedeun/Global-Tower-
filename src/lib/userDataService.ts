// Multi-User SaaS Data Service for Global Tower of Christ
// Provides data isolation: users/{uid}/[notes|bookmarks|highlights|dreams|visions|prayers|readingProgress|savedSermons]
// with automatic offline cache and real-time Firestore synchronization.

import {
  db,
  auth,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  orderBy
} from "./firebase";
import {
  UserProfile,
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
  CommunityPost
} from "../types";
import { Storage, DEFAULT_USER } from "./storage";

export class UserDataService {
  /**
   * Fetch current authenticated user's profile from Firestore
   */
  static async fetchUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, "users", uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfile;
        Storage.setUser(data);
        return data;
      }
      return null;
    } catch (err) {
      console.warn("Could not fetch user profile from Firestore, using local:", err);
      return Storage.getUser();
    }
  }

  /**
   * Save / Sync user profile in Firestore
   */
  static async saveUserProfile(user: UserProfile): Promise<void> {
    Storage.setUser(user);
    if (!auth.currentUser || auth.currentUser.uid !== user.id) return;

    try {
      const userRef = doc(db, "users", user.id);
      await setDoc(userRef, {
        ...user,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Failed to sync user profile to Firestore:", err);
    }
  }

  // ==========================================
  // ISOLATED USER DATA: NOTES (users/{uid}/notes)
  // ==========================================
  static async saveNote(note: StudyNote): Promise<StudyNote[]> {
    const local = Storage.saveNote(note);
    if (auth.currentUser) {
      try {
        const noteRef = doc(db, `users/${auth.currentUser.uid}/notes`, note.id);
        await setDoc(noteRef, note, { merge: true });
      } catch (err) {
        console.warn("Firestore saveNote error:", err);
      }
    }
    return local;
  }

  static async deleteNote(noteId: string): Promise<StudyNote[]> {
    const local = Storage.deleteNote(noteId);
    if (auth.currentUser) {
      try {
        const noteRef = doc(db, `users/${auth.currentUser.uid}/notes`, noteId);
        await deleteDoc(noteRef);
      } catch (err) {
        console.warn("Firestore deleteNote error:", err);
      }
    }
    return local;
  }

  // ==========================================
  // ISOLATED USER DATA: BOOKMARKS (users/{uid}/bookmarks)
  // ==========================================
  static async saveBookmark(bm: VerseBookmark): Promise<VerseBookmark[]> {
    const local = Storage.saveBookmark(bm);
    if (auth.currentUser) {
      try {
        const bmRef = doc(db, `users/${auth.currentUser.uid}/bookmarks`, bm.id);
        await setDoc(bmRef, bm, { merge: true });
      } catch (err) {
        console.warn("Firestore saveBookmark error:", err);
      }
    }
    return local;
  }

  static async removeBookmark(id: string): Promise<VerseBookmark[]> {
    const local = Storage.removeBookmark(id);
    if (auth.currentUser) {
      try {
        const bmRef = doc(db, `users/${auth.currentUser.uid}/bookmarks`, id);
        await deleteDoc(bmRef);
      } catch (err) {
        console.warn("Firestore removeBookmark error:", err);
      }
    }
    return local;
  }

  // ==========================================
  // ISOLATED USER DATA: HIGHLIGHTS (users/{uid}/highlights)
  // ==========================================
  static async saveHighlight(hl: VerseHighlight): Promise<VerseHighlight[]> {
    const local = Storage.saveHighlight(hl);
    if (auth.currentUser) {
      try {
        const hlRef = doc(db, `users/${auth.currentUser.uid}/highlights`, hl.id);
        await setDoc(hlRef, hl, { merge: true });
      } catch (err) {
        console.warn("Firestore saveHighlight error:", err);
      }
    }
    return local;
  }

  // ==========================================
  // ISOLATED USER DATA: DREAMS (users/{uid}/dreams)
  // ==========================================
  static async saveDream(dream: DreamEntry): Promise<DreamEntry[]> {
    const local = Storage.saveDream(dream);
    if (auth.currentUser) {
      try {
        const dreamRef = doc(db, `users/${auth.currentUser.uid}/dreams`, dream.id);
        await setDoc(dreamRef, dream, { merge: true });
      } catch (err) {
        console.warn("Firestore saveDream error:", err);
      }
    }
    return local;
  }

  static async deleteDream(dreamId: string): Promise<DreamEntry[]> {
    const local = Storage.deleteDream(dreamId);
    if (auth.currentUser) {
      try {
        const dreamRef = doc(db, `users/${auth.currentUser.uid}/dreams`, dreamId);
        await deleteDoc(dreamRef);
      } catch (err) {
        console.warn("Firestore deleteDream error:", err);
      }
    }
    return local;
  }

  // ==========================================
  // ISOLATED USER DATA: VISIONS (users/{uid}/visions)
  // ==========================================
  static async saveVision(vision: VisionEntry): Promise<VisionEntry[]> {
    const local = Storage.saveVision(vision);
    if (auth.currentUser) {
      try {
        const visionRef = doc(db, `users/${auth.currentUser.uid}/visions`, vision.id);
        await setDoc(visionRef, vision, { merge: true });
      } catch (err) {
        console.warn("Firestore saveVision error:", err);
      }
    }
    return local;
  }

  static async deleteVision(visionId: string): Promise<VisionEntry[]> {
    const local = Storage.deleteVision(visionId);
    if (auth.currentUser) {
      try {
        const visionRef = doc(db, `users/${auth.currentUser.uid}/visions`, visionId);
        await deleteDoc(visionRef);
      } catch (err) {
        console.warn("Firestore deleteVision error:", err);
      }
    }
    return local;
  }

  // ==========================================
  // ISOLATED USER DATA: SAVED SERMONS (users/{uid}/savedSermons)
  // ==========================================
  static async toggleSaveSermon(sermonId: string): Promise<string[]> {
    const local = Storage.toggleSaveSermon(sermonId);
    if (auth.currentUser) {
      try {
        const isSaved = local.includes(sermonId);
        const ref = doc(db, `users/${auth.currentUser.uid}/savedSermons`, sermonId);
        if (isSaved) {
          await setDoc(ref, { sermonId, savedAt: new Date().toISOString() });
        } else {
          await deleteDoc(ref);
        }
      } catch (err) {
        console.warn("Firestore toggleSaveSermon error:", err);
      }
    }
    return local;
  }

  // ==========================================
  // SYNC USER DATA ON LOGIN
  // When a user logs in, retrieve all their private subcollections from Firestore
  // ==========================================
  static async syncUserDataFromFirestore(uid: string): Promise<void> {
    try {
      // 1. Sync Bookmarks
      const bmSnap = await getDocs(collection(db, `users/${uid}/bookmarks`));
      if (!bmSnap.empty) {
        const items = bmSnap.docs.map(d => d.data() as VerseBookmark);
        localStorage.setItem("gtc_verse_bookmarks", JSON.stringify(items));
      }

      // 2. Sync Notes
      const notesSnap = await getDocs(collection(db, `users/${uid}/notes`));
      if (!notesSnap.empty) {
        const items = notesSnap.docs.map(d => d.data() as StudyNote);
        localStorage.setItem("gtc_study_notes", JSON.stringify(items));
      }

      // 3. Sync Dreams
      const dreamsSnap = await getDocs(collection(db, `users/${uid}/dreams`));
      if (!dreamsSnap.empty) {
        const items = dreamsSnap.docs.map(d => d.data() as DreamEntry);
        localStorage.setItem("gtc_dream_journal", JSON.stringify(items));
      }

      // 4. Sync Visions
      const visionsSnap = await getDocs(collection(db, `users/${uid}/visions`));
      if (!visionsSnap.empty) {
        const items = visionsSnap.docs.map(d => d.data() as VisionEntry);
        localStorage.setItem("gtc_vision_journal", JSON.stringify(items));
      }

      // 5. Sync Saved Sermons
      const savedSnap = await getDocs(collection(db, `users/${uid}/savedSermons`));
      if (!savedSnap.empty) {
        const items = savedSnap.docs.map(d => d.id);
        localStorage.setItem("gtc_saved_sermon_ids", JSON.stringify(items));
      }
    } catch (err) {
      console.warn("Could not synchronize user subcollections from Firestore:", err);
    }
  }

  // Clear private data from local state on logout
  static clearUserData(): void {
    localStorage.removeItem("gtc_verse_bookmarks");
    localStorage.removeItem("gtc_study_notes");
    localStorage.removeItem("gtc_dream_journal");
    localStorage.removeItem("gtc_vision_journal");
    localStorage.removeItem("gtc_saved_sermon_ids");
    localStorage.removeItem("gtc_user_profile");
  }

  /**
   * Fetch all registered believers / members for the Admin CRM
   */
  static async fetchAllUsersForCrm(): Promise<UserProfile[]> {
    const localList = Storage.getJoinedMembers();
    try {
      const usersCol = collection(db, "users");
      const snap = await getDocs(usersCol);
      if (!snap.empty) {
        const firestoreUsers = snap.docs.map((d) => d.data() as UserProfile);
        // Merge Firestore users with local registry by ID/email
        const combined = [...firestoreUsers];
        for (const localUser of localList) {
          if (!combined.some((u) => u.email?.toLowerCase() === localUser.email?.toLowerCase() || u.id === localUser.id)) {
            combined.push(localUser);
          }
        }
        // Filter out any revoked/deleted users
        return combined.filter((u) => !Storage.isUserRevoked(u.id, u.email));
      }
    } catch (err) {
      console.warn("Could not query Firestore users collection, returning local CRM list:", err);
    }
    return localList.filter((u) => !Storage.isUserRevoked(u.id, u.email));
  }

  /**
   * Delete an account completely: deletes user from Firestore, removes from CRM,
   * invokes Firebase Auth account deletion, and broadcasts real-time kick signal.
   */
  static async deleteUserAccount(userId: string, email: string): Promise<boolean> {
    try {
      // 1. Revoke and remove locally
      Storage.revokeUser(userId, email);
      Storage.deleteJoinedMember(userId);
      if (email) Storage.deleteJoinedMember(email);

      // 2. Delete Firestore document
      try {
        const userRef = doc(db, "users", userId);
        await deleteDoc(userRef);
      } catch (err) {
        console.warn("Could not delete user doc from Firestore:", err);
      }

      // 3. Request server-side Firebase Auth user deletion
      try {
        await fetch("/api/admin/delete-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: userId, email })
        });
      } catch (apiErr) {
        console.warn("Could not reach backend /api/admin/delete-user:", apiErr);
      }

      // 4. Dispatch real-time kick and CRM update events
      window.dispatchEvent(
        new CustomEvent("gtc_user_kicked", { detail: { uid: userId, email } })
      );
      window.dispatchEvent(new CustomEvent("gtc_crm_updated"));

      return true;
    } catch (err) {
      console.error("Error in deleteUserAccount:", err);
      return false;
    }
  }
}
