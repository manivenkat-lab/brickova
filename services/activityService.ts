import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  updateDoc,
  deleteDoc,
  limit,
  Timestamp,
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebase";
import { Activity } from "../types";
import { cleanObject } from "../src/lib/firebaseUtils";
import { handleFirestoreError, OperationType } from "../src/lib/firestoreErrorHandler";

const COLLECTION_NAME = "activities";

export const subscribeToActivities = (filters: { userId?: string, agencyId?: string }, callback: (activities: Activity[]) => void) => {
  if (!db) return () => {};
  
  let q;
  if (filters.userId) {
    q = query(collection(db, COLLECTION_NAME), where("userId", "==", filters.userId));
  } else if (filters.agencyId) {
    q = query(collection(db, COLLECTION_NAME), where("agencyId", "==", filters.agencyId));
  } else {
    q = query(collection(db, COLLECTION_NAME));
  }

  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map(d => ({
      id: d.id,
      ...(d.data() as any)
    } as Activity));
    
    // Sort in memory
    activities.sort((a, b) => {
      const timeA = a.timestamp?.toMillis?.() || new Date(a.timestamp || 0).getTime();
      const timeB = b.timestamp?.toMillis?.() || new Date(b.timestamp || 0).getTime();
      return timeB - timeA;
    });
    
    callback(activities.slice(0, 50));
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
  });
};

export const logActivity = async (activityData: Omit<Activity, 'id' | 'timestamp'>): Promise<void> => {
  if (!db) return;
  try {
    // Ensure no undefined values are passed to addDoc
    const data = cleanObject({
      userId: activityData.userId || 'unknown',
      userName: activityData.userName || 'Unknown User',
      action: activityData.action || 'Performed Action',
      leadId: activityData.leadId || 'unknown',
      leadName: activityData.leadName || 'Unknown Lead',
      timestamp: serverTimestamp()
    });
    await addDoc(collection(db, COLLECTION_NAME), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
  }
};

export const getRecentActivities = async (filters: { userId?: string, agencyId?: string }): Promise<Activity[]> => {
  if (!db) return [];
  try {
    let q;
    if (filters.userId) {
      q = query(collection(db, COLLECTION_NAME), where("userId", "==", filters.userId));
    } else if (filters.agencyId) {
      q = query(collection(db, COLLECTION_NAME), where("agencyId", "==", filters.agencyId));
    } else {
      q = query(collection(db, COLLECTION_NAME));
    }

    const querySnapshot = await getDocs(q);
    const activities = querySnapshot.docs.map(d => ({
      id: d.id,
      ...(d.data() as any)
    } as Activity));

    // Sort in memory and limit to 10
    return activities
      .sort((a, b) => {
        const timeA = a.timestamp?.toMillis?.() || new Date(a.timestamp || 0).getTime();
        const timeB = b.timestamp?.toMillis?.() || new Date(b.timestamp || 0).getTime();
        return timeB - timeA;
      })
      .slice(0, 10);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    return [];
  }
};
