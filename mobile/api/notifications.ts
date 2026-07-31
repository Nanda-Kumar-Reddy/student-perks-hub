import { request } from "./client";
import { buildQuery } from "@/utils";
import type { AppNotification, PaginatedResponse } from "@/types";

export async function apiGetNotifications(page?: number, limit?: number) {
  return request<PaginatedResponse<AppNotification>>("GET", `/api/notifications${buildQuery({ page, limit })}`);
}

export async function apiGetUnreadCount() {
  return request<{ count: number }>("GET", "/api/notifications/unread-count");
}

export async function apiMarkNotificationRead(id: string) {
  return request<Record<string, unknown>>("PATCH", `/api/notifications/${id}/read`);
}

export async function apiMarkAllNotificationsRead() {
  return request<Record<string, unknown>>("PATCH", "/api/notifications/read-all");
}
