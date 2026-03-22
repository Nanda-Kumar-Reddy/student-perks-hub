/**
 * Database Service — Uses Node.js Backend API.
 * Falls back to demo mode when VITE_API_BASE_URL is not configured.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const DEMO_MODE = !API_BASE;

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("access_token") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getProfile(userId: string) {
  if (DEMO_MODE) return null;
  const res = await fetch(`${API_BASE}/api/profiles/me`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to get profile");
  return res.json();
}

export async function updateProfile(userId: string, updates: Record<string, any>) {
  if (DEMO_MODE) return null;
  const res = await fetch(`${API_BASE}/api/profiles/me`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export async function getUserRole(userId: string): Promise<"student" | "vendor" | "admin" | null> {
  if (DEMO_MODE) {
    // In demo mode, read role from stored demo user
    try {
      const stored = localStorage.getItem("demo_user");
      if (stored) {
        const user = JSON.parse(stored);
        return user.role || "student";
      }
    } catch {}
    return "student";
  }
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, { headers: getAuthHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    return data.role || null;
  } catch {
    return null;
  }
}

// ── Community Task Status Updates ────────────────────

export async function updateCommunityTaskStatus(
  taskId: string,
  status: "FILLED" | "CANCELLED"
): Promise<{ success: boolean }> {
  if (DEMO_MODE) return { success: true };

  const res = await fetch(`${API_BASE}/api/community/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Failed to update task status");
  }

  return { success: true };
}
