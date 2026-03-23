/**
 * Database Service — Abstraction layer over Supabase Postgres.
 * Swap this file to migrate to another provider (AWS RDS, PlanetScale, etc.)
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Tables["profiles"]["Update"]>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getUserRole(userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.role as "student" | "vendor" | "admin" | null;
}

// ── Community Task Status Updates ────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function updateCommunityTaskStatus(
  taskId: string,
  status: "FILLED" | "CANCELLED"
): Promise<{ success: boolean }> {
  if (!API_BASE) {
    // Demo mode — simulate success
    return { success: true };
  }

  const token = localStorage.getItem("access_token") || "";
  const res = await fetch(`${API_BASE}/community-tasks/${taskId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Failed to update task status");
  }

  return { success: true };
}
