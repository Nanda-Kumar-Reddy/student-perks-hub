import { request } from "./client";
import { buildQuery } from "@/utils";
import type { PaginatedResponse, ServiceType, Transaction } from "@/types";

export async function apiGetAdminDashboard() {
  return request<Record<string, unknown>>("GET", "/api/admin/dashboard");
}

export async function apiGetAdminUsers(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/admin/users${buildQuery({ page, limit })}`);
}

export async function apiGetAdminVendors(page?: number, limit?: number, status?: string) {
  return request<PaginatedResponse<unknown>>("GET", `/api/admin/vendors${buildQuery({ page, limit, status })}`);
}

export async function apiApproveVendor(id: string) {
  return request<Record<string, unknown>>("PATCH", `/api/admin/vendors/${id}/approve`);
}

export async function apiRejectVendor(id: string) {
  return request<Record<string, unknown>>("PATCH", `/api/admin/vendors/${id}/reject`);
}

export async function apiGetAdminTransactions(page?: number, limit?: number) {
  return request<PaginatedResponse<Transaction>>("GET", `/api/admin/transactions${buildQuery({ page, limit })}`);
}

export async function apiGetAdminRevenueAnalytics(mode?: string) {
  return request<Record<string, unknown>>("GET", `/api/admin/analysis/revenue${mode ? `?mode=${mode}` : ""}`);
}

export async function apiGetAdminUserAnalytics() {
  return request<Record<string, unknown>>("GET", "/api/admin/analysis/users");
}

export async function apiGetAdminVendorAnalytics() {
  return request<Record<string, unknown>>("GET", "/api/admin/analysis/vendors");
}

export async function apiGetAdminCategoryDistribution() {
  return request<Record<string, unknown>>("GET", "/api/admin/analysis/category-distribution");
}

// Approvals
export async function apiGetAdminApprovals(page?: number, limit?: number, entityType?: string) {
  return request<PaginatedResponse<unknown>>("GET", `/api/admin/approvals${buildQuery({ page, limit, entityType })}`);
}
export async function apiApproveAdminApproval(id: string) {
  return request<Record<string, unknown>>("POST", `/api/admin/approvals/${id}/approve`);
}
export async function apiRejectAdminApproval(id: string, reason: string) {
  return request<Record<string, unknown>>("POST", `/api/admin/approvals/${id}/reject`, { body: { reason } });
}

// Vendor details & service management
export async function apiGetAdminVendorDetails(vendorId: string) {
  return request<Record<string, unknown>>("GET", `/api/admin/vendors/${vendorId}/details`);
}
export async function apiAdminAddVendorService(vendorId: string, serviceType: ServiceType) {
  return request<Record<string, unknown>>("POST", `/api/admin/vendors/${vendorId}/services`, { body: { serviceType } });
}
export async function apiAdminRemoveVendorService(vendorId: string, serviceId: string) {
  return request<Record<string, unknown>>("DELETE", `/api/admin/vendors/${vendorId}/services/${serviceId}`);
}
