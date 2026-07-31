import { request } from "./client";
import { buildQuery } from "@/utils";
import type { PaginatedResponse } from "@/types";

export async function apiGetMyProfile() {
  return request<Record<string, unknown>>("GET", "/api/profiles/me");
}

export async function apiUpdateMyProfile(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("PATCH", "/api/profiles/me", { body: data });
}

export async function apiGetMyActiveTasks(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/profiles/me/tasks${buildQuery({ page, limit })}`);
}

export async function apiGetMyPendingApprovals(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/profiles/me/pending-approvals${buildQuery({ page, limit })}`);
}

export async function apiGetMyTaskHistory(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/profiles/me/history${buildQuery({ page, limit })}`);
}
