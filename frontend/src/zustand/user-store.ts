import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  username: string | null;
  setUsername: (username: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      username: null,
      setUsername: (username) => set({ username }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
