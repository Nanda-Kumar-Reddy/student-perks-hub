/**
 * API Service — Centralized HTTP client for the Backend API Server.
 * All frontend components should use these functions instead of direct fetch calls.
 * 
 * Uses the external Node.js backend (SERVER 2) for all business logic.
 * Falls back to demo mode when VITE_API_BASE_URL is not configured.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

// ── Internal helpers ─────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("access_token") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));

    // Auto-refresh on 401 TOKEN_EXPIRED
    if (res.status === 401 && body.code === "TOKEN_EXPIRED") {
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry is left to the caller
        throw new TokenExpiredError();
      }
    }

    throw new ApiError(body.error || body.message || "Request failed", res.status, body);
  }
  return res.json();
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: { raw?: boolean }
): Promise<T> {
  if (!API_BASE) {
    console.info(`ℹ️ API not configured — ${method} ${path} (demo mode)`);
    return {} as T;
  }

  const config: RequestInit = {
    method,
    headers: options?.raw ? { Authorization: getAuthHeaders().Authorization } : getAuthHeaders(),
    credentials: "include",
  };

  if (body && !options?.raw) {
    config.body = JSON.stringify(body);
  } else if (body && options?.raw) {
    config.body = body as BodyInit;
  }

  const res = await fetch(`${API_BASE}${path}`, config);
  return handleResponse<T>(res);
}

// ── Error classes ────────────────────────────────────

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export class TokenExpiredError extends Error {
  constructor() {
    super("Token expired");
    this.name = "TokenExpiredError";
  }
}

// ── Pagination types ─────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function paginationParams(page?: number, limit?: number): string {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  return params.toString() ? `?${params}` : "";
}

// ══════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════

export async function apiSignup(data: { email: string; password: string; fullName: string; role?: string }) {
  return request<{ user: any; accessToken: string }>("POST", "/api/auth/signup", data);
}

export async function apiLogin(data: { email: string; password: string }) {
  const result = await request<{ user: any; accessToken: string }>("POST", "/api/auth/login", data);
  if (result.accessToken) localStorage.setItem("access_token", result.accessToken);
  return result;
}

export async function apiGoogleLogin(data: { googleId: string; email: string; fullName: string; avatarUrl?: string }) {
  const result = await request<{ user: any; accessToken: string }>("POST", "/api/auth/google-login", data);
  if (result.accessToken) localStorage.setItem("access_token", result.accessToken);
  return result;
}

export async function refreshToken(): Promise<boolean> {
  try {
    const result = await request<{ accessToken: string }>("POST", "/api/auth/refresh");
    if (result.accessToken) {
      localStorage.setItem("access_token", result.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiLogout() {
  await request("POST", "/api/auth/logout");
  localStorage.removeItem("access_token");
}

export async function apiGetMe() {
  return request<any>("GET", "/api/auth/me");
}

// ══════════════════════════════════════════════════════
// PROFILES
// ══════════════════════════════════════════════════════

export async function apiGetMyProfile() {
  return request<any>("GET", "/api/profiles/me");
}

export async function apiUpdateMyProfile(data: Record<string, any>) {
  return request<any>("PATCH", "/api/profiles/me", data);
}

export async function apiGetMyActiveTasks(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/profiles/me/tasks${paginationParams(page, limit)}`);
}

export async function apiGetMyPendingApprovals(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/profiles/me/pending-approvals${paginationParams(page, limit)}`);
}

export async function apiGetMyTaskHistory(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/profiles/me/history${paginationParams(page, limit)}`);
}

// ══════════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════════

export async function apiGetNotifications(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/notifications${paginationParams(page, limit)}`);
}

export async function apiGetUnreadCount() {
  return request<{ count: number }>("GET", "/api/notifications/unread-count");
}

export async function apiMarkNotificationRead(id: string) {
  return request<any>("PATCH", `/api/notifications/${id}/read`);
}

export async function apiMarkAllNotificationsRead() {
  return request<any>("PATCH", "/api/notifications/read-all");
}

// ══════════════════════════════════════════════════════
// STUDENT FEATURES
// ══════════════════════════════════════════════════════

// Airport Pickup
export async function apiCreateAirportPickup(data: any) {
  return request<any>("POST", "/api/airport-pickups", data);
}

export async function apiGetMyAirportPickups(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/airport-pickups/my-requests${paginationParams(page, limit)}`);
}

// Accommodations
export async function apiCreateAccommodationEnquiry(data: any) {
  return request<any>("POST", "/api/accommodations/enquiry", data);
}

export async function apiCreateAccommodationChat(data: any) {
  return request<any>("POST", "/api/accommodations/chat", data);
}

export async function apiGetMyAccommodationEnquiries(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/accommodations/my-enquiries${paginationParams(page, limit)}`);
}

// Jobs
export async function apiApplyForJob(data: FormData) {
  return request<any>("POST", "/api/jobs/apply", data, { raw: true });
}

export async function apiGetMyJobApplications(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/jobs/my-applications${paginationParams(page, limit)}`);
}

// Loans
export async function apiApplyForLoan(data: any) {
  return request<any>("POST", "/api/loans/apply", data);
}

export async function apiGetMyLoanApplications(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/loans/my-applications${paginationParams(page, limit)}`);
}

// Consultations
export async function apiBookConsultation(data: any) {
  return request<any>("POST", "/api/consultations/book", data);
}

export async function apiGetMyConsultations(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/consultations/my-bookings${paginationParams(page, limit)}`);
}

// Accounting
export async function apiBookAccounting(data: any) {
  return request<any>("POST", "/api/accounting/book", data);
}

export async function apiGetMyAccountingBookings(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/accounting/my-bookings${paginationParams(page, limit)}`);
}

// Cars
export async function apiCreateCarRequest(data: any) {
  return request<any>("POST", "/api/cars/request", data);
}

export async function apiGetMyCarRequests(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/cars/my-requests${paginationParams(page, limit)}`);
}

// Events
export async function apiRegisterForEvent(data: any) {
  return request<any>("POST", "/api/events/register", data);
}

export async function apiGetMyEventRegistrations(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/events/my-registrations${paginationParams(page, limit)}`);
}

// Certifications
export async function apiRequestCertification(data: any) {
  return request<any>("POST", "/api/certifications/request", data);
}

export async function apiGetMyCertificationRequests(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/certifications/my-requests${paginationParams(page, limit)}`);
}

// Driving License
export async function apiBookDrivingLicense(data: any) {
  return request<any>("POST", "/api/driving-license/book", data);
}

export async function apiGetMyDrivingLicenseBookings(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/driving-license/my-bookings${paginationParams(page, limit)}`);
}

// Student Dashboard
export async function apiGetStudentBookings(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/students/my-bookings${paginationParams(page, limit)}`);
}

export async function apiGetStudentRequests(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/students/my-requests${paginationParams(page, limit)}`);
}

// ══════════════════════════════════════════════════════
// COMMUNITY TASKS
// ══════════════════════════════════════════════════════

export async function apiListCommunityTasks(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params)}` : "";
  return request<PaginatedResponse<any>>("GET", `/api/community/tasks${query}`);
}

export async function apiGetCommunityTask(id: string) {
  return request<any>("GET", `/api/community/tasks/${id}`);
}

export async function apiCreateCommunityTask(data: any) {
  return request<any>("POST", "/api/community/tasks", data);
}

export async function apiGetMyCommunityTasks(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/community/tasks/user/my-posts${paginationParams(page, limit)}`);
}

export async function apiApplyForCommunityTask(taskId: string, message: string) {
  return request<any>("POST", `/api/community/tasks/${taskId}/apply`, { message });
}

export async function apiUpdateCommunityTaskStatus(taskId: string, status: string) {
  return request<any>("PATCH", `/api/community/tasks/${taskId}/status`, { status });
}

export async function apiSendCommunityTaskMessage(taskId: string, content: string) {
  return request<any>("POST", `/api/community/tasks/${taskId}/messages`, { content });
}

export async function apiGetCommunityTaskMessages(taskId: string, page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/community/tasks/${taskId}/messages${paginationParams(page, limit)}`);
}

// Admin community task actions
export async function apiGetPendingCommunityTasks(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/community/tasks/admin/pending${paginationParams(page, limit)}`);
}

export async function apiApproveCommunityTask(taskId: string, adminNotes?: string) {
  return request<any>("POST", `/api/community/tasks/admin/${taskId}/approve`, { adminNotes });
}

export async function apiRejectCommunityTask(taskId: string, reason?: string) {
  return request<any>("POST", `/api/community/tasks/admin/${taskId}/reject`, { reason });
}

export async function apiFlagCommunityTask(taskId: string, adminNotes?: string) {
  return request<any>("POST", `/api/community/tasks/admin/${taskId}/flag`, { adminNotes });
}

// ══════════════════════════════════════════════════════
// BOOKINGS (Legacy)
// ══════════════════════════════════════════════════════

export async function apiCreateBooking(data: any) {
  return request<any>("POST", "/api/bookings", data);
}

export async function apiGetMyBookings(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/bookings/mine${paginationParams(page, limit)}`);
}

export async function apiGetBooking(id: string) {
  return request<any>("GET", `/api/bookings/${id}`);
}

export async function apiCancelBooking(id: string) {
  return request<any>("PATCH", `/api/bookings/${id}/cancel`);
}

export async function apiUpdateBookingStatus(id: string, status: string) {
  return request<any>("PATCH", `/api/bookings/${id}/status`, { status });
}

// ══════════════════════════════════════════════════════
// CHAT (REST endpoints — messages go via Socket.io)
// ══════════════════════════════════════════════════════

export async function apiGetConversations() {
  return request<{ data: any[] }>("GET", "/api/chat/conversations");
}

export async function apiGetChatMessages(conversationId: string, page?: number, limit?: number) {
  return request<{ data: any[] }>("GET", `/api/chat/messages/${conversationId}${paginationParams(page, limit)}`);
}

export async function apiStartConversation(otherUserId: string) {
  return request<{ data: any }>("POST", "/api/chat/conversations", { otherUserId });
}

// ══════════════════════════════════════════════════════
// VENDOR
// ══════════════════════════════════════════════════════

export async function apiGetVendorDashboard() {
  return request<any>("GET", "/api/vendor/dashboard");
}

export async function apiGetVendorTransactions(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/vendor/transactions${paginationParams(page, limit)}`);
}

export async function apiCreateVendorCoupon(data: any) {
  return request<any>("POST", "/api/vendor/coupons", data);
}

export async function apiGetVendorCoupons(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/vendor/coupons${paginationParams(page, limit)}`);
}

export async function apiDeleteVendorCoupon(id: string) {
  return request<any>("DELETE", `/api/vendor/coupons/${id}`);
}

export async function apiGetVendorRevenueAnalytics(mode?: string) {
  return request<any>("GET", `/api/vendor/analysis/revenue${mode ? `?mode=${mode}` : ""}`);
}

export async function apiGetVendorCustomerVisits() {
  return request<any>("GET", "/api/vendor/analysis/customer-visits");
}

export async function apiGetVendorRatingTrend() {
  return request<any>("GET", "/api/vendor/analysis/rating-trend");
}

export async function apiGetVendorCouponUsage() {
  return request<any>("GET", "/api/vendor/analysis/coupon-usage");
}

export async function apiGetVendorSettings() {
  return request<any>("GET", "/api/vendor/settings");
}

export async function apiUpdateVendorSettings(data: any) {
  return request<any>("PUT", "/api/vendor/settings", data);
}

// ── Vendor Services ─────────────────────────────────

export async function apiGetVendorServices() {
  return request<{ data: any[] }>("GET", "/api/vendor/services");
}

export async function apiAddVendorService(serviceType: string) {
  return request<any>("POST", "/api/vendor/services", { serviceType });
}

export async function apiRemoveVendorService(id: string) {
  return request<any>("DELETE", `/api/vendor/services/${id}`);
}

export async function apiToggleVendorService(id: string, isActive: boolean) {
  return request<any>("PATCH", `/api/vendor/services/${id}/toggle`, { isActive });
}

// ── Vendor Listings ─────────────────────────────────

export async function apiGetVendorListings(serviceType?: string, page?: number, limit?: number) {
  const params = new URLSearchParams();
  if (serviceType) params.set("serviceType", serviceType);
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  return request<PaginatedResponse<any>>("GET", `/api/vendor/listings?${params}`);
}

export async function apiCreateVendorListing(data: any) {
  return request<any>("POST", "/api/vendor/listings", data);
}

export async function apiUpdateVendorListing(id: string, data: any) {
  return request<any>("PUT", `/api/vendor/listings/${id}`, data);
}

export async function apiDeleteVendorListing(id: string) {
  return request<any>("DELETE", `/api/vendor/listings/${id}`);
}

// ── Vendor Requests ─────────────────────────────────

export async function apiGetVendorRequests(serviceType?: string, status?: string, page?: number, limit?: number) {
  const params = new URLSearchParams();
  if (serviceType) params.set("serviceType", serviceType);
  if (status) params.set("status", status);
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  return request<PaginatedResponse<any>>("GET", `/api/vendor/requests?${params}`);
}

export async function apiGetVendorRequestHistory(serviceType?: string, page?: number, limit?: number) {
  const params = new URLSearchParams();
  if (serviceType) params.set("serviceType", serviceType);
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  return request<PaginatedResponse<any>>("GET", `/api/vendor/requests/history?${params}`);
}

export async function apiApproveVendorRequest(id: string, notes?: string) {
  return request<any>("POST", `/api/vendor/requests/${id}/approve`, { notes });
}

export async function apiRejectVendorRequest(id: string, reason: string) {
  return request<any>("POST", `/api/vendor/requests/${id}/reject`, { reason });
}

// ── Public Listings (for students) ──────────────────

export async function apiGetPublicListings(serviceType: string, page?: number, limit?: number) {
  const params = new URLSearchParams({ serviceType });
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  return request<PaginatedResponse<any>>("GET", `/api/vendor/listings/public?${params}`);
}

export async function apiCreateServiceRequest(data: any) {
  return request<any>("POST", "/api/vendor/requests/student", data);
}

// ── Admin Approvals ─────────────────────────────────

export async function apiGetAdminApprovals(page?: number, limit?: number, entityType?: string) {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  if (entityType) params.set("entityType", entityType);
  return request<PaginatedResponse<any>>("GET", `/api/admin/approvals?${params}`);
}

export async function apiAdminApprove(id: string, adminNotes?: string) {
  return request<any>("POST", `/api/admin/approvals/${id}/approve`, { adminNotes });
}

export async function apiAdminReject(id: string, reason: string) {
  return request<any>("POST", `/api/admin/approvals/${id}/reject`, { reason });
}

export async function apiGetAdminApprovalHistory(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/admin/approvals/history${paginationParams(page, limit)}`);
}

export async function apiGetAdminVendorDetails(vendorId: string) {
  return request<any>("GET", `/api/admin/vendors/${vendorId}/details`);
}

export async function apiAdminAddVendorService(vendorProfileId: string, serviceType: string) {
  return request<any>("POST", "/api/admin/vendors/services/add", { vendorProfileId, serviceType });
}

export async function apiAdminRemoveVendorService(vendorProfileId: string, serviceType: string) {
  return request<any>("POST", "/api/admin/vendors/services/remove", { vendorProfileId, serviceType });
}

// ══════════════════════════════════════════════════════
// ADMIN
// ══════════════════════════════════════════════════════

export async function apiGetAdminDashboard() {
  return request<any>("GET", "/api/admin/dashboard");
}

export async function apiGetAdminUsers(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/admin/users${paginationParams(page, limit)}`);
}

export async function apiGetAdminVendors(page?: number, limit?: number, status?: string) {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  if (status) params.set("status", status);
  return request<PaginatedResponse<any>>("GET", `/api/admin/vendors?${params}`);
}

export async function apiApproveVendor(id: string) {
  return request<any>("PATCH", `/api/admin/vendors/${id}/approve`);
}

export async function apiRejectVendor(id: string) {
  return request<any>("PATCH", `/api/admin/vendors/${id}/reject`);
}

export async function apiGetAdminTransactions(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/admin/transactions${paginationParams(page, limit)}`);
}

export async function apiGetAdminRevenueAnalytics(mode?: string) {
  return request<any>("GET", `/api/admin/analysis/revenue${mode ? `?mode=${mode}` : ""}`);
}

export async function apiGetAdminUserAnalytics() {
  return request<any>("GET", "/api/admin/analysis/users");
}

export async function apiGetAdminVendorAnalytics() {
  return request<any>("GET", "/api/admin/analysis/vendors");
}

export async function apiGetAdminCategoryDistribution() {
  return request<any>("GET", "/api/admin/analysis/category-distribution");
}

// ══════════════════════════════════════════════════════
// PAYMENTS (Stripe)
// ══════════════════════════════════════════════════════

export async function apiCreatePaymentIntent(data: { amount: number; currency?: string; description?: string; metadata?: Record<string, string> }) {
  return request<{ clientSecret: string; paymentIntentId: string; amount: number; currency: string }>("POST", "/api/payments/create-intent", data);
}

export async function apiVerifyPayment(paymentIntentId: string) {
  return request<{ status: string; amount: number; currency: string }>("POST", "/api/payments/verify", { paymentIntentId });
}

export async function apiGetMyPayments(page?: number, limit?: number) {
  return request<PaginatedResponse<any>>("GET", `/api/payments/my-payments${paginationParams(page, limit)}`);
}

export async function apiRefundPayment(paymentIntentId: string, amount?: number) {
  return request<any>("POST", "/api/payments/refund", { paymentIntentId, amount });
}

// ══════════════════════════════════════════════════════
// OTP
// ══════════════════════════════════════════════════════

export async function apiSendOtp(purpose: string) {
  return request<any>("POST", "/api/otp/send", { purpose });
}

export async function apiVerifyOtp(code: string, purpose: string) {
  return request<any>("POST", "/api/otp/verify", { code, purpose });
}

// ══════════════════════════════════════════════════════
// HEALTH
// ══════════════════════════════════════════════════════

export async function apiHealthCheck() {
  return request<{ status: string; timestamp: string }>("GET", "/api/health");
}
