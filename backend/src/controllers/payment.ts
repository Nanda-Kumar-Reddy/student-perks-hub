/**
 * Payment Controller
 */
import { Request, Response } from "express";
import { paymentService } from "../services/paymentService";
import { payments } from "../wrappers/paymentWrapper";

export async function createPaymentIntent(req: Request, res: Response) {
  const user = (req as any).user;
  const { amount, currency, description, metadata } = req.body;

  const result = await paymentService.createPaymentIntent(user.userId, user.email, {
    amount,
    currency,
    description,
    metadata,
  });

  return res.status(201).json(result);
}

export async function verifyPayment(req: Request, res: Response) {
  const { paymentIntentId } = req.body;
  const result = await paymentService.verifyPayment(paymentIntentId);
  return res.json(result);
}

export async function refundPayment(req: Request, res: Response) {
  const { paymentIntentId, amount } = req.body;
  const result = await paymentService.refund(paymentIntentId, amount);
  return res.json(result);
}

export async function getMyPayments(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { page, limit } = req.query as any;
  const result = await paymentService.getMyPayments(userId, page, limit);
  return res.json(result);
}

/**
 * Stripe Webhook Handler — raw body required for signature verification.
 */
export async function stripeWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return res.status(400).json({ error: "Missing stripe-signature header" });
  }

  try {
    const event = payments.constructWebhookEvent(req.body, signature);
    await paymentService.handleWebhookEvent(event);
    return res.json({ received: true });
  } catch (err: any) {
    console.error("[PAYMENT] Webhook error:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
}
