/**
 * Vendor Portal Routes — services, listings, requests
 */
import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { rbac } from "../../middleware/rbac";
import catchErrors from "../../utils/catchErrors";
import * as vendorController from "../../controllers/vendor/vendor";
import * as vendorServiceController from "../../controllers/vendor/vendorServiceController";
import * as vendorListingController from "../../controllers/vendor/vendorListingController";
import * as vendorRequestController from "../../controllers/vendor/vendorRequestController";
import { createCouponSchema, updateSettingsSchema } from "../../validators/vendor/vendor";
import { validate } from "../../middleware/validate";

const router = Router();

// All vendor routes require authentication + vendor role
router.use(authenticate, rbac("vendor"));

// ── Dashboard ──────────────────────────────────────
router.get("/dashboard", catchErrors(vendorController.getDashboard));

// ── Services (dynamic) ─────────────────────────────
router.get("/services", catchErrors(vendorServiceController.getMyServices));
router.post("/services", catchErrors(vendorServiceController.addService));
router.delete("/services/:id", catchErrors(vendorServiceController.removeService));

// ── Listings ───────────────────────────────────────
router.get("/listings", catchErrors(vendorListingController.getListings));
router.post("/listings", catchErrors(vendorListingController.createListing));
router.put("/listings/:id", catchErrors(vendorListingController.updateListing));
router.delete("/listings/:id", catchErrors(vendorListingController.deleteListing));

// ── Requests ───────────────────────────────────────
router.get("/requests", catchErrors(vendorRequestController.getRequests));
router.post("/requests/:id/approve", catchErrors(vendorRequestController.approveRequest));
router.post("/requests/:id/reject", catchErrors(vendorRequestController.rejectRequest));
router.post("/requests/:id/accept-pickup", catchErrors(vendorRequestController.acceptAirportPickup));

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
