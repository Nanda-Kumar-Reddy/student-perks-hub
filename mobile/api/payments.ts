import { request } from "./client";
import { buildQuery } from "@/utils";
import type { PaginatedResponse, Payment } from "@/types";

export async function apiCreatePaymentIntent(data: {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, string>;
}) {
  return request<{ clientSecret: string; paymentIntentId: string; amount: number; currency: string }>(
    "POST",
    "/api/payments/create-intent",
    { body: data }
  );
}

export async function apiVerifyPayment(paymentIntentId: string) {
  return request<{ status: string; amount: number; currency: string }>(
    "POST",
    "/api/payments/verify",
    { body: { paymentIntentId } }
  );
}

export async function apiGetMyPayments(page?: number, limit?: number) {
  return request<PaginatedResponse<Payment>>("GET", `/api/payments/my-payments${buildQuery({ page, limit })}`);
}

export async function apiRefundPayment(paymentIntentId: string, amount?: number) {
  return request<Record<string, unknown>>("POST", "/api/payments/refund", { body: { paymentIntentId, amount } });
}
