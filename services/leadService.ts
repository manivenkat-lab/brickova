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
  arrayUnion,
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebase";
import { Lead, LeadStatus, LeadNote } from "../types";
import { cleanObject } from "../src/lib/firebaseUtils";
import { handleFirestoreError, OperationType } from "../src/lib/firestoreErrorHandler";

const COLLECTION_NAME = "leads";

export const subscribeToLeads = (filters: { agentId?: string, agencyId?: string }, callback: (leads: Lead[]) => void) => {
  if (!db) return () => {};
  
  let q;
  if (filters.agentId) {
    q = query(collection(db, COLLECTION_NAME), where("assignedTo", "==", filters.agentId));
  } else if (filters.agencyId) {
    q = query(collection(db, COLLECTION_NAME), where("agencyId", "==", filters.agencyId));
  } else {
    q = query(collection(db, COLLECTION_NAME));
  }

  return onSnapshot(q, (snapshot) => {
    const leads = snapshot.docs.map(d => ({
      id: d.id,
      ...(d.data() as any)
    } as Lead));
    
    // Sort in memory
    leads.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || new Date(a.createdAt || 0).getTime();
      const timeB = b.createdAt?.toMillis?.() || new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });
    
    callback(leads);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
  });
};

export const checkDuplicatePhone = async (phone: string): Promise<boolean> => {
  if (!db) return false;
  try {
    const q = query(collection(db, COLLECTION_NAME), where("phone", "==", phone), limit(1));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    return false;
  }
};

export const createLead = async (leadData: any, userId: string, agencyId: string | null): Promise<string> => {
  if (!db) throw new Error("Firestore not initialized");
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), cleanObject({
      ...leadData,
      status: "New",
      createdBy: userId,
      agencyId: agencyId || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
    throw error;
  }
};

export const getLeads = async (filters: { agentId?: string, agencyId?: string }): Promise<Lead[]> => {
  if (!db) return [];
  try {
    let q;
    if (filters.agentId) {
      q = query(collection(db, COLLECTION_NAME), where("assignedTo", "==", filters.agentId));
    } else if (filters.agencyId) {
      q = query(collection(db, COLLECTION_NAME), where("agencyId", "==", filters.agencyId));
    } else {
      q = query(collection(db, COLLECTION_NAME));
    }

    const querySnapshot = await getDocs(q);
    const leads = querySnapshot.docs.map(d => ({
      id: d.id,
      ...(d.data() as any)
    } as Lead));

    // Sort in memory to avoid composite index requirement
    return leads.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || new Date(a.createdAt || 0).getTime();
      const timeB = b.createdAt?.toMillis?.() || new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    return [];
  }
};

export const updateLeadStatus = async (leadId: string, status: LeadStatus): Promise<void> => {
  if (!db) throw new Error("Firestore not initialized");
  try {
    const docRef = doc(db, COLLECTION_NAME, leadId);
    await updateDoc(docRef, cleanObject({
      status,
      updatedAt: serverTimestamp()
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${leadId}`);
  }
};

export const updateLead = async (leadId: string, data: Partial<Lead>): Promise<void> => {
  if (!db) throw new Error("Firestore not initialized");
  try {
    const docRef = doc(db, COLLECTION_NAME, leadId);
    await updateDoc(docRef, cleanObject({
      ...data,
      updatedAt: serverTimestamp()
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${leadId}`);
  }
};

export const deleteLead = async (leadId: string): Promise<void> => {
  if (!db) throw new Error("Firestore not initialized");
  try {
    const docRef = doc(db, COLLECTION_NAME, leadId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${leadId}`);
  }
};

export const addLeadNote = async (leadId: string, noteText: string): Promise<void> => {
  if (!db) throw new Error("Firestore not initialized");
  try {
    const docRef = doc(db, COLLECTION_NAME, leadId);
    const newNote: LeadNote = {
      text: noteText,
      createdAt: new Date().toISOString()
    };
    await updateDoc(docRef, {
      notes: arrayUnion(newNote),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${leadId}`);
  }
};
