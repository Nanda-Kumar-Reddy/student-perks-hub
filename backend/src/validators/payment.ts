/**
 * Payment Validators
 */
import { z } from "zod";

export const createPaymentIntentSchema = z.object({
  amount: z.coerce.number().int().positive("Amount must be positive (in cents)").max(99999999),
  currency: z.string().trim().length(3, "Currency must be 3-letter ISO code").default("aud"),
  description: z.string().trim().max(500).optional(),
  metadata: z.record(z.string()).optional(),
});

export const refundSchema = z.object({
  paymentIntentId: z.string().trim().min(1, "Payment intent ID required").startsWith("pi_"),
  amount: z.coerce.number().int().positive().optional(), // partial refund in cents
});

export const verifyPaymentSchema = z.object({
  paymentIntentId: z.string().trim().min(1, "Payment intent ID required").startsWith("pi_"),
});
