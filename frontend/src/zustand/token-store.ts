import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from './mmkv';

interface TokenState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: 'token-storage',
      storage: createJSONStorage(() => ({
        getItem: (name: string) => storage.getString(name) ?? null,
        setItem: (name: string, value: string) => storage.set(name, value),
        removeItem: (name: string) => storage.delete(name),
      })),
    },
  ),
);
