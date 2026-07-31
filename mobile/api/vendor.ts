import { request } from "./client";
import { buildQuery } from "@/utils";
import type { Coupon, PaginatedResponse, ServiceType, Transaction, VendorListing, VendorRequest } from "@/types";

// Dashboard
export async function apiGetVendorDashboard() {
  return request<Record<string, unknown>>("GET", "/api/vendor/dashboard");
}

// Transactions
export async function apiGetVendorTransactions(page?: number, limit?: number) {
  return request<PaginatedResponse<Transaction>>("GET", `/api/vendor/transactions${buildQuery({ page, limit })}`);
}

// Coupons
export async function apiCreateVendorCoupon(data: Record<string, unknown>) {
  return request<Coupon>("POST", "/api/vendor/coupons", { body: data });
}
export async function apiGetVendorCoupons(page?: number, limit?: number) {
  return request<PaginatedResponse<Coupon>>("GET", `/api/vendor/coupons${buildQuery({ page, limit })}`);
}
export async function apiDeleteVendorCoupon(id: string) {
  return request<Record<string, unknown>>("DELETE", `/api/vendor/coupons/${id}`);
}

// Analytics
export async function apiGetVendorRevenueAnalytics(mode?: string) {
  return request<Record<string, unknown>>("GET", `/api/vendor/analysis/revenue${mode ? `?mode=${mode}` : ""}`);
}
export async function apiGetVendorCustomerVisits() {
  return request<Record<string, unknown>>("GET", "/api/vendor/analysis/customer-visits");
}
export async function apiGetVendorRatingTrend() {
  return request<Record<string, unknown>>("GET", "/api/vendor/analysis/rating-trend");
}
export async function apiGetVendorCouponUsage() {
  return request<Record<string, unknown>>("GET", "/api/vendor/analysis/coupon-usage");
}

// Settings
export async function apiGetVendorSettings() {
  return request<Record<string, unknown>>("GET", "/api/vendor/settings");
}
export async function apiUpdateVendorSettings(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("PUT", "/api/vendor/settings", { body: data });
}

// Services
export async function apiGetVendorServices() {
  return request<{ data: { id: string; serviceType: ServiceType; isActive: boolean }[] }>("GET", "/api/vendor/services");
}
export async function apiAddVendorService(serviceType: ServiceType) {
  return request<Record<string, unknown>>("POST", "/api/vendor/services", { body: { serviceType } });
}
export async function apiRemoveVendorService(id: string) {
  return request<Record<string, unknown>>("DELETE", `/api/vendor/services/${id}`);
}

// Listings
export async function apiGetVendorListings(serviceType?: ServiceType, page?: number, limit?: number) {
  return request<PaginatedResponse<VendorListing>>("GET", `/api/vendor/listings${buildQuery({ serviceType, page, limit })}`);
}
export async function apiCreateVendorListing(data: Record<string, unknown>) {
  return request<VendorListing>("POST", "/api/vendor/listings", { body: data });
}
export async function apiUpdateVendorListing(id: string, data: Record<string, unknown>) {
  return request<VendorListing>("PUT", `/api/vendor/listings/${id}`, { body: data });
}
export async function apiDeleteVendorListing(id: string) {
  return request<Record<string, unknown>>("DELETE", `/api/vendor/listings/${id}`);
}

// Requests
export async function apiGetVendorRequests(serviceType?: ServiceType, status?: string, page?: number, limit?: number) {
  return request<PaginatedResponse<VendorRequest>>("GET", `/api/vendor/requests${buildQuery({ serviceType, status, page, limit })}`);
}
export async function apiApproveVendorRequest(id: string, data?: Record<string, unknown>) {
  return request<Record<string, unknown>>("POST", `/api/vendor/requests/${id}/approve`, { body: data });
}
export async function apiRejectVendorRequest(id: string, reason: string) {
  return request<Record<string, unknown>>("POST", `/api/vendor/requests/${id}/reject`, { body: { reason } });
}
export async function apiAcceptAirportPickup(id: string) {
  return request<Record<string, unknown>>("POST", `/api/vendor/requests/${id}/accept-pickup`);
}
