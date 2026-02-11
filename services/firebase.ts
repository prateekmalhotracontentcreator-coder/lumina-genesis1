// Exodus Power Source: Firebase Integration
// Note: Config is expected to be provided via environment variables.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSy-PLACEHOLDER",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "lumina-genesis.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "lumina-genesis",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "lumina-genesis.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.FIREBASE_APP_ID || "1:000000000000:web:000000000000"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Database Helper: Sync User Profile
 * Forces initialization of 'manifestationProgress' to ensure the Green Tick displays correctly.
 */
export const syncUserProfile = async (user: any) => {
  if (!user) return null;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const initialProfile = {
      uid: user.uid,
      name: user.displayName || "Disciple",
      email: user.email,
      photoURL: user.photoURL,
      isPremium: false,
      points: 750,
      lastLogin: Date.now(),
      familyDetails: "",
      manifestationProgress: [] 
    };
    await setDoc(userRef, initialProfile);
    return initialProfile;
  } else {
    const data = userSnap.data();
    // Wave 2 migration: Ensure manifestationProgress exists
    if (!data.manifestationProgress) {
        await updateDoc(userRef, { manifestationProgress: [] });
        data.manifestationProgress = [];
    }
    await updateDoc(userRef, { lastLogin: Date.now() });
    return data;
  }
};

// Exporting auth and firestore functions for all components
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