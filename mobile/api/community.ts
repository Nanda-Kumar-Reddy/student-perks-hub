import { request } from "./client";
import { buildQuery } from "@/utils";
import type { CommunityTask, PaginatedResponse, TaskMessage } from "@/types";

export async function apiListCommunityTasks(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params)}` : "";
  return request<PaginatedResponse<CommunityTask>>("GET", `/api/community/tasks${query}`);
}

export async function apiGetCommunityTask(id: string) {
  return request<CommunityTask>("GET", `/api/community/tasks/${id}`);
}

export async function apiCreateCommunityTask(data: Record<string, unknown>) {
  return request<CommunityTask>("POST", "/api/community/tasks", { body: data });
}

export async function apiEditCommunityTask(taskId: string, data: Record<string, unknown>) {
  return request<CommunityTask>("PUT", `/api/community/tasks/${taskId}`, { body: data });
}

export async function apiGetMyCommunityTasks(page?: number, limit?: number) {
  return request<PaginatedResponse<CommunityTask>>("GET", `/api/community/tasks/user/my-posts${buildQuery({ page, limit })}`);
}

export async function apiApplyForCommunityTask(taskId: string, message: string) {
  return request<Record<string, unknown>>("POST", `/api/community/tasks/${taskId}/apply`, { body: { message } });
}

export async function apiUpdateCommunityTaskStatus(taskId: string, status: string) {
  return request<Record<string, unknown>>("PATCH", `/api/community/tasks/${taskId}/status`, { body: { status } });
}

export async function apiSendCommunityTaskMessage(taskId: string, content: string) {
  return request<TaskMessage>("POST", `/api/community/tasks/${taskId}/messages`, { body: { content } });
}

export async function apiGetCommunityTaskMessages(taskId: string, page?: number, limit?: number) {
  return request<PaginatedResponse<TaskMessage>>("GET", `/api/community/tasks/${taskId}/messages${buildQuery({ page, limit })}`);
}

// Admin
export async function apiGetPendingCommunityTasks(page?: number, limit?: number) {
  return request<PaginatedResponse<CommunityTask>>("GET", `/api/community/tasks/admin/pending${buildQuery({ page, limit })}`);
}
export async function apiApproveCommunityTask(taskId: string, adminNotes?: string) {
  return request<CommunityTask>("POST", `/api/community/tasks/admin/${taskId}/approve`, { body: { adminNotes } });
}
export async function apiRejectCommunityTask(taskId: string, reason?: string) {
  return request<CommunityTask>("POST", `/api/community/tasks/admin/${taskId}/reject`, { body: { reason } });
}
export async function apiFlagCommunityTask(taskId: string, adminNotes?: string) {
  return request<CommunityTask>("POST", `/api/community/tasks/admin/${taskId}/flag`, { body: { adminNotes } });
}
