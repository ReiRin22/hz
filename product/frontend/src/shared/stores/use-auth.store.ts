import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { registerStore } from './storeRegistry';

type AuthState = {
  userId: string | null;
  userName: string | null;
  role: string | null;
  token: string | null;
  setAuth: (auth: { userId: string; userName: string; role: string; token: string }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      userName: null,
      role: null,
      token: null,
      setAuth: (auth) => set(auth),
      clearAuth: () => set({ userId: null, userName: null, role: null, token: null }),
    }),
    { name: 'harz-auth' },
  ),
);

registerStore(() => useAuthStore.getState().clearAuth());
