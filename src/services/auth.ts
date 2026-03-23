/**
 * Authentication Service — Uses Node.js backend API for auth.
 * No Supabase dependency.
 */

export type AppUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function authRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  if (!API_BASE) {
    console.info(`ℹ️ API not configured — ${method} ${path} (demo mode)`);
    return {} as T;
  }
  const token = localStorage.getItem("access_token") || "";
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || err.error || "Request failed");
  }
  return res.json();
}

export async function signUp(email: string, password: string, fullName: string, role: "student" | "vendor" = "student") {
  if (!API_BASE) {
    return {
      id: `${role}-design-user`,
      email,
      fullName,
      avatarUrl: "",
      role,
    } as AppUser;
  }
  const result = await authRequest<{ user: any; accessToken: string }>("POST", "/api/auth/signup", {
    email, password, fullName, role,
  });
  if (result.accessToken) {
    localStorage.setItem("access_token", result.accessToken);
  }
  return result.user ? mapApiUser(result.user) : null;
}

export async function signIn(email: string, password: string) {
  if (!API_BASE) {
    const derivedRole = email.toLowerCase().includes("admin")
      ? "admin"
      : email.toLowerCase().includes("vendor")
        ? "vendor"
        : "student";
    return {
      id: `${derivedRole}-design-user`,
      email,
      fullName: derivedRole === "admin" ? "Admin Reviewer" : derivedRole === "vendor" ? "Vendor Reviewer" : "Student Reviewer",
      avatarUrl: "",
      role: derivedRole,
    } as AppUser;
  }
  const result = await authRequest<{ user: any; accessToken: string }>("POST", "/api/auth/login", {
    email, password,
  });
  if (result.accessToken) {
    localStorage.setItem("access_token", result.accessToken);
  }
  return mapApiUser(result.user);
}

export async function signInWithGoogle() {
  if (!API_BASE) return;
  // Google OAuth would redirect to backend OAuth endpoint
  window.location.href = `${API_BASE}/api/auth/google`;
}

export async function signOut() {
  try {
    await authRequest("POST", "/api/auth/logout");
  } catch {
    // ignore
  }
  localStorage.removeItem("access_token");
}

export async function resetPasswordForEmail(email: string) {
  if (!API_BASE) return;
  await authRequest("POST", "/api/auth/forgot-password", { email });
}

export async function updatePassword(newPassword: string) {
  if (!API_BASE) return;
  await authRequest("POST", "/api/auth/change-password", { newPassword });
}

export async function getSession(): Promise<{ user: AppUser } | null> {
  if (!API_BASE) {
    return {
      user: {
        id: "design-mode-user",
        email: "design@lifelineaustralia.app",
        fullName: "Design Reviewer",
        avatarUrl: "",
        role: "admin",
      },
    };
  }
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    const result = await authRequest<{ user: any; role: string }>("GET", "/api/auth/me");
    if (!result.user) return null;
    return { user: mapApiUser(result.user, result.role) };
  } catch {
    return null;
  }
}

type AuthCallback = (user: AppUser | null) => void;
const listeners = new Set<AuthCallback>();

export function onAuthStateChange(callback: AuthCallback) {
  listeners.add(callback);
  if (!API_BASE) {
    callback({
      id: "design-mode-user",
      email: "design@lifelineaustralia.app",
      fullName: "Design Reviewer",
      avatarUrl: "",
      role: "admin",
    });
    return {
      unsubscribe: () => { listeners.delete(callback); },
    };
  }

  getSession().then((result) => {
    callback(result?.user || null);
  });
  return {
    unsubscribe: () => { listeners.delete(callback); },
  };
}

// Emit auth state changes when login/logout happens
export function emitAuthChange(user: AppUser | null) {
  listeners.forEach((cb) => cb(user));
}

function mapApiUser(user: any, role?: string): AppUser {
  return {
    id: user.id || user.userId || "",
    email: user.email || "",
    fullName: user.fullName || user.full_name || user.profile?.fullName || "",
    avatarUrl: user.avatarUrl || user.avatar_url || user.profile?.avatarUrl || "",
    role: role || user.role,
  };
}
