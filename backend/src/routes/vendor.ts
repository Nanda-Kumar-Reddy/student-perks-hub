/**
 * Vendor Routes — protected by JWT + vendor RBAC
 */
import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { rbac } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import catchErrors from "../utils/catchErrors";
import * as vendorController from "../controllers/vendor";
import { createCouponSchema, updateSettingsSchema } from "../validators/vendor";

const router = Router();

// All vendor routes require authentication + vendor role
router.use(authenticate, rbac("vendor"));

// ── Dashboard ──────────────────────────────────────
router.get("/dashboard", catchErrors(vendorController.getDashboard));

// ── Transactions ───────────────────────────────────
router.get("/transactions", catchErrors(vendorController.getTransactions));

// ── Coupons ────────────────────────────────────────
router.post("/coupons", validate(createCouponSchema), catchErrors(vendorController.createCoupon));
router.get("/coupons", catchErrors(vendorController.getCoupons));
router.delete("/coupons/:id", catchErrors(vendorController.deleteCoupon));

// ── Analytics ──────────────────────────────────────
router.get("/analysis/revenue", catchErrors(vendorController.getRevenueAnalytics));
router.get("/analysis/customer-visits", catchErrors(vendorController.getCustomerVisits));
router.get("/analysis/rating-trend", catchErrors(vendorController.getRatingTrend));
router.get("/analysis/coupon-usage", catchErrors(vendorController.getCouponUsage));

// ── Settings ───────────────────────────────────────
router.get("/settings", catchErrors(vendorController.getSettings));
router.put("/settings", validate(updateSettingsSchema), catchErrors(vendorController.updateSettings));

export default router;
