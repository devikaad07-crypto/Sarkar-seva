import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useUserStore } from '../store/userStore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const syncProfile = useUserStore(state => state.syncProfile);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        syncProfile(user.uid);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [syncProfile]);

  return { user, loading };
}
