import { request } from "./client";
import { buildQuery } from "@/utils";
import type { PaginatedResponse, ServiceType } from "@/types";

// Airport Pickup
export async function apiCreateAirportPickup(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("POST", "/api/airport-pickups", { body: data });
}
export async function apiGetMyAirportPickups(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/airport-pickups/my-requests${buildQuery({ page, limit })}`);
}

// Accommodations
export async function apiCreateAccommodationEnquiry(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("POST", "/api/accommodations/enquiry", { body: data });
}
export async function apiCreateAccommodationChat(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("POST", "/api/accommodations/chat", { body: data });
}
export async function apiGetMyAccommodationEnquiries(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/accommodations/my-enquiries${buildQuery({ page, limit })}`);
}
export async function apiCreateStudentAccommodation(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("POST", "/api/accommodations/listings", { body: data });
}
export async function apiGetMyAccommodationListings(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/accommodations/my-listings${buildQuery({ page, limit })}`);
}
export async function apiUpdateStudentAccommodation(id: string, data: Record<string, unknown>) {
  return request<Record<string, unknown>>("PUT", `/api/accommodations/listings/${id}`, { body: data });
}
export async function apiDeleteStudentAccommodation(id: string) {
  return request<Record<string, unknown>>("DELETE", `/api/accommodations/listings/${id}`);
}

// Jobs
export async function apiApplyForJob(data: FormData) {
  return request<Record<string, unknown>>("POST", "/api/jobs/apply", { body: data, raw: true });
}
export async function apiGetMyJobApplications(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/jobs/my-applications${buildQuery({ page, limit })}`);
}

// Loans
export async function apiApplyForLoan(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("POST", "/api/loans/apply", { body: data });
}
export async function apiGetMyLoanApplications(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/loans/my-applications${buildQuery({ page, limit })}`);
}

// Consultations
export async function apiBookConsultation(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("POST", "/api/consultations/book", { body: data });
}
export async function apiGetMyConsultations(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/consultations/my-bookings${buildQuery({ page, limit })}`);
}

// Accounting
export async function apiBookAccounting(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("POST", "/api/accounting/book", { body: data });
}
export async function apiGetMyAccountingBookings(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/accounting/my-bookings${buildQuery({ page, limit })}`);
}

// Cars
export async function apiCreateCarRequest(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("POST", "/api/cars/request", { body: data });
}
export async function apiGetMyCarRequests(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/cars/my-requests${buildQuery({ page, limit })}`);
}

// Events
export async function apiRegisterForEvent(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("POST", "/api/events/register", { body: data });
}
export async function apiGetMyEventRegistrations(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/events/my-registrations${buildQuery({ page, limit })}`);
}

// Certifications
export async function apiRequestCertification(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("POST", "/api/certifications/request", { body: data });
}
export async function apiGetMyCertificationRequests(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/certifications/my-requests${buildQuery({ page, limit })}`);
}

// Driving Licence
export async function apiBookDrivingLicense(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("POST", "/api/driving-license/book", { body: data });
}
export async function apiGetMyDrivingLicenseBookings(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/driving-license/my-bookings${buildQuery({ page, limit })}`);
}

// Student Dashboard
export async function apiGetStudentBookings(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/students/my-bookings${buildQuery({ page, limit })}`);
}
export async function apiGetStudentRequests(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/students/my-requests${buildQuery({ page, limit })}`);
}

// Bookings (legacy)
export async function apiCreateBooking(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("POST", "/api/bookings", { body: data });
}
export async function apiGetMyBookings(page?: number, limit?: number) {
  return request<PaginatedResponse<unknown>>("GET", `/api/bookings/mine${buildQuery({ page, limit })}`);
}
export async function apiGetBooking(id: string) {
  return request<Record<string, unknown>>("GET", `/api/bookings/${id}`);
}
export async function apiCancelBooking(id: string) {
  return request<Record<string, unknown>>("PATCH", `/api/bookings/${id}/cancel`);
}
export async function apiUpdateBookingStatus(id: string, status: string) {
  return request<Record<string, unknown>>("PATCH", `/api/bookings/${id}/status`, { body: { status } });
}

// OTP
export async function apiSendOtp(purpose: string) {
  return request<Record<string, unknown>>("POST", "/api/otp/send", { body: { purpose } });
}
export async function apiVerifyOtp(code: string, purpose: string) {
  return request<Record<string, unknown>>("POST", "/api/otp/verify", { body: { code, purpose } });
}

// Helper: get the "my-*" fetcher for a given service type
export function getMyFetcher(serviceType: ServiceType): (page?: number, limit?: number) => Promise<PaginatedResponse<unknown>> {
  const map: Record<ServiceType, (page?: number, limit?: number) => Promise<PaginatedResponse<unknown>>> = {
    AIRPORT_PICKUP: apiGetMyAirportPickups,
    ACCOMMODATION: apiGetMyAccommodationEnquiries,
    JOBS: apiGetMyJobApplications,
    LOANS: apiGetMyLoanApplications,
    CONSULTATIONS: apiGetMyConsultations,
    ACCOUNTING: apiGetMyAccountingBookings,
    CAR_RENT_SALE: apiGetMyCarRequests,
    EVENTS: apiGetMyEventRegistrations,
    CERTIFICATIONS: apiGetMyCertificationRequests,
    DRIVING_LICENCE: apiGetMyDrivingLicenseBookings,
  };
  return map[serviceType];
}
