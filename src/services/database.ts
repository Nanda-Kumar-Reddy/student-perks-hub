/**
 * Database Service — Uses Node.js backend API for data access.
 * No Supabase dependency.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function dbRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
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

export async function getProfile(userId: string) {
  return dbRequest<any>("GET", "/api/profiles/me");
}

export async function updateProfile(userId: string, updates: Record<string, any>) {
  return dbRequest<any>("PATCH", "/api/profiles/me", updates);
}

export async function getUserRole(userId: string): Promise<"student" | "vendor" | "admin" | null> {
  try {
    const result = await dbRequest<{ role: string }>("GET", "/api/auth/me");
    return (result.role as "student" | "vendor" | "admin") || null;
  } catch {
    return null;
  }
}

// ── Community Task Status Updates ────────────────────

export async function updateCommunityTaskStatus(
  taskId: string,
  status: "FILLED" | "CANCELLED"
): Promise<{ success: boolean }> {
  await dbRequest("PATCH", `/api/community/tasks/${taskId}/status`, { status });
  return { success: true };
}
