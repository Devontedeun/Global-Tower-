// Firebase Client SDK initialization for Global Tower of Christ SaaS Platform
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
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
  serverTimestamp
} from "firebase/firestore";
import rawFirebaseConfig from "../../firebase-applet-config.json";

// Firebase configuration with valid API key guarantee
const firebaseConfig = {
  ...rawFirebaseConfig,
  apiKey: ((import.meta as any).env?.VITE_FIREBASE_API_KEY as string | undefined) || rawFirebaseConfig.apiKey || "AIzaSyCO23KxuJNVFP2qnCkHFbpHRVYrvQz0Vog"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
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
  serverTimestamp
};
export type { FirebaseUser };
