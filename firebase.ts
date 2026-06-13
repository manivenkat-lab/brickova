import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCTjtDpPGgSSDqNY3Awln7SwuqD6Xn7mJE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "m-homes-bad1d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "m-homes-bad1d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "m-homes-bad1d.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "504290879014",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:504290879014:web:b433dfd7cb03ed2a4e28e7",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();





