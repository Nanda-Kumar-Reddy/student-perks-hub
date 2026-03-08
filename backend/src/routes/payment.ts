/**
 * Payment Routes
 */
import { Router, raw } from "express";
import {
  createPaymentIntent,
  verifyPayment,
  refundPayment,
  getMyPayments,
  stripeWebhook,
} from "../controllers/payment";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { rbac } from "../middleware/rbac";
import {
  createPaymentIntentSchema,
  refundSchema,
  verifyPaymentSchema,
} from "../validators/payment";
import { paginationQuery } from "../validators/common";
import catchErrors from "../utils/catchErrors";

const router = Router();

// ── Webhook (must be before JSON parser — needs raw body) ──
router.post(
  "/webhook",
  raw({ type: "application/json" }),
  catchErrors(stripeWebhook)
);

// ── Authenticated Routes ──────────────────────────────────
router.post(
  "/create-intent",
  authenticate,
  validate(createPaymentIntentSchema),
  catchErrors(createPaymentIntent)
);

router.post(
  "/verify",
  authenticate,
  validate(verifyPaymentSchema),
  catchErrors(verifyPayment)
);

router.get(
  "/my-payments",
  authenticate,
  validate(paginationQuery, "query"),
  catchErrors(getMyPayments)
);

// ── Admin-only: Refunds ──────────────────────────────────
router.post(
  "/refund",
  authenticate,
  rbac("admin"),
  validate(refundSchema),
  catchErrors(refundPayment)
);

export default router;
