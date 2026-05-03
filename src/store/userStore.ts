import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError } from '../services/firebase';

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  mobile: string;
  state: string;
  district: string;
  income: number;
  occupation: string;
  caste: string;
  familyMembers: number;
  hasDisability: boolean;
  hasBPLCard: boolean;
  language: string;
  onboarded: boolean;
  updatedAt?: string;
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  setProfile: (profile: UserProfile) => void;
  syncProfile: (uid: string) => Promise<void>;
  saveProfile: (uid: string, profile: UserProfile) => Promise<void>;
  resetProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      setProfile: (profile) => set({ profile }),
      syncProfile: async (uid) => {
        set({ isLoading: true });
        try {
          const docRef = doc(db, 'users', uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            set({ profile: docSnap.data() as UserProfile });
          }
        } catch (error) {
          console.error("Sync error:", error);
        } finally {
          set({ isLoading: false });
        }
      },
      saveProfile: async (uid, profile) => {
        set({ isLoading: true });
        try {
          const docRef = doc(db, 'users', uid);
          const data = { ...profile, userId: uid, updatedAt: new Date().toISOString() };
          await setDoc(docRef, data);
          set({ profile });
        } catch (error) {
          console.error("Save error:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      resetProfile: () => set({ profile: null }),
    }),
    {
      name: 'user-profile-storage',
    }
  )
);
