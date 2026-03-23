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

  const loadRole = useCallback(async (u: AppUser) => {
    try {
      // Try to get role from the user object first (from backend auth)
      if (u.role) {
        setRole(u.role as AuthState["role"]);
        return;
      }
      const r = await getUserRole(u.id);
      setRole(r);
    } catch {
      setRole(null);
    }
  }, []);

  useEffect(() => {
    const subscription = onAuthStateChange(async (u) => {
      setUser(u);
      if (u) {
        await loadRole(u);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    // Hydrate
    getSession().then(async (result) => {
      if (result) {
        setUser(result.user);
        await loadRole(result.user);
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
