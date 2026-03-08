/**
 * Payment Wrapper — Abstracts Stripe payment processing.
 * Swap this wrapper to migrate to another payment provider (PayPal, Square, etc.)
 */
import Stripe from "stripe";
import { config } from "../config/env";

if (!config.stripe.secretKey) {
  console.warn("⚠️  STRIPE_SECRET_KEY not set — payments will fail");
}

const stripe = new Stripe(config.stripe.secretKey || "", {
  apiVersion: "2025-05-28.basil",
});

export interface CreatePaymentIntentInput {
  amount: number; // in cents
  currency: string;
  customerId?: string;
  metadata?: Record<string, string>;
  description?: string;
}

export interface CreateCustomerInput {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

class PaymentWrapper {
  // ── Customers ──────────────────────────────────────

  async createCustomer(input: CreateCustomerInput): Promise<Stripe.Customer> {
    return stripe.customers.create({
      email: input.email,
      name: input.name,
      metadata: input.metadata,
    });
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    return stripe.customers.retrieve(customerId);
  }

  async findCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
    const customers = await stripe.customers.list({ email, limit: 1 });
    return customers.data[0] || null;
  }

  // ── Payment Intents ────────────────────────────────

  async createPaymentIntent(input: CreatePaymentIntentInput): Promise<Stripe.PaymentIntent> {
    return stripe.paymentIntents.create({
      amount: input.amount,
      currency: input.currency,
      customer: input.customerId,
      description: input.description,
      metadata: input.metadata,
      automatic_payment_methods: { enabled: true },
    });
  }

  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return stripe.paymentIntents.cancel(paymentIntentId);
  }

  // ── Refunds ────────────────────────────────────────

  async createRefund(
    paymentIntentId: string,
    amount?: number
  ): Promise<Stripe.Refund> {
    return stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount, // partial refund if provided, full if omitted
    });
  }

  // ── Webhooks ───────────────────────────────────────

  constructWebhookEvent(
    payload: string | Buffer,
    signature: string
  ): Stripe.Event {
    if (!config.stripe.webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET not configured");
    }
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe.webhookSecret
    );
  }

  // ── Direct Stripe access (for advanced usage) ─────

  get client(): Stripe {
    return stripe;
  }
}

export const payments = new PaymentWrapper();
