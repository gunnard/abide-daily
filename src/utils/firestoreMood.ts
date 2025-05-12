import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface MoodEntry {
  id?: string;
  mood: number;
  note: string;
  createdAt: Timestamp;
}

export async function saveMoodEntry(user: User, entry: Omit<MoodEntry, 'createdAt'>) {
  const ref = collection(db, 'users', user.uid, 'moods');
  await addDoc(ref, { ...entry, createdAt: Timestamp.now() });
}

export async function getMoodEntries(user: User) {
  const ref = collection(db, 'users', user.uid, 'moods');
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MoodEntry[];
}
