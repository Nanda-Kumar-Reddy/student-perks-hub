import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGetMe, apiLogout } from "@/api/auth";
import { loadStoredToken, setAccessToken } from "@/api/client";
import type { AppUser } from "@/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: AppUser | null;
  role: AppUser["role"] | null;
  status: AuthStatus;
  setUser: (user: AppUser) => void;
  hydrate: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      status: "loading",
      setUser: (user) =>
        set({ user, role: user.role, status: "authenticated" }),
      hydrate: async () => {
        const token = await loadStoredToken();
        if (!token) {
          set({ status: "unauthenticated" });
          return;
        }
        try {
          const user = await apiGetMe();
          setAccessToken(token);
          set({ user, role: user.role, status: "authenticated" });
        } catch {
          setAccessToken(null);
          set({ user: null, role: null, status: "unauthenticated" });
        }
      },
      signOut: async () => {
        await apiLogout();
        setAccessToken(null);
        set({ user: null, role: null, status: "unauthenticated" });
      },
    }),
    {
      name: "ll-auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user, role: state.role }),
    }
  )
);
