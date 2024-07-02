import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from './mmkv';

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
      storage: createJSONStorage(() => ({
        getItem: (name: string) => storage.getString(name) ?? null,
        setItem: (name: string, value: string) => storage.set(name, value),
        removeItem: (name: string) => storage.delete(name),
      })),
    },
  ),
);
