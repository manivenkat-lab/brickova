import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";
import { UserRole, AppUser, MembershipTier } from "../types";
import { handleFirestoreError, OperationType } from "../src/lib/firestoreErrorHandler";

export const loginWithGoogle = async (): Promise<AppUser | null> => {
  if (!auth) {
    console.error("Firebase Authentication is not initialized.");
    return null;
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user document exists in Firestore
    const userDocRef = doc(db, "users", user.uid);
    let userDoc;
    try {
      userDoc = await getDoc(userDocRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    }
    
    if (userDoc && !userDoc.exists()) {
      // Create new user document
      const newUser: AppUser = {
        uid: user.uid,
        displayName: user.displayName || "Anonymous",
        email: user.email || "",
        photo: user.photoURL || "",
        phone: user.phoneNumber || "",
        role: UserRole.BUYER, // Default role as per request
        agencyId: null,
        agencyCode: null,
        createdAt: serverTimestamp(),
        plan: MembershipTier.FREE,
        listingsUsed: 0,
        isSubscribed: false
      };
      try {
        await setDoc(userDocRef, newUser);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
      return newUser;
    }
    
    return userDoc?.data() as AppUser;
  } catch (error: any) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};

export const logout = async () => {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const getCurrentUserDoc = async (uid: string): Promise<AppUser | null> => {
  if (!db) return null;
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data() as AppUser;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    return null;
  }
};

export const updatePlan = async (uid: string, plan: MembershipTier): Promise<void> => {
  if (!db) throw new Error("Firestore not initialized");
  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, { 
      plan, 
      isSubscribed: plan !== MembershipTier.FREE 
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
  }
};

export const updateListingsUsed = async (uid: string, count: number): Promise<void> => {
  if (!db) throw new Error("Firestore not initialized");
  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, { listingsUsed: count }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
  }
};

export const subscribeToAuthChanges = (callback: (user: FirebaseUser | null) => void) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};
