import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './useAuth';

interface SubscriptionContextProps {
  isPremium: boolean;
  loading: boolean;
  trialActive: boolean;
  customerId: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextProps>({
  isPremium: false,
  loading: true,
  trialActive: false,
  customerId: null,
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [trialActive, setTrialActive] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setTrialActive(false);
      setCustomerId(null);
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(doc(db, 'users', user.uid, 'subscription'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setIsPremium(!!data.active);
        setTrialActive(!!data.trialActive);
        setCustomerId(data.customerId || null);
      } else {
        setIsPremium(false);
        setTrialActive(false);
        setCustomerId(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{ isPremium, trialActive, customerId, loading }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
