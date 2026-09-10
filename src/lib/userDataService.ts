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
  // ISOLATED USER DATA: STUDY PROGRESS (users/{uid}/studyProgress)
  // ==========================================
  static async saveStudyProgress(
    planId: string,
    progress: {
      isEnrolled: boolean;
      currentDay: number;
      completedDays: number;
      completedDayNumbers: number[];
    }
  ): Promise<void> {
    const activeUid = auth.currentUser?.uid;
    if (activeUid) {
      try {
        const progRef = doc(db, `users/${activeUid}/studyProgress`, planId);
        await setDoc(progRef, {
          ...progress,
          planId,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn("Firestore saveStudyProgress error:", err);
      }
    }
  }

  static async fetchStudyProgress(
    uid: string
  ): Promise<Record<string, { isEnrolled: boolean; currentDay: number; completedDays: number; completedDayNumbers: number[] }>> {
    const result: Record<string, any> = {};
    try {
      const snap = await getDocs(collection(db, `users/${uid}/studyProgress`));
      if (!snap.empty) {
        snap.docs.forEach((d) => {
          result[d.id] = d.data();
        });
      }
    } catch (err) {
      console.warn("Could not fetch user studyProgress from Firestore:", err);
    }
    return result;
  }

  // ==========================================
  // SYNC USER DATA ON LOGIN (Blazing Fast Parallel Queries)
  // When a user logs in, retrieve all their private subcollections from Firestore concurrently
  // ==========================================
  static async syncUserDataFromFirestore(uid: string): Promise<void> {
    try {
      // Execute all 6 subcollection fetches in parallel with Promise.allSettled
      // This reduces sync time from multiple seconds down to a single network flight!
      const [bmRes, notesRes, dreamsRes, visionsRes, savedRes, studyRes] = await Promise.allSettled([
        getDocs(collection(db, `users/${uid}/bookmarks`)),
        getDocs(collection(db, `users/${uid}/notes`)),
        getDocs(collection(db, `users/${uid}/dreams`)),
        getDocs(collection(db, `users/${uid}/visions`)),
        getDocs(collection(db, `users/${uid}/savedSermons`)),
        getDocs(collection(db, `users/${uid}/studyProgress`))
      ]);

      // 1. Bookmarks
      if (bmRes.status === "fulfilled" && !bmRes.value.empty) {
        const items = bmRes.value.docs.map(d => d.data() as VerseBookmark);
        localStorage.setItem("gtc_verse_bookmarks", JSON.stringify(items));
      }

      // 2. Notes
      if (notesRes.status === "fulfilled" && !notesRes.value.empty) {
        const items = notesRes.value.docs.map(d => d.data() as StudyNote);
        localStorage.setItem("gtc_study_notes", JSON.stringify(items));
      }

      // 3. Dreams
      if (dreamsRes.status === "fulfilled" && !dreamsRes.value.empty) {
        const items = dreamsRes.value.docs.map(d => d.data() as DreamEntry);
        localStorage.setItem("gtc_dream_journal", JSON.stringify(items));
      }

      // 4. Visions
      if (visionsRes.status === "fulfilled" && !visionsRes.value.empty) {
        const items = visionsRes.value.docs.map(d => d.data() as VisionEntry);
        localStorage.setItem("gtc_vision_journal", JSON.stringify(items));
      }

      // 5. Saved Sermons
      if (savedRes.status === "fulfilled" && !savedRes.value.empty) {
        const items = savedRes.value.docs.map(d => d.id);
        localStorage.setItem("gtc_saved_sermon_ids", JSON.stringify(items));
      }

      // 6. Study Progress (Sync & Reconcile)
      if (studyRes.status === "fulfilled" && !studyRes.value.empty) {
        const progressMap: Record<string, any> = {};
        studyRes.value.docs.forEach((d) => {
          progressMap[d.id] = d.data();
        });

        const currentPlans = Storage.getStudyPlans();
        const updatedPlans = currentPlans.map((plan) => {
          const userProg = progressMap[plan.id];
          if (!userProg) return plan;

          const completedNums = new Set<number>(
            Array.isArray(userProg.completedDayNumbers) ? userProg.completedDayNumbers : []
          );

          const days = (plan.days || []).map((d, index) => {
            const num = d.dayNumber ?? d.day ?? index + 1;
            return {
              ...d,
              isCompleted: completedNums.has(num) || !!d.isCompleted
            };
          });

          const completedCount = days.filter((d) => d.isCompleted).length;

          return {
            ...plan,
            isEnrolled: userProg.isEnrolled !== undefined ? userProg.isEnrolled : plan.isEnrolled,
            currentDay: userProg.currentDay || plan.currentDay || 1,
            completedDays: completedCount,
            days
          };
        });

        Storage.saveStudyPlans(updatedPlans);
        window.dispatchEvent(new CustomEvent("gtc_study_plans_updated"));
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
    localStorage.removeItem("gtc_study_plans");
    window.dispatchEvent(new CustomEvent("gtc_study_plans_updated"));
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
   * Complete purge of all user subcollections in Firestore
   */
  private static async purgeUserFirestoreSubcollections(userId: string): Promise<void> {
    const subcollectionNames = [
      "notes",
      "bookmarks",
      "highlights",
      "dreams",
      "visions",
      "savedSermons",
      "studyProgress",
      "prayers",
      "savedEncouragements"
    ];

    for (const subcol of subcollectionNames) {
      try {
        const snap = await getDocs(collection(db, `users/${userId}/${subcol}`));
        if (!snap.empty) {
          const deletePromises = snap.docs.map((d) => deleteDoc(d.ref));
          await Promise.allSettled(deletePromises);
        }
      } catch (e) {
        console.warn(`Could not purge subcollection ${subcol} for user ${userId}:`, e);
      }
    }
  }

  /**
   * Delete current authenticated user's own account (Self-Service)
   * GDPR / Sacred Privacy Trust complete erasure of all personal spiritual data.
   */
  static async deleteOwnAccount(userId: string, email: string, reason?: string): Promise<boolean> {
    const cleanEmail = (email || "").toLowerCase().trim();

    try {
      // 1. Purge all private Firestore subcollections (notes, bookmarks, dreams, visions, etc.)
      await this.purgeUserFirestoreSubcollections(userId);

      // 2. Delete parent user profile document in Firestore
      try {
        const userRef = doc(db, "users", userId);
        await deleteDoc(userRef);
      } catch (fsErr) {
        console.warn("Could not delete user doc from Firestore:", fsErr);
      }

      // 3. Delete Firebase Auth user if authenticated
      if (auth.currentUser && auth.currentUser.uid === userId) {
        try {
          if (typeof (auth.currentUser as any).delete === "function") {
            await (auth.currentUser as any).delete();
          }
        } catch (authErr: any) {
          console.warn("Direct Firebase Auth user delete warning (proceeding with revocation):", authErr);
        }
      }

      // 4. Notify backend server to record revocation and purge sessions
      try {
        await fetch("/api/user/delete-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: userId, email: cleanEmail, reason })
        });
      } catch (apiErr) {
        console.warn("Could not reach backend /api/user/delete-account:", apiErr);
      }

      // 5. Remove from local user accounts registry
      try {
        const raw = localStorage.getItem("gtc_local_user_accounts");
        if (raw) {
          const accounts = JSON.parse(raw);
          if (accounts[cleanEmail]) {
            delete accounts[cleanEmail];
            localStorage.setItem("gtc_local_user_accounts", JSON.stringify(accounts));
          }
        }
      } catch {}

      // 6. Revoke in local storage and delete from CRM
      Storage.revokeUser(userId, cleanEmail);
      Storage.deleteJoinedMember(userId);
      if (cleanEmail) Storage.deleteJoinedMember(cleanEmail);

      // 7. Clear all user data from storage
      this.clearUserData();
      Storage.clearUser();

      // 8. Store closing blessing notice for sign-in display
      try {
        sessionStorage.setItem(
          "gtc_account_deleted_notice",
          "Numbers 6:24-26: The Lord bless you and keep you; The Lord make His face shine upon you, and give you peace. Amen. Depart in peace, dear beloved."
        );
      } catch {}

      // 9. Dispatch events (notice: do not dispatch gtc_user_kicked as that is reserved for admin kicks)
      window.dispatchEvent(new CustomEvent("gtc_crm_updated"));
      window.dispatchEvent(new CustomEvent("gtc_account_deleted", { detail: { uid: userId, email: cleanEmail } }));

      return true;
    } catch (err: any) {
      console.error("Error in deleteOwnAccount:", err);
      throw err;
    }
  }

  /**
   * Selectively purge chosen categories of spiritual records for a user
   * (e.g. notes, dreams/visions, reading progress, bookmarks/highlights).
   */
  static async purgeSelectiveData(
    userId: string,
    options: {
      notes?: boolean;
      dreams?: boolean;
      reading?: boolean;
      bookmarks?: boolean;
      prayers?: boolean;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (options.notes) {
        try {
          const snap = await getDocs(collection(db, `users/${userId}/notes`));
          if (!snap.empty) {
            await Promise.allSettled(snap.docs.map((d) => deleteDoc(d.ref)));
          }
        } catch (e) {
          console.warn("Could not purge notes from Firestore:", e);
        }
        Storage.clearNotes();
        window.dispatchEvent(new CustomEvent("gtc_notes_updated"));
      }

      if (options.dreams) {
        try {
          const snapD = await getDocs(collection(db, `users/${userId}/dreams`));
          if (!snapD.empty) {
            await Promise.allSettled(snapD.docs.map((d) => deleteDoc(d.ref)));
          }
          const snapV = await getDocs(collection(db, `users/${userId}/visions`));
          if (!snapV.empty) {
            await Promise.allSettled(snapV.docs.map((d) => deleteDoc(d.ref)));
          }
        } catch (e) {
          console.warn("Could not purge dreams/visions from Firestore:", e);
        }
        Storage.clearDreams();
        Storage.clearVisions();
        window.dispatchEvent(new CustomEvent("gtc_dreams_updated"));
      }

      if (options.reading) {
        try {
          const snapR = await getDocs(collection(db, `users/${userId}/readingProgress`));
          if (!snapR.empty) {
            await Promise.allSettled(snapR.docs.map((d) => deleteDoc(d.ref)));
          }
          const snapS = await getDocs(collection(db, `users/${userId}/studyProgress`));
          if (!snapS.empty) {
            await Promise.allSettled(snapS.docs.map((d) => deleteDoc(d.ref)));
          }
        } catch (e) {
          console.warn("Could not purge reading progress from Firestore:", e);
        }
        Storage.clearStudyProgress();
        window.dispatchEvent(new CustomEvent("gtc_reading_updated"));
      }

      if (options.bookmarks) {
        try {
          const snapB = await getDocs(collection(db, `users/${userId}/bookmarks`));
          if (!snapB.empty) {
            await Promise.allSettled(snapB.docs.map((d) => deleteDoc(d.ref)));
          }
          const snapH = await getDocs(collection(db, `users/${userId}/highlights`));
          if (!snapH.empty) {
            await Promise.allSettled(snapH.docs.map((d) => deleteDoc(d.ref)));
          }
        } catch (e) {
          console.warn("Could not purge bookmarks/highlights from Firestore:", e);
        }
        Storage.clearBookmarks();
        Storage.clearHighlights();
        window.dispatchEvent(new CustomEvent("gtc_bookmarks_updated"));
      }

      if (options.prayers) {
        try {
          const snapP = await getDocs(collection(db, `users/${userId}/prayers`));
          if (!snapP.empty) {
            await Promise.allSettled(snapP.docs.map((d) => deleteDoc(d.ref)));
          }
        } catch (e) {
          console.warn("Could not purge prayers from Firestore:", e);
        }
        Storage.clearUserPrayers();
        window.dispatchEvent(new CustomEvent("gtc_prayers_updated"));
      }

      return { success: true, message: "Selected records have been cleared." };
    } catch (err: any) {
      console.error("purgeSelectiveData error:", err);
      return { success: false, message: err?.message || "Failed to purge selected records." };
    }
  }

  /**
   * Update a user's role in CRM and Firestore
   */
  static async updateUserRole(userId: string, email: string, newRole: any): Promise<boolean> {
    try {
      // 1. Update in Firestore
      try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { role: newRole });
      } catch (e) {
        console.warn("Firestore role update note:", e);
      }

      // 2. Update in local storage CRM
      Storage.updateJoinedMemberRole(userId, newRole);
      if (email) Storage.updateJoinedMemberRole(email, newRole);

      // 3. Update in local accounts registry
      try {
        const raw = localStorage.getItem("gtc_local_user_accounts");
        if (raw) {
          const accounts = JSON.parse(raw);
          const cleanEmail = email.toLowerCase().trim();
          if (accounts[cleanEmail]) {
            accounts[cleanEmail].profile = { ...accounts[cleanEmail].profile, role: newRole };
            localStorage.setItem("gtc_local_user_accounts", JSON.stringify(accounts));
          }
        }
      } catch {}

      window.dispatchEvent(new CustomEvent("gtc_crm_updated"));
      return true;
    } catch (err) {
      console.error("updateUserRole error:", err);
      return false;
    }
  }

  /**
   * Revoke session without full account deletion (Kick user session)
   */
  static async kickUserSession(userId: string, email: string, reason?: string): Promise<boolean> {
    const cleanEmail = (email || "").toLowerCase().trim();
    try {
      // Broadcast kick signal
      window.dispatchEvent(
        new CustomEvent("gtc_user_kicked", { detail: { uid: userId, email: cleanEmail, reason } })
      );
      Storage.revokeUser(userId, cleanEmail);
      window.dispatchEvent(new CustomEvent("gtc_crm_updated"));
      return true;
    } catch (err) {
      console.error("kickUserSession error:", err);
      return false;
    }
  }

  /**
   * Delete an account completely (Admin-initiated from CRM):
   * deletes user from Firestore, purges subcollections, removes from CRM,
   * invokes Firebase Auth account deletion, and broadcasts real-time kick signal.
   */
  static async deleteUserAccount(userId: string, email: string, reason?: string): Promise<boolean> {
    const cleanEmail = (email || "").toLowerCase().trim();

    try {
      // 1. Purge all private Firestore subcollections
      await this.purgeUserFirestoreSubcollections(userId);

      // 2. Revoke and remove locally
      Storage.revokeUser(userId, cleanEmail);
      Storage.deleteJoinedMember(userId);
      if (cleanEmail) Storage.deleteJoinedMember(cleanEmail);

      // 3. Delete Firestore document
      try {
        const userRef = doc(db, "users", userId);
        await deleteDoc(userRef);
      } catch (err) {
        console.warn("Could not delete user doc from Firestore:", err);
      }

      // 4. Request server-side Firebase Auth user deletion
      try {
        await fetch("/api/admin/delete-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: userId, email: cleanEmail, reason })
        });
      } catch (apiErr) {
        console.warn("Could not reach backend /api/admin/delete-user:", apiErr);
      }

      // 5. Remove from local accounts registry
      try {
        const raw = localStorage.getItem("gtc_local_user_accounts");
        if (raw) {
          const accounts = JSON.parse(raw);
          if (accounts[cleanEmail]) {
            delete accounts[cleanEmail];
            localStorage.setItem("gtc_local_user_accounts", JSON.stringify(accounts));
          }
        }
      } catch {}

      // 6. Dispatch real-time kick and CRM update events
      window.dispatchEvent(
        new CustomEvent("gtc_user_kicked", { detail: { uid: userId, email: cleanEmail } })
      );
      window.dispatchEvent(new CustomEvent("gtc_crm_updated"));

      return true;
    } catch (err) {
      console.error("Error in deleteUserAccount:", err);
      return false;
    }
  }
}
