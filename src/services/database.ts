/**
 * Database Service — Uses Node.js Backend API.
 * No Supabase dependency.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("access_token") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getProfile(userId: string) {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/api/profiles/me`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to get profile");
  return res.json();
}

export async function updateProfile(userId: string, updates: Record<string, any>) {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/api/profiles/me`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export async function getUserRole(userId: string): Promise<"student" | "vendor" | "admin" | null> {
  if (!API_BASE) return "student"; // demo mode default
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
  if (!API_BASE) return { success: true };

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
