/**
 * Authentication Service — Uses Node.js Backend API.
 * Falls back to demo mode when VITE_API_BASE_URL is not configured.
 */
import { apiLogin, apiSignup, apiLogout, apiGetMe, apiGoogleLogin, refreshToken as refreshAccessToken } from "@/services/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const DEMO_MODE = !API_BASE;

export type AppUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role?: "student" | "vendor" | "admin";
};

export type AuthSession = {
  user: AppUser;
  token: string | null;
};

function mapApiUser(data: any): AppUser {
  return {
    id: data.id || data.userId || "",
    email: data.email || "",
    fullName: data.fullName || data.full_name || data.email?.split("@")[0] || "User",
    avatarUrl: data.avatarUrl || data.avatar_url || "",
    role: data.role,
  };
}

// ── Demo mode helpers ───────────────────────────────
function getDemoUser(): AppUser | null {
  try {
    const stored = localStorage.getItem("demo_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setDemoUser(user: AppUser) {
  localStorage.setItem("demo_user", JSON.stringify(user));
  localStorage.setItem("access_token", `demo-token:${user.role || "student"}:${user.id}`);
}

function clearDemoUser() {
  localStorage.removeItem("demo_user");
  localStorage.removeItem("access_token");
}

// ── Auth functions ──────────────────────────────────

export async function signUp(email: string, password: string, fullName: string, role: "student" | "vendor" = "student") {
  if (DEMO_MODE) {
    const user: AppUser = { id: crypto.randomUUID(), email, fullName, avatarUrl: "", role };
    setDemoUser(user);
    return user;
  }
  const result = await apiSignup({ email, password, fullName, role });
  if (result.accessToken) localStorage.setItem("access_token", result.accessToken);
  return result.user ? mapApiUser(result.user) : null;
}

export async function signIn(email: string, password: string) {
  if (DEMO_MODE) {
    // In demo mode, determine role from email pattern or default to student
    let role: AppUser["role"] = "student";
    if (email.includes("vendor")) role = "vendor";
    if (email.includes("admin")) role = "admin";
    const user: AppUser = {
      id: crypto.randomUUID(),
      email,
      fullName: email.split("@")[0].replace(/[._-]/g, " "),
      avatarUrl: "",
      role,
    };
    setDemoUser(user);
    return user;
  }
  const result = await apiLogin({ email, password });
  return mapApiUser(result.user);
}

export async function signInWithGoogle() {
  if (DEMO_MODE) {
    const user: AppUser = { id: crypto.randomUUID(), email: "demo@google.com", fullName: "Google User", avatarUrl: "", role: "student" };
    setDemoUser(user);
    return user;
  }
  window.location.href = `${API_BASE}/api/auth/google`;
}

export async function signOut() {
  if (DEMO_MODE) {
    clearDemoUser();
    return;
  }
  try {
    await apiLogout();
  } catch {
    // Ignore errors on logout
  }
  localStorage.removeItem("access_token");
}

export async function resetPasswordForEmail(email: string) {
  if (DEMO_MODE) return;
  await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function updatePassword(newPassword: string) {
  if (DEMO_MODE) return;
  const token = localStorage.getItem("access_token") || "";
  await fetch(`${API_BASE}/api/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword }),
  });
}

export async function getSession(): Promise<AuthSession | null> {
  if (DEMO_MODE) {
    const user = getDemoUser();
    return user ? { user, token: localStorage.getItem("access_token") } : null;
  }

  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const data = await apiGetMe();
    if (!data || !data.id) return null;
    return { user: mapApiUser(data), token };
  } catch {
    try {
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        localStorage.removeItem("access_token");
        return null;
      }

      const data = await apiGetMe();
      if (!data || !data.id) return null;
      return { user: mapApiUser(data), token: localStorage.getItem("access_token") };
    } catch {
      localStorage.removeItem("access_token");
      return null;
    }
  }
}

// No-op auth state listener (backend uses JWT, no realtime auth events)
export function onAuthStateChange(_callback: (user: AppUser | null) => void) {
  return { unsubscribe: () => {} };
}
