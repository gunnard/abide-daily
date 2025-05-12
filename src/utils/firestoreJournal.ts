import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, Timestamp, orderBy } from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface JournalEntry {
  id?: string;
  text: string;
  prompt: string;
  mood: string;
  createdAt: Timestamp;
}

export async function saveJournalEntry(user: User, entry: Omit<JournalEntry, 'createdAt'>) {
  const ref = collection(db, 'users', user.uid, 'journal');
  await addDoc(ref, { ...entry, createdAt: Timestamp.now() });
}

export async function getJournalEntries(user: User) {
  const ref = collection(db, 'users', user.uid, 'journal');
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as JournalEntry[];
}
