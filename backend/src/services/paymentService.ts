/**
 * Payment Service — Business logic for Stripe payments.
 */
import { payments } from "../wrappers/paymentWrapper";
import { db } from "../wrappers/databaseWrapper";
import { notifications } from "../wrappers/notificationWrapper";

class PaymentService {
  /**
   * Get or create a Stripe customer for a user.
   */
  async ensureCustomer(userId: string, email: string, name?: string) {
    // Check if user already has a stripeCustomerId stored
    const profile = await db.findOne("User", { id: userId });

    if (profile?.stripeCustomerId) {
      return profile.stripeCustomerId;
    }

    // Check Stripe by email
    let customer = await payments.findCustomerByEmail(email);
    if (!customer) {
      customer = await payments.createCustomer({
        email,
        name,
        metadata: { userId },
      });
    }

    // Store customer ID on user record
    await db.update("User", userId, { stripeCustomerId: customer.id });

    return customer.id;
  }

  /**
   * Create a payment intent for a service booking.
   */
  async createPaymentIntent(
    userId: string,
    email: string,
    input: {
      amount: number;
      currency?: string;
      description?: string;
      metadata?: Record<string, string>;
    }
  ) {
    const customerId = await this.ensureCustomer(userId, email);

    const paymentIntent = await payments.createPaymentIntent({
      amount: input.amount,
      currency: input.currency || "aud",
      customerId,
      description: input.description,
      metadata: {
        userId,
        ...input.metadata,
      },
    });

    // Record in DB
    await db.create("Payment", {
      userId,
      stripePaymentIntentId: paymentIntent.id,
      amount: input.amount,
      currency: input.currency || "aud",
      status: paymentIntent.status,
      description: input.description,
    });

    console.log(`[PAYMENT] Intent ${paymentIntent.id} created for user ${userId}`);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };
  }

  /**
   * Verify a payment intent status.
   */
  async verifyPayment(paymentIntentId: string) {
    const paymentIntent = await payments.getPaymentIntent(paymentIntentId);

    // Update local record
    const existing = await db.findOne("Payment", {
      stripePaymentIntentId: paymentIntentId,
    });
    if (existing) {
      await db.update("Payment", existing.id, { status: paymentIntent.status });
    }

    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };
  }

  /**
   * Process a refund.
   */
  async refund(paymentIntentId: string, amount?: number) {
    const refund = await payments.createRefund(paymentIntentId, amount);

    // Update local record
    const existing = await db.findOne("Payment", {
      stripePaymentIntentId: paymentIntentId,
    });
    if (existing) {
      await db.update("Payment", existing.id, {
        status: amount ? "partially_refunded" : "refunded",
      });

      // Notify admin
      await notifications.notifyAdmins(
        "Payment Refunded",
        `Refund of ${(refund.amount / 100).toFixed(2)} ${refund.currency?.toUpperCase()} processed for payment ${paymentIntentId}`,
        "payment"
      );
    }

    console.log(`[PAYMENT] Refund ${refund.id} for intent ${paymentIntentId}`);

    return {
      refundId: refund.id,
      amount: refund.amount,
      status: refund.status,
    };
  }

  /**
   * Handle Stripe webhook events.
   */
  async handleWebhookEvent(event: any) {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object;
        const existing = await db.findOne("Payment", {
          stripePaymentIntentId: pi.id,
        });
        if (existing) {
          await db.update("Payment", existing.id, { status: "succeeded" });

          // Notify user
          if (existing.userId) {
            await notifications.send({
              receiverId: existing.userId,
              receiverRole: "student",
              title: "Payment Successful",
              message: `Your payment of ${(pi.amount / 100).toFixed(2)} ${pi.currency.toUpperCase()} was successful.`,
              type: "payment",
            });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object;
        const existing = await db.findOne("Payment", {
          stripePaymentIntentId: pi.id,
        });
        if (existing) {
          await db.update("Payment", existing.id, { status: "failed" });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        if (charge.payment_intent) {
          const existing = await db.findOne("Payment", {
            stripePaymentIntentId: charge.payment_intent,
          });
          if (existing) {
            await db.update("Payment", existing.id, { status: "refunded" });
          }
        }
        break;
      }

      default:
        console.log(`[PAYMENT] Unhandled webhook event: ${event.type}`);
    }
  }

  /**
   * Get payment history for a user.
   */
  async getMyPayments(userId: string, page: number = 1, limit: number = 20) {
    return db.findMany("Payment", { userId }, { page, limit });
  }
}

export const paymentService = new PaymentService();
