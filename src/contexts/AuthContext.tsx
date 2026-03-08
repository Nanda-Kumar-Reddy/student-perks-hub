import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { type AppUser, getSession, onAuthStateChange, signOut as authSignOut } from "@/services/auth";
import { getUserRole } from "@/services/database";

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
  const [user, setUser] = useState<AppUser | null>(null);
  const [role, setRole] = useState<AuthState["role"]>(null);
  const [loading, setLoading] = useState(true);

  const loadRole = useCallback(async (userId: string) => {
    try {
      const r = await getUserRole(userId);
      setRole(r);
    } catch {
      setRole(null);
    }
  }, []);

  useEffect(() => {
    // Set up listener BEFORE getSession (per Supabase best practice)
    const subscription = onAuthStateChange(async (u) => {
      setUser(u);
      if (u) {
        await loadRole(u.id);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    // Then hydrate
    getSession().then(async (result) => {
      if (result) {
        setUser(result.user);
        await loadRole(result.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loadRole]);

  const handleSignOut = useCallback(async () => {
    await authSignOut();
    setUser(null);
    setRole(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
