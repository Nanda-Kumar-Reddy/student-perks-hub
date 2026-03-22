/**
 * Authentication Service — Uses Node.js Backend API.
 * No Supabase dependency.
 */
import { apiLogin, apiSignup, apiLogout, apiGetMe, apiGoogleLogin } from "@/services/api";

export type AppUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role?: "student" | "vendor" | "admin";
};

function mapApiUser(data: any): AppUser {
  return {
    id: data.id || data.userId || "",
    email: data.email || "",
    fullName: data.fullName || data.full_name || "",
    avatarUrl: data.avatarUrl || data.avatar_url || "",
    role: data.role,
  };
}

export async function signUp(email: string, password: string, fullName: string, role: "student" | "vendor" = "student") {
  const result = await apiSignup({ email, password, fullName, role });
  if (result.accessToken) localStorage.setItem("access_token", result.accessToken);
  return result.user ? mapApiUser(result.user) : null;
}

export async function signIn(email: string, password: string) {
  const result = await apiLogin({ email, password });
  return mapApiUser(result.user);
}

export async function signInWithGoogle() {
  // Google OAuth would redirect — handled via backend
  window.location.href = `${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/google`;
}

export async function signOut() {
  try {
    await apiLogout();
  } catch {
    // Ignore errors on logout
  }
  localStorage.removeItem("access_token");
}

export async function resetPasswordForEmail(email: string) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
  if (!API_BASE) return;
  await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function updatePassword(newPassword: string) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
  if (!API_BASE) return;
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

export async function getSession(): Promise<{ user: AppUser } | null> {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    const data = await apiGetMe();
    if (!data || !data.id) return null;
    return { user: mapApiUser(data) };
  } catch {
    return null;
  }
}

// No-op auth state listener (backend uses JWT, no realtime auth events)
export function onAuthStateChange(_callback: (user: AppUser | null) => void) {
  return { unsubscribe: () => {} };
}
