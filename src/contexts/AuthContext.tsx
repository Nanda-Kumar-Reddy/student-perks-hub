import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { type AppUser, getSession, signOut as authSignOut } from "@/services/auth";
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

  useEffect(() => {
    getSession().then(async (result) => {
      if (result) {
        setUser(result.user);
        // Role from user object or fetch separately
        if (result.user.role) {
          setRole(result.user.role);
        } else {
          const r = await getUserRole(result.user.id);
          setRole(r);
        }
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

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
