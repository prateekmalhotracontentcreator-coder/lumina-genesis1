
// Exodus Power Source: Firebase Integration
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ARCHITECT TELEMETRY: Project ID gen-lang-client-0360584699
const ACTUAL_PROJECT_ID = "gen-lang-client-0360584699";
const PROJECT_NUMBER = "360584699";

/** 
 * CRITICAL ALIGNMENT: 
 * Your Firestore instance is named 'lumina-genesis' as seen in the console.
 * We must specify this ID to prevent the SDK from looking for the non-existent '(default)' node.
 */
const DATABASE_ID = "lumina-genesis"; 

const rawKey = process.env.API_KEY || "";
const cleanKey = typeof rawKey === 'string' ? rawKey.trim() : "";

// Masked diagnostic for key verification
if (!cleanKey) {
  console.error("LATTICE CRITICAL: API_KEY environment variable is null.");
} else {
  console.log(`LATTICE SYNC: API Key Active (Verification Suffix: ...${cleanKey.slice(-4)})`);
}

const firebaseConfig = {
  apiKey: cleanKey,
  authDomain: `${ACTUAL_PROJECT_ID}.firebaseapp.com`,
  projectId: ACTUAL_PROJECT_ID,
  storageBucket: `${ACTUAL_PROJECT_ID}.appspot.com`,
  messagingSenderId: PROJECT_NUMBER,
  appId: `1:${PROJECT_NUMBER}:web:lumina01genesis01` 
};

// Initialize with Resilience check
let app;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} catch (e) {
  console.error("Lattice Core Initialization Failed:", e);
  app = initializeApp(firebaseConfig, "fallback-" + Date.now());
}

export const auth = getAuth(app);
// Explicitly pass the DATABASE_ID here to connect to 'lumina-genesis'
export const db = getFirestore(app, DATABASE_ID);
export const googleProvider = new GoogleAuthProvider();

// Configuration: Ensure user always sees the account selector
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const CURRENT_CONFIG = {
    ...firebaseConfig,
    databaseId: DATABASE_ID
};

/**
 * Database Helper: Sync User Profile
 */
export const syncUserProfile = async (user: any) => {
  if (!user) return null;
  
  const baseProfile = {
    uid: user.uid,
    name: user.displayName || "Disciple",
    email: user.email,
    photoURL: user.photoURL,
    isPremium: false,
    points: 750,
    familyDetails: "",
    manifestationProgress: []
  };

  const userRef = doc(db, "users", user.uid);
  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, { ...baseProfile, lastLogin: Date.now() });
      return baseProfile;
    } else {
      const data = userSnap.data();
      await updateDoc(userRef, { lastLogin: Date.now() });
      return { ...baseProfile, ...data };
    }
  } catch (error: any) {
    console.error("LATTICE SYNC ERROR:", error?.message);
    return baseProfile;
  }
};

export { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy
};
