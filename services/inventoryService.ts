import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  query, where, onSnapshot, serverTimestamp, orderBy
} from "firebase/firestore";
import { db } from "../firebase";
import { Builder, Venture, Tower, InventoryUnit, UnitStatus } from "../types";

// ─── Builders ────────────────────────────────────────────────────────────────

export const subscribeToBuilders = (callback: (builders: Builder[]) => void) => {
  if (!db) return () => {};
  const q = query(collection(db, "builders"), orderBy("name"));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Builder)));
  });
};

export const subscribeToMyBuilders = (ownerId: string, callback: (builders: Builder[]) => void) => {
  if (!db) return () => {};
  const q = query(collection(db, "builders"), where("ownerId", "==", ownerId));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Builder)));
  });
};

export const createBuilder = async (data: Omit<Builder, 'id'> & { ownerId: string }) => {
  if (!db) throw new Error("Firestore not initialized");
  const ref = await addDoc(collection(db, "builders"), { ...data, createdAt: serverTimestamp() });
  return ref.id;
};

export const updateBuilder = async (id: string, data: Partial<Builder>) => {
  if (!db) throw new Error("Firestore not initialized");
  await updateDoc(doc(db, "builders", id), data);
};

export const deleteBuilder = async (id: string) => {
  if (!db) throw new Error("Firestore not initialized");
  await deleteDoc(doc(db, "builders", id));
};

// ─── Ventures ────────────────────────────────────────────────────────────────

export const subscribeToVentures = (builderId: string, callback: (ventures: Venture[]) => void) => {
  if (!db) return () => {};
  const q = query(collection(db, "ventures"), where("builderId", "==", builderId));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Venture)));
  });
};

export const createVenture = async (data: Omit<Venture, 'id'>) => {
  if (!db) throw new Error("Firestore not initialized");
  const ref = await addDoc(collection(db, "ventures"), { ...data, createdAt: serverTimestamp() });
  return ref.id;
};

export const updateVenture = async (id: string, data: Partial<Venture>) => {
  if (!db) throw new Error("Firestore not initialized");
  await updateDoc(doc(db, "ventures", id), data);
};

export const deleteVenture = async (id: string) => {
  if (!db) throw new Error("Firestore not initialized");
  await deleteDoc(doc(db, "ventures", id));
};

// ─── Towers ──────────────────────────────────────────────────────────────────

export const subscribeToTowers = (ventureId: string, callback: (towers: Tower[]) => void) => {
  if (!db) return () => {};
  const q = query(collection(db, "towers"), where("ventureId", "==", ventureId));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Tower)));
  });
};

export const createTower = async (data: Omit<Tower, 'id'>) => {
  if (!db) throw new Error("Firestore not initialized");
  const ref = await addDoc(collection(db, "towers"), { ...data, createdAt: serverTimestamp() });
  return ref.id;
};

export const updateTower = async (id: string, data: Partial<Tower>) => {
  if (!db) throw new Error("Firestore not initialized");
  await updateDoc(doc(db, "towers", id), data);
};

export const deleteTower = async (id: string) => {
  if (!db) throw new Error("Firestore not initialized");
  await deleteDoc(doc(db, "towers", id));
};

// ─── Units ───────────────────────────────────────────────────────────────────

export const subscribeToUnits = (ventureId: string, callback: (units: InventoryUnit[]) => void) => {
  if (!db) return () => {};
  const q = query(collection(db, "units"), where("ventureId", "==", ventureId));
  return onSnapshot(q, snap => {
    const units = snap.docs.map(d => ({ id: d.id, ...d.data() } as InventoryUnit));
    units.sort((a, b) => a.floorNumber - b.floorNumber || a.flatNumber.localeCompare(b.flatNumber));
    callback(units);
  });
};

export const createUnit = async (data: Omit<InventoryUnit, 'id'>) => {
  if (!db) throw new Error("Firestore not initialized");
  const ref = await addDoc(collection(db, "units"), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return ref.id;
};

export const updateUnit = async (id: string, data: Partial<InventoryUnit>) => {
  if (!db) throw new Error("Firestore not initialized");
  await updateDoc(doc(db, "units", id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteUnit = async (id: string) => {
  if (!db) throw new Error("Firestore not initialized");
  await deleteDoc(doc(db, "units", id));
};

export const updateUnitStatus = async (unitId: string, status: UnitStatus) => {
  if (!db) throw new Error("Firestore not initialized");
  await updateDoc(doc(db, "units", unitId), { status, updatedAt: serverTimestamp() });
};

// ─── Aggregation helpers ─────────────────────────────────────────────────────

export const getUnitCounts = (units: InventoryUnit[]) => ({
  total: units.length,
  available: units.filter(u => u.status === 'Available').length,
  sold: units.filter(u => u.status === 'Sold').length,
  reserved: units.filter(u => u.status === 'Reserved').length,
  blocked: units.filter(u => u.status === 'Blocked').length,
  comingSoon: units.filter(u => u.status === 'Coming Soon').length,
});
