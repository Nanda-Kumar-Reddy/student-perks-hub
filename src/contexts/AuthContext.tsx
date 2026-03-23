import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { type AppUser, getSession, signOut as authSignOut } from "@/services/auth";
import { getUserRole } from "@/services/database";

type AuthState = {
  user: AppUser | null;
  role: "student" | "vendor" | "admin" | null;
  token: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  role: null,
  token: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [role, setRole] = useState<AuthState["role"]>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const syncSession = useCallback(async () => {
    try {
      const result = await getSession();
      if (result) {
        setUser(result.user);
        setToken(result.token || null);
        if (result.user.role) {
          setRole(result.user.role);
        } else {
          const r = await getUserRole(result.user.id);
          setRole(r);
        }
      } else {
        setUser(null);
        setRole(null);
        setToken(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncSession();
  }, [syncSession]);

  // Listen for storage events so login in LoginPage updates the provider
  useEffect(() => {
    function handleStorage() {
      syncSession();
    }
    window.addEventListener("auth-changed", handleStorage);
    return () => window.removeEventListener("auth-changed", handleStorage);
  }, [syncSession]);

  const handleSignOut = useCallback(async () => {
    await authSignOut();
    setUser(null);
    setRole(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, token, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
