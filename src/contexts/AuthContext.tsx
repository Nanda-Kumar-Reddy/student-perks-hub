import { createContext, useContext, useMemo, type ReactNode } from "react";
import { type AppUser } from "@/services/auth";

type AuthState = {
  user: AppUser | null;
  role: "student" | "vendor" | "admin" | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AuthState>(
    () => ({
      user: {
        id: "design-mode-user",
        email: "design@lifelineaustralia.app",
        fullName: "Design Reviewer",
        avatarUrl: "",
        role: "admin",
      } as AppUser,
      role: "admin",
      loading: false,
      signOut: async () => {},
    }),
    []
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
