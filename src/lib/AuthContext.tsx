import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  FirebaseUser
} from "./firebase";
import { UserProfile, UserRole } from "../types";
import { Storage, DEFAULT_USER, APOSTLE_SANGO_ADMIN } from "./storage";
import { UserDataService } from "./userDataService";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  emailVerified?: boolean;
  isAnonymous?: boolean;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  country?: string;
  password?: string;
  avatarUrl?: string;
  interests?: string[];
}

interface AuthContextType {
  currentUser: FirebaseUser | AppUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  kickedNotice: string | null;
  clearKickedNotice: () => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: SignUpData) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
  isRegistered: boolean;
}

const SESSION_KEY = "gtc_active_auth_session";
const REGISTRY_KEY = "gtc_local_user_accounts";

interface SavedSession {
  user: AppUser;
  profile: UserProfile;
}

interface StoredAccount {
  user: AppUser;
  profile: UserProfile;
  passHash: string;
}

function getStoredAccounts(): Record<string, StoredAccount> {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    const accounts: Record<string, StoredAccount> = raw ? JSON.parse(raw) : {};

    // Pre-seed the requested Admin accounts for Richard Sango
    const adminEmails = ["info@globaltowerofchrist.com", "sangorichard@gmail.com"];
    adminEmails.forEach((adminEmail) => {
      if (!accounts[adminEmail]) {
        accounts[adminEmail] = {
          user: {
            uid: APOSTLE_SANGO_ADMIN.id,
            email: adminEmail,
            displayName: "Richard Sango",
            photoURL: APOSTLE_SANGO_ADMIN.avatarUrl || null,
            emailVerified: true
          },
          profile: {
            ...APOSTLE_SANGO_ADMIN,
            email: adminEmail
          },
          passHash: btoa("G0d1sg0od")
        };
      }
    });
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(accounts));

    return accounts;
  } catch {
    return {
      "info@globaltowerofchrist.com": {
        user: {
          uid: APOSTLE_SANGO_ADMIN.id,
          email: "info@globaltowerofchrist.com",
          displayName: "Richard Sango",
          photoURL: APOSTLE_SANGO_ADMIN.avatarUrl || null,
          emailVerified: true
        },
        profile: APOSTLE_SANGO_ADMIN,
        passHash: btoa("G0d1sg0od")
      },
      "sangorichard@gmail.com": {
        user: {
          uid: APOSTLE_SANGO_ADMIN.id,
          email: "sangorichard@gmail.com",
          displayName: "Richard Sango",
          photoURL: APOSTLE_SANGO_ADMIN.avatarUrl || null,
          emailVerified: true
        },
        profile: { ...APOSTLE_SANGO_ADMIN, email: "sangorichard@gmail.com" },
        passHash: btoa("G0d1sg0od")
      }
    };
  }
}

function saveStoredAccount(email: string, user: AppUser, profile: UserProfile, pass: string) {
  try {
    const accounts = getStoredAccounts();
    accounts[email.toLowerCase().trim()] = {
      user,
      profile,
      passHash: btoa(pass)
    };
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn("Could not save local user account:", e);
  }
}

function getSavedSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveActiveSession(session: SavedSession) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.warn("Could not save active session:", e);
  }
}

function clearActiveSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.warn("Could not clear active session:", e);
  }
}

function isFirebaseAuthUnavailable(err: any): boolean {
  if (!err) return false;
  const code = String(err.code || "");
  const msg = String(err.message || "");
  return (
    code.includes("api-key-not-valid") ||
    code.includes("invalid-api-key") ||
    code.includes("api-key") ||
    code.includes("configuration-not-found") ||
    code.includes("internal-error") ||
    code.includes("network-request-failed") ||
    code.includes("operation-not-allowed") ||
    msg.includes("api-key-not-valid") ||
    msg.includes("API key not valid") ||
    msg.includes("pass a valid api key")
  );
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronously restore active session or stored user on mount to eliminate initial loading delays
  const [currentUser, setCurrentUser] = useState<FirebaseUser | AppUser | null>(() => {
    try {
      const active = getSavedSession();
      if (active?.user && !Storage.isUserRevoked(active.user.uid, active.user.email)) {
        return active.user;
      }
      const existingUser = Storage.getUser();
      if (existingUser && existingUser.id !== DEFAULT_USER.id && !Storage.isUserRevoked(existingUser.id, existingUser.email)) {
        return {
          uid: existingUser.id,
          email: existingUser.email,
          displayName: existingUser.name,
          photoURL: existingUser.avatarUrl
        };
      }
    } catch {}
    return null;
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const active = getSavedSession();
      if (active?.profile && !Storage.isUserRevoked(active.profile.id, active.profile.email)) {
        return active.profile;
      }
      const existingUser = Storage.getUser();
      if (existingUser && existingUser.id !== DEFAULT_USER.id && !Storage.isUserRevoked(existingUser.id, existingUser.email)) {
        return existingUser;
      }
    } catch {}
    return null;
  });

  // Zero-delay initial entry: no blocking screen on app start
  const [loading, setLoading] = useState(false);
  const [kickedNotice, setKickedNotice] = useState<string | null>(null);

  const clearKickedNotice = () => setKickedNotice(null);

  // Dedicated Kick Listener: Whenever active user is revoked or deleted from Firestore, immediately kick them
  useEffect(() => {
    if (!currentUser || !currentUser.uid) return;

    const founderEmails = [
      "info@globaltowerofchrist.com",
      "sangorichard@gmail.com",
      "sangodeyvin@gmail.com"
    ];
    const isFounder =
      founderEmails.includes(currentUser.email?.toLowerCase().trim() || "") ||
      currentUser.uid === "u-admin-rsango";
    if (isFounder) return;

    const performKick = (reason?: string) => {
      const msg =
        reason ||
        "Your account has been deleted by ministry leadership. You have been disconnected from Firebase Auth and kicked from the app.";
      setKickedNotice(msg);

      // Attempt to delete client user from Firebase Auth if possible
      try {
        if ("delete" in currentUser && typeof (currentUser as any).delete === "function") {
          (currentUser as any).delete().catch(() => {});
        }
      } catch {}

      try {
        fbSignOut(auth).catch(() => {});
      } catch {}

      clearActiveSession();
      UserDataService.clearUserData();
      Storage.clearUser();
      setCurrentUser(null);
      setUserProfile(null);
    };

    // Check revocation cache immediately
    if (Storage.isUserRevoked(currentUser.uid, currentUser.email || "")) {
      performKick();
      return;
    }

    // 1. Listen for real-time kick broadcast
    const handleKickEvent = (e: any) => {
      const kickedUid = e.detail?.uid;
      const kickedEmail = e.detail?.email?.toLowerCase().trim();
      if (
        (kickedUid && kickedUid === currentUser.uid) ||
        (kickedEmail && kickedEmail === currentUser.email?.toLowerCase().trim())
      ) {
        performKick();
      }
    };
    window.addEventListener("gtc_user_kicked", handleKickEvent);

    // 2. Real-time Firestore snapshot listener on user document
    let unsubDoc: (() => void) | null = null;
    try {
      unsubDoc = onSnapshot(
        doc(db, "users", currentUser.uid),
        (docSnap) => {
          if (!docSnap.exists() && Storage.isUserRevoked(currentUser.uid, currentUser.email || "")) {
            performKick();
          }
        },
        () => {}
      );
    } catch {}

    return () => {
      window.removeEventListener("gtc_user_kicked", handleKickEvent);
      if (unsubDoc) unsubDoc();
    };
  }, [currentUser?.uid, currentUser?.email]);

  useEffect(() => {
    // 1. Immediately restore existing session or profile so UI is responsive and never locked
    const active = getSavedSession();
    if (active) {
      if (Storage.isUserRevoked(active.user?.uid, active.user?.email || active.profile?.email)) {
        clearActiveSession();
        Storage.clearUser();
        setCurrentUser(null);
        setUserProfile(null);
        setLoading(false);
        return;
      }
      if (active.profile) {
        const founderEmails = [
          "info@globaltowerofchrist.com",
          "sangorichard@gmail.com",
          "sangodeyvin@gmail.com"
        ];
        const isFounder = founderEmails.includes(active.profile.email?.toLowerCase().trim() || "");
        if (isFounder) {
          active.profile.role = "super_admin";
          if (!active.profile.name || active.profile.name === "Richard Sango" || active.profile.name === "Deyvin Richard Jnr Sango") {
            active.profile.name = "Apostle R.Sango";
            active.profile.firstName = "Apostle";
            active.profile.lastName = "R.Sango";
          }
          if (active.user && (!active.user.displayName || active.user.displayName === "Richard Sango")) {
            active.user.displayName = active.profile.name;
          }
        } else {
          // Anyone else who enters is strictly beloved brethren
          active.profile.role = "user";
        }
        saveActiveSession(active);
      }
      setCurrentUser(active.user);
      setUserProfile(active.profile);
      Storage.setUser(active.profile);
      setLoading(false);
    } else {
      const existingUser = Storage.getUser();
      if (existingUser && existingUser.id !== DEFAULT_USER.id) {
        if (Storage.isUserRevoked(existingUser.id, existingUser.email)) {
          Storage.clearUser();
          setLoading(false);
          return;
        }
        const restoredUser: AppUser = {
          uid: existingUser.id,
          email: existingUser.email,
          displayName: existingUser.name,
          photoURL: existingUser.avatarUrl
        };
        setCurrentUser(restoredUser);
        setUserProfile(existingUser);
        saveActiveSession({ user: restoredUser, profile: existingUser });
        setLoading(false);
      }
    }

    // 2. Attach Firebase Auth observer with error resilience
    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          if (firebaseUser) {
            if (Storage.isUserRevoked(firebaseUser.uid, firebaseUser.email || "")) {
              try {
                await fbSignOut(auth);
              } catch {}
              setCurrentUser(null);
              setUserProfile(null);
              setLoading(false);
              return;
            }
            setCurrentUser(firebaseUser);
            setLoading(false);

            // Fetch and sync Firestore in background without delaying UI load
            (async () => {
              try {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                const founderEmails = [
                  "info@globaltowerofchrist.com",
                  "sangorichard@gmail.com",
                  "sangodeyvin@gmail.com"
                ];
                const isFounder = founderEmails.includes(firebaseUser.email?.toLowerCase().trim() || "");

                if (userDoc.exists()) {
                  const data = userDoc.data() as UserProfile;
                  if (isFounder) {
                    data.role = "super_admin";
                  } else {
                    data.role = "user";
                  }
                  setUserProfile(data);
                  Storage.setUser(data);
                  saveActiveSession({ user: firebaseUser, profile: data });
                } else {
                  const initialProfile: UserProfile = {
                    id: firebaseUser.uid,
                    name: isFounder ? "Apostle R.Sango" : (firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Beloved Brethren"),
                    firstName: isFounder ? "Apostle" : (firebaseUser.displayName?.split(" ")[0] || "Beloved"),
                    lastName: isFounder ? "R.Sango" : (firebaseUser.displayName?.split(" ").slice(1).join(" ") || "Brethren"),
                    email: firebaseUser.email || "",
                    role: isFounder ? "super_admin" : "user",
                    avatarUrl: firebaseUser.photoURL || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80`,
                    interests: ["Bible Study", "Prayer", "Sermons", "Worship", "Dominion", "Victory", "Dreams & Visions Interpretation"],
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
                      profilePublic: false,
                      shareActivity: false,
                      allowDirectMessages: true,
                    },
                    createdAt: new Date().toISOString(),
                    isEarlyAccess: true,
                  };

                  setDoc(userDocRef, initialProfile).catch(() => {});
                  Storage.saveJoinedMember(initialProfile);
                  setUserProfile(initialProfile);
                  Storage.setUser(initialProfile);
                  saveActiveSession({ user: firebaseUser, profile: initialProfile });
                }

                await UserDataService.syncUserDataFromFirestore(firebaseUser.uid);
              } catch (err) {
                console.warn("Could not sync profile from Firestore:", err);
              }
            })();
          } else {
            setLoading(false);
          }
        },
        (authError) => {
          console.warn("Firebase Auth listener encountered error, retaining active session:", authError);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn("Could not subscribe to onAuthStateChanged:", e);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const cleanEmail = email.toLowerCase().trim();

    // Prevent revoked / deleted accounts from accessing the application
    if (Storage.isUserRevoked(undefined, cleanEmail)) {
      throw new Error("This account has been deleted by ministry leadership. Access is terminated.");
    }

    // Check pre-configured Richard Sango Admin Credentials
    const founderEmails = ["info@globaltowerofchrist.com", "sangorichard@gmail.com", "sangodeyvin@gmail.com"];
    const isFounder = founderEmails.includes(cleanEmail);

    if (isFounder && pass === "G0d1sg0od") {
      let fbUser: any = null;
      // Attempt to authenticate or register directly on Firebase Auth
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        fbUser = cred.user;
      } catch (authErr: any) {
        if (authErr?.code === "auth/user-not-found" || authErr?.code === "auth/invalid-credential") {
          try {
            const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
            fbUser = cred.user;
          } catch (createErr) {
            console.warn("Could not create founder in Firebase Auth:", createErr);
          }
        }
      }

      const accounts = getStoredAccounts();
      const existingStored = accounts[cleanEmail];
      const uid = fbUser?.uid || existingStored?.user?.uid || APOSTLE_SANGO_ADMIN.id;
      const adminUser: AppUser = {
        uid,
        email: cleanEmail,
        displayName: existingStored?.user?.displayName || existingStored?.profile?.name || "Apostle R.Sango",
        photoURL: existingStored?.user?.photoURL || existingStored?.profile?.avatarUrl || APOSTLE_SANGO_ADMIN.avatarUrl || null,
        emailVerified: true
      };
      const adminProfile: UserProfile = {
        ...(existingStored?.profile || APOSTLE_SANGO_ADMIN),
        id: uid,
        name: existingStored?.profile?.name || "Apostle R.Sango",
        firstName: existingStored?.profile?.firstName || "Apostle",
        lastName: existingStored?.profile?.lastName || "R.Sango",
        email: cleanEmail,
        role: "super_admin",
        favoriteTeachers: ["Apostle R.Sango"]
      };

      // Non-blocking Firestore sync for immediate entry
      setDoc(doc(db, "users", uid), adminProfile, { merge: true }).catch((err) => {
        console.warn("Could not sync admin to Firestore:", err);
      });

      saveStoredAccount(cleanEmail, adminUser, adminProfile, pass);
      Storage.saveJoinedMember(adminProfile);
      saveActiveSession({ user: adminUser, profile: adminProfile });
      setCurrentUser(adminUser);
      setUserProfile(adminProfile);
      Storage.setUser(adminProfile);
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      if (cred.user) {
        // Immediate local resolution: check if we have stored profile
        const accounts = getStoredAccounts();
        const stored = accounts[cleanEmail];
        const initialProfile: UserProfile = stored?.profile || {
          ...DEFAULT_USER,
          id: cred.user.uid,
          name: cred.user.displayName || cleanEmail.split("@")[0] || "Beloved Brethren",
          firstName: cred.user.displayName?.split(" ")[0] || "Beloved",
          lastName: cred.user.displayName?.split(" ").slice(1).join(" ") || "Brethren",
          email: cleanEmail,
          role: isFounder ? "super_admin" : "user",
          avatarUrl: cred.user.photoURL || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80`
        };

        setCurrentUser(cred.user);
        setUserProfile(initialProfile);
        Storage.setUser(initialProfile);
        saveActiveSession({ user: cred.user, profile: initialProfile });
        saveStoredAccount(cleanEmail, cred.user, initialProfile, pass);

        // Run full database synchronization in parallel background without blocking the user
        (async () => {
          try {
            const userDocRef = doc(db, "users", cred.user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const data = userDoc.data() as UserProfile;
              setUserProfile(data);
              Storage.setUser(data);
              saveActiveSession({ user: cred.user, profile: data });
            }
          } catch {}
          UserDataService.syncUserDataFromFirestore(cred.user.uid).catch(() => {});
        })();

        return;
      }
    } catch (fbErr: any) {
      console.warn("Firebase signIn failed:", fbErr?.code || fbErr?.message);
      if (isFirebaseAuthUnavailable(fbErr)) {
        // Fallback to local accounts registry
        const accounts = getStoredAccounts();
        const existing = accounts[cleanEmail];

        if (existing) {
          if (existing.passHash && existing.passHash !== btoa(pass)) {
            const err = new Error("Invalid email or password.") as any;
            err.code = "auth/wrong-password";
            throw err;
          }
          saveActiveSession({ user: existing.user, profile: existing.profile });
          setCurrentUser(existing.user);
          setUserProfile(existing.profile);
          Storage.setUser(existing.profile);
          return;
        }

        const displayName = isFounder ? "Apostle R.Sango" : (cleanEmail.split("@")[0] || "Beloved Brethren");

        const profile: UserProfile = {
          ...DEFAULT_USER,
          id: isFounder ? APOSTLE_SANGO_ADMIN.id : `u-local-${cleanEmail.replace(/[^a-zA-Z0-9]/g, "-")}`,
          name: displayName,
          firstName: isFounder ? "Apostle" : (displayName.split(" ")[0] || "Beloved"),
          lastName: isFounder ? "R.Sango" : (displayName.split(" ").slice(1).join(" ") || "Brethren"),
          email: cleanEmail,
          role: isFounder ? "super_admin" : "user",
          favoriteTeachers: ["Apostle R.Sango"]
        };
        const user: AppUser = {
          uid: profile.id,
          email: cleanEmail,
          displayName: profile.name,
          photoURL: profile.avatarUrl,
          emailVerified: true
        };
        saveStoredAccount(cleanEmail, user, profile, pass);
        Storage.saveJoinedMember(profile);
        saveActiveSession({ user, profile });
        setCurrentUser(user);
        setUserProfile(profile);
        Storage.setUser(profile);
        return;
      }

      throw fbErr;
    }
  };

  const register = async (data: SignUpData) => {
    if (!data.password || data.password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }
    
    const cleanEmail = data.email.toLowerCase().trim();
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim() || cleanEmail.split("@")[0];
    const chosenAvatar = data.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`;

    let uid: string;
    let authUser: FirebaseUser | AppUser;

    try {
      // 1. Attempt to create real user in Firebase Authentication
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
      uid = cred.user.uid;
      authUser = cred.user;

      try {
        await updateProfile(cred.user, {
          displayName: fullName,
          photoURL: chosenAvatar.startsWith("http") ? chosenAvatar : undefined
        });
      } catch (e) {
        console.warn("Could not set displayName on Firebase Auth user:", e);
      }
    } catch (fbErr: any) {
      console.warn("Firebase createUser failed:", fbErr?.code || fbErr?.message);
      if (isFirebaseAuthUnavailable(fbErr)) {
        // Fall back gracefully to local authenticated member identity
        uid = `u-member-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
        authUser = {
          uid,
          email: cleanEmail,
          displayName: fullName,
          photoURL: chosenAvatar,
          emailVerified: true
        };
      } else {
        // Legitimate validation errors (e.g. email-already-in-use)
        throw fbErr;
      }
    }

    // 2. Build UserProfile (All newly registered accounts are ALWAYS role: "user")
    const newProfile: UserProfile = {
      id: uid,
      name: fullName,
      firstName: data.firstName.trim() || fullName.split(" ")[0],
      lastName: data.lastName.trim() || fullName.split(" ").slice(1).join(" "),
      email: cleanEmail,
      phoneNumber: data.phoneNumber?.trim() || "",
      country: data.country?.trim() || "Global",
      role: "user", // Enforce standard user role; no admin option visible or granted
      avatarUrl: chosenAvatar,
      interests: data.interests && data.interests.length > 0 ? data.interests : ["Bible Study", "Prayer", "Sermons", "Worship", "Dominion", "Victory"],
      favoriteTeachers: ["Richard Sango"],
      notificationPrefs: {
        dailyScripture: true,
        newSermons: true,
        bibleStudyReminders: true,
        liveEvents: false,
        prayerReminders: true,
        announcements: true,
      },
      privacyPrefs: {
        profilePublic: false,
        shareActivity: false,
        allowDirectMessages: true,
      },
      createdAt: new Date().toISOString(),
      isEarlyAccess: true,
    };

    // 3. Automatically create user profile document in Firebase Firestore (non-blocking background sync)
    setDoc(doc(db, "users", uid), newProfile).catch((fsErr) => {
      console.warn("Could not write profile to Firestore, safely stored in local registry:", fsErr);
    });

    // 4. Save account to local CRM registry & active session
    saveStoredAccount(cleanEmail, authUser, newProfile, data.password);
    Storage.saveJoinedMember(newProfile);
    saveActiveSession({ user: authUser, profile: newProfile });

    // 5. Update application state
    setCurrentUser(authUser);
    setUserProfile(newProfile);
    Storage.setUser(newProfile);

    // Auto-update CRM: Notify application that a new believer has registered
    window.dispatchEvent(
      new CustomEvent("gtc_member_registered", { detail: newProfile })
    );
    window.dispatchEvent(new CustomEvent("gtc_crm_updated", { detail: newProfile }));
  };

  const continueAsGuest = () => {
    const guestProfile: UserProfile = {
      ...DEFAULT_USER,
      id: "u-guest-visitor",
      name: "Beloved Pilgrim",
      firstName: "Beloved",
      lastName: "Pilgrim",
      email: "visitor@globaltowerofchrist.org",
      role: "user",
      isEarlyAccess: true
    };
    const guestUser: AppUser = {
      uid: guestProfile.id,
      email: guestProfile.email,
      displayName: guestProfile.name,
      photoURL: guestProfile.avatarUrl,
      emailVerified: false,
      isAnonymous: true
    };
    saveActiveSession({ user: guestUser, profile: guestProfile });
    setCurrentUser(guestUser);
    setUserProfile(guestProfile);
    Storage.setUser(guestProfile);
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn("Error signing out from Firebase Auth:", e);
    }
    clearActiveSession();
    UserDataService.clearUserData();
    setUserProfile(null);
    setCurrentUser(null);
  };

  const resetPassword = async (email: string) => {
    const cleanEmail = email.toLowerCase().trim();
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch (err: any) {
      if (isFirebaseAuthUnavailable(err)) {
        console.warn("Firebase Auth reset password offline fallback");
        return;
      }
      throw err;
    }
  };

  const updateProfileData = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...updates };

    const founderEmails = [
      "info@globaltowerofchrist.com",
      "sangorichard@gmail.com",
      "sangodeyvin@gmail.com"
    ];
    const isFounder = founderEmails.includes((updated.email || userProfile.email || "").toLowerCase().trim());
    if (!isFounder) {
      updated.role = "user";
    } else {
      updated.role = "super_admin";
    }

    setUserProfile(updated);
    Storage.setUser(updated);

    // Also update stored accounts in local registry if present
    const cleanEmail = (updated.email || userProfile.email || "").toLowerCase().trim();
    try {
      const accounts = getStoredAccounts();
      if (accounts[cleanEmail]) {
        accounts[cleanEmail].profile = updated;
        if (accounts[cleanEmail].user) {
          accounts[cleanEmail].user.displayName = updated.name;
          accounts[cleanEmail].user.photoURL = updated.avatarUrl || null;
        }
        localStorage.setItem(REGISTRY_KEY, JSON.stringify(accounts));
      }
    } catch {}

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        displayName: updates.name || currentUser.displayName,
        photoURL: updates.avatarUrl || currentUser.photoURL
      };
      setCurrentUser(updatedUser);
      saveActiveSession({ user: updatedUser, profile: updated });

      try {
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, updated, { merge: true });
      } catch (e) {
        console.warn("Could not sync profile update to Firestore:", e);
      }

      // If avatar or name updated, also update Firebase Auth profile if available
      try {
        if ("getIdToken" in currentUser && (updates.name || updates.avatarUrl)) {
          await updateProfile(currentUser as FirebaseUser, {
            displayName: updates.name || userProfile.name,
            photoURL: updates.avatarUrl?.startsWith("http") ? updates.avatarUrl : undefined
          });
        }
      } catch (err) {
        console.warn("Could not update auth profile:", err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        kickedNotice,
        clearKickedNotice,
        login,
        register,
        continueAsGuest,
        logout,
        resetPassword,
        updateProfileData,
        isRegistered: !!currentUser
      }}
    >
      {children}
      {kickedNotice && (
        <div className="fixed bottom-6 right-6 max-w-md bg-[#2D2D2D] text-white p-5 rounded-2xl shadow-2xl border border-rose-500/40 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="font-serif font-bold text-amber-300 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Session Terminated by Leadership
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">{kickedNotice}</p>
            </div>
            <button
              onClick={clearKickedNotice}
              className="text-stone-400 hover:text-white text-xs px-2 py-1 rounded bg-stone-800 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
