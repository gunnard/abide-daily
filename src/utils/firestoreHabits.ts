import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, setDoc, doc } from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface Habit {
  id?: string;
  name: string;
  createdAt: Timestamp;
}

export interface HabitCheck {
  id?: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  checked: boolean;
  reflection?: string;
  createdAt: Timestamp;
}

export async function addHabit(user: User, habit: Omit<Habit, 'createdAt'>) {
  const ref = collection(db, 'users', user.uid, 'habits');
  await addDoc(ref, { ...habit, createdAt: Timestamp.now() });
}

export async function getHabits(user: User) {
  const ref = collection(db, 'users', user.uid, 'habits');
  const q = query(ref, orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Habit[];
}

export async function checkHabit(user: User, habitId: string, date: string, reflection?: string) {
  const ref = doc(db, 'users', user.uid, 'habits', habitId, 'checks', date);
  await setDoc(ref, {
    habitId,
    date,
    checked: true,
    reflection: reflection || '',
    createdAt: Timestamp.now(),
  });
}

export async function getHabitChecks(user: User, habitId: string) {
  const ref = collection(db, 'users', user.uid, 'habits', habitId, 'checks');
  const q = query(ref, orderBy('date', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as HabitCheck[];
}
