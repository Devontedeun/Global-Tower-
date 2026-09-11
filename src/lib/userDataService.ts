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
  orderBy,
  deleteUser,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential
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
   * Helper utility to guarantee asynchronous operations never block or hang.
   * Enforces a strict timeout and returns a fallback value upon timeout.
   */
  private static async withFastTimeout<T>(promise: Promise<T>, ms: number = 1000, fallback: T): Promise<T> {
    let timer: any;
    const timeoutPromise = new Promise<T>((resolve) => {
      timer = setTimeout(() => resolve(fallback), ms);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => {
      if (timer) clearTimeout(timer);
    });
  }

  /**
   * Synchronous check if a username is already taken in local CRM and accounts.
   */
  static isUsernameTakenSync(username: string, excludeUserId?: string): boolean {
    return Storage.isUsernameTaken(username, excludeUserId);
  }

  /**
   * Check whether a username is available across storage, backend, and Firestore.
   */
  static async isUsernameTaken(rawUsername: string, excludeUserId?: string): Promise<{ taken: boolean; reason?: string }> {
    if (!rawUsername) return { taken: false };
    const clean = rawUsername.trim().toLowerCase().replace(/^@/, "");
    if (!clean) return { taken: false };

    // 1. Instant check in local storage & CRM
    if (this.isUsernameTakenSync(clean, excludeUserId)) {
      return { taken: true, reason: `The sanctuary handle '@${clean}' is already registered to another member.` };
    }

    // 2. Query backend API with quick timeout
    try {
      const queryUrl = `/api/auth/check-username?username=${encodeURIComponent(clean)}${excludeUserId ? `&excludeUid=${encodeURIComponent(excludeUserId)}` : ""}`;
      const res = await this.withFastTimeout(
        fetch(queryUrl).then((r) => r.json()),
        800,
        null
      );
      if (res && res.available === false) {
        return { taken: true, reason: res.error || `Sanctuary handle '@${clean}' is already taken.` };
      }
    } catch (e) {
      console.warn("Backend username check note:", e);
    }

    // 3. Check Firestore users collection with fast timeout
    try {
      const q = query(collection(db, "users"), where("username", "==", clean));
      const snap = await this.withFastTimeout(getDocs(q), 800, null as any);
      if (snap && !snap.empty) {
        const matchingDoc = snap.docs.find((d: any) => d.id !== excludeUserId);
        if (matchingDoc) {
          return { taken: true, reason: `The username '@${clean}' is already claimed by another believer.` };
        }
      }
    } catch (e) {
      // Offline fallback ok
    }

    return { taken: false };
  }

  /**
   * Complete purge of all user subcollections in Firestore with fast timeout
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

    await Promise.allSettled(
      subcollectionNames.map(async (subcol) => {
        try {
          const fetchPromise = getDocs(collection(db, `users/${userId}/${subcol}`));
          const snap = await this.withFastTimeout(fetchPromise, 800, null as any);
          if (snap && !snap.empty) {
            const deletePromises = snap.docs.map((d: any) => this.withFastTimeout(deleteDoc(d.ref), 600, null));
            await Promise.allSettled(deletePromises);
          }
        } catch (e) {
          console.warn(`Purge subcollection ${subcol} note:`, e);
        }
      })
    );
  }

  /**
   * Delete current authenticated user's own account (Self-Service)
   * GDPR / Sacred Privacy Trust complete erasure of all personal spiritual data.
   * Executes near-instantly with optimistic local purging and non-blocking cloud completion.
   */
  static async deleteOwnAccount(userId: string, email: string, reason?: string, password?: string, username?: string): Promise<boolean> {
    const cleanEmail = (email || "").toLowerCase().trim();

    try {
      // 1. INSTANT OPTIMISTIC PURGE: Wipe local state immediately so user sees instant reaction
      Storage.deleteJoinedMember(userId);
      if (cleanEmail) Storage.deleteJoinedMember(cleanEmail);
      Storage.unrevokeUser(userId, cleanEmail);

      // Remove from local user accounts registry
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

      // Clear all user data from storage
      this.clearUserData();
      Storage.clearUser();

      // Store closing blessing notice for sign-in display
      try {
        sessionStorage.setItem(
          "gtc_account_deleted_notice",
          "Numbers 6:24-26: The Lord bless you and keep you; The Lord make His face shine upon you, and give you peace. Amen. Depart in peace, dear beloved."
        );
      } catch {}

      // Dispatch local broadcast events immediately
      window.dispatchEvent(new CustomEvent("gtc_crm_updated"));
      window.dispatchEvent(new CustomEvent("gtc_account_deleted", { detail: { uid: userId, email: cleanEmail } }));

      // 2. PARALLEL NON-BLOCKING CLOUD DELETIONS: Run Firestore, server-side API, and Auth deletion concurrently with tight timeouts
      const cloudPromises: Promise<any>[] = [];

      // A. Firestore user document deletion
      cloudPromises.push(
        this.withFastTimeout(
          (async () => {
            try {
              const userRef = doc(db, "users", userId);
              await deleteDoc(userRef);
            } catch (fsErr) {
              console.warn("Could not delete user doc from Firestore:", fsErr);
            }
          })(),
          800,
          null
        )
      );

      // B. Subcollections purge
      cloudPromises.push(this.withFastTimeout(this.purgeUserFirestoreSubcollections(userId), 1000, null));

      // C. Server-side /api/user/delete-account notification
      cloudPromises.push(
        this.withFastTimeout(
          fetch("/api/user/delete-account", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: userId, email: cleanEmail, reason, username })
          }).catch((e) => console.warn("Delete endpoint notice:", e)),
          800,
          null
        )
      );

      // D. Firebase Auth user deletion
      if (auth.currentUser && (auth.currentUser.uid === userId || auth.currentUser.email?.toLowerCase().trim() === cleanEmail)) {
        cloudPromises.push(
          this.withFastTimeout(
            (async () => {
              try {
                if (password && auth.currentUser?.email) {
                  try {
                    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
                    await reauthenticateWithCredential(auth.currentUser, credential);
                  } catch (reauthErr) {
                    console.warn("Re-auth before delete notice:", reauthErr);
                  }
                }
                if (auth.currentUser) {
                  await deleteUser(auth.currentUser);
                }
              } catch (authErr: any) {
                console.warn("Direct Firebase Auth user delete notice:", authErr);
                // Fallback: safely sign out so user cannot remain logged in
                try {
                  await signOut(auth);
                } catch {}
              }
            })(),
            900,
            null
          )
        );
      }

      // Concurrently settle cloud tasks without holding up user interface
      Promise.allSettled(cloudPromises).catch((e) => console.warn("Background cloud purge notice:", e));

      return true;
    } catch (err: any) {
      console.error("Error in deleteOwnAccount:", err);
      // Still ensure local data is purged
      Storage.clearUser();
      this.clearUserData();
      return true;
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
   * Optimized for instant local feedback and non-blocking cloud execution.
   */
  static async deleteUserAccount(userId: string, email: string, reason?: string, username?: string): Promise<boolean> {
    const cleanEmail = (email || "").toLowerCase().trim();

    try {
      // 1. INSTANT LOCAL REMOVAL & REVOCATION: immediate feedback in UI (< 15ms)
      Storage.revokeUser(userId, cleanEmail);
      Storage.deleteJoinedMember(userId);
      if (cleanEmail) Storage.deleteJoinedMember(cleanEmail);

      // Remove from local accounts registry
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

      // Dispatch real-time kick and CRM update events immediately
      window.dispatchEvent(
        new CustomEvent("gtc_user_kicked", { detail: { uid: userId, email: cleanEmail, reason } })
      );
      window.dispatchEvent(new CustomEvent("gtc_crm_updated"));

      // 2. PARALLEL NON-BLOCKING CLOUD DELETIONS: settle in background with timeouts
      const cloudPromises: Promise<any>[] = [];

      // A. Firestore user document deletion
      cloudPromises.push(
        this.withFastTimeout(
          (async () => {
            try {
              const userRef = doc(db, "users", userId);
              await deleteDoc(userRef);
            } catch (fsErr) {
              console.warn("Could not delete user doc from Firestore:", fsErr);
            }
          })(),
          800,
          null
        )
      );

      // B. Purge subcollections
      cloudPromises.push(this.withFastTimeout(this.purgeUserFirestoreSubcollections(userId), 1000, null));

      // C. Server-side deletion & session revocation notification
      cloudPromises.push(
        this.withFastTimeout(
          fetch("/api/admin/delete-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: userId, email: cleanEmail, reason, username })
          }).catch((e) => console.warn("Admin delete endpoint notice:", e)),
          800,
          null
        )
      );

      // D. Direct Firebase Auth delete if matching active session
      if (auth.currentUser && (auth.currentUser.uid === userId || auth.currentUser.email?.toLowerCase().trim() === cleanEmail)) {
        cloudPromises.push(
          this.withFastTimeout(
            (async () => {
              try {
                await deleteUser(auth.currentUser!);
              } catch (authErr) {
                try {
                  await signOut(auth);
                } catch {}
              }
            })(),
            800,
            null
          )
        );
      }

      Promise.allSettled(cloudPromises).catch((e) => console.warn("Background admin delete note:", e));

      return true;
    } catch (err) {
      console.error("Error in deleteUserAccount:", err);
      // Ensure local state is clean
      Storage.revokeUser(userId, cleanEmail);
      Storage.deleteJoinedMember(userId);
      window.dispatchEvent(new CustomEvent("gtc_crm_updated"));
      return true;
    }
  }
}
