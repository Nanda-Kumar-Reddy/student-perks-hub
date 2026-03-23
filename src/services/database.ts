/**
 * Database Service — Uses Node.js Backend API.
 * Falls back to demo mode when VITE_API_BASE_URL is not configured.
 */

import {
  apiGetMyProfile,
  apiUpdateMyProfile,
  apiUpdateCommunityTaskStatus,
  apiGetMyActiveTasks,
  apiGetMyPendingApprovals,
  apiGetMyTaskHistory,
  apiGetMyCommunityTasks,
  apiCreateCommunityTask,
  apiGetCommunityTask,
  apiListCommunityTasks,
} from "@/services/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const DEMO_MODE = !API_BASE;

const demoProfileFallback = {
  full_name: "User",
  phone: "",
  address: "",
  university: "",
};

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("access_token") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getProfile(userId: string) {
  if (DEMO_MODE) {
    try {
      const stored = localStorage.getItem("demo_user");
      const parsed = stored ? JSON.parse(stored) : null;
      return {
        ...demoProfileFallback,
        full_name: parsed?.fullName || demoProfileFallback.full_name,
      };
    } catch {
      return demoProfileFallback;
    }
  }
  try {
    const profile = await apiGetMyProfile();
    return profile || demoProfileFallback;
  } catch {
    return demoProfileFallback;
  }
}

export async function updateProfile(userId: string, updates: Record<string, any>) {
  if (DEMO_MODE) return { ...demoProfileFallback, ...updates };
  return apiUpdateMyProfile(updates);
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
    const res = await fetch(`${API_BASE}/api/auth/me`, { headers: getAuthHeaders(), credentials: "include" });
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

  await apiUpdateCommunityTaskStatus(taskId, status);

  return { success: true };
}

export async function getMyActiveTasks(page?: number, limit?: number) {
  if (DEMO_MODE) return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  return apiGetMyActiveTasks(page, limit);
}

export async function getMyPendingApprovals(page?: number, limit?: number) {
  if (DEMO_MODE) return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  return apiGetMyPendingApprovals(page, limit);
}

export async function getMyTaskHistory(page?: number, limit?: number) {
  if (DEMO_MODE) return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  return apiGetMyTaskHistory(page, limit);
}

export async function getMyCommunityTasks(page?: number, limit?: number) {
  if (DEMO_MODE) return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  return apiGetMyCommunityTasks(page, limit);
}

export async function createCommunityTask(data: Record<string, any>) {
  if (DEMO_MODE) return { id: crypto.randomUUID(), ...data, status: "PENDING_APPROVAL" };
  return apiCreateCommunityTask(data);
}

export async function updateCommunityTask(taskId: string, data: Record<string, any>) {
  if (DEMO_MODE) return { id: taskId, ...data, status: "PENDING_APPROVAL" };
  const res = await fetch(`${API_BASE}/api/community/tasks/${taskId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Failed to update task");
  }
  return res.json();
}

export async function listCommunityTasks(params?: Record<string, string>) {
  if (DEMO_MODE) return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  return apiListCommunityTasks(params);
}

export async function getCommunityTask(taskId: string) {
  if (DEMO_MODE) return null;
  return apiGetCommunityTask(taskId);
}
